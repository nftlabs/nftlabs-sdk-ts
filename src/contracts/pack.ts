import { ContractWrapper } from "../core/classes/contract-wrapper";
import { ContractInterceptor } from "../core/classes/contract-interceptor";
import { IStorage } from "../core/interfaces/IStorage";
import {
  NetworkOrSignerOrProvider,
  TransactionResultWithId,
} from "../core/types";
import { ContractMetadata } from "../core/classes/contract-metadata";
import { ContractEncoder } from "../core/classes/contract-encoder";
import { SDKOptions } from "../schema/sdk-options";
import { Pack as PackContract } from "contracts";
import { PackContractSchema } from "../schema/contracts/packs";
import { ContractRoles } from "../core/classes/contract-roles";
import { ContractRoyalty } from "../core/classes/contract-royalty";
import { Erc1155 } from "../core/classes/erc-1155";
import { GasCostEstimator } from "../core/classes/gas-cost-estimator";
import { ContractEvents } from "../core/classes/contract-events";
import { ContractAnalytics } from "../core/classes/contract-analytics";
import {
  PackMetadataInput,
  PackMetadataInputSchema,
  PackMetadataOutput,
  PackRewards,
  PackRewardsOutput,
} from "../schema/tokens/pack";
import {
  ITokenBundle,
  PackCreatedEvent,
  PackOpenedEvent,
} from "contracts/Pack";
import { BigNumber, BigNumberish, ethers } from "ethers";
import {
  fetchCurrencyMetadata,
  hasERC20Allowance,
  normalizePriceValue,
} from "../common/currency";
import { isTokenApprovedForTransfer } from "../common/marketplace";
import { uploadOrExtractURI } from "../common/nft";
import { EditionMetadata, EditionMetadataOwner } from "../schema";
import { Erc1155Enumerable } from "../core/classes/erc-1155-enumerable";
import { QueryAllParams } from "../types";

/**
 * Create lootboxes of NFTs with rarity based open mechanics.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * const sdk = new ThirdwebSDK("rinkeby");
 * const contract = sdk.getPack("{{contract_address}}");
 * ```
 *
 * @public
 */
export class Pack extends Erc1155<PackContract> {
  static contractType = "pack" as const;
  static contractRoles = ["admin", "minter", "pauser", "transfer"] as const;
  static contractAbi = require("../../abis/Pack.json");
  /**
   * @internal
   */
  static schema = PackContractSchema;
  // TODO: Change schema and deployment

  public metadata: ContractMetadata<PackContract, typeof Pack.schema>;
  public roles: ContractRoles<PackContract, typeof Pack.contractRoles[number]>;
  public encoder: ContractEncoder<PackContract>;
  public events: ContractEvents<PackContract>;
  public estimator: GasCostEstimator<PackContract>;
  /**
   * @internal
   */
  public analytics: ContractAnalytics<PackContract>;
  /**
   * Configure royalties
   * @remarks Set your own royalties for the entire contract or per pack
   * @example
   * ```javascript
   * // royalties on the whole contract
   * contract.royalties.setDefaultRoyaltyInfo({
   *   seller_fee_basis_points: 100, // 1%
   *   fee_recipient: "0x..."
   * });
   * // override royalty for a particular pack
   * contract.royalties.setTokenRoyaltyInfo(packId, {
   *   seller_fee_basis_points: 500, // 5%
   *   fee_recipient: "0x..."
   * });
   * ```
   */
  public royalties: ContractRoyalty<PackContract, typeof Pack.schema>;
  /**
   * @internal
   */
  public interceptor: ContractInterceptor<PackContract>;

