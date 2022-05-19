/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  PermissionsEnumerable,
  PermissionsEnumerableInterface,
} from "../PermissionsEnumerable";

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
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
    ],
    name: "getRoleMember",
    outputs: [
      {
        internalType: "address",
        name: "member",
        type: "address",
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
    name: "getRoleMemberCount",
    outputs: [
      {
        internalType: "uint256",
        name: "count",
        type: "uint256",
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
  "0x608060405234801561001057600080fd5b506108f5806100206000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c806391d148541161005b57806391d1485414610113578063a217fddf1461015a578063ca15c87314610162578063d547741f1461017557600080fd5b8063248a9ca31461008d5780632f2ff15d146100c057806336568abe146100d55780639010d07c146100e8575b600080fd5b6100ad61009b3660046106fd565b60009081526001602052604090205490565b6040519081526020015b60405180910390f35b6100d36100ce366004610716565b610188565b005b6100d36100e3366004610716565b6101a0565b6100fb6100f6366004610752565b610203565b6040516001600160a01b0390911681526020016100b7565b61014a610121366004610716565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b60405190151581526020016100b7565b6100ad600081565b6100ad6101703660046106fd565b6102a7565b6100d3610183366004610716565b610312565b610192828261031c565b61019c828261038e565b5050565b6101aa8282610407565b60009182526002602081815260408085206001600160a01b03949094168086529284018083528186208054875260019095018352908520805473ffffffffffffffffffffffffffffffffffffffff191690559184525255565b60008281526002602052604081205481805b8281101561029e5760008681526002602090815260408083208484526001019091529020546001600160a01b03161561027e57848214156102795760008681526002602090815260408083208484526001019091529020546001600160a01b031693505b61028c565b61028960018361078a565b91505b61029760018261078a565b9050610215565b50505092915050565b600081815260026020526040812054815b8181101561030b5760008481526002602090815260408083208484526001019091529020546001600160a01b0316156102f9576102f660018461078a565b92505b61030460018261078a565b90506102b8565b5050919050565b6101aa82826104ba565b60008281526001602052604090205461033590336104cf565b6000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916600117905551339285917f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d9190a45050565b6000828152600260205260408120805491600191906103ad838561078a565b9091555050600092835260026020818152604080862084875260018101835281872080546001600160a01b0390971673ffffffffffffffffffffffffffffffffffffffff1990971687179055948652939091019052912055565b336001600160a01b038216146104645760405162461bcd60e51b815260206004820152601a60248201527f43616e206f6e6c792072656e6f756e636520666f722073656c6600000000000060448201526064015b60405180910390fd5b6000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60008281526001602052604090205461046490335b6000828152602081815260408083206001600160a01b038516845290915290205460ff1661019c5761050b816001600160a01b0316601461054d565b61051683602061054d565b6040516020016105279291906107d2565b60408051601f198184030181529082905262461bcd60e51b825261045b91600401610853565b6060600061055c836002610886565b61056790600261078a565b67ffffffffffffffff81111561057f5761057f6108a5565b6040519080825280601f01601f1916602001820160405280156105a9576020820181803683370190505b509050600360fc1b816000815181106105c4576105c46108bb565b60200101906001600160f81b031916908160001a905350600f60fb1b816001815181106105f3576105f36108bb565b60200101906001600160f81b031916908160001a9053506000610617846002610886565b61062290600161078a565b90505b60018111156106a7577f303132333435363738396162636465660000000000000000000000000000000085600f1660108110610663576106636108bb565b1a60f81b828281518110610679576106796108bb565b60200101906001600160f81b031916908160001a90535060049490941c936106a0816108d1565b9050610625565b5083156106f65760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e74604482015260640161045b565b9392505050565b60006020828403121561070f57600080fd5b5035919050565b6000806040838503121561072957600080fd5b8235915060208301356001600160a01b038116811461074757600080fd5b809150509250929050565b6000806040838503121561076557600080fd5b50508035926020909101359150565b634e487b7160e01b600052601160045260246000fd5b6000821982111561079d5761079d610774565b500190565b60005b838110156107bd5781810151838201526020016107a5565b838111156107cc576000848401525b50505050565b7f416363657373436f6e74726f6c3a206163636f756e742000000000000000000081526000835161080a8160178501602088016107a2565b7f206973206d697373696e6720726f6c652000000000000000000000000000000060179184019182015283516108478160288401602088016107a2565b01602801949350505050565b60208152600082518060208401526108728160408501602087016107a2565b601f01601f19169190910160400192915050565b60008160001904831182151516156108a0576108a0610774565b500290565b634e487b7160e01b600052604160045260246000fd5b634e487b7160e01b600052603260045260246000fd5b6000816108e0576108e0610774565b50600019019056fea164736f6c634300080c000a";

type PermissionsEnumerableConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: PermissionsEnumerableConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class PermissionsEnumerable__factory extends ContractFactory {
  constructor(...args: PermissionsEnumerableConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<PermissionsEnumerable> {
    return super.deploy(overrides || {}) as Promise<PermissionsEnumerable>;
  }
  override getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  override attach(address: string): PermissionsEnumerable {
    return super.attach(address) as PermissionsEnumerable;
  }
  override connect(signer: Signer): PermissionsEnumerable__factory {
    return super.connect(signer) as PermissionsEnumerable__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): PermissionsEnumerableInterface {
    return new utils.Interface(_abi) as PermissionsEnumerableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): PermissionsEnumerable {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as PermissionsEnumerable;
  }
}
