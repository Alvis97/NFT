import "dotenv/config";
import { createNft, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromEnvironment, getKeypairFromFile } from "@solana-developers/helpers";
import { promises as fs } from "fs";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { createGenericFile } from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";


const connection = new Connection(clusterApiUrl("devnet")); 
 
const umi = createUmi(clusterApiUrl("devnet"));
 
// load keypair from local file system
// See https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file
const localKeypair = getKeypairFromEnvironment("SECRET_KEY");
 
// convert to Umi compatible keypair
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);
 
// load the MPL metadata program plugin and assign a signer to our umi instance
umi.use(keypairIdentity(umiKeypair)).use(mplTokenMetadata()).use(irysUploader());

//Upload random image
const collectionImagePath = "collection.png";
const collectionBuffer = await fs.readFile(collectionImagePath);
let collectionFile = createGenericFile(collectionBuffer, collectionImagePath, {
    contentType: "image/jpeg",
});
const [image] = await umi.uploader.upload([collectionFile]); 

//Create uri
const collectionUri = await umi.uploader.uploadJson({
    name: "NFT Collection",
    description: "This is my NFT Collection",
    image,
  }); 

console.log("Collection Metadata URI: ", collectionUri);

const collectionMint = generateSigner(umi);

const { signature, result } = await createNft(umi, {
    mint: collectionMint,
    name: "My NFT Collection",
    uri: collectionUri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(0),
    isCollection: true,
    collection: {
        verified: false,
        key: collectionMint.publicKey,
    },
}).sendAndConfirm(umi, { send: { commitment: "finalized" } });


console.log("Successfully created the NFT collection!");
console.log("Transaction Signature: ", signature);
const explorerUrl = `https://explorer.solana.com/address/${collectionMint.publicKey}?cluster=devnet`;
console.log("View NFT collection on Solana Explorer:", explorerUrl);


