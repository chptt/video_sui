/**
 * GET /api/videos/[videoId]/play
 * Returns decrypted embed URL only if user has valid access
 * SECURITY: Decryption happens server-side only
 *
 * Looks up access by EMAIL (primary) and ADDRESS (fallback).
 * This handles the case where Slush wallet address differs from zkLogin address.
 * Retries up to 6x with 3s delay for Pinata IPFS indexing lag.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { findLatestFileByMetadataName, getJsonFromCid, getVideoMetadata } from "@/lib/pinata";
import { decryptText } from "@/lib/encryption";
import { toEmbedUrl, extractYouTubeId } from "@/lib/youtube";
import type { AccessRecord } from "@/lib/pinata";

async function findAccessRecord(
  viewerEmail: string,
  viewerAddress: string,
  videoId: string
): Promise<AccessRecord | null> {
  console.log("[play/findAccessRecord] Checking:", { viewerEmail, viewerAddress, videoId });
  // Try by email first (works regardless of which wallet was used)
  const emailKey = `access-email-${viewerEmail.replace(/[@.]/g, "_")}-${videoId}`;
  const addrKey = `access-${viewerAddress}-${videoId}`;

  console.log("[play/findAccessRecord] Generated keys:", { emailKey, addrKey });

  const latest =
    (await findLatestFileByMetadataName(emailKey)) ??
    (await findLatestFileByMetadataName(addrKey));

  if (!latest) {
    console.log("[play/findAccessRecord] No latest file found");
    return null;
  }

  try {
    const record = await getJsonFromCid<AccessRecord>(latest.cid);
    console.log("[play/findAccessRecord] Got record:", record);
    // Validate the record belongs to this video
    if (record.videoId !== videoId) {
      console.log("[play/findAccessRecord] videoId mismatch!");
      return null;
    }
    const expiry = new Date(record.accessExpiresAt);
    const now = new Date();
    console.log("[play/findAccessRecord] Expiry check:", { expiry: expiry.toISOString(), now: now.toISOString() });
    if (expiry > now) {
      console.log("[play/findAccessRecord] Access is active!");
      return record;
    }
    console.log("[play/findAccessRecord] Access expired");
    return null; // expired
  } catch (e) {
    console.error("[play/findAccessRecord] Error fetching/parsing record:", e);
    return null;
  }
}

async function findAccessWithRetry(
  viewerEmail: string,
  viewerAddress: string,
  videoId: string
): Promise<AccessRecord | null> {
  const maxAttempts = 6;
  const delayMs = 3000;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(`[play] Attempt ${attempt}/${maxAttempts} email=${viewerEmail} addr=${viewerAddress} video=${videoId}`);

    const access = await findAccessRecord(viewerEmail, viewerAddress, videoId);
    if (access) {
      console.log(`[play] Access found on attempt ${attempt}`);
      return access;
    }

    if (attempt < maxAttempts) {
      console.log(`[play] Not found, waiting ${delayMs}ms...`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }

  console.log(`[play] Access not found after ${maxAttempts} attempts`);
  return null;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  return withAuth(req, async (user) => {
    try {
      const { videoId } = await params;
      console.log("[play] Starting play request for:", { videoId, userEmail: user.email, userAddress: user.suiAddress });
      if (!videoId) return NextResponse.json({ error: "Video ID required" }, { status: 400 });

      const access = await findAccessWithRetry(user.email, user.suiAddress, videoId);

      if (!access) {
        console.log("[play] No access found—returning 403");
        return NextResponse.json(
          {
            error: "Access denied",
            message: "No active access found. If you just purchased, click Try Again in a few seconds.",
          },
          { status: 403 }
        );
      }

      console.log("[play] Access confirmed! Fetching video metadata...");
      const result = await getVideoMetadata(videoId);
      if (!result) return NextResponse.json({ error: "Video not found" }, { status: 404 });

      const { metadata } = result;

      let rawUrl: string;
      try {
        rawUrl = decryptText(metadata.encryptedUrl, metadata.iv, metadata.authTag);
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
        expiresAt: access.accessExpiresAt,
        title: metadata.title,
      });
    } catch (err) {
      console.error("[play] FATAL Error:", err);
      return NextResponse.json({ error: "Failed to load video" }, { status: 500 });
    }
  });
}
