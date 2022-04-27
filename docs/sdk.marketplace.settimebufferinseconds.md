<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@thirdweb-dev/sdk](./sdk.md) &gt; [Marketplace](./sdk.marketplace.md) &gt; [setTimeBufferInSeconds](./sdk.marketplace.settimebufferinseconds.md)

## Marketplace.setTimeBufferInSeconds() method

Set the Auction Time buffer:

<b>Signature:</b>

```typescript
setTimeBufferInSeconds(bufferInSeconds: BigNumberish): Promise<void>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  bufferInSeconds | BigNumberish | the seconds value |

<b>Returns:</b>

Promise&lt;void&gt;

## Remarks

Measured in seconds (e.g. 15 minutes or 900 seconds). If a winning bid is made within the buffer of the auction closing (e.g. 15 minutes within the auction closing), the auction's closing time is increased by the buffer to prevent buyers from making last minute winning bids, and to give time to other buyers to make a higher bid if they wish to.

## Example


```javascript
// the time buffer in seconds
const bufferInSeconds = 60;
await contract.setTimeBufferInSeconds(bufferInSeconds);
```
