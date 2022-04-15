import { BigNumber, BigNumberish, BytesLike, ethers } from "ethers";
import { hexZeroPad } from "@ethersproject/bytes";
import { AddressZero } from "@ethersproject/constants";
import {
  SnapshotInputSchema,
  SnapshotSchema,
} from "../schema/contracts/common/snapshots";
import {
  approveErc20Allowance,
  fetchCurrencyValue,
  isNativeToken,
  normalizePriceValue,
} from "./currency";
import {
  ClaimCondition,
  ClaimConditionInput,
  ClaimVerification,
  FilledConditionInput,
  SnapshotInfo,
} from "../types";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { IStorage } from "../core";
import {
  ClaimConditionInputArray,
  ClaimConditionInputSchema,
  ClaimConditionOutputSchema,
} from "../schema/contracts/common/claim-conditions";
import { createSnapshot } from "./snapshots";
import { IDropClaimCondition } from "@thirdweb-dev/contracts/dist/IDropERC1155";
import { NATIVE_TOKEN_ADDRESS } from "../constants";
import { Provider } from "@ethersproject/providers";
import { implementsInterface } from "./feature-detection";
import { DropERC20, DropERC20__factory } from "@thirdweb-dev/contracts";

/**
 * Returns proofs and the overrides required for the transaction.
 * @internal
 * @returns - `overrides` and `proofs` as an object.
 */
export async function prepareClaim(
  quantity: BigNumberish,
  activeClaimCondition: ClaimCondition,
  merkleMetadata: Record<string, string>,
  contractWrapper: ContractWrapper<any>,
  storage: IStorage,
  proofs: BytesLike[] = [hexZeroPad([0], 32)],
): Promise<ClaimVerification> {
  const addressToClaim = await contractWrapper.getSignerAddress();
  let tokenDecimals = 0;
  if (
    implementsInterface<DropERC20>(
      contractWrapper,
      DropERC20__factory.createInterface(),
    )
  ) {
    tokenDecimals = await contractWrapper.readContract.decimals();
  }
  let maxClaimable = BigNumber.from(0);

  try {
    if (
      !activeClaimCondition.merkleRootHash.toString().startsWith(AddressZero)
    ) {
      const claims = await fetchSnapshot(
        activeClaimCondition.merkleRootHash.toString(),
        merkleMetadata,
        storage,
      );
      const item =
        claims &&
        claims.find(
          (c) => c.address.toLowerCase() === addressToClaim.toLowerCase(),
        );
      if (item === undefined) {
        throw new Error("No claim found for this address");
      }
      proofs = item.proof;
      maxClaimable = ethers.utils.parseUnits(item.maxClaimable, tokenDecimals);
    }
  } catch (e) {
    // have to handle the valid error case that we *do* want to throw on
    if ((e as Error)?.message === "No claim found for this address") {
      throw e;
    }
    // other errors we wanna ignore and try to continue
    console.warn(
      "failed to check claim condition merkle root hash, continuing anyways",
      e,
    );
  }

  const overrides = (await contractWrapper.getCallOverrides()) || {};
  const price = activeClaimCondition.price;
  const currencyAddress = activeClaimCondition.currencyAddress;
  if (price.gt(0)) {
    if (isNativeToken(currencyAddress)) {
      overrides["value"] = BigNumber.from(price).mul(quantity);
    } else {
      await approveErc20Allowance(
        contractWrapper,
        currencyAddress,
        price,
        quantity,
      );
    }
  }
  return {
    overrides,
    proofs,
    maxQuantityPerTransaction: maxClaimable,
    price,
    currencyAddress,
  };
}

/**
 * @internal
 * @param merkleRoot
 * @param merkleMetadata
 * @param storage
 */
export async function fetchSnapshot(
  merkleRoot: string,
  merkleMetadata: Record<string, string>,
  storage: IStorage,
) {
  const snapshotUri = merkleMetadata[merkleRoot];
  let snapshot = undefined;
  if (snapshotUri) {
    const raw = await storage.get(snapshotUri);
    const snapshotData = SnapshotSchema.parse(raw);
    if (merkleRoot === snapshotData.merkleRoot) {
      snapshot = snapshotData.claims;
    }
  }
  return snapshot;
}

/**
 * @internal
 * @param index
 * @param claimConditionInput
 * @param existingConditions
 */
