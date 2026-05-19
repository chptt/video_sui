"use client";

import { useState } from "react";

interface WalletStatusProps {
  email: string;
  suiAddress: string;
}

export function WalletStatus({ email, suiAddress }: WalletStatusProps) {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    await navigator.clipboard.writeText(suiAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4ade80", display: "inline-block" }} className="animate-pulse" />
        <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>Connected via zkLogin</span>
      </div>

      <div className="stack-sm">
        <div>
          <p style={{ fontSize: "0.75rem", color: "#475569", marginBottom: "0.25rem" }}>Email</p>
          <p style={{ fontSize: "0.875rem", color: "#f8fafc", fontWeight: 500 }}>{email}</p>
        </div>
        <div>
          <p style={{ fontSize: "0.75rem", color: "#475569", marginBottom: "0.25rem" }}>Sui Address (Testnet)</p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <code className="mono" style={{ flex: 1, fontSize: "0.75rem" }}>
              {suiAddress.slice(0, 10)}...{suiAddress.slice(-8)}
            </code>
            <button
              onClick={copyAddress}
              style={{ fontSize: "0.75rem", color: copied ? "#4ade80" : "#64748b", background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap", transition: "color 0.15s" }}
            >
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "1rem", paddingTop: "0.875rem", borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <a
          href={`https://suiexplorer.com/address/${suiAddress}?network=testnet`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "0.8125rem", color: "#6366f1" }}
        >
          View on Sui Explorer →
        </a>
      </div>
    </div>
  );
}
