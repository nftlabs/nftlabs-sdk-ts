import { BigNumber, BigNumberish } from "ethers";
import {
  AuctionListing,
  DirectListing,
  NewAuctionListing,
  NewDirectListing,
  Offer,
} from "../../types/marketplace";

export interface IMarketplace {
  /**
   * Creates a new direct listing on a marketplace.
   *
   * @param listing - The new direct listing to create.
   * @returns - The ID of the newly created listing.
   */
  createDirectListing(listing: NewDirectListing): Promise<BigNumber>;

  /**
   * Creates a new auction listing on a marketplace.
   *
   * @param listing - The new auction listing to create.
   * @returns - The ID of the newly created listing.
   */
  createAuctionListing(listing: NewAuctionListing): Promise<BigNumber>;

  /**
   * Creates a new direct listing on a marketplace.
   */
  updateDirectListing(listing: DirectListing): Promise<void>;

  /**
   * Creates a new auction listing on a marketplace.
   */
  updateAuctionListing(listing: AuctionListing): Promise<void>;

  /**
   * Make an offer on a direct listing.
   *
   * @param listingId - The listing id.
   * @param quantityDesired - The quantity of tokens desired.
   * @param currencyContractAddress - The address of the currency contract.
   * @param tokenAmount - The amount of tokens to be offered.
   */
  makeDirectListingOffer(offer: {
    listingId: BigNumberish;
    quantityDesired: BigNumberish;
    currencyContractAddress: string;
    pricePerToken: BigNumberish;
  }): Promise<void>;

  /**
   * Make an offer on an auction. The offer must be at least `current bid * bid buffer %)` in order to be accepted.
   *
   * Bid buffer is configured on the Marketplace contract.
   *
   * Note: If you make a bid above the buyout price, you will automatically be awarded the
   * the listing and the sale will be executed.
   *
   * // TODO:  come back to `currencyContractAddress`
   *
   * @param listingId - The listing id.
   * @param currencyContractAddress - The address of the currency contract.
   * @param tokenAmount - The amount of tokens to be offered.
   */
  makeAuctionListingBid(bid: {
    listingId: BigNumberish;
    currencyContractAddress: string;
    pricePerToken: BigNumberish;
  }): Promise<void>;

  /**
   * Cancels a direct listing by updating the quantity to be sold to 0.
   *
   * @param listingId - Id of the listing to remove.
   */
  cancelDirectListing(listingId: BigNumberish): Promise<void>;

  /**
   * Cancels an auction listing. You can only cancel the listing
   * if it has not started yet.
   *
   * @param listingId - Id of the listing to remove.
   */
  cancelAuctionListing(listingId: BigNumberish): Promise<void>;

  // TODO: finish
  // cancelListing();

  /**
   * Closes an auction listing and distributes the payment/assets.
   * You can only close the listing after it has already ended.
   *
   * This method must be called by both the buyer and the seller.
   *
   * When the buyer calls this method, the tokens they purchased will
   * be distributed to the buyers wallet.
   *
   * When the seller calls this method, the winning bid will be
   * distributed to the sellers wallet.
   *
   * @param listingId - Id of the listing to remove.
   * @param closeFor - The address of the wallet to close the sale for (buyer or seller).
   */
  closeAuctionListing(
    listingId: BigNumberish,
    closeFor?: string,
  ): Promise<void>;

  /**
   * Buyout the listing based on the buyout price.
   *
   * The offer must be higher as high as the buyout price in order
   * for this buyout to succeed. If the buyout is too low, the
   * method will throw an error.
   *
   * Buying out an auction listing will purchase all tokens
   * regardless of the quantity. There is no way to buy
   * a partial amount of the tokens.
   *
   * Assuming this transaction is successful, the buyer will
   * instantly have access to the tokens and does not need
   * to call `closeAuctionListing`.
   *
   * @param listingId - Id of the listing to buyout.
   */
  buyoutAuctionListing(listingId: BigNumberish): Promise<void>;

