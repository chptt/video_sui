/**
 * GET /api/auth/zklogin/start
 * Initiates Google OAuth flow with EXACTLY matching redirect URI
 */

import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";

export async function GET(req: NextRequest) {
  try {
    console.log("[zkLogin Start] Starting OAuth flow...");
    
    const clientId = process.env.GOOGLE_CLIENT_ID;
    let redirectUri = process.env.GOOGLE_REDIRECT_URI;
    
    // Fallback to auto-detect
    if (!redirectUri) {
      const url = new URL(req.url);
      redirectUri = `${url.origin}/api/auth/zklogin/callback`;
    }
    
    if (!clientId || !redirectUri) {
      throw new Error("Google OAuth credentials missing");
    }
    
    console.log("[zkLogin Start] Client ID:", clientId);
    console.log("[zkLogin Start] Redirect URI:", redirectUri);
    
    // Generate nonce
    const nonce = randomBytes(16).toString("hex");
    
    // Create OAuth params
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      nonce: nonce,
      access_type: "offline",
      prompt: "select_account",
    });
    
    const oauthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    
    console.log("[zkLogin Start] OAuth URL:", oauthUrl);
    
    const response = NextResponse.redirect(oauthUrl);
    
    response.cookies.set("zklogin_nonce", nonce, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    });
    
    return response;
  } catch (err) {
    console.error("[zkLogin Start] Error:", err);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/login?error=oauth_config_error`);
  }
}
