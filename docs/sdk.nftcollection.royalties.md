<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [NFTCollection](./sdk.nftcollection.md) &gt; [royalties](./sdk.nftcollection.royalties.md)

## NFTCollection.royalties property

Configure royalties

<b>Signature:</b>

```typescript
royalties: ContractRoyalty<TokenERC721, typeof NFTCollection.schema>;
```

## Remarks

Set your own royalties for the entire contract or per token

## Example


```javascript
// royalties on the whole contract
contract.royalties.setDefaultRoyaltyInfo({
  seller_fee_basis_points: 100, // 1%
  fee_recipient: "0x..."
});
// override royalty for a particular token
contract.royalties.setTokenRoyaltyInfo(tokenId, {
  seller_fee_basis_points: 500, // 5%
  fee_recipient: "0x..."
});
```
