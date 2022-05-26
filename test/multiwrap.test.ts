import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { sdk, signers } from "./before-setup";
import { Edition, Multiwrap, NFTCollection, Token } from "../src/contracts";
import { expect } from "chai";

describe("Multiwrap Contract", async () => {
  let multiwrapContract: Multiwrap;
  let nftContract: NFTCollection;
  let editionContract: Edition;
  let tokenContract: Token;
  let tokenContract2: Token;

  let adminWallet: SignerWithAddress,
    samWallet: SignerWithAddress,
    bobWallet: SignerWithAddress;

  before(() => {
    [adminWallet, samWallet, bobWallet] = signers;
  });

  beforeEach(async () => {
    sdk.updateSignerOrProvider(adminWallet);
    const address = await sdk.deployer.deployMultiwrap({
      name: `Testing multiwrap from SDK`,
      symbol: `TEST`,
      description: "Test contract from tests",
      image:
        "https://pbs.twimg.com/profile_images/1433508973215367176/XBCfBn3g_400x400.jpg",
    });
    multiwrapContract = sdk.getMultiwrap(address);

    nftContract = sdk.getNFTCollection(
      await sdk.deployer.deployBuiltInContract(NFTCollection.contractType, {
        name: "TEST NFT",
        seller_fee_basis_points: 200,
        fee_recipient: adminWallet.address,
        primary_sale_recipient: adminWallet.address,
      }),
    );
    await nftContract.mintBatch([
      {
        name: "Test 0",
      },
      {
        name: "Test 1",
      },
      {
        name: "Test 2",
      },
      {
        name: "Test 3",
      },
    ]);
    editionContract = sdk.getEdition(
      await sdk.deployer.deployBuiltInContract(Edition.contractType, {
        name: "TEST BUNDLE",
        seller_fee_basis_points: 100,
        primary_sale_recipient: adminWallet.address,
      }),
    );
    await editionContract.mintBatch([
      {
        metadata: {
          name: "Test 0",
        },
        supply: 100,
      },
      {
        metadata: {
          name: "Test 1",
        },
        supply: 100,
      },
    ]);

    tokenContract = sdk.getToken(
      await sdk.deployer.deployBuiltInContract(Token.contractType, {
        name: "Test",
        symbol: "TEST",
        primary_sale_recipient: adminWallet.address,
      }),
    );
    await tokenContract.mintBatchTo([
      {
        toAddress: bobWallet.address,
        amount: 1000,
      },
      {
        toAddress: samWallet.address,
        amount: 1000,
      },
      {
        toAddress: adminWallet.address,
        amount: 1000,
      },
    ]);
    tokenContract2 = sdk.getToken(
      await sdk.deployer.deployBuiltInContract(Token.contractType, {
        name: "Test2",
        symbol: "TEST2",
        primary_sale_recipient: adminWallet.address,
      }),
    );
    await tokenContract2.mintBatchTo([
      {
        toAddress: bobWallet.address,
        amount: 1000,
      },
      {
        toAddress: samWallet.address,
        amount: 1000,
      },
      {
        toAddress: adminWallet.address,
        amount: 1000,
      },
    ]);
  });

  it("should wrap erc20s", async () => {
    await multiwrapContract.wrap(
      {
        erc20tokens: [
          {
            contractAddress: tokenContract.getAddress(),
            tokenAmount: 100.5,
          },
          {
            contractAddress: tokenContract2.getAddress(),
            tokenAmount: "200.1",
          },
        ],
      },
      {
        name: "Wrapped token",
      },
    );
    const balance = await tokenContract.balanceOf(adminWallet.address);
    const balance2 = await tokenContract.balanceOf(adminWallet.address);
    expect(balance.displayValue).to.equal("899.5");
    expect(balance2.displayValue).to.equal("799.9");
  });

  it("should wrap erc721s", async () => {
    await multiwrapContract.wrap(
      {
        erc721tokens: [
          {
            contractAddress: nftContract.getAddress(),
            tokenId: "0",
          },
          {
            contractAddress: nftContract.getAddress(),
            tokenId: "2",
          },
        ],
      },
      {
        name: "Wrapped token",
      },
    );
    const balance = await nftContract.balanceOf(adminWallet.address);
    expect(balance.toNumber()).to.eq(2);
  });

  it("should wrap erc1155s", async () => {
    await multiwrapContract.wrap(
      {
        erc1155tokens: [
          {
            contractAddress: editionContract.getAddress(),
            tokenId: "0",
            tokenAmount: 10,
          },
          {
            contractAddress: editionContract.getAddress(),
            tokenId: 1,
            tokenAmount: 20,
          },
        ],
      },
      {
        name: "Wrapped token",
      },
    );
    const balance0 = await editionContract.balanceOf(adminWallet.address, 0);
    const balance1 = await editionContract.balanceOf(adminWallet.address, 1);
    expect(balance0.toNumber()).to.eq(90);
    expect(balance1.toNumber()).to.eq(80);
  });

  it("should wrap mixed tokens", async () => {
    await multiwrapContract.wrap(
      {
        erc20tokens: [
          {
            contractAddress: tokenContract.getAddress(),
            tokenAmount: 100.5,
          },
        ],
        erc721tokens: [
          {
            contractAddress: nftContract.getAddress(),
            tokenId: "0",
          },
        ],
        erc1155tokens: [
          {
            contractAddress: editionContract.getAddress(),
            tokenId: "0",
            tokenAmount: 10,
          },
        ],
      },
      {
        name: "Wrapped token",
      },
    );
    const balanceT = await tokenContract.balanceOf(adminWallet.address);
    expect(balanceT.displayValue).to.equal("899.5");
    const balanceN = await nftContract.balanceOf(adminWallet.address);
    expect(balanceN.toNumber()).to.eq(2);
    const balanceE = await editionContract.balanceOf(adminWallet.address, 0);
    expect(balanceE.toNumber()).to.eq(90);
  });
});
