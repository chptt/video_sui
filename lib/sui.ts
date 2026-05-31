import { SuiJsonRpcClient, getJsonRpcFullnodeUrl } from "@mysten/sui/jsonRpc";
import { Transaction } from "@mysten/sui/transactions";

const NETWORK_ENV = process.env.NEXT_PUBLIC_SUI_NETWORK || "testnet";
const RPC_URL = process.env.NEXT_PUBLIC_SUI_RPC_URL || getJsonRpcFullnodeUrl(NETWORK_ENV as any);
const PACKAGE_ID = process.env.NEXT_PUBLIC_PACKAGE_ID || "";
const REGISTRY_ID = process.env.NEXT_PUBLIC_REGISTRY_ID || "";
const PLATFORM_CONFIG_ID = process.env.NEXT_PUBLIC_PLATFORM_CONFIG_ID || "";

export const suiClient = new SuiJsonRpcClient({ url: RPC_URL, network: NETWORK_ENV as any });

export interface SafeVideoMetadata {
  videoId: string;
  campaignId: string;
  title: string;
  description: string;
  creatorAddress: string;
  priceMist: string;
  priceSui: string;
  durationHours: number;
  isDisabled: boolean;
  disabledReason: string | null;
  totalPurchases: number;
  totalGrossMist: string;
  thumbnailVideoId: string;
}

export async function getCampaigns(): Promise<SafeVideoMetadata[]> {
  if (!REGISTRY_ID || !PACKAGE_ID) {
    console.warn("Missing REGISTRY_ID or PACKAGE_ID environment variables");
    return [];
  }

  try {
    const registryObj = await suiClient.getObject({
      id: REGISTRY_ID,
      options: { showContent: true },
    });

    console.log("Registry object:", JSON.stringify(registryObj, null, 2));

    if (registryObj.data?.content?.dataType !== "moveObject") {
      console.warn("Registry is not a move object");
      return [];
    }

    const content = (registryObj.data.content as any);
    console.log("Registry content:", JSON.stringify(content, null, 2));

    let campaignIds: string[] = [];

    if (content.campaigns) {
      if (content.campaigns.fields?.contents) {
        const contents = content.campaigns.fields.contents as any[];
        campaignIds = contents
          .map((c) => c?.fields?.value || c?.value)
          .filter((id): id is string => id != null);
      } else if (content.campaigns.contents) {
        const contents = content.campaigns.contents as any[];
        campaignIds = contents
          .map((c) => c?.fields?.value || c?.value)
          .filter((id): id is string => id != null);
      }
    }

    if (campaignIds.length === 0) {
      console.warn("No campaign IDs found in registry");
      return [];
    }

    console.log("Campaign IDs:", campaignIds);

    const campaignObjects = await suiClient.multiGetObjects({
      ids: campaignIds,
      options: { showContent: true },
    });

    return campaignObjects
      .filter((obj) => {
        if (obj.data?.content?.dataType !== "moveObject") {
          console.warn("Skipping non-move object:", obj);
          return false;
        }
        const content = obj.data.content as any;
        if (!content?.fields) {
          console.warn("Skipping object with no fields:", obj);
          return false;
        }
        return true;
      })
      .map((obj) => {
        const content = obj.data!.content as any;
        const fields = content.fields;
        console.log("Campaign object fields:", JSON.stringify(fields, null, 2));
        return {
          videoId: fields.video_id ? Buffer.from(fields.video_id).toString() : "",
          campaignId: obj.data!.objectId,
          title: fields.title ? Buffer.from(fields.title).toString() : "",
          description: fields.description ? Buffer.from(fields.description).toString() : "",
          creatorAddress: fields.creator || "",
          priceMist: fields.price_mist?.toString() || "0",
          priceSui: fields.price_mist ? (Number(fields.price_mist) / 1e9).toFixed(4) : "0",
          durationHours: Number(fields.duration_hours) || 0,
          isDisabled: fields.is_disabled || false,
          disabledReason: fields.disabled_reason ? Buffer.from(fields.disabled_reason).toString() || null : null,
          totalPurchases: Number(fields.total_purchases) || 0,
          totalGrossMist: fields.total_gross_mist?.toString() || "0",
          thumbnailVideoId: fields.thumbnail_video_id ? Buffer.from(fields.thumbnail_video_id).toString() : "",
        };
      });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return [];
  }
}

