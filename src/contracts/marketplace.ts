import {
  Marketplace as MarketplaceContract,
  Marketplace__factory,
} from "@thirdweb-dev/contracts";
import { ContractMetadata } from "../core/classes/contract-metadata";
import { ContractRoles } from "../core/classes/contract-roles";
import { ContractEncoder } from "../core/classes/contract-encoder";
import {
  IStorage,
  NetworkOrSignerOrProvider,
  TransactionResult,
} from "../core";
import { SDKOptions } from "../schema/sdk-options";
import { ContractWrapper } from "../core/classes/contract-wrapper";
import { UpdateableNetwork } from "../core/interfaces/contract";
import { MarketplaceContractSchema } from "../schema/contracts/marketplace";
import { AuctionListing, DirectListing } from "../types/marketplace";
import { ListingType } from "../enums";
import { BigNumber, BigNumberish } from "ethers";
import invariant from "tiny-invariant";
import { ListingNotFoundError } from "../common";
import { AddressZero } from "@ethersproject/constants";
import { MarketplaceFilter } from "../types/marketplace/MarketPlaceFilter";
import { getRoleHash } from "../common/role";
import { MarketplaceDirect } from "../core/classes/marketplace-direct";
import { MarketplaceAuction } from "../core/classes/marketplace-auction";
import { GasCostEstimator } from "../core/classes";

/**
 * Create your own whitelabel marketplace that enables users to buy and sell any digital assets.
 *
 * @example
 *
 * ```javascript
 * import { ThirdwebSDK } from "@thirdweb-dev/sdk";
 *
 * // You can switch out this provider with any wallet or provider setup you like.
 * const provider = ethers.Wallet.createRandom();
 * const sdk = new ThirdwebSDK(provider);
 * const marketplace = sdk.getMarketplace("{{contract_address}}");
 * ```
 *
 * @public
 */
export class Marketplace implements UpdateableNetwork {
  static contractType = "marketplace" as const;
  static contractRoles = ["admin", "lister", "asset"] as const;
  static contractFactory = Marketplace__factory;
  /**
   * @internal
   */
  static schema = MarketplaceContractSchema;

  private contractWrapper: ContractWrapper<MarketplaceContract>;
  private storage: IStorage;

  public metadata: ContractMetadata<
    MarketplaceContract,
    typeof Marketplace.schema
  >;
  public roles: ContractRoles<
    MarketplaceContract,
    typeof Marketplace.contractRoles[number]
  >;
  public encoder: ContractEncoder<MarketplaceContract>;
  public estimator: GasCostEstimator<MarketplaceContract>;
  /**
   * Handle direct listings, see {@link MarketplaceDirect}
   */
  public direct: MarketplaceDirect;
  /**
   * Handle direct listings, see {@link MarketplaceAuction}
   */
  public auction: MarketplaceAuction;

  constructor(
    network: NetworkOrSignerOrProvider,
    address: string,
    storage: IStorage,
    options: SDKOptions = {},
    contractWrapper = new ContractWrapper<MarketplaceContract>(
      network,
      address,
      Marketplace.contractFactory.abi,
      options,
    ),
  ) {
    this.contractWrapper = contractWrapper;
    this.storage = storage;
    this.metadata = new ContractMetadata(
      this.contractWrapper,
      Marketplace.schema,
      this.storage,
    );
    this.roles = new ContractRoles(
      this.contractWrapper,
      Marketplace.contractRoles,
    );
    this.encoder = new ContractEncoder(this.contractWrapper);
    this.estimator = new GasCostEstimator(this.contractWrapper);
    this.direct = new MarketplaceDirect(this.contractWrapper, this.storage);
    this.auction = new MarketplaceAuction(this.contractWrapper, this.storage);
  }

  onNetworkUpdated(network: NetworkOrSignerOrProvider) {
    this.contractWrapper.updateSignerOrProvider(network);
  }

  getAddress(): string {
    return this.contractWrapper.readContract.address;
  }

  /** ******************************
   * READ FUNCTIONS
   *******************************/

