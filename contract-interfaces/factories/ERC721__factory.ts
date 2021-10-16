/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ERC721, ERC721Interface } from "../ERC721";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "approved",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "ApprovalForAll",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "getApproved",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
    ],
    name: "isApprovedForAll",
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
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "ownerOf",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "_data",
        type: "bytes",
      },
    ],
    name: "safeTransferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "operator",
        type: "address",
      },
      {
        internalType: "bool",
        name: "approved",
        type: "bool",
      },
    ],
    name: "setApprovalForAll",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes4",
        name: "interfaceId",
        type: "bytes4",
      },
    ],
    name: "supportsInterface",
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
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b50604051620014d2380380620014d28339810160408190526200003491620001c1565b81516200004990600090602085019062000068565b5080516200005f90600190602084019062000068565b5050506200027b565b828054620000769062000228565b90600052602060002090601f0160209004810192826200009a5760008555620000e5565b82601f10620000b557805160ff1916838001178555620000e5565b82800160010185558215620000e5579182015b82811115620000e5578251825591602001919060010190620000c8565b50620000f3929150620000f7565b5090565b5b80821115620000f35760008155600101620000f8565b600082601f8301126200011f578081fd5b81516001600160401b03808211156200013c576200013c62000265565b604051601f8301601f19908116603f0116810190828211818310171562000167576200016762000265565b8160405283815260209250868385880101111562000183578485fd5b8491505b83821015620001a6578582018301518183018401529082019062000187565b83821115620001b757848385830101525b9695505050505050565b60008060408385031215620001d4578182fd5b82516001600160401b0380821115620001eb578384fd5b620001f9868387016200010e565b935060208501519150808211156200020f578283fd5b506200021e858286016200010e565b9150509250929050565b600181811c908216806200023d57607f821691505b602082108114156200025f57634e487b7160e01b600052602260045260246000fd5b50919050565b634e487b7160e01b600052604160045260246000fd5b611247806200028b6000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c80636352211e1161008c578063a22cb46511610066578063a22cb465146101b3578063b88d4fde146101c6578063c87b56dd146101d9578063e985e9c5146101ec576100cf565b80636352211e1461017757806370a082311461018a57806395d89b41146101ab576100cf565b806301ffc9a7146100d457806306fdde03146100fc578063081812fc14610111578063095ea7b31461013c57806323b872dd1461015157806342842e0e14610164575b600080fd5b6100e76100e2366004610f3f565b610228565b60405190151581526020015b60405180910390f35b61010461027c565b6040516100f39190611027565b61012461011f366004610f77565b61030e565b6040516001600160a01b0390911681526020016100f3565b61014f61014a366004610f16565b6103a8565b005b61014f61015f366004610dcc565b6104be565b61014f610172366004610dcc565b6104ef565b610124610185366004610f77565b61050a565b61019d610198366004610d80565b610581565b6040519081526020016100f3565b610104610608565b61014f6101c1366004610edc565b610617565b61014f6101d4366004610e07565b6106e9565b6101046101e7366004610f77565b610721565b6100e76101fa366004610d9a565b6001600160a01b03918216600090815260056020908152604080832093909416825291909152205460ff1690565b60006001600160e01b031982166380ac58cd60e01b148061025957506001600160e01b03198216635b5e139f60e01b145b8061027457506301ffc9a760e01b6001600160e01b03198316145b90505b919050565b60606000805461028b9061114c565b80601f01602080910402602001604051908101604052809291908181526020018280546102b79061114c565b80156103045780601f106102d957610100808354040283529160200191610304565b820191906000526020600020905b8154815290600101906020018083116102e757829003601f168201915b5050505050905090565b6000818152600260205260408120546001600160a01b031661038c5760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a20617070726f76656420717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b60648201526084015b60405180910390fd5b506000908152600460205260409020546001600160a01b031690565b60006103b38261050a565b9050806001600160a01b0316836001600160a01b031614156104215760405162461bcd60e51b815260206004820152602160248201527f4552433732313a20617070726f76616c20746f2063757272656e74206f776e656044820152603960f91b6064820152608401610383565b336001600160a01b038216148061043d575061043d81336101fa565b6104af5760405162461bcd60e51b815260206004820152603860248201527f4552433732313a20617070726f76652063616c6c6572206973206e6f74206f7760448201527f6e6572206e6f7220617070726f76656420666f7220616c6c00000000000000006064820152608401610383565b6104b98383610809565b505050565b6104c83382610877565b6104e45760405162461bcd60e51b81526004016103839061108c565b6104b983838361096e565b6104b9838383604051806020016040528060008152506106e9565b6000818152600260205260408120546001600160a01b0316806102745760405162461bcd60e51b815260206004820152602960248201527f4552433732313a206f776e657220717565727920666f72206e6f6e657869737460448201526832b73a103a37b5b2b760b91b6064820152608401610383565b60006001600160a01b0382166105ec5760405162461bcd60e51b815260206004820152602a60248201527f4552433732313a2062616c616e636520717565727920666f7220746865207a65604482015269726f206164647265737360b01b6064820152608401610383565b506001600160a01b031660009081526003602052604090205490565b60606001805461028b9061114c565b6001600160a01b0382163314156106705760405162461bcd60e51b815260206004820152601960248201527f4552433732313a20617070726f766520746f2063616c6c6572000000000000006044820152606401610383565b3360008181526005602090815260408083206001600160a01b0387168085529252909120805460ff1916841515179055906001600160a01b03167f17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31836040516106dd911515815260200190565b60405180910390a35050565b6106f33383610877565b61070f5760405162461bcd60e51b81526004016103839061108c565b61071b84848484610b0e565b50505050565b6000818152600260205260409020546060906001600160a01b03166107a05760405162461bcd60e51b815260206004820152602f60248201527f4552433732314d657461646174613a2055524920717565727920666f72206e6f60448201526e3732bc34b9ba32b73a103a37b5b2b760891b6064820152608401610383565b60006107b760408051602081019091526000815290565b905060008151116107d75760405180602001604052806000815250610802565b806107e184610b41565b6040516020016107f2929190610fbb565b6040516020818303038152906040525b9392505050565b600081815260046020526040902080546001600160a01b0319166001600160a01b038416908117909155819061083e8261050a565b6001600160a01b03167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92560405160405180910390a45050565b6000818152600260205260408120546001600160a01b03166108f05760405162461bcd60e51b815260206004820152602c60248201527f4552433732313a206f70657261746f7220717565727920666f72206e6f6e657860448201526b34b9ba32b73a103a37b5b2b760a11b6064820152608401610383565b60006108fb8361050a565b9050806001600160a01b0316846001600160a01b031614806109365750836001600160a01b031661092b8461030e565b6001600160a01b0316145b8061096657506001600160a01b0380821660009081526005602090815260408083209388168352929052205460ff165b949350505050565b826001600160a01b03166109818261050a565b6001600160a01b0316146109e95760405162461bcd60e51b815260206004820152602960248201527f4552433732313a207472616e73666572206f6620746f6b656e2074686174206960448201526839903737ba1037bbb760b91b6064820152608401610383565b6001600160a01b038216610a4b5760405162461bcd60e51b8152602060048201526024808201527f4552433732313a207472616e7366657220746f20746865207a65726f206164646044820152637265737360e01b6064820152608401610383565b610a56600082610809565b6001600160a01b0383166000908152600360205260408120805460019290610a7f908490611109565b90915550506001600160a01b0382166000908152600360205260408120805460019290610aad9084906110dd565b909155505060008181526002602052604080822080546001600160a01b0319166001600160a01b0386811691821790925591518493918716917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef91a4505050565b610b1984848461096e565b610b2584848484610c5c565b61071b5760405162461bcd60e51b81526004016103839061103a565b606081610b6657506040805180820190915260018152600360fc1b6020820152610277565b8160005b8115610b905780610b7a81611187565b9150610b899050600a836110f5565b9150610b6a565b60008167ffffffffffffffff811115610bb957634e487b7160e01b600052604160045260246000fd5b6040519080825280601f01601f191660200182016040528015610be3576020820181803683370190505b5090505b841561096657610bf8600183611109565b9150610c05600a866111a2565b610c109060306110dd565b60f81b818381518110610c3357634e487b7160e01b600052603260045260246000fd5b60200101906001600160f81b031916908160001a905350610c55600a866110f5565b9450610be7565b60006001600160a01b0384163b15610d5e57604051630a85bd0160e11b81526001600160a01b0385169063150b7a0290610ca0903390899088908890600401610fea565b602060405180830381600087803b158015610cba57600080fd5b505af1925050508015610cea575060408051601f3d908101601f19168201909252610ce791810190610f5b565b60015b610d44573d808015610d18576040519150601f19603f3d011682016040523d82523d6000602084013e610d1d565b606091505b508051610d3c5760405162461bcd60e51b81526004016103839061103a565b805181602001fd5b6001600160e01b031916630a85bd0160e11b149050610966565b506001949350505050565b80356001600160a01b038116811461027757600080fd5b600060208284031215610d91578081fd5b61080282610d69565b60008060408385031215610dac578081fd5b610db583610d69565b9150610dc360208401610d69565b90509250929050565b600080600060608486031215610de0578081fd5b610de984610d69565b9250610df760208501610d69565b9150604084013590509250925092565b60008060008060808587031215610e1c578081fd5b610e2585610d69565b9350610e3360208601610d69565b925060408501359150606085013567ffffffffffffffff80821115610e56578283fd5b818701915087601f830112610e69578283fd5b813581811115610e7b57610e7b6111e2565b604051601f8201601f19908116603f01168101908382118183101715610ea357610ea36111e2565b816040528281528a6020848701011115610ebb578586fd5b82602086016020830137918201602001949094529598949750929550505050565b60008060408385031215610eee578182fd5b610ef783610d69565b915060208301358015158114610f0b578182fd5b809150509250929050565b60008060408385031215610f28578182fd5b610f3183610d69565b946020939093013593505050565b600060208284031215610f50578081fd5b8135610802816111f8565b600060208284031215610f6c578081fd5b8151610802816111f8565b600060208284031215610f88578081fd5b5035919050565b60008151808452610fa7816020860160208601611120565b601f01601f19169290920160200192915050565b60008351610fcd818460208801611120565b835190830190610fe1818360208801611120565b01949350505050565b6001600160a01b038581168252841660208201526040810183905260806060820181905260009061101d90830184610f8f565b9695505050505050565b6000602082526108026020830184610f8f565b60208082526032908201527f4552433732313a207472616e7366657220746f206e6f6e20455243373231526560408201527131b2b4bb32b91034b6b83632b6b2b73a32b960711b606082015260800190565b60208082526031908201527f4552433732313a207472616e736665722063616c6c6572206973206e6f74206f6040820152701ddb995c881b9bdc88185c1c1c9bdd9959607a1b606082015260800190565b600082198211156110f0576110f06111b6565b500190565b600082611104576111046111cc565b500490565b60008282101561111b5761111b6111b6565b500390565b60005b8381101561113b578181015183820152602001611123565b8381111561071b5750506000910152565b600181811c9082168061116057607f821691505b6020821081141561118157634e487b7160e01b600052602260045260246000fd5b50919050565b600060001982141561119b5761119b6111b6565b5060010190565b6000826111b1576111b16111cc565b500690565b634e487b7160e01b600052601160045260246000fd5b634e487b7160e01b600052601260045260246000fd5b634e487b7160e01b600052604160045260246000fd5b6001600160e01b03198116811461120e57600080fd5b5056fea2646970667358221220a8bcf112e667f42668b0b9cb6fe17e6d95f6d67e2dedd681fa43086aca87296264736f6c63430008030033";

export class ERC721__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC721> {
    return super.deploy(name_, symbol_, overrides || {}) as Promise<ERC721>;
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, overrides || {});
  }
  attach(address: string): ERC721 {
    return super.attach(address) as ERC721;
  }
  connect(signer: Signer): ERC721__factory {
    return super.connect(signer) as ERC721__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC721Interface {
    return new utils.Interface(_abi) as ERC721Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): ERC721 {
    return new Contract(address, _abi, signerOrProvider) as ERC721;
  }
}
