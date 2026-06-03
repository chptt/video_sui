/**
 * GET /api/videos/[videoId]/play
 * Returns decrypted embed URL only if user has valid access.
 * Checks on-chain first, then falls back to Pinata access records.
 * SECURITY: Decryption happens server-side only
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { getCampaignByVideoId, getCampaignEncryptedData, checkAccess } from "@/lib/sui-server";
import { checkAccess as checkPinataAccess } from "@/lib/accessStore";
import { getVideoMetadata } from "@/lib/pinata";
import { decryptText } from "@/lib/encryption";
import { toEmbedUrl, extractYouTubeId } from "@/lib/youtube";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  return withAuth(req, async (user) => {
    try {
      const { videoId } = await params;
      console.log("[play] Starting play request for:", { videoId, userEmail: user.email, userAddress: user.suiAddress });
      if (!videoId) return NextResponse.json({ error: "Video ID required" }, { status: 400 });

      // Try on-chain campaign first
      const campaign = await getCampaignByVideoId(videoId);

      let hasAccess = false;
      let expiresAt: string | null = null;

      if (campaign) {
        // Check if campaign is disabled
        if (campaign.isDisabled) {
          return NextResponse.json({ error: "This video has been disabled" }, { status: 403 });
        }

        // Check on-chain access
        const onChainAccess = await checkAccess(campaign.campaignId, user.suiAddress);
        console.log("[play] On-chain access:", onChainAccess);

        if (onChainAccess.hasAccess) {
          hasAccess = true;
          expiresAt = onChainAccess.expiresAt;
        }
      }

      // Fall back to Pinata access records if on-chain check failed
      if (!hasAccess) {
        console.log("[play] No on-chain access, checking Pinata fallback...");
        const pinataAccess = await checkPinataAccess(user.suiAddress, videoId, user.email);
        console.log("[play] Pinata access:", pinataAccess);
        if (pinataAccess.hasAccess) {
          hasAccess = true;
          expiresAt = pinataAccess.expiresAt;
        }
      }

      if (!hasAccess) {
        return NextResponse.json(
          {
            error: "Access denied",
            message: "No active access found. If you just purchased, click Try Again in a few seconds.",
          },
          { status: 403 }
        );
      }

      console.log("[play] Access confirmed! Fetching encrypted data...");

      // Get encrypted video data — try on-chain first, fall back to Pinata
      let encryptedUrl: string | undefined;
      let iv: string | undefined;
      let authTag: string | undefined;
      let title: string | undefined;

      if (campaign) {
        const encryptedData = await getCampaignEncryptedData(campaign.campaignId);
        if (encryptedData) {
          encryptedUrl = encryptedData.encryptedUrl;
          iv = encryptedData.iv;
          authTag = encryptedData.authTag;
          title = campaign.title;
        }
      }

      // Fall back to Pinata metadata if on-chain data not available
      if (!encryptedUrl) {
        console.log("[play] No on-chain encrypted data, checking Pinata...");
        const pinataResult = await getVideoMetadata(videoId);
        if (!pinataResult) {
          return NextResponse.json({ error: "Video not found" }, { status: 404 });
        }
        const { metadata } = pinataResult;
        encryptedUrl = metadata.encryptedUrl;
        iv = metadata.iv;
        authTag = metadata.authTag;
        title = metadata.title;
      }

      if (!encryptedUrl || !iv || !authTag) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 });
      }

      let rawUrl: string;
      try {
        rawUrl = decryptText(encryptedUrl, iv, authTag);
      } catch (decryptErr) {
        console.error("[play] Decryption failed:", decryptErr);
        return NextResponse.json({ error: "Failed to decrypt video data" }, { status: 500 });
      }

      const ytVideoId = extractYouTubeId(rawUrl);
      if (!ytVideoId) {
        console.error("[play] extractYouTubeId failed for decrypted URL:", rawUrl?.slice(0, 60));
        return NextResponse.json({ error: "Invalid video data" }, { status: 500 });
      }

      console.log("[play] Success! Returning embed URL");
      return NextResponse.json({
        embedUrl: toEmbedUrl(ytVideoId),
        expiresAt,
        title,
      });
    } catch (err) {
      console.error("[play] FATAL Error:", err);
      return NextResponse.json({ error: "Failed to load video" }, { status: 500 });
    }
  });
}
