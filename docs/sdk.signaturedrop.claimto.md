<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [SignatureDrop](./sdk.signaturedrop.md) &gt; [claimTo](./sdk.signaturedrop.claimto.md)

## SignatureDrop.claimTo() method

Claim unique NFTs to a specific Wallet

<b>Signature:</b>

```typescript
claimTo(destinationAddress: string, quantity: BigNumberish, checkERC20Allowance?: boolean, proofs?: BytesLike[]): Promise<TransactionResultWithId<NFTMetadataOwner>[]>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  destinationAddress | string | Address you want to send the token to |
|  quantity | BigNumberish | Quantity of the tokens you want to claim |
|  checkERC20Allowance | boolean | <i>(Optional)</i> Optional, check if the wallet has enough ERC20 allowance to claim the tokens, and if not, approve the transfer |
|  proofs | BytesLike\[\] | <i>(Optional)</i> Array of proofs |

<b>Returns:</b>

Promise&lt;[TransactionResultWithId](./sdk.transactionresultwithid.md)<!-- -->&lt;[NFTMetadataOwner](./sdk.nftmetadataowner.md)<!-- -->&gt;\[\]&gt;

- an array of results containing the id of the token claimed, the transaction receipt and a promise to optionally fetch the nft metadata

## Remarks

Let the specified wallet claim NFTs.

## Example


```javascript
const address = "{{wallet_address}}"; // address of the wallet you want to claim the NFTs
const quantity = 1; // how many unique NFTs you want to claim

const tx = await contract.claimTo(address, quantity);
const receipt = tx.receipt; // the transaction receipt
const claimedTokenId = tx.id; // the id of the NFT claimed
const claimedNFT = await tx.data(); // (optional) get the claimed NFT metadata
```
