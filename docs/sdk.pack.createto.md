<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [Pack](./sdk.pack.md) &gt; [createTo](./sdk.pack.createto.md)

## Pack.createTo() method

Create Pack To Wallet

<b>Signature:</b>

```typescript
createTo(to: string, metadataWithRewards: PackMetadataInput): Promise<TransactionResultWithId<EditionMetadata>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  to | string | the address to mint the pack to |
|  metadataWithRewards | PackMetadataInput | the metadata and rewards to include in the pack |

<b>Returns:</b>

Promise&lt;[TransactionResultWithId](./sdk.transactionresultwithid.md)<!-- -->&lt;[EditionMetadata](./sdk.editionmetadata.md)<!-- -->&gt;&gt;

## Remarks

Create a new pack with the given metadata and rewards and mint it to the specified address.

## Example


```javascript
const packMetadata = {
  // The metadata for the pack NFT itself
  metadata: {
    name: "My Pack",
    description: "This is a new pack",
    image: "ipfs://...",
  },
  // ERC20 rewards to be included in the pack
  erc20Rewards: [
    {
      assetContract: "0x...",
      quantity: 100,
    }
  ],
  // ERC721 rewards to be included in the pack
  erc721Rewards: [
    {
      assetContract: "0x...",
      tokenId: 0,
    }
  ],
  // ERC1155 rewards to be included in the pack
  erc1155Rewards: [
    {
      assetContract: "0x...",
      tokenId: 0,
      quantity: 100,
    }
  ],
  openStartTime: new Date(), // the date that packs can start to be opened, defaults to now
  rewardsPerPack: 1, // the number of rewards in each pack, defaults to 1
}

const tx = await contract.createTo("0x...", packMetadata);
```
