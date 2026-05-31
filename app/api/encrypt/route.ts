import { NextResponse } from "next/server";
import { encryptText } from "@/lib/encryption";

export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const encrypted = encryptText(text);
    return NextResponse.json({ encrypted });
  } catch (err: unknown) {
    console.error("Encryption error:", err);
    return NextResponse.json({ error: "Failed to encrypt text" }, { status: 500 });
  }
}
