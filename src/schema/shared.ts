import { BigNumber } from "ethers";
import { z } from "zod";

if (!global.File) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  global.File = require("@web-std/file").File;
}

export const FileBufferOrStringSchema = z.union([
  z.instanceof(File),
  z.instanceof(Buffer),
  z.string(),
]);

const BigNumberSchema = z.instanceof(BigNumber);

const BigNumberishSchema = z
  .union([z.string(), z.number(), z.bigint(), BigNumberSchema])
  .transform((arg) => BigNumber.from(arg));

export const BasisPointsSchema = BigNumberishSchema.superRefine((bn, ctx) => {
  if (bn.gt(10000)) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      maximum: 10000,
      inclusive: true,
      type: "number",
    });
  } else if (bn.lt(0)) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_small,
      minimum: 0,
      inclusive: true,
      type: "number",
    });
  }
});

type Literal = boolean | null | number | string;
type Json = Literal | { [key: string]: Json } | Json[];
export const JsonLiteral = z.union([
  z.string().min(1, "Cannot be empty"),
  z.number(),
  z.boolean(),
  z.null(),
]);

export const JsonSchema: z.ZodSchema<Json> = z.lazy(() =>
  z.union([JsonLiteral, z.array(JsonSchema), z.record(JsonSchema)]),
);
export const JsonObject = z.record(JsonSchema);
export const HexColor = z
  .string()
  .regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color")
  .transform((val) => val.replace("#", ""));
