/**
 * GET /api/videos/[videoId]/access
 * Check if the current user has active access to a video.
 * Checks on-chain first, then falls back to Pinata access records.
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { getCampaignByVideoId, checkAccess as checkOnChainAccess } from "@/lib/sui-server";
import { checkAccess as checkPinataAccess } from "@/lib/accessStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  return withAuth(req, async (user) => {
    try {
      const { videoId } = await params;
      if (!videoId) return NextResponse.json({ error: "Video ID required" }, { status: 400 });

      console.log(`[access] Checking access for videoId=${videoId}, addr=${user.suiAddress}, email=${user.email}`);

      const campaign = await getCampaignByVideoId(videoId);
      if (!campaign) {
        // Fall back to Pinata-only access check (no on-chain campaign found)
        const pinataAccess = await checkPinataAccess(user.suiAddress, videoId, user.email);
        const isExpired = pinataAccess.expiresAt ? new Date(pinataAccess.expiresAt).getTime() <= Date.now() : false;
        return NextResponse.json({
          hasAccess: pinataAccess.hasAccess,
          expiresAt: pinataAccess.expiresAt,
          isExpired,
        });
      }

      // Check on-chain first
      const onChainAccess = await checkOnChainAccess(campaign.campaignId, user.suiAddress);
      console.log(`[access] On-chain result:`, onChainAccess);

      if (onChainAccess.hasAccess) {
        const isExpired = onChainAccess.expiresAt ? new Date(onChainAccess.expiresAt).getTime() <= Date.now() : false;
        return NextResponse.json({
          hasAccess: true,
          expiresAt: onChainAccess.expiresAt,
          isExpired,
        });
      }

      // Fall back to Pinata access records (covers payments recorded off-chain)
      console.log(`[access] No on-chain access, checking Pinata fallback...`);
      const pinataAccess = await checkPinataAccess(user.suiAddress, videoId, user.email);
      console.log(`[access] Pinata fallback result:`, pinataAccess);

      const isExpired = pinataAccess.expiresAt ? new Date(pinataAccess.expiresAt).getTime() <= Date.now() : false;

      return NextResponse.json({
        hasAccess: pinataAccess.hasAccess,
        expiresAt: pinataAccess.expiresAt,
        isExpired,
      });
    } catch (err) {
      console.error("Check access error:", err);
      return NextResponse.json({ error: "Failed to check access" }, { status: 500 });
    }
  });
}
