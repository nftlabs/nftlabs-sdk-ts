import { AddressZero } from "@ethersproject/constants";
import { TransactionReceipt } from "@ethersproject/providers";
import {
  ProtocolControl,
  ProtocolControl__factory,
} from "../../contract-interfaces";
import { ModuleType, uploadMetadata } from "../common";
import { ContractMetadata, getContractMetadata } from "../common/contract";
import { Module } from "../core/module";
import { MetadataURIOrObject } from "../core/types";

/**
 * A Module with metadata.
 * @public
 */
export interface ModuleMetadata {
  address: string;
  metadata?: ContractMetadata;
}

/**
 * The AppModule. This should always be created via `getAppModule()` on the main SDK.
 * @public
 */
export class AppModule extends Module {
  private __contract: ProtocolControl | null = null;
  /**
   * @internal - This is a temporary way to access the underlying contract directly and will likely become private once this module implements all the contract functions.
   */
  public get contract(): ProtocolControl {
    return this.__contract || this.connectContract();
  }
  private set contract(value: ProtocolControl) {
    this.__contract = value;
  }

  /**
   * @internal
   */
  protected connectContract(): ProtocolControl {
    return (this.contract = ProtocolControl__factory.connect(
      this.address,
      this.providerOrSigner,
    ));
  }

  private async getModuleAddress(moduleType: ModuleType): Promise<string[]> {
    return await this.contract.getAllModulesOfType(moduleType);
  }

  private async getNFTAddress(): Promise<string[]> {
    return this.getModuleAddress(ModuleType.NFT);
  }

  private async getCollectionAddress(): Promise<string[]> {
    return this.getModuleAddress(ModuleType.COLLECTION);
  }

  private async getPackAddress(): Promise<string[]> {
    return this.getModuleAddress(ModuleType.PACK);
  }

  private async getCurrencyAddress(): Promise<string[]> {
    return this.getModuleAddress(ModuleType.CURRENCY);
  }

  private async getMarketAddress(): Promise<string[]> {
    return this.getModuleAddress(ModuleType.MARKET);
  }

  private async getDropAddress(): Promise<string[]> {
    return this.getModuleAddress(ModuleType.DROP);
  }

  private async getDatastoreAddress(): Promise<string[]> {
    return this.getModuleAddress(ModuleType.DATASTORE);
  }

  public async getRoyaltyTreasury(address?: string): Promise<string> {
    return await this.contract.getRoyaltyTreasury(address || AddressZero);
  }

  public async getAllContractMetadata(
    addresses: string[],
  ): Promise<ModuleMetadata[]> {
    const metadatas = await Promise.all(
      addresses.map((address) =>
        getContractMetadata(
          this.providerOrSigner,
          address,
          this.ipfsGatewayUrl,
        ).catch(() => undefined),
      ),
    );
    return addresses
      .filter((d) => d)
      .map((address, i) => {
        return {
          address,
          metadata: metadatas[i],
        };
      });
  }

  /**
   * Method to get all pack modules.
   * @returns A promise of an array of Pack modules.
   */
  public async getPackModules(): Promise<ModuleMetadata[]> {
    return await this.getAllContractMetadata(await this.getPackAddress());
  }

  /**
   * Method to get all NFT modules.
   * @returns A promise of an array of NFT modules.
   */
  public async getNFTModules(): Promise<ModuleMetadata[]> {
    return await this.getAllContractMetadata(await this.getNFTAddress());
  }

  /**
   * Method to get all Collection modules.
   * @returns A promise of an array of Collection modules.
   */
  public async getCollectionModules(): Promise<ModuleMetadata[]> {
    return await this.getAllContractMetadata(await this.getCollectionAddress());
  }

  /**
   * Method to get all Currency modules.
   * @returns A promise of an array of Currency modules.
   */
  public async getCurrencyModules(): Promise<ModuleMetadata[]> {
    return await this.getAllContractMetadata(await this.getCurrencyAddress());
  }

  /**
   * Method to get all Datastore modules.
   * @returns A promise of an array of Currency modules.
   */
  public async getDatastoreModules(): Promise<ModuleMetadata[]> {
    return await this.getAllContractMetadata(await this.getDatastoreAddress());
  }

  /**
   * Method to get all Market modules.
   * @returns A promise of an array of Market modules.
   */
  public async getMarketModules(): Promise<ModuleMetadata[]> {
    return await this.getAllContractMetadata(await this.getMarketAddress());
  }

  /**
   * Method to get all Drop modules.
   * @returns A promise of an array of Drop modules.
   */
  public async getDropModules(): Promise<ModuleMetadata[]> {
    return await this.getAllContractMetadata(await this.getDropAddress());
  }

  // owner functions
  public async setModuleMetadata(
    metadata: MetadataURIOrObject,
  ): Promise<TransactionReceipt> {
    const uri = await uploadMetadata(metadata);
    return await this.sendTransaction("setContractURI", [uri]);
  }

  public async setRoyaltyTreasury(
    treasury: string,
  ): Promise<TransactionReceipt> {
    return await this.sendTransaction("setRoyaltyTreasury", [treasury]);
  }

  public async setModuleRoyaltyTreasury(
    moduleAddress: string,
    treasury: string,
  ): Promise<TransactionReceipt> {
    return await this.sendTransaction("setModuleRoyaltyTreasury", [
      moduleAddress,
      treasury,
    ]);
  }

  public async withdrawFunds(
    to: string,
    currency: string,
  ): Promise<TransactionReceipt> {
    return await this.sendTransaction("withdrawFunds", [to, currency]);
  }
}