export async function updateExistingClaimConditions(
  index: number,
  claimConditionInput: ClaimConditionInput,
  existingConditions: ClaimCondition[],
  tokenDecimals: number,
): Promise<ClaimConditionInput[]> {
  if (index >= existingConditions.length) {
    throw Error(
      `Index out of bounds - got index: ${index} with ${existingConditions.length} conditions`,
    );
  }
  // merge input with existing claim condition
  // TODO figure out how to have inputs and outputs symmetrical to avoid this gymnastic
  const revertToFormattedAmount = (bigNumberValue: BigNumber) => {
    if (
      bigNumberValue.toHexString() === ethers.constants.MaxUint256.toHexString()
    ) {
      return "unlimited";
    }
    const formatted = ethers.utils
      .formatUnits(bigNumberValue, tokenDecimals)
      .replace(".0", "");
    return formatted;
  };

  const convertBackToBigNumber = (formattedValue: string) => {
    if (formattedValue === "unlimited") {
      return ethers.constants.MaxUint256;
    } else {
      return ethers.utils.parseUnits(formattedValue, tokenDecimals);
    }
  };

  const priceDecimals = existingConditions[index].currencyMetadata.decimals;
  const priceInWei = existingConditions[index].price;
  const priceInTokens = ethers.utils.formatUnits(priceInWei, priceDecimals);

  // merge existing (output format) with incoming (input format)
  const newConditionParsed = ClaimConditionInputSchema.parse({
    ...existingConditions[index],
    price: priceInTokens,
    maxQuantity: revertToFormattedAmount(existingConditions[index].maxQuantity),
    quantityLimitPerTransaction: revertToFormattedAmount(
      existingConditions[index].quantityLimitPerTransaction,
    ),
    ...claimConditionInput,
  });

  // convert to output claim condition
  const mergedConditionOutput = ClaimConditionOutputSchema.parse({
    ...newConditionParsed,
    price: priceInWei,
    maxQuantity: convertBackToBigNumber(newConditionParsed.maxQuantity),
    quantityLimitPerTransaction: convertBackToBigNumber(
      newConditionParsed.quantityLimitPerTransaction,
    ),
  });

  return existingConditions.map((existingOutput, i) => {
    let newConditionAtIndex;
    if (i === index) {
      newConditionAtIndex = mergedConditionOutput;
    } else {
      newConditionAtIndex = existingOutput;
    }
    const formattedPrice = ethers.utils.formatUnits(
      newConditionAtIndex.price,
      priceDecimals,
    );
    return {
      ...newConditionAtIndex,
      price: formattedPrice, // manually transform back to input price type
      maxQuantity: revertToFormattedAmount(newConditionAtIndex.maxQuantity),
      quantityLimitPerTransaction: revertToFormattedAmount(
        newConditionAtIndex.quantityLimitPerTransaction,
      ),
    };
  });
}

/**
 * Fetches the proof for the current signer for a particular wallet.
 *
 * @param merkleRoot - The merkle root of the condition to check.
 * @returns - The proof for the current signer for the specified condition.
 */
export async function getClaimerProofs(
  addressToClaim: string,
  merkleRoot: string,
  tokenDecimals: number,
  merkleMetadata: Record<string, string>,
  storage: IStorage,
): Promise<{ maxClaimable: BigNumber; proof: string[] }> {
  const claims = await fetchSnapshot(merkleRoot, merkleMetadata, storage);
  if (claims === undefined) {
    return {
      proof: [],
      maxClaimable: BigNumber.from(0),
    };
  }
  const item = claims.find(
    (c) => c.address.toLowerCase() === addressToClaim?.toLowerCase(),
  );

  if (item === undefined) {
    return {
      proof: [],
      maxClaimable: BigNumber.from(0),
    };
  }
  return {
    proof: item.proof,
    maxClaimable: ethers.utils.parseUnits(item.maxClaimable, tokenDecimals),
  };
}

/**
 * Create and uploads snapshots + converts claim conditions to contract format
 * @param claimConditionInputs
 * @internal
 */
