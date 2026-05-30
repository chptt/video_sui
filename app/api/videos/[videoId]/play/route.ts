/**
 * GET /api/videos/[videoId]/play
 * Returns decrypted embed URL only if user has valid access
 * SECURITY: Decryption happens server-side only
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { getVideoMetadata } from "@/lib/pinata";
import { decryptText } from "@/lib/encryption";
import { toEmbedUrl, extractYouTubeId } from "@/lib/youtube";
import { checkAccess } from "@/lib/accessStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  return withAuth(req, async (user) => {
    try {
      const { videoId } = await params;
      console.log("[play] Starting play request for:", { videoId, userEmail: user.email, userAddress: user.suiAddress });
      if (!videoId) return NextResponse.json({ error: "Video ID required" }, { status: 400 });

      // Check access by email AND address (handles wallet mismatches)
      const access = await checkAccess(user.suiAddress, videoId, user.email);

      if (!access.hasAccess) {
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
        expiresAt: access.expiresAt,
        title: metadata.title,
      });
    } catch (err) {
      console.error("[play] FATAL Error:", err);
      return NextResponse.json({ error: "Failed to load video" }, { status: 500 });
    }
  });
}
