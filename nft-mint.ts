import "dotenv/config";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromEnvironment, getKeypairFromFile } from "@solana-developers/helpers";
import { promises as fs } from "fs";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { createGenericFile } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const connection = new Connection(clusterApiUrl("devnet"));

const umi = createUmi(clusterApiUrl("devnet"));
umi.use(mplTokenMetadata());
umi.use(irysUploader());

const localKeypair = getKeypairFromEnvironment("SECRET_KEY");

const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);
umi.use(keypairIdentity(umiKeypair));

// Load the existing Collection Mint address
const collectionMintAddress = "38NFoqobq7UbFuKwuhDQwGHTG7G1DiNzkFhd3hKzbEgg"; 
const collectionMint = publicKey(collectionMintAddress);


//New image for NFT
const nftImagePath = "nft.png";
const nftBuffer = await fs.readFile(nftImagePath);
let nftFile = createGenericFile(nftBuffer, nftImagePath, {
    contentType: "image/jpeg",
});
const [image] = await umi.uploader.upload([nftFile]);

//Create uri
const nftUri = await umi.uploader.uploadJson({
    name: "NFT",
    description: "This is my nft",
    image,
});

const nftMint = generateSigner(umi);

const { signature: nftSignature } = await createNft(umi, {
    mint: nftMint,
    name: "My NFT",
    uri: nftUri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(0),
    collection: { key: collectionMint, verified: false },
}).sendAndConfirm(umi);

console.log("✅ Successfully minted NFT!");
console.log("NFT Mint Address:", nftMint.publicKey.toString());
console.log(
    `View NFT on Solana Explorer: https://explorer.solana.com/address/${nftMint.publicKey}?cluster=devnet`
);



