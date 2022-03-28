import { ethers } from "ethers";
import { IStorage } from "./interfaces/IStorage";
import {
  CONTRACTS_MAP,
  Edition,
  EditionDrop,
  Marketplace,
  NFTCollection,
  NFTDrop,
  Pack,
  REMOTE_CONTRACT_TO_CONTRACT_TYPE,
  Split,
  Token,
  Vote,
} from "../contracts";
import { SDKOptions } from "../schema/sdk-options";
import { IpfsStorage } from "./classes/ipfs-storage";
import { RPCConnectionHandler } from "./classes/rpc-connection-handler";
import type {
  ContractForContractType,
  ContractType,
  NetworkOrSignerOrProvider,
  ValidContractInstance,
} from "./types";
import { IThirdwebContract__factory } from "@thirdweb-dev/contracts";
import { ContractDeployer } from "./classes/contract-deployer";
import { CustomContract } from "../contracts/custom";
import invariant from "tiny-invariant";

/**
 * The main entry point for the thirdweb SDK
 * @public
 */
export class ThirdwebSDK extends RPCConnectionHandler {
  /**
   * @internal
   * the cache of contracts that we have already seen
   */
  private contractCache = new Map<
    string,
    ValidContractInstance | CustomContract
  >();
  /**
   * @internal
   */
  private storage: IStorage;

  /**
   * @internal
   */
  private contractTypeResolutionMap = new Map<string, Promise<ContractType>>();

  /**
   * New contract deployer
   * @public
   */
  public deployer: ContractDeployer;

  constructor(
    network: NetworkOrSignerOrProvider,
    options: SDKOptions = {},
    storage: IStorage = new IpfsStorage(),
  ) {
    super(network, options);
    // this.factory = new ContractFactory(network, storage, options);
    // this.registry = new ContractRegistry(network, options);
    this.storage = storage;
    this.deployer = new ContractDeployer(network, options, storage);
  }

  /**
   * Get an instance of a Drop contract
   * @param contractAddress - the address of the deployed contract
   * @returns the contract
   */
  public getNFTDrop(contractAddress: string): NFTDrop {
    return this.getContract(contractAddress, NFTDrop.contractType) as NFTDrop;
  }

  /**
   * Get an instance of a NFT Collection contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getNFTCollection(address: string): NFTCollection {
    return this.getContract(
      address,
      NFTCollection.contractType,
    ) as NFTCollection;
  }

  /**
   * Get an instance of a Edition Drop contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getEditionDrop(address: string): EditionDrop {
    return this.getContract(address, EditionDrop.contractType) as EditionDrop;
  }

  /**
   * Get an instance of an Edition contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getEdition(address: string): Edition {
    return this.getContract(address, Edition.contractType) as Edition;
  }

  /**
   * Get an instance of a Token contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getToken(address: string): Token {
    return this.getContract(address, Token.contractType) as Token;
  }

  /**
   * Get an instance of a Vote contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getVote(address: string): Vote {
    return this.getContract(address, Vote.contractType) as Vote;
  }

  /**
   * Get an instance of a Splits contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getSplit(address: string): Split {
    return this.getContract(address, Split.contractType) as Split;
  }

  /**
   * Get an instance of a Marketplace contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getMarketplace(address: string): Marketplace {
    return this.getContract(address, Marketplace.contractType) as Marketplace;
  }

  /**
   * Get an instance of a Pack contract
   * @param address - the address of the deployed contract
   * @returns the contract
   */
  public getPack(address: string): Pack {
    return this.getContract(address, Pack.contractType) as Pack;
  }

  /**
   *
   * @internal
   * @param address - the address of the contract to instantiate
   * @param contractType - optional, the type of contract to instantiate
   * @returns a promise that resolves with the contract instance
   */
  public getContract<TContractType extends ContractType = ContractType>(
    address: string,
    contractType: TContractType,
  ): ContractForContractType<TContractType> {
    // if we have a contract in the cache we will return it
    // we will do this **without** checking any contract type things for simplicity, this may have to change in the future?
    if (this.contractCache.has(address)) {
      return this.contractCache.get(
        address,
      ) as ContractForContractType<TContractType>;
    }
    const newContract = new CONTRACTS_MAP[
      // we have to do this as here because typescript is not smart enough to figure out
      // that the type is a key of the map (checked by the if statement above)
      contractType as keyof typeof CONTRACTS_MAP
    ](this.getSignerOrProvider(), address, this.storage, this.options);
    // if we have a contract type && the contract type is part of the map

    this.contractCache.set(address, newContract);

    // return the new contract
    return newContract as ContractForContractType<TContractType>;
  }

