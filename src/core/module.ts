import {
  JsonRpcSigner,
  Log,
  Provider,
  TransactionReceipt,
} from "@ethersproject/providers";
import { BaseContract, BigNumber, CallOverrides, ethers, Signer } from "ethers";
import type { ISDKOptions } from ".";
import { Forwarder__factory } from "../../contract-interfaces";
import { isContract } from "../common/contract";
import { ForwardRequest, getAndIncrementNonce } from "../common/forwarder";
import { getGasPriceForChain } from "../common/gas-price";
import { invariant } from "../common/invariant";
import type { ProviderOrSigner } from "./types";

/**
 *
 * The root Module class to be extended and not used directly!
 * @internal
 *
 */
export class Module {
  public readonly address: string;
  protected readonly ipfsGatewayUrl: string;
  protected readonly options: ISDKOptions;

  private _providerOrSigner: ProviderOrSigner | null = null;
  protected get providerOrSigner(): ProviderOrSigner {
    return this.signer || this._providerOrSigner || this.getProviderOrSigner();
  }
  private set providerOrSigner(value: ProviderOrSigner) {
    this._providerOrSigner = value;
  }

  private _signer: Signer | null = null;
  protected get signer(): Signer | null {
    return this._signer;
  }
  private set signer(value: Signer | null) {
    this._signer = value;
  }

  constructor(
    providerOrSigner: ProviderOrSigner,
    address: string,
    options: ISDKOptions,
  ) {
    this.address = address;
    this.options = options;
    this.ipfsGatewayUrl = options.ipfsGatewayUrl;
    this.setProviderOrSigner(providerOrSigner);
  }

  /*
   * @internal
   */
  public setProviderOrSigner(providerOrSigner: ProviderOrSigner) {
    this.providerOrSigner = providerOrSigner;
    if (Signer.isSigner(providerOrSigner)) {
      this.signer = providerOrSigner;
    }
    this.connectContract();
  }

  /*
   * @internal
   */
  public clearSigner(): void {
    this.signer = null;
  }

  private getProviderOrSigner(): ProviderOrSigner {
    return this.signer || this.providerOrSigner;
  }

  protected getSigner(): Signer | null {
    if (Signer.isSigner(this.signer)) {
      return this.signer;
    }
    return null;
  }

  protected hasValidSigner(): boolean {
    return Signer.isSigner(this.signer);
  }

  protected async getSignerAddress(): Promise<string> {
    const signer = this.getSigner();
    invariant(signer, "Cannot get signer address without valid signer");
    return await signer.getAddress();
  }

  protected async getProvider(): Promise<Provider | undefined> {
    const provider: Provider | undefined = Signer.isSigner(
      this.getProviderOrSigner(),
    )
      ? (this.providerOrSigner as Signer).provider
      : (this.providerOrSigner as Provider);
    return provider;
  }

  protected async getChainID(): Promise<number> {
    const provider = await this.getProvider();
    invariant(provider, "getChainID() -- No Provider");
    const { chainId } = await provider.getNetwork();
    return chainId;
  }

  protected connectContract(): BaseContract {
    throw new Error("connectContract has to be implemented");
  }

  protected async getCallOverrides(): Promise<CallOverrides> {
    const chainId = await this.getChainID();
    const speed = this.options.gasSpeed;
    const maxGasPrice = this.options.maxGasPriceInGwei;
    const gasPriceChain = await getGasPriceForChain(
      chainId,
      speed,
      maxGasPrice,
    );
    if (!gasPriceChain) {
      return {};
    }
    // TODO: support EIP-1559 by try-catch, provider.getFeeData();
    return {
      gasPrice: ethers.utils.parseUnits(gasPriceChain.toString(), "gwei"),
    };
  }

  public async exists(): Promise<boolean> {
    const provider = await this.getProvider();
    invariant(provider, "exists() -- No Provider");
    return isContract(provider, this.address);
  }

  protected async sendTransaction(
    fn: string,
    args: any[],
    callOverrides?: CallOverrides,
  ): Promise<TransactionReceipt> {
    if (!callOverrides) {
      callOverrides = await this.getCallOverrides();
    }
    if (this.options.transactionRelayerUrl) {
      return await this.sendGaslessTransaction(fn, args, callOverrides);
    } else {
      return await this.sendAndWaitForTransaction(fn, args, callOverrides);
    }
  }

  private async sendAndWaitForTransaction(
    fn: string,
    args: any[],
    callOverrides: CallOverrides,
  ): Promise<TransactionReceipt> {
    const contract = this.connectContract();
    const tx = await contract.functions[fn](...args, callOverrides);
    if (tx.wait) {
      return await tx.wait();
    }
    return tx;
  }

  private async sendGaslessTransaction(
    fn: string,
    args: any[],
    callOverrides: CallOverrides,
  ): Promise<TransactionReceipt> {
    const signer = this.getSigner();
    invariant(
      signer,
      "Cannot execute gasless transaction without valid signer",
    );
    const provider = await this.getProvider();
    invariant(provider, "no provider to execute transaction");
    const chainId = await this.getChainID();
    const contract = this.connectContract();
    const from = await this.getSignerAddress();
    const to = this.address;
    const value = 0;
    const data = contract.interface.encodeFunctionData(fn, args);
    const gas = (await contract.estimateGas[fn](...args)).mul(2);
    const forwarderAddress = this.options.transactionRelayerForwarderAddress;
    const forwarder = Forwarder__factory.connect(
      forwarderAddress,
      this.getProviderOrSigner(),
    );
    const nonce = await getAndIncrementNonce(forwarder, from);

    const domain = {
      name: "GSNv2 Forwarder",
      version: "0.0.1",
      chainId,
      verifyingContract: forwarderAddress,
    };

    const types = {
      ForwardRequest,
    };

    const message = {
      from,
      to,
      value: BigNumber.from(value).toString(),
      gas: BigNumber.from(gas).toString(),
      nonce: BigNumber.from(nonce).toString(),
      data,
    };

    const signature = await (signer as JsonRpcSigner)._signTypedData(
      domain,
      types,
      message,
    );

    // await forwarder.verify(message, signature);
    const txHash = await this.options.transactionRelayerSendFunction(
      message,
      signature,
    );

    return await provider.waitForTransaction(txHash);
  }

  protected parseEventLogs(eventName: string, logs?: Log[]): any {
    if (!logs) {
      return null;
    }
    const contract = this.connectContract();
    for (const log of logs) {
      try {
        const event = contract.interface.decodeEventLog(
          eventName,
          log.data,
          log.topics,
        );
        return event;
        // eslint-disable-next-line no-empty
      } catch (e) {}
    }
    return null;
  }
}
