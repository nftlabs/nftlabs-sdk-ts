import { AddressZero } from "@ethersproject/constants";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert } from "chai";
import { BigNumber } from "ethers";
import { readFileSync } from "fs";
import { JsonConvert } from "json2typescript";
import { BundleModuleMetadata, DropModule } from "../src/index";
import { appModule, sdk, signers } from "./before.test";

describe("App Module", async () => {
  let dropModule: DropModule;
  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;

  beforeEach(async () => {
    [adminWallet, samWallet, bobWallet] = signers;
  });

  it.skip("should serialize metadata correctly", async () => {
    const tests: {
      expected: any;
      test: BundleModuleMetadata;
      type: any;
    }[] = [
      {
        expected: {
          name: "Testing",
          description: "Test description",
          external_link: "https://google.com",
          seller_fee_basis_points: 100,
        },
        test: {
          name: "Testing",
          description: "Test description",
          externalLink: "https://google.com",
          sellerFeeBasisPoints: 100,
        },
        type: BundleModuleMetadata,
      },
      {
        expected: {
          name: "Testing",
          description: "Test description",
          external_link: "https://google.com",
          seller_fee_basis_points: 100,
          fee_recipient: "0x0",
          image: "test",
        },
        test: {
          name: "Testing",
          description: "Test description",
          externalLink: "https://google.com",
          sellerFeeBasisPoints: 100,
          feeRecipient: "0x0",
          image: "test",
        } as BundleModuleMetadata,
        type: BundleModuleMetadata,
      },
      {
        expected: {
          name: "Testing",
        },
        test: {
          name: "Testing",
        } as BundleModuleMetadata,
        type: BundleModuleMetadata,
      },
    ];

    const jsonConvert = new JsonConvert();
    for (const test of tests) {
      const result = jsonConvert.serializeObject(test.test, test.type);
      assert.deepEqual(result, test.expected);
    }
  });

  it("should deploy a collection module successfully", async () => {
    const module = await appModule.deployBundleModule({
      name: "Testing module from SDK",
      sellerFeeBasisPoints: 1000,
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
    });
  });

  it("should deploy a splits module successfully", async () => {
    const module = await appModule.deploySplitsModule({
      name: "Testing module from SDK",
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
      // this represents a 50/50 split (excluding the Thirdweb platform 5% cut)
      recipientSplits: [
        {
          address: "0xE79ee09bD47F4F5381dbbACaCff2040f2FbC5803",
          shares: BigNumber.from(100),
        },
        {
          address: "0x4d36d531D9cB40b8694763123D52170FAE5e1195",
          shares: BigNumber.from(100),
        },
      ],
    });
  });

  it("Should return a valid splits module", async () => {
    const module = await sdk.getSplitsModule(
      "0x255d57Be74C055Bdd29Dfb7c714EEfFdd2492163",
    );
  });

  it("should deploy an nft module with an image file successfully", async () => {
    const filePath = `${__dirname}/3510820011_4f558b6dea_b.jpg`;
    const image = readFileSync(filePath);
    const module = await appModule.deployNftModule({
      name: "Testing module from SDK",
      sellerFeeBasisPoints: 0,
      image,
    });

    const metadata = await module.getMetadata();
    assert.isTrue(
      metadata.metadata.image.includes("ipfs/"),
      `Image property = ${metadata.metadata.image}, should include ipfs/`,
    );
  });

  it("should deploy a currency module successfully", async () => {
    const image =
      "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg";
    const module = await appModule.deployCurrencyModule({
      name: "Testing currency from SDK",
      image,
      symbol: "TEST",
    });

    const metadata = await module.getMetadata();
    assert.equal(
      metadata.metadata.image,
      image,
      `Image property = ${metadata.metadata.image}, should include ipfs/`,
    );
  });

  it("should deploy a marketplace module successfully", async () => {
    const result = await appModule.deployMarketModule({
      name: `Testing market from SDK - ${new Date().toLocaleString()}`,
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
      marketFeeBasisPoints: 100,
    });
    await sdk.getMarketModule(result.address);
  });

  it("should deploy a pack module successfully", async () => {
    const result = await appModule.deployPackModule({
      name: `Testing pack from SDK - ${new Date().toLocaleString()}`,
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
      sellerFeeBasisPoints: 100,
    });
    await sdk.getPackModule(result.address);
  });

  it("should deploy a drop module successfully", async () => {
    const result = await appModule.deployDropModule({
      name: `Testing drop from SDK - ${new Date().toLocaleString()}`,
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
      sellerFeeBasisPoints: 100,
      maxSupply: 10,
      baseTokenUri: "/test",
      primarySaleRecipientAddress: AddressZero,
    });

    const module = await sdk.getDropModule(result.address);
    assert.equal(
      (await module.maxTotalSupply()).toNumber(),
      10,
      "The max supply should be 10",
    );
  });

  it("should deploy a datastore module successfully", async () => {
    const result = await appModule.deployDatastoreModule({
      name: `Testing drop from SDK - ${new Date().toLocaleString()}`,
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
    });

    await sdk.getDatastoreModule(result.address);
  });

  it("should properly parse metadata when image is string", async () => {
    const metadata = {
      name: "safe",
      description: "",
      image:
        "ipfs://bafkreiax7og4coq7z4w4mfsos6mbbit3qpzg4pa4viqhmed5dkyfbnp6ku",
      sellerFeeBasisPoints: 0,
      fee_recipient: "0xabE01399799888819f5dCE731F8C22f8E7e6AD26",
      symbol: "",
    };
    const contract = await appModule.deployBundleModule(metadata);
    const module = sdk.getBundleModule(contract.address);
    const result = await module.getMetadata();
    assert.equal(
      result.metadata.image,
      "https://ipfs.io/ipfs/bafkreiax7og4coq7z4w4mfsos6mbbit3qpzg4pa4viqhmed5dkyfbnp6ku",
    );
  });

  it("should upload to ipfs image is file", async () => {
    const metadata = {
      name: "safe",
      description: "",
      image: readFileSync(`${__dirname}/3510820011_4f558b6dea_b.jpg`),
      sellerFeeBasisPoints: 0,
      fee_recipient: "0xabE01399799888819f5dCE731F8C22f8E7e6AD26",
      symbol: "",
    };
    const contract = await appModule.deployBundleModule(metadata);
    const module = sdk.getBundleModule(contract.address);
    const result = await module.getMetadata();
    const regex = new RegExp(
      /Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/,
    );
    assert.match(result.metadata.image, regex);
  });
});
