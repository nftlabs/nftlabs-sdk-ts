<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@3rdweb/sdk](./sdk.md) &gt; [Module](./sdk.module.md) &gt; [signTypedData](./sdk.module.signtypeddata.md)

## Module.signTypedData() method

<b>Signature:</b>

```typescript
protected signTypedData(signer: ethers.Signer, from: string, domain: {
        name: string;
        version: string;
        chainId: number;
        verifyingContract: string;
    }, types: any, message: any): Promise<BytesLike>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  signer | ethers.Signer |  |
|  from | string |  |
|  domain | { name: string; version: string; chainId: number; verifyingContract: string; } |  |
|  types | any |  |
|  message | any |  |

<b>Returns:</b>

Promise&lt;BytesLike&gt;
