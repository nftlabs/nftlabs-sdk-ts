import {
  BasisPointsSchema,
  BigNumberishSchema,
  BigNumberSchema,
  DateSchema,
  PriceSchema,
} from "../../shared";
import { z } from "zod";
import { CommonNFTInput } from "../../tokens/common";
import { NATIVE_TOKEN_ADDRESS } from "../../../constants/currency";
import { AddressZero } from "@ethersproject/constants";
import { ethers } from "ethers";
import { resolveOrGenerateId } from "../../../common/signature-minting";

export const SignaturePayloadInput = z.object({
  metadata: CommonNFTInput,
  to: z.string(),
  price: PriceSchema,
  currencyAddress: z.string().default(NATIVE_TOKEN_ADDRESS),
  mintStartTime: DateSchema,
  mintEndTime: DateSchema,
  uid: z
    .string()
    .optional()
    .transform((arg) => resolveOrGenerateId(arg)),
  royaltyRecipient: z.string().default(AddressZero),
  royaltyBps: BasisPointsSchema.default(0),
  primarySaleRecipient: z.string().default(AddressZero),
});

export const SignaturePayloadOutput = SignaturePayloadInput.extend({
  uri: z.string(),
  royaltyBps: BigNumberSchema,
  price: BigNumberSchema,
  mintStartTime: BigNumberSchema,
  mintEndTime: BigNumberSchema,
});

export const Signature1155PayloadInput = SignaturePayloadInput.extend({
  tokenId: BigNumberishSchema.default(ethers.constants.MaxUint256),
  quantity: BigNumberishSchema,
});

export const Signature1155PayloadOutput = SignaturePayloadOutput.extend({
  tokenId: BigNumberSchema,
  quantity: BigNumberSchema,
});

/**
 * @internal
 */
export type FilledSignaturePayload = z.output<typeof SignaturePayloadInput>;
/**
 * @internal
 */
export type PayloadWithUri = z.output<typeof SignaturePayloadOutput>;

export type PayloadToSign = z.input<typeof SignaturePayloadInput>;
export type SignedPayload = { payload: PayloadWithUri; signature: string };

/**
 * @internal
 */
export type FilledSignaturePayload1155 = z.output<
  typeof Signature1155PayloadInput
>;
/**
 * @internal
 */
export type PayloadWithUri1155 = z.output<typeof Signature1155PayloadOutput>;

export type PayloadToSign1155 = z.input<typeof Signature1155PayloadInput>;
export type SignedPayload1155 = {
  payload: PayloadWithUri1155;
  signature: string;
};

export const MintRequest721 = [
  { name: "to", type: "address" },
  { name: "royaltyRecipient", type: "address" },
  { name: "royaltyBps", type: "uint256" },
  { name: "primarySaleRecipient", type: "address" },
  { name: "uri", type: "string" },
  { name: "price", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];

export const MintRequest1155 = [
  { name: "to", type: "address" },
  { name: "royaltyRecipient", type: "address" },
  { name: "royaltyBps", type: "uint256" },
  { name: "primarySaleRecipient", type: "address" },
  { name: "tokenId", type: "uint256" },
  { name: "uri", type: "string" },
  { name: "quantity", type: "uint256" },
  { name: "pricePerToken", type: "uint256" },
  { name: "currency", type: "address" },
  { name: "validityStartTimestamp", type: "uint128" },
  { name: "validityEndTimestamp", type: "uint128" },
  { name: "uid", type: "bytes32" },
];
