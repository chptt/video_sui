"use client";

import { useState } from "react";
import { useDAppKit, useCurrentAccount } from "@mysten/dapp-kit-react";
import { Transaction } from "@mysten/sui/transactions";
import { toast } from "sonner";
import { formatSui } from "@/lib/pricing";
import { SlushConnectModal } from "./SlushConnectModal";

interface SlushPayButtonProps {
  videoId: string;
  priceMist: string;
  creatorAddress: string;
  onSuccess: (txDigest: string) => void;
  disabled?: boolean;
  label?: string;
}

const PLATFORM_FEE_BPS = 1000n;

export function SlushPayButton({ videoId, priceMist, creatorAddress, onSuccess, disabled = false, label }: SlushPayButtonProps) {
  const dAppKit = useDAppKit();
  const account = useCurrentAccount();
  const [paying, setPaying] = useState(false);
  const [showConnect, setShowConnect] = useState(false);
  const treasuryAddress = process.env.NEXT_PUBLIC_PLATFORM_TREASURY_ADDRESS;

  const handlePay = async () => {
    if (!account) { setShowConnect(true); return; }
    if (!treasuryAddress) { toast.error("Platform treasury not configured"); return; }

    setPaying(true);
    try {
      const totalMist = BigInt(priceMist);
      const feeMist = (totalMist * PLATFORM_FEE_BPS) / 10000n;
      const creatorMist = totalMist - feeMist;

      const tx = new Transaction();
      tx.setSender(account.address);
      const [creatorCoin, feeCoin] = tx.splitCoins(tx.gas, [tx.pure.u64(creatorMist), tx.pure.u64(feeMist)]);
      tx.transferObjects([creatorCoin], tx.pure.address(creatorAddress));
      tx.transferObjects([feeCoin], tx.pure.address(treasuryAddress));

      const result = await dAppKit.signAndExecuteTransaction({ transaction: tx });

      const digest =
        "digest" in result
          ? (result as { digest: string }).digest
          : result.$kind === "Transaction"
          ? result.Transaction.digest
          : null;

      if (!digest) { toast.error("Could not get transaction digest"); return; }
      toast.success("Payment confirmed!");
      onSuccess(digest);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("reject") || msg.toLowerCase().includes("cancel") || msg.toLowerCase().includes("denied")) {
        toast.info("Payment cancelled");
      } else {
        toast.error(`Payment failed: ${msg}`);
      }
    } finally {
      setPaying(false);
    }
  };

  const btnLabel = label ?? (account ? `Pay ${formatSui(priceMist)} SUI` : "Connect Wallet to Pay");

  return (
    <>
      <button
        onClick={handlePay}
        disabled={disabled || paying}
        className="btn btn-primary btn-full"
        style={{ gap: "0.625rem" }}
      >
        {paying ? (
          <>
            <div className="spinner spinner-sm" style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "#fff" }} />
            Waiting for Slush...
          </>
        ) : (
          <>
            <SlushIcon />
            {btnLabel}
          </>
        )}
      </button>
      {account && !paying && (
        <p style={{ fontSize: "0.75rem", textAlign: "center", color: "#475569", marginTop: "0.375rem" }}>
          via <span style={{ color: "#a855f7", fontFamily: "monospace" }}>{account.address.slice(0, 6)}...{account.address.slice(-4)}</span>
        </p>
      )}
      <SlushConnectModal open={showConnect} onClose={() => setShowConnect(false)} />
    </>
  );
}

function SlushIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="rgba(255,255,255,0.2)" />
      <path d="M8 20c2-4 6-8 8-8s6 4 8 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="16" cy="14" r="2.5" fill="white" />
    </svg>
  );
}
