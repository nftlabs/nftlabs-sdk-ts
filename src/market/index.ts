import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { CurrencyValue, getCurrencyValue } from "../common/currency";
import { getMetadataWithoutContract, NFTMetadata } from "../common/nft";
import { Module } from "../core/module";
import {
  ERC1155__factory,
  ERC20__factory,
  Market,
  Market__factory,
} from "../types";

export interface ListingFilter {
  seller?: string;
  tokenContract?: string;
  tokenId?: string;
}

export interface Listing {
  id: string;
  seller: string;
  tokenContract: string;
  tokenId: string;
  tokenMetadata?: NFTMetadata;
  quantity: BigNumber;
  currencyContract: string;
  currencyMetadata: CurrencyValue | null;
  price: BigNumber;
  saleStart: Date | null;
  saleEnd: Date | null;
}

export class MarketSDK extends Module {
  private _contract: Market | null = null;
  public get contract(): Market {
    return this._contract || this.connectContract();
  }
  private set contract(value: Market) {
    this._contract = value;
  }

  protected connectContract(): Market {
    return (this.contract = Market__factory.connect(
      this.address,
      this.providerOrSigner,
    ));
  }

  private async transformResultToListing(listing: any): Promise<Listing> {
    let currency: CurrencyValue | null = null;

    try {
      currency = await getCurrencyValue(
        this.providerOrSigner,
        listing.currency,
        listing.pricePerToken,
      );
    } catch (e) {}

    let metadata: NFTMetadata | undefined = undefined;
    try {
      metadata = await getMetadataWithoutContract(
        this.providerOrSigner,
        listing.assetContract,
        listing.tokenId.toString(),
        this.ipfsGatewayUrl,
      );
    } catch (e) {}

    return {
      id: listing.listingId.toString(),
      seller: listing.seller,
      tokenId: listing.tokenId.toString(),
      tokenContract: listing.assetContract,
      tokenMetadata: metadata,
      quantity: listing.quantity,
      price: listing.pricePerToken,
      currencyContract: listing.currency,
      currencyMetadata: currency,
      saleStart: listing.saleStart.gt(0)
        ? new Date(listing.saleStart.toNumber() * 1000)
        : null,
      saleEnd:
        listing.saleEnd.gt(0) &&
        listing.saleEnd.lte(Number.MAX_SAFE_INTEGER - 1)
          ? new Date(listing.saleEnd.toNumber() * 1000)
          : null,
    };
  }

  public async get(listingId: string): Promise<Listing> {
    const listing = await this.contract.listings(listingId);
    return await this.transformResultToListing(listing);
  }

  public async getAll(filter?: ListingFilter): Promise<Listing[]> {
    let listings: any[] = [];

    if (!filter) {
      listings = listings.concat(await this.contract.getAllListings());
    } else {
      if (filter.tokenContract && filter.tokenId) {
        listings = listings.concat(
          await this.contract.getListingsByAsset(
            filter.tokenContract,
            filter.tokenId,
          ),
        );
      } else if (filter.seller) {
        listings = listings.concat(
          await this.contract.getListingsBySeller(filter.seller),
        );
      } else if (filter.tokenContract) {
        listings = listings.concat(
          await this.contract.getListingsByAssetContract(filter.tokenContract),
        );
      } else {
        listings = listings.concat(await this.contract.getAllListings());
      }
    }

    listings = listings
      .filter((l) => {
        if (l.quantity.eq(0)) {
          return false;
        }
        if (filter) {
          const filterSeller = filter?.seller || "";
          const filterTokenContract = filter?.tokenContract || "";
          const filterTokenId = filter?.tokenId || "";

          if (
            filterSeller &&
            filterSeller.toLowerCase() !== l.seller.toLowerCase()
          ) {
            return false;
          }
          if (
            filterTokenContract &&
            filterTokenContract.toLowerCase() !== l.assetContract.toLowerCase()
          ) {
            return false;
          }
          if (
            filterTokenId &&
            filterTokenId.toLowerCase() !== l.tokenId.toString().toLowerCase()
          ) {
            return false;
          }
        }
        return true;
      })
      .map((l) => this.transformResultToListing(l));
    return await Promise.all(listings);
  }

  public async list(
    assetContract: string,
    tokenId: string,
    currencyContract: string,
    price: BigNumber,
    quantity: BigNumber,
    secondsUntilStart: number = 0,
    secondsUntilEnd: number = 0,
  ): Promise<Listing> {
    const from = await this.getSignerAddress();
    const asset = ERC1155__factory.connect(
      assetContract,
      this.providerOrSigner,
    );

    const approved = await asset.isApprovedForAll(from, this.address);
    if (!approved) {
      const tx = await asset.setApprovalForAll(this.address, true);
      await tx.wait();
    }

    const tx = await this.contract.list(
      assetContract,
      tokenId,
      currencyContract,
      price,
      quantity,
      secondsUntilStart,
      secondsUntilEnd,
    );
    const receipt = await tx.wait();
    const event = receipt?.events?.find((e) => e.event === "NewListing");
    const listing = event?.args?.listing;
    return await this.transformResultToListing(listing);
  }

  public async unlistAll(listingId: string) {
    const maxQuantity = (await this.get(listingId)).quantity;
    await this.unlist(listingId, maxQuantity);
  }

  public async unlist(listingId: string, quantity: BigNumberish) {
    const tx = await this.contract.unlist(listingId, quantity);
    await tx.wait();
  }

  public async buy(
    listingId: string,
    quantity: BigNumberish,
  ): Promise<Listing> {
    const listing = await this.get(listingId);
    const owner = await this.getSignerAddress();
    const spender = this.address;
    const totalPrice = listing.price.mul(BigNumber.from(quantity));
    const erc20 = ERC20__factory.connect(
      listing.currencyContract,
      this.providerOrSigner,
    );
    const allowance = await erc20.allowance(owner, spender);
    if (allowance.lte(totalPrice)) {
      const tx = await erc20.increaseAllowance(spender, totalPrice);
      await tx.wait();
    }
    const tx = await this.contract.buy(listingId, quantity);
    const receipt = await tx.wait();
    const event = receipt?.events?.find((e) => e.event === "NewSale");
    return await this.transformResultToListing(event?.args?.listing);
  }
}
