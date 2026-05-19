"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { SecureVideoPlayer } from "@/components/SecureVideoPlayer";
import { LoadingPage } from "@/components/LoadingSpinner";
import Link from "next/link";

interface VideoInfo {
  videoId: string; title: string; description: string;
  creatorAddress: string; priceMist: string; durationMs: number;
  isSoldOut: boolean; status: string; createdAt: string;
}

export default function WatchPage() {
  const router = useRouter();
  const params = useParams();
  const videoId = params.videoId as string;
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [video, setVideo] = useState<VideoInfo | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      if (!sessionData.user) { router.replace(`/login?redirect=/watch/${videoId}`); return; }
      setAuthed(true);
      try {
        const res = await fetch(`/api/videos/${videoId}`);
        const data = await res.json();
        if (!res.ok || !data.video) setVideoError("Video not found");
        else setVideo(data.video);
      } catch { setVideoError("Failed to load video information"); }
      setLoading(false);
    };
    init();
  }, [videoId, router]);

  if (loading) return <LoadingPage message="Loading video..." />;
  if (!authed) return null;

  if (videoError) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <div className="empty-state">
        <div className="empty-icon">❌</div>
        <h2 className="empty-title">{videoError}</h2>
        <Link href="/marketplace" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>Back to Marketplace</Link>
      </div>
    </div>
  );

  const fmtAddr = (a: string) => `${a.slice(0, 6)}...${a.slice(-4)}`;
  const fmtDuration = (ms: number) => { const h = ms / 3600000; return h < 24 ? `${h} hours` : `${Math.floor(h / 24)} days`; };

  return (
    <div className="page">
      <div className="container-lg">
        {/* Breadcrumb */}
        <div className="breadcrumb" style={{ marginBottom: "1.5rem" }}>
          <Link href="/marketplace" className="breadcrumb">Marketplace</Link>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-current truncate" style={{ maxWidth: "280px" }}>{video?.title || videoId}</span>
        </div>

        {/* Title */}
        {video && (
          <div style={{ marginBottom: "1.5rem" }} className="stack-xs">
            <h1 style={{ fontSize: "clamp(1.375rem, 3vw, 1.875rem)", fontWeight: 800, color: "#f8fafc" }}>{video.title}</h1>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.875rem", color: "#64748b" }}>by {fmtAddr(video.creatorAddress)}</span>
              <span style={{ color: "#334155" }}>·</span>
              <span style={{ fontSize: "0.875rem", color: "#64748b" }}>{fmtDuration(video.durationMs)} access</span>
            </div>
          </div>
        )}

        {/* Player */}
        <SecureVideoPlayer videoId={videoId} />

        {/* Description */}
        {video?.description && (
          <div className="card" style={{ padding: "1.5rem", marginTop: "1.5rem" }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#94a3b8", marginBottom: "0.75rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>Description</h3>
            <p style={{ fontSize: "0.9375rem", color: "#64748b", lineHeight: 1.7 }}>{video.description}</p>
          </div>
        )}

        {/* Security info */}
        <div className="card" style={{ padding: "1.5rem", marginTop: "1.25rem" }}>
          <h3 style={{ fontSize: "0.875rem", fontWeight: 600, color: "#94a3b8", marginBottom: "1rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>🔐 Security</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "0.75rem" }}>
            {[
              "Video URL encrypted with AES-256-GCM, stored on Pinata IPFS",
              "Decryption happens server-side only — raw URL never reaches your browser",
              "Access verified on every request via Pinata IPFS records",
              "Payment recorded on Sui testnet blockchain",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                <span style={{ color: "#7c3aed", flexShrink: 0, marginTop: "2px" }}>•</span>
                <p style={{ fontSize: "0.8125rem", color: "#64748b", lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
