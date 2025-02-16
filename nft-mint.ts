import "dotenv/config";
import react from "react";
import { mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { keypairIdentity } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { getKeypairFromEnvironment, getKeypairFromFile } from "@solana-developers/helpers";
import { promises as fs } from "fs";
import { clusterApiUrl } from "@solana/web3.js";
 
const umi = createUmi(clusterApiUrl("devnet"));
 
// load keypair from local file system
// See https://github.com/solana-developers/helpers?tab=readme-ov-file#get-a-keypair-from-a-keypair-file
const localKeypair = getKeypairFromEnvironment("SECRET_KEY");
 
// convert to Umi compatible keypair
const umiKeypair = umi.eddsa.createKeypairFromSecretKey(localKeypair.secretKey);
 
// load the MPL metadata program plugin and assign a signer to our umi instance
umi.use(keypairIdentity(umiKeypair)).use(mplTokenMetadata());

//Upload random image
const imagePath = "Random-image.png";
const buffer = await fs.readFile(imagePath);
let file = createGenericFile(buffer, imagePath, {
    contentType: "image/jpeg",
});
const [image] = await umi.uploader.upload([file]); 


