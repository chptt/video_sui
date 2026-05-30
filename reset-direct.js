const fs = require('fs');
const path = require('path');

// Read .env.local manually
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const PINATA_JWT = envVars.PINATA_JWT;
const PINATA_API_URL = "https://api.pinata.cloud";
const REGISTRY_NAME = "private-tube-registry-latest";

async function resetRegistry() {
  console.log("🔄 Resetting all video data...");
  
  const emptyRegistry = {
    videos: [],
    updatedAt: new Date().toISOString()
  };

  const body = {
    pinataContent: emptyRegistry,
    pinataMetadata: { name: REGISTRY_NAME },
    pinataOptions: { cidVersion: 1 }
  };

  const res = await fetch(`${PINATA_API_URL}/pinning/pinJSONToIPFS`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("❌ Reset failed:", err);
    return;
  }

  const result = await res.json();
  console.log("\n✅✅✅ ALL DATA RESET SUCCESSFULLY! ✅✅✅");
  console.log("New empty registry CID:", result.IpfsHash);
  console.log("\nYour site now has completely fresh data!");
}

resetRegistry();
