import "dotenv/config";
import { findMetadataPda, mplTokenMetadata, verifyCollectionV1 } from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { clusterApiUrl } from "@solana/web3.js";

const umi = createUmi(clusterApiUrl("devnet"));
umi.use(mplTokenMetadata());

const localKeypair = getKeypairFromEnvironment("SECRET_KEY");
umi.use(keypairIdentity(umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey)));

const collectionMintAddress = "38NFoqobq7UbFuKwuhDQwGHTG7G1DiNzkFhd3hKzbEgg";
const collectionMint = publicKey(collectionMintAddress);

const metadata = findMetadataPda(umi, { mint: collectionMint });

await verifyCollectionV1(umi, {
    metadata,
    collectionMint,
    authority: umi.identity, // The authority that owns the collection NFT
}).sendAndConfirm(umi);

console.log("✅ Collection has been verified!");

