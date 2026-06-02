
import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import dotenv from "dotenv";

dotenv.config();

const NETWORK = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet";
const RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL || getJsonRpcFullnodeUrl(NETWORK);
const OWNER_ADDRESS = process.argv[2];

if (!OWNER_ADDRESS) {
  console.error("Usage: node debug-get-coins.mjs <YOUR_SUI_ADDRESS>");
  process.exit(1);
}

async function debugGetCoins() {
  console.log("\n=== Getting Coins for Address ===\n");
  console.log("NETWORK:", NETWORK);
  console.log("OWNER_ADDRESS:", OWNER_ADDRESS);

  const client = new SuiJsonRpcClient({ url: RPC_URL, network: NETWORK });

  const coins = await client.getCoins({
    owner: OWNER_ADDRESS,
    coinType: "0x2::sui::SUI",
  });

  console.log("\n=== Your SUI Coins ===\n", JSON.stringify(coins, null, 2));

  console.log("\n=== Coin Summary ===");
  coins.data.forEach((coin, index) => {
    console.log(`Coin ${index + 1}:`);
    console.log(`  ID: ${coin.coinObjectId}`);
    console.log(`  Balance: ${coin.balance} Mist (${Number(coin.balance) / 1e9} SUI)`);
  });
}

debugGetCoins().catch(console.error);