export async function processClaimConditionInputs(
  claimConditionInputs: ClaimConditionInput[],
  tokenDecimals: number,
  provider: Provider,
  storage: IStorage,
) {
  const snapshotInfos: SnapshotInfo[] = [];
  const inputsWithSnapshots = await Promise.all(
    claimConditionInputs.map(async (conditionInput) => {
      // check snapshots and upload if provided
      if (conditionInput.snapshot && conditionInput.snapshot.length > 0) {
        const snapshotInfo = await createSnapshot(
          SnapshotInputSchema.parse(conditionInput.snapshot),
          tokenDecimals,
          storage,
        );
        snapshotInfos.push(snapshotInfo);
        conditionInput.merkleRootHash = snapshotInfo.merkleRoot;
      } else {
        // if no snapshot is passed or empty, reset the merkle root
        conditionInput.merkleRootHash = hexZeroPad([0], 32);
      }
      // fill condition with defaults values if not provided
      return conditionInput;
    }),
  );

  const parsedInputs = ClaimConditionInputArray.parse(inputsWithSnapshots);

  // Convert processed inputs to the format the contract expects, and sort by timestamp
  const sortedConditions: IDropClaimCondition.ClaimConditionStruct[] = (
    await Promise.all(
      parsedInputs.map((c) =>
        convertToContractModel(c, tokenDecimals, provider),
      ),
    )
  ).sort((a, b) => {
    const left = BigNumber.from(a.startTimestamp);
    const right = BigNumber.from(b.startTimestamp);
    if (left.eq(right)) {
      return 0;
    } else if (left.gt(right)) {
      return 1;
    } else {
      return -1;
    }
  });
  return { snapshotInfos, sortedConditions };
}

/**
 * Converts a local SDK model to contract model
 * @param c
 * @param provider
 * @internal
 */
async function convertToContractModel(
  c: FilledConditionInput,
  tokenDecimals: number,
  provider: Provider,
): Promise<IDropClaimCondition.ClaimConditionStruct> {
  const currency =
    c.currencyAddress === AddressZero
      ? NATIVE_TOKEN_ADDRESS
      : c.currencyAddress;
  let maxClaimableSupply;
  let quantityLimitPerTransaction;
  if (c.maxQuantity === "unlimited") {
    maxClaimableSupply = ethers.constants.MaxUint256.toString();
  } else {
    maxClaimableSupply = ethers.utils.parseUnits(c.maxQuantity, tokenDecimals);
  }
  if (c.quantityLimitPerTransaction === "unlimited") {
    quantityLimitPerTransaction = ethers.constants.MaxUint256.toString();
  } else {
    quantityLimitPerTransaction = ethers.utils.parseUnits(
      c.quantityLimitPerTransaction,
      tokenDecimals,
    );
  }
  return {
    startTimestamp: c.startTime,
    maxClaimableSupply,
    supplyClaimed: 0,
    quantityLimitPerTransaction,
    waitTimeInSecondsBetweenClaims: c.waitInSeconds,
    pricePerToken: await normalizePriceValue(provider, c.price, currency),
    currency,
    merkleRoot: c.merkleRootHash,
  };
}

/**
 * Transforms a contract model to local model
 * @param pm
 * @param provider
 * @param merkleMetadata
 * @param storage
 * @internal
 */
export async function transformResultToClaimCondition(
  pm: IDropClaimCondition.ClaimConditionStructOutput,
  provider: Provider,
  merkleMetadata: Record<string, string>,
  storage: IStorage,
): Promise<ClaimCondition> {
  const cv = await fetchCurrencyValue(provider, pm.currency, pm.pricePerToken);
  const claims = await fetchSnapshot(pm.merkleRoot, merkleMetadata, storage);
  return ClaimConditionOutputSchema.parse({
    startTime: pm.startTimestamp,
    maxQuantity: pm.maxClaimableSupply.toString(),
    currentMintSupply: pm.supplyClaimed.toString(),
    availableSupply: BigNumber.from(pm.maxClaimableSupply)
      .sub(pm.supplyClaimed)
      .toString(),
    quantityLimitPerTransaction: pm.quantityLimitPerTransaction.toString(),
    waitInSeconds: pm.waitTimeInSecondsBetweenClaims.toString(),
    price: BigNumber.from(pm.pricePerToken),
    currency: pm.currency,
    currencyAddress: pm.currency,
    currencyMetadata: cv,
    merkleRootHash: pm.merkleRoot,
    snapshot: claims,
  });
}