  /**
   * Convenience function to get either a direct or auction listing
   *
   * @param listingId the listing id
   * @returns either a direct or auction listing
   */
  public async getListing(
    listingId: BigNumberish,
  ): Promise<AuctionListing | DirectListing> {
    const listing = await this.contractWrapper.readContract.listings(listingId);
    if (listing.assetContract === AddressZero) {
      throw new ListingNotFoundError(this.getAddress(), listingId.toString());
    }
    switch (listing.listingType) {
      case ListingType.Auction: {
        return await this.auction.mapListing(listing);
      }
      case ListingType.Direct: {
        return await this.direct.mapListing(listing);
      }
      default: {
        throw new Error(`Unknown listing type: ${listing.listingType}`);
      }
    }
  }

  /**
   * Get all the listings
   *
   * @remarks Fetch all the active listings from this marketplace contract.
   *
   * ```javascript
   * const listings = await contract.getAllListings();
   * const priceOfFirstListing = listings[0].price;
   * ```
   *
   * @param filter - optional filters
   */
  public async getAllListings(
    filter?: MarketplaceFilter,
  ): Promise<(AuctionListing | DirectListing)[]> {
    let rawListings = await this.getAllListingsNoFilter();

    if (filter) {
      if (filter.seller) {
        rawListings = rawListings.filter(
          (seller) =>
            seller.sellerAddress.toString().toLowerCase() ===
            filter?.seller?.toString().toLowerCase(),
        );
      }
      if (filter.tokenContract) {
        if (!filter.tokenId) {
          rawListings = rawListings.filter(
            (tokenContract) =>
              tokenContract.assetContractAddress.toString().toLowerCase() ===
              filter?.tokenContract?.toString().toLowerCase(),
          );
        } else {
          rawListings = rawListings.filter(
            (tokenContract) =>
              tokenContract.assetContractAddress.toString().toLowerCase() ===
                filter?.tokenContract?.toString().toLowerCase() &&
              tokenContract.tokenId.toString() === filter?.tokenId?.toString(),
          );
        }
      }
      if (filter.start !== undefined) {
        const start = filter.start;
        rawListings = rawListings.filter((_, index) => index >= start);
        if (filter.count !== undefined && rawListings.length > filter.count) {
          rawListings = rawListings.slice(0, filter.count);
        }
      }
    }
    return rawListings.filter((l) => l !== undefined) as (
      | AuctionListing
      | DirectListing
    )[];
  }

  /**
   * Get whether listing is restricted only to addresses with the Lister role
   */
  public async isRestrictedToListerRoleOnly(): Promise<boolean> {
    const anyoneCanList = await this.contractWrapper.readContract.hasRole(
      getRoleHash("lister"),
      AddressZero,
    );
    return !anyoneCanList;
  }

  /**
   * Get the buffer in basis points between offers
   */
  public async getBidBufferBps(): Promise<BigNumber> {
    return this.contractWrapper.readContract.bidBufferBps();
  }

  /**
   * get the buffer time in seconds between offers
   */
  public async getTimeBufferInSeconds(): Promise<BigNumber> {
    return this.contractWrapper.readContract.timeBuffer();
  }

  /** ******************************
   * WRITE FUNCTIONS
   *******************************/

  /**
   * Convenience function to buy a Direct or Auction listing.
   * @param listingId - the listing ID of the listing you want to buy
   * @param quantityDesired - the quantity that you want to buy (for ERC1155 tokens)
   */
  public async buyoutListing(
    listingId: BigNumberish,
    quantityDesired?: BigNumberish,
  ): Promise<TransactionResult> {
    const listing = await this.contractWrapper.readContract.listings(listingId);
    if (listing.listingId.toString() !== listingId.toString()) {
      throw new ListingNotFoundError(this.getAddress(), listingId.toString());
    }
    switch (listing.listingType) {
      case ListingType.Direct: {
        invariant(
          quantityDesired !== undefined,
          "quantityDesired is required when buying out a direct listing",
        );
        return await this.direct.buyoutListing(listingId, quantityDesired);
      }
      case ListingType.Auction: {
        return await this.auction.buyoutListing(listingId);
      }
      default:
        throw Error(`Unknown listing type: ${listing.listingType}`);
    }
  }

