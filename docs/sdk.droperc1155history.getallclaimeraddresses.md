<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [DropErc1155History](./sdk.droperc1155history.md) &gt; [getAllClaimerAddresses](./sdk.droperc1155history.getallclaimeraddresses.md)

## DropErc1155History.getAllClaimerAddresses() method

Get all claimer addresses

<b>Signature:</b>

```typescript
getAllClaimerAddresses(tokenId: BigNumberish): Promise<string[]>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  tokenId | BigNumberish | the tokenId of the NFT to get the addresses of\* |

<b>Returns:</b>

Promise&lt;string\[\]&gt;

- A unique list of addresses that claimed the token

## Remarks

Get a list of all the addresses that have claimed a token

## Example


```javascript
const tokenId = "0";
const allClaimerAddresses = await contract.history.getAllClaimerAddresses(tokenId);
```