  /**
   * Buyout the listing based on the buyout price.
   *
   * The offer must be higher as high as the buyout price in order
   * for this buyout to succeed. If the buyout is too low, the
   * method will throw an error.
   *
   * @param listingId - Id of the listing to buyout.
   */
  buyoutDirectListing(buyout: {
    listingId: BigNumberish;
    quantityDesired: BigNumberish;
  }): Promise<void>;

  /**
   * Generic buyout method that will dynamically determine
   * the listing type.
   *
   * Only direct listings support buying out a specific quantity,
   * therefore the `quantityDesired` parameter is ignored
   * if the listing ID passed in is an auction listing.
   *
   * @param listingId - Id of the listing to buyout.
   * @param quantityDesired - The quantity of tokens to buyout. Required if listing is a direct listing.
   */
  buyoutListing(
    listingId: BigNumberish,
    quantityDesired?: BigNumberish,
  ): Promise<void>;

  // TODO: Implement these with subgraph
  // /**
  //  * Return all active bids for an auction.
  //  *
  //  * @param listingId - Id of the listing to get bids for.
  //  */
  // getActiveBids(listingId: BigNumberish): Promise<Offer[]>;

  // /**
  //  * Return all active offers for a direct listing.
  //  *
  //  * @param listingId - Id of the listing to get offers for.
  //  */
  // getActiveOffers(listingId: BigNumberish): Promise<Offer[]>;

  /**
   * If the `address` has made an offer to the specified listing,
   * this method will fetch the offer and return it. If no
   * offer has been made, this method will return `undefined`.
   *
   * @param listingId - Id of the listing to get offers for.
   * @param address - Address of the buyer.
   */
  getActiveOffer(
    listingId: BigNumberish,
    address: string,
  ): Promise<Offer | undefined>;

  /**
   * If there's a winning big on the listing,
   * this method will return it.
   *
   * @param listingId - Id of the listing to get the bid for.
   */
  getWinningBid(listingId: BigNumberish): Promise<Offer | undefined>;

  /**
   * Accepts the offer of the specified wallet in `addressofOfferor`.
   *
   * @param listingId - The listing Id to accept the offer for.
   * @param addressOfOfferor - The address of the offeror.
   */
  acceptDirectListingOffer(
    listingId: BigNumberish,
    addressOfOfferor: string,
  ): Promise<void>;

  /**
   * Fetch a direct listing by Id.
   *
   * @param listingId - Id of the listing to fetch.
   */
  getDirectListing(listingId: BigNumberish): Promise<DirectListing>;

  /**
   * Fetch an auction listing by Id.
   *
   * @param listingId - Id of the listing to fetch.
   */
  getAuctionListing(listingId: BigNumberish): Promise<AuctionListing>;

  /**
   * Helper method to fetch a listing without knowing the type.
   *
   * @param listingId - The ID of the listing to fetch.
   */
  getListing(listingId: BigNumberish): Promise<AuctionListing | DirectListing>;

  /**
   * Fetch the current bid buffer on the marketplace contract.
   * The bid buffer is represented in basis points.
   *
   * @returns - The bid buffer in basis points.
   */
  getBidBufferBps(): Promise<BigNumber>;

  /**
   * Fetch the current time buffer on the marketplace contract.
   *
   * @returns - The time buffer in seconds.
   */
  getTimeBufferInSeconds(): Promise<BigNumber>;

  /**
   * Sets the bid buffer on the marketplace contract.
   * The bid buffer is represented in basis points.
   *
   * @param buffer - The bid buffer in basis points.
   */
  setBidBufferBps(buffer: BigNumberish): Promise<void>;

  /**
   * Sets the current time buffer on the marketplace contract.
   *
   * @param buffer - The time buffer in seconds.
   */
  setTimeBufferInSeconds(buffer: BigNumberish): Promise<void>;
}