  /**
   * @param contractAddress - the address of the contract to attempt to resolve the contract type for
   * @returns the {@link ContractType} for the given contract address
   * @throws if the contract type cannot be determined (is not a valid thirdweb contract)
   */
  public async resolveContractType(
    contractAddress: string,
  ): Promise<ContractType> {
    // if we already have a request in flight for this contract address, return the promise from that request
    const cached = this.contractTypeResolutionMap.get(contractAddress);
    if (cached) {
      return cached;
    }
    const resolutionPromise = new Promise<ContractType>(
      // I know what I'm doing here, I promise eslint
      // eslint-disable-next-line no-async-promise-executor
      async (resolve, reject) => {
        try {
          const contract = IThirdwebContract__factory.connect(
            contractAddress,
            this.getSignerOrProvider(),
          );
          const remoteContractType = ethers.utils
            .toUtf8String(await contract.contractType())
            // eslint-disable-next-line no-control-regex
            .replace(/\x00/g, "");
          invariant(
            remoteContractType in REMOTE_CONTRACT_TO_CONTRACT_TYPE,
            `${remoteContractType} is not a valid contract type, falling back to custom contract`,
          );
          resolve(
            REMOTE_CONTRACT_TO_CONTRACT_TYPE[
              remoteContractType as keyof typeof REMOTE_CONTRACT_TO_CONTRACT_TYPE
            ],
          );
        } catch (e) {
          // delete the cached request so we will fetch again on re-try
          this.contractTypeResolutionMap.delete(contractAddress);
          reject(e);
        }
      },
    );
    this.contractTypeResolutionMap.set(contractAddress, resolutionPromise);
    return resolutionPromise;
  }

  /**
   * Return all the contracts deployed by the specified address
   * @param walletAddress - the deployed address
   */
  public async getContractList(walletAddress: string) {
    const addresses = await (
      await this.deployer.getRegistry()
    ).getContractAddresses(walletAddress);

    const addressesWithContractTypes = await Promise.all(
      addresses.map(async (adrr) => ({
        address: adrr,
        contractType: await this.resolveContractType(adrr).catch((err) => {
          console.error(
            `failed to get contract type for address: ${adrr}`,
            err,
          );
          return "" as ContractType;
        }),
      })),
    );

    return addressesWithContractTypes.map(({ address, contractType }) => ({
      address,
      contractType,
      metadata: () => this.getContract(address, contractType).metadata.get(),
    }));
  }

  /**
   * Update the active signer or provider for all contracts
   * @param network - the new signer or provider
   */
  public override updateSignerOrProvider(network: NetworkOrSignerOrProvider) {
    super.updateSignerOrProvider(network);
    this.updateContractSignerOrProvider();
  }

  private updateContractSignerOrProvider() {
    this.deployer.updateSignerOrProvider(this.getSignerOrProvider());
    for (const [, contract] of this.contractCache) {
      contract.onNetworkUpdated(this.getSignerOrProvider());
    }
  }

  /**
   * bring ur own contract init?
   * @internal
   */
  public async unstable_getCustomContract(address: string, abi?: any) {
    if (this.contractCache.has(address)) {
      return this.contractCache.get(address);
    }

    try {
      return this.getContract(address, await this.resolveContractType(address));
    } catch {
      // expected to happen if the contract is not a known thirdweb contract
      // we will create a bare-bones custom contract for now
      const newCustomContract = new CustomContract(
        this.getSignerOrProvider(),
        address,
        this.storage,
        this.options,
        abi,
      );
      this.contractCache.set(address, newCustomContract);
      return newCustomContract;
    }
  }
}
