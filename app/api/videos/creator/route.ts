/**
 * GET /api/videos/creator
 * Returns ALL videos for the authenticated creator (full metadata including revenue)
 * Reads full metadata per video — not just the registry index.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { getLatestRegistry, getVideoMetadata } from "@/lib/pinata";
import { mistToSui } from "@/lib/pricing";
import { getThumbnailUrl } from "@/lib/youtube";

export async function GET(req: NextRequest) {
  return withAuth(req, async (user) => {
    try {
      const registry = await getLatestRegistry();
      const allVideos = Array.isArray(registry.videos) ? registry.videos : [];

      // Filter to this creator's videos
      const creatorEntries = allVideos.filter(
        (v) => v.creatorAddress.toLowerCase() === user.suiAddress.toLowerCase()
      );

      // Fetch full metadata for each (for accurate revenue/purchase counts)
      const videos = await Promise.all(
        creatorEntries.map(async (entry) => {
          try {
            const result = await getVideoMetadata(entry.videoId);
            if (!result) throw new Error("not found");
            const m = result.metadata;
            return {
              videoId: m.videoId,
              cid: result.cid,
              title: m.title,
              description: m.description,
              creatorAddress: m.creatorAddress,
              creatorEmail: m.creatorEmail,
              priceMist: m.priceMist,
              priceSui: mistToSui(BigInt(m.priceMist)).toString(),
              durationMs: m.durationMs,
              durationHours: m.durationMs / (60 * 60 * 1000),
              revenueCapUsd: m.revenueCapUsd,
              totalGrossRevenueUsd: m.totalGrossRevenueUsd,
              totalCreatorRevenueUsd: m.totalCreatorRevenueUsd,
              totalPlatformRevenueUsd: m.totalPlatformRevenueUsd,
              purchaseCount: m.purchaseCount,
              isSoldOut: m.isSoldOut,
              isDisabled: m.isDisabled ?? false,
              disabledReason: m.disabledReason ?? null,
              disabledAt: m.disabledAt ?? null,
              status: m.status,
              createdAt: m.createdAt,
              thumbnailUrl: m.thumbnailVideoId
                ? getThumbnailUrl(m.thumbnailVideoId)
                : undefined,
            };
          } catch {
            // Fallback to registry data if full metadata fetch fails
            return {
              videoId: entry.videoId,
              cid: entry.cid,
              title: entry.title,
              description: "",
              creatorAddress: entry.creatorAddress,
              creatorEmail: entry.creatorEmail ?? "",
              priceMist: entry.priceMist,
              priceSui: mistToSui(BigInt(entry.priceMist)).toString(),
              durationMs: entry.durationMs,
              durationHours: entry.durationMs / (60 * 60 * 1000),
              revenueCapUsd: parseFloat(process.env.VIDEO_REVENUE_CAP_USD || "20"),
              totalGrossRevenueUsd: 0,
              totalCreatorRevenueUsd: 0,
              totalPlatformRevenueUsd: 0,
              purchaseCount: 0,
              isSoldOut: entry.isSoldOut,
              isDisabled: entry.isDisabled ?? false,
              disabledReason: null,
              disabledAt: null,
              status: entry.status,
              createdAt: entry.createdAt,
              thumbnailUrl: entry.thumbnailVideoId
                ? getThumbnailUrl(entry.thumbnailVideoId)
                : undefined,
            };
          }
        })
      );

      return NextResponse.json({ videos });
    } catch (err) {
      console.error("Creator videos error:", err);
      return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
    }
  });
}
