"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { VideoCard } from "@/components/VideoCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import Link from "next/link";

interface Video {
  videoId: string; cid: string; title: string; description: string;
  creatorAddress: string; priceMist: string; priceSui: string;
  durationMs: number; isSoldOut: boolean; isDisabled: boolean;
  status: string; createdAt: string; thumbnailUrl?: string;
}
interface AccessMap {
  [id: string]: { hasAccess: boolean; expiresAt: string | null; isExpired: boolean; };
}
interface User { email: string; suiAddress: string; isAdmin: boolean; }

export default function MarketplacePage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [accessMap, setAccessMap] = useState<AccessMap>({});
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [showDisabled, setShowDisabled] = useState(false);

  const fetchVideos = useCallback(async (includeDisabled = false) => {
    try {
      const res = await fetch(includeDisabled ? "/api/videos/list?includeDisabled=true" : "/api/videos/list");
      const data = await res.json();
      if (data.videos) setVideos(data.videos);
    } catch { toast.error("Failed to load videos"); }
    finally { setLoading(false); }
  }, []);

  const fetchAccess = useCallback(async (ids: string[]) => {
    if (!user) return;
    const results: AccessMap = {};
    await Promise.all(ids.map(async id => {
      try {
        const res = await fetch(`/api/videos/${id}/access`);
        const data = await res.json();
        results[id] = { hasAccess: data.hasAccess || false, expiresAt: data.expiresAt || null, isExpired: data.isExpired || false };
      } catch { results[id] = { hasAccess: false, expiresAt: null, isExpired: false }; }
    }));
    setAccessMap(results);
  }, [user]);

  useEffect(() => {
    fetch("/api/auth/session").then(r => r.json()).then(d => setUser(d.user || null)).catch(() => {});
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => { if (user && videos.length > 0) fetchAccess(videos.map(v => v.videoId)); }, [user, videos, fetchAccess]);
  useEffect(() => { if (user?.isAdmin) fetchVideos(showDisabled); }, [showDisabled, user, fetchVideos]);

  const handlePaymentSuccess = async (videoId: string, txDigest: string) => {
    if (!user) { toast.error("Please login first"); return; }
    setProcessingId(videoId);
    try {
      const res = await fetch("/api/payment/record", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, txDigest }),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || "Failed to record payment"); return; }
      setLastTx(txDigest);
      toast.success("Access granted! You can now watch the video.");
      setAccessMap(p => ({ ...p, [videoId]: { hasAccess: true, expiresAt: data.access.expiresAt, isExpired: false } }));
      fetchVideos(showDisabled);
    } catch { toast.error("Failed to record payment. Contact support with your tx digest."); }
    finally { setProcessingId(null); }
  };

  const handleDisableToggle = (videoId: string, disabled: boolean) => {
    setVideos(p => p.map(v => v.videoId === videoId ? { ...v, isDisabled: disabled } : v));
  };

  const getAccessStatus = (id: string): "none" | "active" | "expired" => {
    const a = accessMap[id];
    if (!a) return "none";
    if (a.hasAccess) return "active";
    if (a.isExpired) return "expired";
    return "none";
  };

  const visible = user?.isAdmin
    ? (showDisabled ? videos : videos.filter(v => !v.isDisabled))
    : videos.filter(v => !v.isDisabled);

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem", marginBottom: "2.5rem" }}>
          <div>
            <h1 style={{ fontSize: "clamp(1.75rem, 4vw, 2.25rem)", fontWeight: 800, color: "#f8fafc" }}>Marketplace</h1>
            <p style={{ color: "#64748b", marginTop: "0.375rem" }}>Pay with Slush wallet — get time-limited access instantly</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            {user?.isAdmin && (
              <button
                onClick={() => setShowDisabled(v => !v)}
                className={`btn btn-sm ${showDisabled ? "btn-danger" : "btn-outline"}`}
              >
                {showDisabled ? "Hide Disabled" : "Show Disabled"}
              </button>
            )}
            {!user && <Link href="/login" className="btn btn-primary">Login to Purchase</Link>}
          </div>
        </div>

        {/* Admin notice */}
        {user?.isAdmin && (
          <div className="alert alert-warning" style={{ marginBottom: "1.5rem" }}>
            <span>🛡️</span>
            Admin view — Disable/Enable buttons are visible only to you
          </div>
        )}

        {/* Tx success */}
        {lastTx && (
          <div className="alert alert-success" style={{ marginBottom: "1.5rem", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span>✓</span>
              <div>
                <p style={{ fontWeight: 600, color: "#86efac" }}>Payment recorded on Sui testnet</p>
                <code style={{ fontSize: "0.75rem", color: "#64748b", fontFamily: "monospace" }}>{lastTx.slice(0, 44)}...</code>
              </div>
            </div>
            <button onClick={() => setLastTx(null)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", fontSize: "1rem" }}>✕</button>
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "6rem 0", gap: "1rem" }}>
            <LoadingSpinner size="lg" />
            <p style={{ color: "#475569" }}>Loading from Pinata IPFS...</p>
          </div>
        ) : visible.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎬</div>
            <h2 className="empty-title">No videos yet</h2>
            <p className="empty-desc">Be the first to create an encrypted video listing</p>
            <Link href="/create" className="btn btn-primary" style={{ marginTop: "0.5rem" }}>Create Video</Link>
          </div>
        ) : (
          <>
            {/* Stats bar */}
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
              <span style={{ fontSize: "0.875rem", color: "#64748b" }}>
                <strong style={{ color: "#f8fafc" }}>{visible.length}</strong> video{visible.length !== 1 ? "s" : ""} available
              </span>
              {user && (
                <span style={{ fontSize: "0.875rem", color: "#a855f7" }}>
                  <strong>{Object.values(accessMap).filter(a => a.hasAccess).length}</strong> active access
                </span>
              )}
              {user?.isAdmin && showDisabled && (
                <span style={{ fontSize: "0.875rem", color: "#f87171" }}>
                  <strong>{videos.filter(v => v.isDisabled).length}</strong> disabled
                </span>
              )}
            </div>

            <div className="video-grid">
              {visible.map(video => (
                <VideoCard
                  key={video.videoId}
                  videoId={video.videoId}
                  title={video.title}
                  creatorAddress={video.creatorAddress}
                  priceMist={video.priceMist}
                  durationMs={video.durationMs}
                  isSoldOut={video.isSoldOut}
                  isDisabled={video.isDisabled}
                  status={video.status}
                  createdAt={video.createdAt}
                  thumbnailUrl={video.thumbnailUrl}
                  accessStatus={getAccessStatus(video.videoId)}
                  expiresAt={accessMap[video.videoId]?.expiresAt}
                  onPaymentSuccess={user && !video.isDisabled ? handlePaymentSuccess : undefined}
                  isPurchasing={processingId === video.videoId}
                  isAdmin={user?.isAdmin}
                  onDisableToggle={handleDisableToggle}
                />
              ))}
            </div>

            <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "#334155", marginTop: "3rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              Payments via Slush wallet on Sui Testnet · Metadata on Pinata IPFS · Revenue cap $20 USD per video
            </p>
          </>
        )}
      </div>
    </div>
  );
}
