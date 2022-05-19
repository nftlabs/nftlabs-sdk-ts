/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import type { Provider } from "@ethersproject/providers";
import type {
  IDropMultiPhase,
  IDropMultiPhaseInterface,
} from "../IDropMultiPhase";

const _abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "quantity",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "currency",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "pricePerToken",
        type: "uint256",
      },
      {
        components: [
          {
            internalType: "bytes32[]",
            name: "proof",
            type: "bytes32[]",
          },
          {
            internalType: "uint256",
            name: "maxQuantityInAllowlist",
            type: "uint256",
          },
        ],
        internalType: "struct IDropMultiPhase.AllowlistProof",
        name: "allowlistProof",
        type: "tuple",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "claim",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "startTimestamp",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "maxClaimableSupply",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "supplyClaimed",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "quantityLimitPerTransaction",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "waitTimeInSecondsBetweenClaims",
            type: "uint256",
          },
          {
            internalType: "bytes32",
            name: "merkleRoot",
            type: "bytes32",
          },
          {
            internalType: "uint256",
            name: "pricePerToken",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "currency",
            type: "address",
          },
        ],
        internalType: "struct IClaimCondition.ClaimCondition[]",
        name: "phases",
        type: "tuple[]",
      },
      {
        internalType: "bool",
        name: "resetClaimEligibility",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
    ],
    name: "setClaimConditions",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IDropMultiPhase__factory {
  static readonly abi = _abi;
  static createInterface(): IDropMultiPhaseInterface {
    return new utils.Interface(_abi) as IDropMultiPhaseInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IDropMultiPhase {
    return new Contract(address, _abi, signerOrProvider) as IDropMultiPhase;
  }
}
