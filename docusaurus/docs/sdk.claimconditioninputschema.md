---
id: sdk.claimconditioninputschema
title: ClaimConditionInputSchema variable
hide_title: true
---
<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[@thirdweb-dev/sdk](./sdk.md) &gt; [ClaimConditionInputSchema](./sdk.claimconditioninputschema.md)

## ClaimConditionInputSchema variable

<b>Signature:</b>

```typescript
ClaimConditionInputSchema: z.ZodObject<{
    startTime: z.ZodEffects<z.ZodDefault<z.ZodDate>, BigNumber, Date | undefined>;
    currencyAddress: z.ZodDefault<z.ZodString>;
    price: z.ZodDefault<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber]>, string, string | number>>;
    maxQuantity: z.ZodDefault<z.ZodEffects<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBigInt, z.ZodType<BigNumber, z.ZodTypeDef, BigNumber>]>, BigNumber, string | number | bigint | BigNumber>, string, string | number | bigint | BigNumber>>;
    quantityLimitPerTransaction: z.ZodDefault<z.ZodEffects<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBigInt, z.ZodType<BigNumber, z.ZodTypeDef, BigNumber>]>, BigNumber, string | number | bigint | BigNumber>, string, string | number | bigint | BigNumber>>;
    waitInSeconds: z.ZodDefault<z.ZodEffects<z.ZodEffects<z.ZodUnion<[z.ZodString, z.ZodNumber, z.ZodBigInt, z.ZodType<BigNumber, z.ZodTypeDef, BigNumber>]>, BigNumber, string | number | bigint | BigNumber>, string, string | number | bigint | BigNumber>>;
    merkleRootHash: z.ZodDefault<z.ZodUnion<[z.ZodArray<z.ZodNumber, "many">, z.ZodString]>>;
    snapshot: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    snapshot?: string[] | undefined;
    startTime: BigNumber;
    currencyAddress: string;
    price: string;
    maxQuantity: string;
    quantityLimitPerTransaction: string;
    waitInSeconds: string;
    merkleRootHash: string | number[];
}, {
    snapshot?: string[] | undefined;
    startTime?: Date | undefined;
    currencyAddress?: string | undefined;
    price?: string | number | undefined;
    maxQuantity?: string | number | bigint | BigNumber | undefined;
    quantityLimitPerTransaction?: string | number | bigint | BigNumber | undefined;
    waitInSeconds?: string | number | bigint | BigNumber | undefined;
    merkleRootHash?: string | number[] | undefined;
}>
```