"use client";

import { useState } from "react";
import { useDAppKit, useCurrentAccount } from "@mysten/dapp-kit-react";
import { SlushConnectModal } from "./SlushConnectModal";

export function SlushWalletBar() {
  const dAppKit = useDAppKit();
  const account = useCurrentAccount();
  const [showConnect, setShowConnect] = useState(false);

  if (!account) {
    return (
      <>
        <button
          onClick={() => setShowConnect(true)}
          className="btn btn-outline btn-sm"
          style={{ gap: "0.5rem" }}
        >
          <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#475569", display: "inline-block" }} />
          Connect Wallet
        </button>
        <SlushConnectModal open={showConnect} onClose={() => setShowConnect(false)} />
      </>
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div className="wallet-pill">
        <span className="wallet-dot animate-pulse" />
        {account.address.slice(0, 6)}...{account.address.slice(-4)}
      </div>
      <button
        onClick={() => dAppKit.disconnectWallet()}
        style={{ background: "none", border: "none", color: "#475569", fontSize: "1rem", padding: "0.25rem", lineHeight: 1, cursor: "pointer", transition: "color 0.15s" }}
        title="Disconnect wallet"
        onMouseEnter={e => (e.currentTarget.style.color = "#94a3b8")}
        onMouseLeave={e => (e.currentTarget.style.color = "#475569")}
      >
        ✕
      </button>
    </div>
  );
}
