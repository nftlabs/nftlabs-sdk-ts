<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [DropClaimConditions](./sdk.dropclaimconditions.md) &gt; [getClaimIneligibilityReasons](./sdk.dropclaimconditions.getclaimineligibilityreasons.md)

## DropClaimConditions.getClaimIneligibilityReasons() method

For any claim conditions that a particular wallet is violating, this function returns human readable information about the breaks in the condition that can be used to inform the user.

<b>Signature:</b>

```typescript
getClaimIneligibilityReasons(quantity: Amount, addressToCheck?: string): Promise<ClaimEligibility[]>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  quantity | [Amount](./sdk.amount.md) | The desired quantity that would be claimed. |
|  addressToCheck | string | <i>(Optional)</i> The wallet address, defaults to the connected wallet. |

<b>Returns:</b>

Promise&lt;[ClaimEligibility](./sdk.claimeligibility.md)<!-- -->\[\]&gt;
