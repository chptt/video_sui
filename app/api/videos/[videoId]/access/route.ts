/**
 * GET /api/videos/[videoId]/access
 * Check if the current user has active access to a video
 */

import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/lib/auth";
import { checkAccess } from "@/lib/accessStore";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ videoId: string }> }
) {
  return withAuth(req, async (user) => {
    try {
      const { videoId } = await params;
      if (!videoId) return NextResponse.json({ error: "Video ID required" }, { status: 400 });

      console.log(`[access] Checking access for videoId=${videoId}, addr=${user.suiAddress}, email=${user.email}`);

      const access = await checkAccess(user.suiAddress, videoId, user.email);

      console.log(`[access] Check result:`, access);

      return NextResponse.json(access);
    } catch (err) {
      console.error("Check access error:", err);
      return NextResponse.json({ error: "Failed to check access" }, { status: 500 });
    }
  });
}
