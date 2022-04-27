<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [EditionDrop](./sdk.editiondrop.md) &gt; [claim](./sdk.editiondrop.claim.md)

## EditionDrop.claim() method

Claim a token to the connected wallet

<b>Signature:</b>

```typescript
claim(tokenId: BigNumberish, quantity: BigNumberish, proofs?: BytesLike[]): Promise<TransactionResult>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  tokenId | BigNumberish | Id of the token you want to claim |
|  quantity | BigNumberish | Quantity of the tokens you want to claim |
|  proofs | BytesLike\[\] | <i>(Optional)</i> Array of proofs |

<b>Returns:</b>

Promise&lt;[TransactionResult](./sdk.transactionresult.md)<!-- -->&gt;

- Receipt for the transaction

## Remarks

See [EditionDrop.claimTo()](./sdk.editiondrop.claimto.md)
