<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [Erc721WithQuantitySignatureMintable](./sdk.erc721withquantitysignaturemintable.md) &gt; [generateBatch](./sdk.erc721withquantitysignaturemintable.generatebatch.md)

## Erc721WithQuantitySignatureMintable.generateBatch() method

Genrate a batch of signatures that can be used to mint many dynamic NFTs.

<b>Signature:</b>

```typescript
generateBatch(payloadsToSign: PayloadToSign721withQuantity[]): Promise<SignedPayload721WithQuantitySignature[]>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  payloadsToSign | [PayloadToSign721withQuantity](./sdk.payloadtosign721withquantity.md)<!-- -->\[\] | the payloads to sign |

<b>Returns:</b>

Promise&lt;[SignedPayload721WithQuantitySignature](./sdk.signedpayload721withquantitysignature.md)<!-- -->\[\]&gt;

an array of payloads and signatures

## Remarks

See [Erc721WithQuantitySignatureMintable.generate()](./sdk.erc721withquantitysignaturemintable.generate.md)
