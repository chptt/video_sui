"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CreateVideoForm } from "@/components/CreateVideoForm";
import { LoadingPage } from "@/components/LoadingSpinner";

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(data => {
      if (!data.user) router.replace("/login");
      else { setAuthed(true); setLoading(false); }
    }).catch(() => router.replace("/login"));
  }, [router]);

  if (loading) return <LoadingPage message="Checking authentication..." />;
  if (!authed) return null;

  return (
    <div className="page" style={{ position: "relative" }}>
      {/* Glow */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: "500px", height: "300px", background: "radial-gradient(ellipse, rgba(120,40,200,0.12) 0%, transparent 65%)", borderRadius: "50%" }} />
      </div>

      <div style={{ position: "relative", maxWidth: "640px", margin: "0 auto" }} className="stack-xl">
        {/* Header */}
        <div style={{ textAlign: "center" }} className="stack-sm">
          <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, color: "#f8fafc" }}>
            Create Encrypted Video
          </h1>
          <p style={{ color: "#64748b" }}>
            Your YouTube URL will be AES-256-GCM encrypted and stored on Pinata IPFS
          </p>
        </div>

        {/* Tech badges */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.625rem" }}>
          {["🔐 AES-256-GCM", "🌐 Pinata IPFS", "🔒 Server-side only", "💎 Sui Testnet"].map(b => (
            <span key={b} className="badge badge-gray">{b}</span>
          ))}
        </div>

        {/* Form card */}
        <div className="card" style={{ padding: "2rem" }}>
          <CreateVideoForm />
        </div>

        {/* Info card */}
        <div className="card" style={{ padding: "1.5rem" }}>
          <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#f8fafc", marginBottom: "1rem" }}>📋 Before you create</h3>
          <div className="stack-sm">
            {[
              { icon: "⚠️", color: "#fbbf24", text: <>Set your YouTube video to <strong style={{ color: "#f8fafc" }}>Unlisted</strong> before adding it here. Private videos cannot be embedded.</> },
              { icon: "ℹ️", color: "#60a5fa", text: "The YouTube URL is encrypted immediately — it never appears in logs or API responses." },
              { icon: "✓", color: "#4ade80", text: "Revenue cap is $20 USD gross. After that, no new purchases are allowed but existing access remains valid." },
              { icon: "💎", color: "#a855f7", text: "Payments are split: 90% to you, 10% platform fee. All on Sui testnet via Slush wallet." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
                <span style={{ color: item.color, flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
                <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.6 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
