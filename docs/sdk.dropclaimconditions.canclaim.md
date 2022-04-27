<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [DropClaimConditions](./sdk.dropclaimconditions.md) &gt; [canClaim](./sdk.dropclaimconditions.canclaim.md)

## DropClaimConditions.canClaim() method

Can Claim

<b>Signature:</b>

```typescript
canClaim(quantity: Amount, addressToCheck?: string): Promise<boolean>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  quantity | [Amount](./sdk.amount.md) |  |
|  addressToCheck | string | <i>(Optional)</i> |

<b>Returns:</b>

Promise&lt;boolean&gt;

## Remarks

Check if the drop can currently be claimed.

## Example


```javascript
// Quantity of tokens to check claimability of
const quantity = 1;
const canClaim = await contract.canClaim(quantity);
```
