<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [SnapshotInputSchema](./sdk.snapshotinputschema.md)

## SnapshotInputSchema variable

<b>Signature:</b>

```typescript
SnapshotInputSchema: z.ZodObject<{
    addresses: z.ZodArray<z.ZodString, "many">;
    maxClaimablePerAddress: z.ZodOptional<z.ZodArray<z.ZodNumber, "many">>;
}, "strip", z.ZodTypeAny, {
    maxClaimablePerAddress?: number[] | undefined;
    addresses: string[];
}, {
    maxClaimablePerAddress?: number[] | undefined;
    addresses: string[];
}>
```