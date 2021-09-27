import { Contract } from "@ethersproject/contracts";
import { NFT, NFTCollection } from "../../contract-interfaces";
import { JSONValue, ProviderOrSigner } from "../core/types";
import { NotFoundError } from "./error";
import { replaceIpfsWithGateway } from "./ipfs";

// support erc721 and erc1155
const tokenUriABI = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId",
        type: "uint256",
      },
    ],
    name: "tokenURI",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export interface NFTMetadata {
  id: string;
  uri: string;
  name?: string;
  description?: string;
  image?: string;
  attributes?: Record<string, JSONValue>;
}

/**
/* @internal
 */
export async function getMetadataWithoutContract(
  provider: ProviderOrSigner,
  contractAddress: string,
  tokenId: string,
  ipfsGatewayUrl: string,
): Promise<NFTMetadata> {
  const contract = new Contract(
    contractAddress,
    tokenUriABI,
    provider,
  ) as NFTCollection;
  // contract.uri(tokenId);
  const uri = await getMetadataUri(contract, tokenId);
  if (!uri) {
    throw new NotFoundError();
  }
  const gatewayUrl = replaceIpfsWithGateway(uri, ipfsGatewayUrl);
  const meta = await fetch(gatewayUrl);
  const metadata = await meta.json();
  const entity: NFTMetadata = {
    ...metadata,
    id: tokenId,
    uri,
    image: replaceIpfsWithGateway(metadata.image, ipfsGatewayUrl),
  };
  return entity;
}

/**
/* @internal
 */
export async function getMetadata(
  contract: NFT | NFTCollection,
  tokenId: string,
  ipfsGatewayUrl: string,
): Promise<NFTMetadata> {
  // contract.uri(tokenId);
  const uri = await getMetadataUri(contract, tokenId);
  if (!uri) {
    throw new NotFoundError();
  }
  const gatewayUrl = replaceIpfsWithGateway(uri, ipfsGatewayUrl);
  const meta = await fetch(gatewayUrl);
  const metadata = await meta.json();
  const entity: NFTMetadata = {
    ...metadata,
    id: tokenId,
    uri,
    image: replaceIpfsWithGateway(metadata.image, ipfsGatewayUrl),
  };
  return entity;
}

/**
/* @internal
 */
export async function getMetadataUri(
  contract: NFT | NFTCollection,
  tokenId: string,
): Promise<string> {
  let uri = "";
  try {
    uri = await contract.tokenURI(tokenId);
    // eslint-disable-next-line no-empty
  } catch (e) {}

  if (!uri) {
    try {
      uri = await (contract as NFTCollection).uri(tokenId);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }

  return uri;
}