export async function getCampaign(campaignId: string): Promise<SafeVideoMetadata | null> {
  try {
    const obj = await suiClient.getObject({
      id: campaignId,
      options: { showContent: true },
    });

    if (obj.data?.content?.dataType !== "moveObject") {
      return null;
    }

    const content = obj.data.content as any;
    const fields = content.fields;
    if (!fields) {
      return null;
    }
    return {
      videoId: fields.video_id ? Buffer.from(fields.video_id).toString() : "",
      campaignId: obj.data.objectId,
      title: fields.title ? Buffer.from(fields.title).toString() : "",
      description: fields.description ? Buffer.from(fields.description).toString() : "",
      creatorAddress: fields.creator || "",
      priceMist: fields.price_mist?.toString() || "0",
      priceSui: fields.price_mist ? (Number(fields.price_mist) / 1e9).toFixed(4) : "0",
      durationHours: Number(fields.duration_hours) || 0,
      isDisabled: fields.is_disabled || false,
      disabledReason: fields.disabled_reason ? Buffer.from(fields.disabled_reason).toString() || null : null,
      totalPurchases: Number(fields.total_purchases) || 0,
      totalGrossMist: fields.total_gross_mist?.toString() || "0",
      thumbnailVideoId: fields.thumbnail_video_id ? Buffer.from(fields.thumbnail_video_id).toString() : "",
    };
  } catch (error) {
    console.error("Error fetching campaign:", error);
    return null;
  }
}

export async function getCampaignEncryptedData(campaignId: string) {
  try {
    const obj = await suiClient.getObject({
      id: campaignId,
      options: { showContent: true },
    });

    if (obj.data?.content?.dataType !== "moveObject") {
      return null;
    }

    const content = obj.data.content as any;
    const fields = content.fields;
    if (!fields) {
      return null;
    }
    return {
      encryptedUrl: fields.encrypted_url ? Buffer.from(fields.encrypted_url).toString() : "",
      iv: fields.iv ? Buffer.from(fields.iv).toString() : "",
      authTag: fields.auth_tag ? Buffer.from(fields.auth_tag).toString() : "",
    };
  } catch (error) {
    console.error("Error fetching encrypted data:", error);
    return null;
  }
}

export function createCreateCampaignTransaction({
  videoId,
  priceMist,
  durationHours,
  title,
  description,
  thumbnailVideoId,
  encryptedUrl,
  iv,
  authTag,
}: {
  videoId: string;
  priceMist: bigint;
  durationHours: bigint;
  title: string;
  description: string;
  thumbnailVideoId: string;
  encryptedUrl: string;
  iv: string;
  authTag: string;
}) {
  const tx = new Transaction();
  tx.moveCall({
    target: `${PACKAGE_ID}::private_tube::create_campaign`,
    arguments: [
      tx.object(REGISTRY_ID),
      tx.pure.string(videoId),
      tx.pure.u64(priceMist),
      tx.pure.u64(durationHours),
      tx.pure.string(title),
      tx.pure.string(description),
      tx.pure.string(thumbnailVideoId),
      tx.pure.string(encryptedUrl),
      tx.pure.string(iv),
      tx.pure.string(authTag),
    ],
  });
  return tx;
}

export function createPurchaseAccessTransaction({
  campaignId,
  priceMist,
}: {
  campaignId: string;
  priceMist: bigint;
}) {
  const tx = new Transaction();
  const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(priceMist)]);
  tx.moveCall({
    target: `${PACKAGE_ID}::private_tube::purchase_access`,
    arguments: [
      tx.object(PLATFORM_CONFIG_ID),
      tx.object(campaignId),
      coin,
    ],
  });
  return tx;
}
