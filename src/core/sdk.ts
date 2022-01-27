import { Networkish } from "@ethersproject/providers";
import { RPCConnectionHandler } from "./classes/rpc-connection-handler";
import { SDKOptions } from "../schema/sdk-options";
import type {
  ModuleForModuleType,
  ModuleType,
  NetworkOrSignerOrProvider,
  ValidModuleInstance,
} from "./types";
import { ModuleFactory } from "./classes/factory";
import { Registry } from "./classes/registry";
import { DropErc721Module, MODULES_MAP } from "../modules";
import { IThirdwebModule__factory } from "@3rdweb/contracts";
import { ethers } from "ethers";

export class ThirdwebSDK extends RPCConnectionHandler {
  /**
   * @internal
   * the cache of modules that we have already seen
   */
  private moduleCache = new Map<string, ValidModuleInstance>();

  private registry: Registry;
  private factory: ModuleFactory;

  private updateModuleSignerOrProvider() {
    this.registry.updateSignerOrProvider(
      this.getSigner() || this.getProvider(),
    );
    this.factory.updateSignerOrProvider(this.getSigner() || this.getProvider());
    for (const [, module] of this.moduleCache) {
      module.updateSignerOrProvider(this.getSigner() || this.getProvider());
    }
  }

  constructor(network: NetworkOrSignerOrProvider, options: SDKOptions) {
    super(network, options);
    this.registry = new Registry(network);
    this.factory = new ModuleFactory(network);
  }

  public override updateSignerOrProvider(network: Networkish) {
    super.updateSignerOrProvider(network);
    this.updateModuleSignerOrProvider();
  }

  /**
   *
   * @param moduleAddress - the address of the module to attempt to resolve the module type for
   * @returns the {@link ModuleType} for the given module address
   * @throws if the module type cannot be determined (is not a valid thirdweb module)
   */
  public async resolveModuleType<TModuleType extends ModuleType>(
    moduleAddress: string,
  ) {
    const contract = IThirdwebModule__factory.connect(
      moduleAddress,
      this.options.readOnlyRpcUrl
        ? ethers.getDefaultProvider(this.options.readOnlyRpcUrl)
        : this.getProvider(),
    );
    return (await contract.moduleType()) as TModuleType;
  }

  /**
   *
   * @internal
   * @param address - the address of the module to instantiate
   * @param moduleType - optional, the type of module to instantiate
   * @returns a promise that resolves with the module instance
   */
  public getModule<TModuleType extends ModuleType = ModuleType>(
    address: string,
    moduleType: TModuleType,
  ) {
    // if we have a module in the cache we will return it
    // we will do this **without** checking any module type things for simplicity, this may have to change in the future?
    if (this.moduleCache.has(address)) {
      return this.moduleCache.get(address) as ModuleForModuleType<TModuleType>;
    }
    const newModule = new MODULES_MAP[
      // we have to do this as here because typescript is not smart enough to figure out
      // that the type is a key of the map (checked by the if statement above)
      moduleType as keyof typeof MODULES_MAP
    ](this.getNetwork(), address, this.options);
    // if we have a module type && the module type is part of the map

    this.moduleCache.set(address, newModule);

    // return the new module
    return newModule;
  }

  public getDropModule(moduleAddress: string) {
    return this.getModule(moduleAddress, DropErc721Module.moduleType);
  }
}

// BELOW ARE TYPESCRIPT SANITY CHECKS

// (async () => {
//   const sdk = new ThirdwebSDK("1");

//   const dropModule = sdk.getDropModule("0x0");
//   // metadata
//   const metadata = await dropModule.metadata.get();
//   const updated = await dropModule.metadata.update({
//     name: "foo",
//     seller_fee_basis_points: 1,
//   });
//   const transaction = updated.transaction;
//   const data = await updated.metadata();

//   // roles
//   const roles = await dropModule.roles.getAllMembers();
//   const adminAddrs = await dropModule.roles.getRoleMembers("admin");

//   // royalty
//   const royalty = await dropModule.royalty.getRoyaltyInfo();

//   const updatedRoyalty = await dropModule.royalty.setRoyaltyInfo({
//     fee_recipient: "0x0",
//     seller_fee_basis_points: 500,
//   });

//   const transaction2 = updatedRoyalty.transaction;
//   // metadata key doesn't really make sense here? hm.
//   const data2 = await updatedRoyalty.metadata();
// })();
