"use client";

interface RevenueProgressProps {
  totalGrossRevenueUsd: number;
  revenueCapUsd: number;
  totalCreatorRevenueUsd: number;
  totalPlatformRevenueUsd: number;
  purchaseCount: number;
  isSoldOut: boolean;
}

export function RevenueProgress({ totalGrossRevenueUsd, revenueCapUsd, totalCreatorRevenueUsd, totalPlatformRevenueUsd, purchaseCount, isSoldOut }: RevenueProgressProps) {
  const pct = Math.min((totalGrossRevenueUsd / revenueCapUsd) * 100, 100);
  const fillColor = isSoldOut ? "#ef4444" : pct >= 80 ? "#f97316" : pct >= 50 ? "#eab308" : "linear-gradient(90deg, #a855f7, #3b82f6)";

  return (
    <div className="stack-sm">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.8125rem", color: "#64748b" }}>Revenue</span>
        <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: isSoldOut ? "#f87171" : "#f8fafc" }}>
          ${totalGrossRevenueUsd.toFixed(2)} / ${revenueCapUsd.toFixed(2)}
        </span>
      </div>

      <div className="progress-track">
        <div
          className="progress-fill"
          style={{
            width: `${pct}%`,
            background: typeof fillColor === "string" && fillColor.startsWith("linear") ? fillColor : fillColor,
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0.625rem" }}>
        {[
          { label: "Sales", value: purchaseCount.toString(), color: "#f8fafc" },
          { label: "Creator", value: `$${totalCreatorRevenueUsd.toFixed(2)}`, color: "#4ade80" },
          { label: "Platform", value: `$${totalPlatformRevenueUsd.toFixed(2)}`, color: "#60a5fa" },
        ].map((s) => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", borderRadius: "0.625rem", padding: "0.625rem", textAlign: "center" }}>
            <p style={{ fontSize: "0.75rem", color: "#475569" }}>{s.label}</p>
            <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: s.color, marginTop: "0.125rem" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {isSoldOut && (
        <div className="alert alert-error" style={{ fontSize: "0.8125rem" }}>
          <span>🔒</span>
          Revenue cap reached — no new purchases
        </div>
      )}
    </div>
  );
}
