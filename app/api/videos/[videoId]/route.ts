/**
 * GET /api/videos/[videoId]
 * Returns safe public metadata for a specific video
 */

import { NextRequest, NextResponse } from "next/server";
import { getSafeVideoMetadata } from "@/lib/videoRegistry";
import { getLatestRegistry, getVideoMetadata } from "@/lib/pinata";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params;

    console.log("[api/videos/[videoId]] Fetching video:", videoId);

    if (!videoId) {
      console.error("[api/videos/[videoId]] No videoId provided!");
      return NextResponse.json({ error: "Video ID required" }, { status: 400 });
    }

    // Check registry first for debugging purposes
    const registry = await getLatestRegistry();
    console.log("[api/videos/[videoId]] Current registry entries:", registry.videos.map(v => ({ videoId: v.videoId, title: v.title })));

    const registryEntry = registry.videos.find(v => v.videoId === videoId);
    console.log("[api/videos/[videoId]] Found registry entry?", !!registryEntry, registryEntry);

    // Try to get the video
    const video = await getSafeVideoMetadata(videoId);
    console.log("[api/videos/[videoId]] getSafeVideoMetadata returned:", video ? "FOUND!" : "NULL");

    // Also check getVideoMetadata directly for more logging
    const directResult = await getVideoMetadata(videoId);
    console.log("[api/videos/[videoId]] getVideoMetadata returned:", directResult ? "FOUND!" : "NULL", directResult);

    if (!video) {
      console.error("[api/videos/[videoId]] Video NOT found - returning 404!");
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    return NextResponse.json({ video });
  } catch (err) {
    console.error("[api/videos/[videoId]] FATAL Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch video" },
      { status: 500 }
    );
  }
}
