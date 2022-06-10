<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [Erc721Dropable](./sdk.erc721dropable.md)

## Erc721Dropable class

Lazily mint and claim ERC721 NFTs

<b>Signature:</b>

```typescript
export declare class Erc721Dropable implements DetectableFeature 
```
<b>Implements:</b> DetectableFeature

## Remarks

Manage claim phases and claim ERC721 NFTs that have been lazily minted.

## Example


```javascript
const contract = await sdk.getContract("{{contract_address}}");
await contract.drop.claim(quantity);
```

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(erc721, contractWrapper, storage)](./sdk.erc721dropable._constructor_.md) |  | Constructs a new instance of the <code>Erc721Dropable</code> class |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [claimConditions](./sdk.erc721dropable.claimconditions.md) |  | [DropClaimConditions](./sdk.dropclaimconditions.md)<!-- -->&lt;BaseDropERC721&gt; \| undefined | Configure claim conditions |
|  [featureName](./sdk.erc721dropable.featurename.md) |  | "ERC721Dropable" |  |
|  [revealer](./sdk.erc721dropable.revealer.md) |  | [DelayedReveal](./sdk.delayedreveal.md)<!-- -->&lt;BaseDelayedRevealERC721&gt; \| undefined |  |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [claim(quantity, claimData, proofs)](./sdk.erc721dropable.claim.md) |  | Claim NFTs to the connected wallet. |
|  [claimTo(destinationAddress, quantity, claimData, proofs)](./sdk.erc721dropable.claimto.md) |  | Claim unique NFTs to a specific Wallet |
|  [lazyMint(metadatas, options)](./sdk.erc721dropable.lazymint.md) |  | Create a batch of unique NFTs to be claimed in the future |