  /**
   * Set the Bid buffer: this is a percentage (e.g. 5%) in basis points (5% = 500, 100% = 10000). A new bid is considered to be a winning bid only if its bid amount is at least the bid buffer (e.g. 5%) greater than the previous winning bid. This prevents buyers from making very slightly higher bids to win the auctioned items.
   * @param bufferBps
   */
  public async setBidBufferBps(bufferBps: BigNumberish): Promise<void> {
    await this.roles.verify(
      ["admin"],
      await this.contractWrapper.getSignerAddress(),
    );

    const timeBuffer = await this.getTimeBufferInSeconds();
    await this.contractWrapper.sendTransaction("setAuctionBuffers", [
      timeBuffer,
      BigNumber.from(bufferBps),
    ]);
  }

  /**
   * Set the Time buffer: this is measured in seconds (e.g. 15 minutes or 900 seconds). If a winning bid is made within the buffer of the auction closing (e.g. 15 minutes within the auction closing), the auction's closing time is increased by the buffer to prevent buyers from making last minute winning bids, and to give time to other buyers to make a higher bid if they wish to.
   * @param bufferInSeconds
   */
  public async setTimeBufferInSeconds(
    bufferInSeconds: BigNumberish,
  ): Promise<void> {
    await this.roles.verify(
      ["admin"],
      await this.contractWrapper.getSignerAddress(),
    );

    const bidBuffer = await this.getBidBufferBps();
    await this.contractWrapper.sendTransaction("setAuctionBuffers", [
      BigNumber.from(bufferInSeconds),
      bidBuffer,
    ]);
  }

  /**
   * Restrict listing NFTs only from the specified NFT contract address.
   * It is possible to allow listing from multiple contract addresses.
   * @param contractAddress - the NFT contract address
   */
  public async allowListingFromSpecificAssetOnly(contractAddress: string) {
    const encoded = [];
    const members = await this.roles.get("asset");
    if (members.includes(AddressZero)) {
      encoded.push(
        this.encoder.encode("revokeRole", [getRoleHash("asset"), AddressZero]),
      );
    }
    encoded.push(
      this.encoder.encode("grantRole", [getRoleHash("asset"), contractAddress]),
    );

    await this.contractWrapper.multiCall(encoded);
  }

  /**
   * Allow listings from any NFT contract
   */
  public async allowListingFromAnyAsset() {
    const encoded = [];
    const members = await this.roles.get("asset");
    for (const addr in members) {
      encoded.push(
        this.encoder.encode("revokeRole", [getRoleHash("asset"), addr]),
      );
    }
    encoded.push(
      this.encoder.encode("grantRole", [getRoleHash("asset"), AddressZero]),
    );
    await this.contractWrapper.multiCall(encoded);
  }

  /** ******************************
   * PRIVATE FUNCTIONS
   *******************************/

  private async getAllListingsNoFilter(): Promise<
    (AuctionListing | DirectListing)[]
  > {
    const listings = await Promise.all(
      Array.from(
        Array(
          (await this.contractWrapper.readContract.totalListings()).toNumber(),
        ).keys(),
      ).map(async (i) => {
        let listing;

        try {
          listing = await this.getListing(i);
        } catch (err) {
          return undefined;
        }

        if (listing.type === ListingType.Auction) {
          return listing;
        }

        const valid = await this.direct.isStillValidListing(listing);
        if (!valid) {
          return undefined;
        }

        return listing;
      }),
    );
    return listings.filter((l) => l !== undefined) as (
      | AuctionListing
      | DirectListing
    )[];
  }

  // TODO: Complete method implementation with subgraph
  // /**
  //  * @beta - This method is not yet complete.
  //  *
  //  * @param listingId
  //  * @returns
  //  */
  // public async getActiveOffers(listingId: BigNumberish): Promise<Offer[]> {
  //   const listing = await this.validateDirectListing(BigNumber.from(listingId));

  //   const offers = await this.readOnlyContract.offers(listing.id, "");

  //   return await Promise.all(
  //     offers.map(async (offer: any) => {
  //       return await this.mapOffer(BigNumber.from(listingId), offer);
  //     }),
  //   );
  // }
}
