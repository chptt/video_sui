/**
 * POST /api/admin/reset
 * Resets ALL data: empty registry, removes all videos!
 * ADMIN ONLY - checks ADMIN_EMAIL env var
 */

import { NextRequest, NextResponse } from "next/server";
import { uploadJsonToPinata } from "@/lib/pinata";
import { getSessionFromRequest } from "@/lib/session";

const REGISTRY_NAME = "private-tube-registry-latest";

export async function POST(req: NextRequest) {
  try {
    // Get admin email from env
    const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    if (!adminEmail) {
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 });
    }

    // Get session user
    const user = await getSessionFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (user.email.toLowerCase() !== adminEmail) {
      return NextResponse.json({ error: "Unauthorized - admin only" }, { status: 403 });
    }

    // Create empty registry
    const emptyRegistry = {
      videos: [],
      updatedAt: new Date().toISOString()
    };

    // Upload new empty registry
    const cid = await uploadJsonToPinata(emptyRegistry, REGISTRY_NAME);

    return NextResponse.json({
      success: true,
      message: "All data reset successfully!",
      newRegistryCid: cid
    });
  } catch (err) {
    console.error("Reset error:", err);
    return NextResponse.json(
      { error: "Failed to reset data" },
      { status: 500 }
    );
  }
}
