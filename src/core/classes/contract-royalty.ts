import { IRoyalty, IThirdwebContract, ThirdwebContract } from "contracts";
import { CommonRoyaltySchema } from "../../schema/contracts/common";
import { ContractMetadata, IGenericSchemaType } from "./contract-metadata";
import { ContractWrapper } from "./contract-wrapper";
import { z } from "zod";
import { TransactionResult } from "../types";
import { BigNumberish } from "ethers";
import { FEATURE_ROYALTY } from "../../constants/thirdweb-features";
import { DetectableFeature } from "../interfaces/DetectableFeature";

/**
 * Handle contract royalties
 * @remarks Configure royalties for an entire contract or a particular token.
 * @example
 * ```javascript
 * const contract = await sdk.getContract("{{contract_address}}");
 * const royaltyInfo = await contract.royalties.getDefaultRoyaltyInfo();
 * await contract.roles.setTokenRoyaltyInfo(tokenId, {
 *   seller_fee_basis_points: 100, // 1% royalty fee
 *   fee_recipient: "0x...", // the fee recipient
 * });
 * ```
 * @public
 */
export class ContractRoyalty<
  TContract extends IRoyalty & (IThirdwebContract | ThirdwebContract),
  TSchema extends IGenericSchemaType,
> implements DetectableFeature
{
  featureName = FEATURE_ROYALTY.name;
  private contractWrapper;
  private metadata;

  constructor(
    contractWrapper: ContractWrapper<TContract>,
    metadata: ContractMetadata<TContract, TSchema>,
  ) {
    this.contractWrapper = contractWrapper;
    this.metadata = metadata;
  }

  /**
   * Gets the royalty recipient and BPS (basis points) of the contract
   * @returns - The royalty recipient and BPS
   */
  public async getDefaultRoyaltyInfo() {
    const [royaltyRecipient, royaltyBps] =
      await this.contractWrapper.readContract.getDefaultRoyaltyInfo();
    // parse it on the way out to make sure we default things if they are not set
    return CommonRoyaltySchema.parse({
      fee_recipient: royaltyRecipient,
      seller_fee_basis_points: royaltyBps,
    });
  }

  /**
   * Gets the royalty recipient and BPS (basis points) of a particular token
   * @returns - The royalty recipient and BPS
   */
  public async getTokenRoyaltyInfo(tokenId: BigNumberish) {
    const [royaltyRecipient, royaltyBps] =
      await this.contractWrapper.readContract.getRoyaltyInfoForToken(tokenId);
    return CommonRoyaltySchema.parse({
      fee_recipient: royaltyRecipient,
      seller_fee_basis_points: royaltyBps,
    });
  }

  /**
   * Set the royalty recipient and fee for a contract
   * @param royaltyData - the royalty recipient and fee
   */
  public async setDefaultRoyaltyInfo(
    royaltyData: z.input<typeof CommonRoyaltySchema>,
  ): Promise<TransactionResult<z.output<typeof CommonRoyaltySchema>>> {
    // read the metadata from the contract
    const oldMetadata = await this.metadata.get();

    // update the metadata with the new royalty data
    // if one of the keys is "undefined" it will be ignored (which is the desired behavior)
    const mergedMetadata = this.metadata.parseInputMetadata({
      ...oldMetadata,
      ...royaltyData,
    });

    // why not use this.metadata.set()? - because that would end up sending it's own separate transaction to `setContractURI`
    // but we want to send both the `setRoyaltyInfo` and `setContractURI` in one transaction!
    const contractURI = await this.metadata._parseAndUploadMetadata(
      mergedMetadata,
    );

    // encode both the functions we want to send
    const encoded = [
      this.contractWrapper.readContract.interface.encodeFunctionData(
        "setDefaultRoyaltyInfo",
        [mergedMetadata.fee_recipient, mergedMetadata.seller_fee_basis_points],
      ),
      this.contractWrapper.readContract.interface.encodeFunctionData(
        "setContractURI",
        [contractURI],
      ),
    ];

    // actually send the transaction and return the receipt + a way to get the new royalty info
    return {
      receipt: await this.contractWrapper.multiCall(encoded),
      data: () => this.getDefaultRoyaltyInfo(),
    };
  }

  /**
   * Set the royalty recipient and fee for a particular token
   * @param tokenId - the token id
   * @param royaltyData - the royalty recipient and fee
   */
  public async setTokenRoyaltyInfo(
    tokenId: BigNumberish,
    royaltyData: z.input<typeof CommonRoyaltySchema>,
  ) {
    return {
      receipt: await this.contractWrapper.sendTransaction(
        "setRoyaltyInfoForToken",
        [
          tokenId,
          royaltyData.fee_recipient,
          royaltyData.seller_fee_basis_points,
        ],
      ),
      data: () => this.getDefaultRoyaltyInfo(),
    };
  }
}