  private _query = this.query as Erc1155Enumerable;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: IStorage,
    options: SDKOptions = {},
    contractWrapper = new ContractWrapper<PackContract>(
      network,
      address,
      Pack.contractAbi,
      options,
    ),
  ) {
    super(contractWrapper, storage, options);
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      Pack.schema,
      this.storage,
    );
    this.analytics = new ContractAnalytics(this.contractWrapper);
    this.roles = new ContractRoles(this.contractWrapper, Pack.contractRoles);
    this.royalties = new ContractRoyalty(this.contractWrapper, this.metadata);
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.events = new ContractEvents(this.contractWrapper);
    this.interceptor = new ContractInterceptor(this.contractWrapper);
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Get All Packs
   *
   * @remarks Get all the data associated with every pack in this contract.
   *
   * By default, returns the first 100 packs, use queryParams to fetch more.
   *
   * @example
   * ```javascript
   * const packs = await contract.getAll();
   * console.log(packs;
   * ```
   * @param queryParams - optional filtering to only fetch a subset of results.
   * @returns The pack metadata for all packs queried.
   */
  public async getAll(
    queryParams?: QueryAllParams,
  ): Promise<EditionMetadata[]> {
    return this._query.all(queryParams);
  }

  /**
   * Get Owned Packs
   *
   * @remarks Get all the data associated with the packs owned by a specific wallet.
   *
   * @example
   * ```javascript
   * // Address of the wallet to get the packs of
   * const address = "{{wallet_address}}";
   * const packss = await contract.getOwned(address);
   * ```
   *
   * @returns The pack metadata for all the owned packs in the contract.
   */
  public async getOwned(
    walletAddress?: string,
  ): Promise<EditionMetadataOwner[]> {
    return this._query.owned(walletAddress);
  }

  public async getPackContents(
    packId: BigNumberish,
  ): Promise<PackRewardsOutput> {
    const { contents, perUnitAmounts } =
      await this.contractWrapper.readContract.getPackContents(packId);

    const erc20Rewards = [];
    const erc721Rewards = [];
    const erc1155Rewards = [];

    for (let i = 0; i < contents.length; i++) {
      const reward = contents[i];
      const amount = perUnitAmounts[i];
      switch (reward.tokenType) {
        case 0: {
          const tokenMetadata = await fetchCurrencyMetadata(
            this.contractWrapper.getProvider(),
            reward.assetContract,
          );
          const rewardAmount = ethers.utils.formatUnits(
            reward.totalAmount,
            tokenMetadata.decimals,
          );
          erc20Rewards.push({
            contractAddress: reward.assetContract,
            quantity: amount.toString(),
            totalRewards: BigNumber.from(rewardAmount).div(amount).toString(),
          });
          break;
        }
        case 1: {
          erc721Rewards.push({
            contractAddress: reward.assetContract,
            tokenId: reward.tokenId.toString(),
          });
          break;
        }
        case 2: {
          erc1155Rewards.push({
            contractAddress: reward.assetContract,
            tokenId: reward.tokenId.toString(),
            quantity: amount.toString(),
            totalRewards: BigNumber.from(reward.totalAmount)
              .div(amount)
              .toString(),
          });
          break;
        }
      }
    }

    return {
      erc20Rewards,
      erc721Rewards,
      erc1155Rewards,
    };
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Create Pack
   * @remarks Create a new pack with the given metadata and rewards and mint it to the connected wallet.
   *
   * @param metadataWithRewards - the metadata and rewards to include in the pack
   */
  public async create(metadataWithRewards: PackMetadataInput) {
    const signerAddress = await this.contractWrapper.getSignerAddress();
    return this.createTo(signerAddress, metadataWithRewards);
  }

  /**
   * Create Pack To Wallet
   * @remarks Create a new pack with the given metadata and rewards and mint it to the specified address.
   *
   * @param to - the address to mint the pack to
   * @param metadataWithRewards - the metadata and rewards to include in the pack
   *
   * @example
   * ```javascript
   * const packMetadata = {
   *   // The metadata for the pack NFT itself
   *   metadata: {
   *     name: "My Pack",
   *     description: "This is a new pack",
   *     image: "ipfs://...",
   *   },
   *   // ERC20 rewards to be included in the pack
   *   erc20Rewards: [
   *     {
   *       assetContract: "0x...",
   *       quantity: 100,
   *     }
   *   ],
   *   // ERC721 rewards to be included in the pack
   *   erc721Rewards: [
   *     {
   *       assetContract: "0x...",
   *       tokenId: 0,
   *     }
   *   ],
   *   // ERC1155 rewards to be included in the pack
   *   erc1155Rewards: [
   *     {
   *       assetContract: "0x...",
   *       tokenId: 0,
   *       quantity: 100,
   *     }
   *   ],
   *   openStartTime: new Date(), // the date that packs can start to be opened, defaults to now
   *   rewardsPerPack: 1, // the number of rewards in each pack, defaults to 1
   * }
   *
   * const tx = await contract.createTo("0x...", packMetadata);
   * ```
   */
  public async createTo(
    to: string,
    metadataWithRewards: PackMetadataInput,
  ): Promise<TransactionResultWithId<EditionMetadata>> {
    const uri = await uploadOrExtractURI(
      metadataWithRewards.metadata,
      this.storage,
    );

    const parsedMetadata = PackMetadataInputSchema.parse(metadataWithRewards);
    const { contents, numOfRewardUnits } = await this.toPackContentArgs(
      parsedMetadata,
    );

    const receipt = await this.contractWrapper.sendTransaction("createPack", [
      contents,
      numOfRewardUnits,
      uri,
      parsedMetadata.openStartTime,
      parsedMetadata.rewardsPerPack,
      to,
    ]);

    const event = this.contractWrapper.parseLogs<PackCreatedEvent>(
      "PackCreated",
      receipt?.logs,
    );
    if (event.length === 0) {
      throw new Error("PackCreated event not found");
    }
    const packId = event[0].args.packId;

    return {
      id: packId,
      receipt,
      data: () => this.get(packId),
    };
  }

  /**
   * Open Pack
   *
   * @remarks - Open a pack to reveal the contained rewards. This will burn the specified pack and
   * the contained assets will be transferred to the opening users wallet.
   *
   * @param tokenId - the token ID of the pack you want to open
   * @param amount - the amount of packs you want to open
   *
   * @example
   * ```javascript
   * const tokenId = 0
   * const amount = 1
   * const tx = await contract.open(tokenId, amount);
   * ```
   */
  public async open(
    tokenId: BigNumberish,
    amount: BigNumberish = 1,
  ): Promise<PackRewards> {
    const receipt = await this.contractWrapper.sendTransaction("openPack", [
      tokenId,
      amount,
    ]);
    const event = this.contractWrapper.parseLogs<PackOpenedEvent>(
      "PackOpened",
      receipt?.logs,
    );
    if (event.length === 0) {
      throw new Error("PackOpened event not found");
    }
    const rewards = event[0].args.rewardUnitsDistributed;

    const erc20Rewards = [];
    const erc721Rewards = [];
    const erc1155Rewards = [];

    for (const reward of rewards) {
      switch (reward.tokenType) {
        case 0: {
          const tokenMetadata = await fetchCurrencyMetadata(
            this.contractWrapper.getProvider(),
            reward.assetContract,
          );
          erc20Rewards.push({
            contractAddress: reward.assetContract,
            quantity: ethers.utils
              .formatUnits(reward.totalAmount, tokenMetadata.decimals)
              .toString(),
          });
          break;
        }
        case 1: {
          erc721Rewards.push({
            contractAddress: reward.assetContract,
            tokenId: reward.tokenId.toString(),
          });
          break;
        }
        case 2: {
          erc1155Rewards.push({
            contractAddress: reward.assetContract,
            tokenId: reward.tokenId.toString(),
            quantity: reward.totalAmount.toString(),
          });
          break;
        }
      }
    }

    return {
      erc20Rewards,
      erc721Rewards,
      erc1155Rewards,
    };
  }

  /** *****************************
   * PRIVATE FUNCTIONS
   *******************************/

  private async toPackContentArgs(metadataWithRewards: PackMetadataOutput) {
    const contents: ITokenBundle.TokenStruct[] = [];
    const numOfRewardUnits = [];
    const { erc20Rewards, erc721Rewards, erc1155Rewards } = metadataWithRewards;

    const provider = this.contractWrapper.getProvider();
    const owner = await this.contractWrapper.getSignerAddress();

    for (const erc20 of erc20Rewards) {
      const normalizedQuantity = await normalizePriceValue(
        provider,
        erc20.quantity,
        erc20.contractAddress,
      );
      // Multiply the quantity of one reward by the number of rewards
      const totalQuantity = normalizedQuantity.mul(erc20.totalRewards);
      const hasAllowance = await hasERC20Allowance(
        this.contractWrapper,
        erc20.contractAddress,
        totalQuantity,
      );
      if (!hasAllowance) {
        throw new Error(
          `ERC20 token with contract address "${
            erc20.contractAddress
          }" does not have enough allowance to transfer.\n\nYou can set allowance to the multiwrap contract to transfer these tokens by running:\n\nawait sdk.getToken("${
            erc20.contractAddress
          }").setAllowance("${this.getAddress()}", ${totalQuantity});\n\n`,
        );
      }

      numOfRewardUnits.push(erc20.totalRewards);
      contents.push({
        assetContract: erc20.contractAddress,
        tokenType: 0,
        totalAmount: totalQuantity,
        tokenId: 0,
      });
    }

    for (const erc721 of erc721Rewards) {
      const isApproved = await isTokenApprovedForTransfer(
        this.contractWrapper.getProvider(),
        this.getAddress(),
        erc721.contractAddress,
        erc721.tokenId,
        owner,
      );

      if (!isApproved) {
        throw new Error(
          `ERC721 token "${erc721.tokenId}" with contract address "${
            erc721.contractAddress
          }" is not approved for transfer.\n\nYou can give approval the multiwrap contract to transfer this token by running:\n\nawait sdk.getNFTCollection("${
            erc721.contractAddress
          }").setApprovalForToken("${this.getAddress()}", ${
            erc721.tokenId
          });\n\n`,
        );
      }

      numOfRewardUnits.push(1);
      contents.push({
        assetContract: erc721.contractAddress,
        tokenType: 1,
        totalAmount: 1,
        tokenId: erc721.tokenId,
      });
    }

    for (const erc1155 of erc1155Rewards) {
      const isApproved = await isTokenApprovedForTransfer(
        this.contractWrapper.getProvider(),
        this.getAddress(),
        erc1155.contractAddress,
        erc1155.tokenId,
        owner,
      );

      if (!isApproved) {
        throw new Error(
          `ERC1155 token "${erc1155.tokenId}" with contract address "${
            erc1155.contractAddress
          }" is not approved for transfer.\n\nYou can give approval the multiwrap contract to transfer this token by running:\n\nawait sdk.getEdition("${
            erc1155.contractAddress
          }").setApprovalForAll("${this.getAddress()}", true);\n\n`,
        );
      }

      numOfRewardUnits.push(erc1155.totalRewards);
      contents.push({
        assetContract: erc1155.contractAddress,
        tokenType: 2,
        totalAmount: BigNumber.from(erc1155.quantity).mul(
          BigNumber.from(erc1155.totalRewards),
        ),
        tokenId: erc1155.tokenId,
      });
    }

    return {
      contents,
      numOfRewardUnits,
    };
  }
}
