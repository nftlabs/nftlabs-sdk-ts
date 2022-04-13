import {
  AddressSchema,
  BasisPointsSchema,
  FileBufferOrStringSchema,
  JsonSchema,
} from "../../shared";
import { AddressZero } from "@ethersproject/constants";
import { z } from "zod";

/**
 * @internal
 */
export const CommonContractSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: FileBufferOrStringSchema.optional(),
  external_link: z.string().url().optional(),
});

export const CustomContractSchema = CommonContractSchema.catchall(
  z.lazy(() => JsonSchema),
);

export type CustomContractMetadata = z.input<typeof CustomContractSchema>;

/**
 * @internal
 */
export const CommonContractOutputSchema = CommonContractSchema.extend({
  image: z.string().optional(),
}).catchall(z.lazy(() => JsonSchema));

/**
 * @internal
 */
export const CommonRoyaltySchema = z.object({
  /**
   * The amount of royalty collected on all royalties represented as basis points.
   * The default is 0 (no royalties).
   *
   * 1 basis point = 0.01%
   *
   * For example: if this value is 100, then the royalty is 1% of the total sales.
   *
   *  @internalremarks used by OpenSea "seller_fee_basis_points"
   */
  seller_fee_basis_points: BasisPointsSchema.default(0),

  /**
   * The address of the royalty recipient. All royalties will be sent
   * to this address.
   * @internalremarks used by OpenSea "fee_recipient"
   */
  fee_recipient: AddressSchema.default(AddressZero),
});

/**
 * @internal
 */
export const CommonPrimarySaleSchema = z.object({
  /**
   * primary sale recipient address
   */
  primary_sale_recipient: AddressSchema,
});

/**
 * @internal
 */
export const CommonPlatformFeeSchema = z.object({
  /**
   * platform fee basis points
   */
  platform_fee_basis_points: BasisPointsSchema.default(0),
  /**
   * platform fee recipient address
   */
  platform_fee_recipient: AddressSchema.default(AddressZero),
});

/**
 * @internal
 */
export const CommonTrustedForwarderSchema = z.object({
  trusted_forwarders: z.array(AddressSchema).default([]),
});

/**
 * @internal
 */
export const CommonSymbolSchema = z.object({
  symbol: z.string().optional().default(""),
});

export * from "./claim-conditions";
export * from "./currency";
export * from "./signature";
export * from "./snapshots";
