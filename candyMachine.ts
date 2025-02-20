import "dotenv/config";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, publicKey, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { createCandyMachine, mplCandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { clusterApiUrl } from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

//Creating a candy machine

// Connect to Solana Devnet
const umi = createUmi(clusterApiUrl("devnet")).use(mplCandyMachine());

// Load your Phantom wallet private key from .env
const keyPair = getKeypairFromEnvironment("SECRET_KEY");

// Extract the secret key as a Uint8Array
const privateKeyUint8Array = new Uint8Array(keyPair.secretKey);

// Authenticate with your wallet
const wallet = umi.eddsa.createKeypairFromSecretKey(privateKeyUint8Array);
umi.use(keypairIdentity(wallet));

// Generate a new Candy Machine address
const candyMachineSigner = generateSigner(umi);

// Define Candy Machine settings
const transactionBuilder = await createCandyMachine(umi,  {
  candyMachine: candyMachineSigner,  
  authority: umi.identity.publicKey, // Your wallet as the authority
  collectionMint: publicKey("38NFoqobq7UbFuKwuhDQwGHTG7G1DiNzkFhd3hKzbEgg"), // Collection NFT
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100, // Number of NFTs in the collection
  sellerFeeBasisPoints: percentAmount(5), // 5% royalty fee
  creators: [
    {
      address: umi.identity.publicKey,
      percentageShare: 100, // 100% of royalties go to you
      verified: true,
    },
  ],
});


// Create the Candy Machine
const transactionSignature = await transactionBuilder.send(umi);

console.log("✅ Candy Machine Created!");
console.log("Candy Machine Address:", candyMachineSigner.publicKey.toString());
console.log("Transaction Signature:", transactionSignature);


//Need to add metadata
// Install Metaplex Bundlr
//npm install -g @metaplex-foundation/cli
//Step 2: Fund Your Bundlr Wallet
//metaplex bundlr deposit 0.1sol --keypair ~/.config/solana/id.json
//Step 3: Upload Metadata & Assets
//metaplex upload ./assets --keypair ~/.config/solana/id.json

//Having problems with installing metadata, so i have just studied the code for now and understand everything because it takes too long for now.


//How to add the NFTs metadata to the candyMachine
// await insertItems(umi, {
//     candyMachine: candyMachineSigner.publicKey, // Use the same Candy Machine from earlier
//     items: [
//       { name: "NFT #1", uri: "https://arweave.net/example1" },
//       { name: "NFT #2", uri: "https://arweave.net/example2" },
//       { name: "NFT #3", uri: "https://arweave.net/example3" },
//     ],
//   });


//Minting an NFT from candy machine (Getting ownership/Bying it)
// const mintTransaction = await mintV2(umi, {
//     candyMachine: candyMachineSigner.publicKey, // Use the same Candy Machine
//     collectionMint: publicKey("38NFoqobq7UbFuKwuhDQwGHTG7G1DiNzkFhd3hKzbEgg"),
//   });
  
//   console.log("✅ NFT Minted!");
//   console.log("Transaction Signature:", mintTransaction);


