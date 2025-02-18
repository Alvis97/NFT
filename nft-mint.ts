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
const imagePath = "nft-mint.png";
const buffer = await fs.readFile(imagePath);
let file = createGenericFile(buffer, imagePath, {
    contentType: "image/jpeg",
});
const [image] = await umi.uploader.upload([file]); 

//Create uri
const uri = await umi.uploader.uploadJson({
    name: "NFT Mint",
    description: "This is my nft mint description",
    image,
  }); 

console.log("Uri: ", uri);

const mint = generateSigner(umi);

const { signature, result } = await createNft(umi, {
    mint,
    name: "My NFT Mint",
    uri,
    updateAuthority: umi.identity.publicKey,
    sellerFeeBasisPoints: percentAmount(0),
}).sendAndConfirm(umi, { send: { commitment: "finalized" } });


console.log("Successfully created the NFT mint!");
console.log("Transaction Signature: ", signature);
const explorerUrl = `https://explorer.solana.com/address/${mint.publicKey}?cluster=devnet`;
console.log("View NFT Mint on Solana Explorer:", explorerUrl);






