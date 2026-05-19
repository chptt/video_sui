"use client";

import { useWallets, useDAppKit } from "@mysten/dapp-kit-react";
import { useEffect, useRef } from "react";

interface SlushConnectModalProps {
  open: boolean;
  onClose: () => void;
}

export function SlushConnectModal({ open, onClose }: SlushConnectModalProps) {
  const wallets = useWallets();
  const dAppKit = useDAppKit();
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const handleConnect = async (wallet: ReturnType<typeof useWallets>[number]) => {
    try {
      await dAppKit.connectWallet({ wallet });
      onClose();
    } catch { /* user cancelled */ }
  };

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        className="card animate-fade-in"
        style={{ width: "100%", maxWidth: "400px", padding: "2rem" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f8fafc" }}>Connect Wallet</h2>
            <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "0.25rem" }}>
              Select a Sui wallet to make payments
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", color: "#475569", fontSize: "1.25rem", cursor: "pointer", padding: "0.25rem", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        {/* Wallet list */}
        {wallets.length === 0 ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }} className="stack">
            <div style={{ fontSize: "3rem" }}>🔌</div>
            <p style={{ color: "#64748b", fontSize: "0.9375rem" }}>No wallets detected</p>
            <p style={{ color: "#475569", fontSize: "0.8125rem" }}>
              Install the Slush browser extension or use the Slush web app
            </p>
            <a
              href="https://slush.app"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-sm"
              style={{ display: "inline-flex", marginTop: "0.75rem" }}
            >
              Get Slush Wallet →
            </a>
          </div>
        ) : (
          <div className="stack-sm">
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleConnect(wallet)}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "0.875rem 1rem",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "0.875rem",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  textAlign: "left",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(168,85,247,0.35)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(168,85,247,0.06)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
                }}
              >
                {wallet.icon ? (
                  <img src={wallet.icon} alt={wallet.name} style={{ width: "36px", height: "36px", borderRadius: "8px" }} />
                ) : (
                  <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(168,85,247,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "#a855f7", fontWeight: 700 }}>
                    {wallet.name[0]}
                  </div>
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: "#f8fafc", fontSize: "0.9375rem" }}>{wallet.name}</p>
                  <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                    {wallet.accounts?.length ? `${wallet.accounts.length} account${wallet.accounts.length > 1 ? "s" : ""}` : "Click to connect"}
                  </p>
                </div>
                <span style={{ color: "#475569", fontSize: "1rem" }}>→</span>
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255,255,255,0.07)", textAlign: "center" }}>
          <p style={{ fontSize: "0.8125rem", color: "#475569" }}>
            Don&apos;t have Slush?{" "}
            <a href="https://slush.app" target="_blank" rel="noopener noreferrer" style={{ color: "#a855f7" }}>
              Download at slush.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
