/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Permissions, PermissionsInterface } from "../Permissions";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "previousAdminRole",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "newAdminRole",
        type: "bytes32",
      },
    ],
    name: "RoleAdminChanged",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleGranted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "address",
        name: "account",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "RoleRevoked",
    type: "event",
  },
  {
    inputs: [],
    name: "DEFAULT_ADMIN_ROLE",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
    ],
    name: "getRoleAdmin",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "grantRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "hasRole",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "renounceRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "role",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "revokeRole",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b50610676806100206000396000f3fe608060405234801561001057600080fd5b50600436106100725760003560e01c806391d148541161005057806391d14854146100d2578063a217fddf14610119578063d547741f1461012157600080fd5b8063248a9ca3146100775780632f2ff15d146100aa57806336568abe146100bf575b600080fd5b6100976100853660046104a0565b60009081526001602052604090205490565b6040519081526020015b60405180910390f35b6100bd6100b83660046104b9565b610134565b005b6100bd6100cd3660046104b9565b6101a6565b6101096100e03660046104b9565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b60405190151581526020016100a1565b610097600081565b6100bd61012f3660046104b9565b610259565b60008281526001602052604090205461014d903361026e565b6000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916600117905551339285917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d9190a45050565b336001600160a01b038216146102035760405162461bcd60e51b815260206004820152601a60248201527f43616e206f6e6c792072656e6f756e636520666f722073656c6600000000000060448201526064015b60405180910390fd5b6000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008281526001602052604090205461020390335b6000828152602081815260408083206001600160a01b038516845290915290205460ff166102ec576102aa816001600160a01b031660146102f0565b6102b58360206102f0565b6040516020016102c6929190610525565b60408051601f198184030181529082905262461bcd60e51b82526101fa916004016105a6565b5050565b606060006102ff8360026105ef565b61030a90600261060e565b67ffffffffffffffff81111561032257610322610626565b6040519080825280601f01601f19166020018201604052801561034c576020820181803683370190505b509050600360fc1b816000815181106103675761036761063c565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106103965761039661063c565b60200101906001600160f81b031916908160001a90535060006103ba8460026105ef565b6103c590600161060e565b90505b600181111561044a577f303132333435363738396162636465660000000000000000000000000000000085600f16601081106104065761040661063c565b1a60f81b82828151811061041c5761041c61063c565b60200101906001600160f81b031916908160001a90535060049490941c9361044381610652565b90506103c8565b5083156104995760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e7460448201526064016101fa565b9392505050565b6000602082840312156104b257600080fd5b5035919050565b600080604083850312156104cc57600080fd5b8235915060208301356001600160a01b03811681146104ea57600080fd5b809150509250929050565b60005b838110156105105781810151838201526020016104f8565b8381111561051f576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161055d8160178501602088016104f5565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000601791840191820152835161059a8160288401602088016104f5565b01602801949350505050565b60208152600082518060208401526105c58160408501602087016104f5565b601f01601f19169190910160400192915050565b634e487b7160e01b600052601160045260246000fd5b6000816000190483118215151615610609576106096105d9565b500290565b60008219821115610621576106216105d9565b500190565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b600081610661576106616105d9565b50600019019056fea164736f6c634300080c000a";

type PermissionsConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PermissionsConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Permissions__factory extends ContractFactory {
  constructor(...args: PermissionsConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Permissions> {
    return super.deploy(overrides || {}) as Promise<Permissions>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): Permissions {
    return super.attach(address) as Permissions;
  }
  override connect(signer: Signer): Permissions__factory {
    return super.connect(signer) as Permissions__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PermissionsInterface {
    return new utils.Interface(_abi) as PermissionsInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Permissions {
    return new Contract(address, _abi, signerOrProvider) as Permissions;
  }
}
