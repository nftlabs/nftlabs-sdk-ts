import { ethers } from "ethers";
import { DropModule, ThirdwebSDK } from "../src/index";
import * as chai from "chai";
import { createReadStream, readdirSync } from "fs";

global.fetch = require("node-fetch");

const RPC_URL = "https://matic-mumbai.chainstacklabs.com";

describe("Batch uploading", async () => {
  let sdk: ThirdwebSDK;
  let dropModule: DropModule;

  beforeEach(async () => {
    if (process.env.PKEY) {
      sdk = new ThirdwebSDK(
        new ethers.Wallet(process.env.PKEY, ethers.getDefaultProvider(RPC_URL)),
      );
    } else {
      sdk = new ThirdwebSDK(RPC_URL);
    }

    dropModule = sdk.getDropModule(
      "0x62B11c3E9234DB862d63389B3Aa9e4fc858d502c",
    );
  });

  it.skip("should upload bulk", async () => {
    const folder = await readdirSync("test/images");
    const filelist = [];
    folder.forEach((file) => {
      filelist.push(createReadStream(`test/images/${file}`));
    });
    const ipfsUri = await dropModule.pinToIpfs(filelist);
    const regex = new RegExp(
      /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/,
    );
    console.log(ipfsUri);
    chai.assert.isTrue(regex.test(ipfsUri));
  });
});
