import { ethers, Wallet } from "ethers";
import { sdk } from "./before-setup";
import { EventType } from "../src/constants/events";
import { expect } from "chai";
import { NFTDrop, ThirdwebSDK } from "../src";
import { AddressZero } from "@ethersproject/constants";

global.fetch = require("cross-fetch");

describe("Events", async () => {
  let dropContract: NFTDrop;

  beforeEach(async () => {
    dropContract = sdk.getNFTDrop(
      await sdk.deployer.deployBuiltInContract(NFTDrop.contractType, {
        name: `Testing drop from SDK`,
        description: "Test contract from tests",
        image:
          "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
        primary_sale_recipient: AddressZero,
        seller_fee_basis_points: 500,
        fee_recipient: AddressZero,
        platform_fee_basis_points: 10,
        platform_fee_recipient: AddressZero,
      }),
    );
  });

  it("should emit Transaction events", async () => {
    let txStatus = "";
    dropContract.events.addTransactionListener((event) => {
      if (!txStatus) {
        expect(event.status).to.eq("submitted");
      } else if (txStatus === "submitted") {
        expect(event.status).to.eq("completed");
      }
      txStatus = event.status;
    });
    await dropContract.setApprovalForAll(ethers.constants.AddressZero, true);
  });

  // TODO
  it.skip("should emit Signature events", async () => {
    const RPC_URL = "https://rpc-mumbai.maticvigil.com/";
    const provider = ethers.getDefaultProvider(RPC_URL);
    const wallet = Wallet.createRandom().connect(provider);
    const esdk = new ThirdwebSDK(wallet, {
      gasless: {
        openzeppelin: {
          relayerUrl: "https://google.com", // TODO test relayer url?
        },
      },
    });
    sdk.on(EventType.Transaction, (event) => {
      console.log(event);
    });
    sdk.on(EventType.Signature, (event) => {
      console.log(event);
    });
    await esdk
      .getNFTDrop(dropContract.getAddress())
      .setApprovalForAll(ethers.constants.AddressZero, true);
  });
});
