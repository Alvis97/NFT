import "dotenv/config";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromEnvironment, getKeypairFromFile } from "@solana-developers/helpers";
import { promises as fs } from "fs";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { createGenericFile } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";