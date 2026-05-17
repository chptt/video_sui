import Link from "next/link";
import { LoginButton } from "@/components/LoginButton";

export default function HomePage() {
  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "5rem 1.5rem 6rem",
          textAlign: "center",
        }}
      >
        {/* Glow blobs */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "600px",
              height: "300px",
              background: "radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "20%",
              width: "400px",
              height: "250px",
              background: "radial-gradient(ellipse, rgba(59,130,246,0.10) 0%, transparent 70%)",
              borderRadius: "50%",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            maxWidth: "56rem",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.375rem 1rem",
              borderRadius: "9999px",
              border: "1px solid rgba(168,85,247,0.3)",
              background: "rgba(168,85,247,0.1)",
              color: "#c4b5fd",
              fontSize: "0.875rem",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#a855f7",
                animation: "pulse 2s infinite",
              }}
            />
            Powered by Sui zkLogin + Pinata IPFS
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "#f8fafc" }}>Encrypted Video</span>
            <br />
            <span className="gradient-text">Access Gate</span>
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              color: "#94a3b8",
              maxWidth: "40rem",
              lineHeight: 1.7,
            }}
          >
            Creators encrypt YouTube links with AES-256-GCM. Viewers login with
            Google zkLogin, pay SUI testnet, and watch for limited time — all
            metadata stored on Pinata IPFS.
          </p>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1rem",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <LoginButton label="Get Started with Google" />
            <Link
              href="/marketplace"
              style={{
                padding: "0.75rem 1.5rem",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: "0.75rem",
                color: "#cbd5e1",
                textDecoration: "none",
                fontSize: "0.9375rem",
                transition: "all 0.2s",
              }}
            >
              Browse Marketplace
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: 700,
                color: "#f8fafc",
                marginBottom: "0.75rem",
              }}
            >
              How It Works
            </h2>
            <p style={{ color: "#94a3b8" }}>
              A fully encrypted, decentralized video access system
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              {
                icon: "🔐",
                step: "01",
                title: "Creator Encrypts",
                desc: "Upload an unlisted YouTube link. It's encrypted with AES-256-GCM and stored on Pinata IPFS.",
              },
              {
                icon: "🔑",
                step: "02",
                title: "zkLogin Auth",
                desc: "Viewers sign in with Google via Sui zkLogin — no wallet seed phrase needed.",
              },
              {
                icon: "💎",
                step: "03",
                title: "Pay with SUI",
                desc: "Pay SUI testnet tokens. 90% goes to creator, 10% platform fee. All verified on-chain.",
              },
              {
                icon: "▶️",
                step: "04",
                title: "Watch Securely",
                desc: "Backend decrypts the URL server-side and serves only an embed URL for the access period.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="glass-card"
                style={{ borderRadius: "1rem", padding: "1.5rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <span style={{ fontSize: "2rem" }}>{item.icon}</span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontFamily: "monospace",
                      color: "rgba(168,85,247,0.5)",
                    }}
                  >
                    {item.step}
                  </span>
                </div>
                <h3
                  style={{
                    fontWeight: 600,
                    color: "#f8fafc",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Built for Security ───────────────────────────────── */}
      <section
        style={{
          padding: "5rem 1.5rem",
          background: "rgba(255,255,255,0.02)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2
              style={{
                fontSize: "1.875rem",
                fontWeight: 700,
                color: "#f8fafc",
                marginBottom: "0.75rem",
              }}
            >
              Built for Security
            </h2>
            <p style={{ color: "#94a3b8" }}>
              Every layer designed to protect creator content
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              {
                icon: "🛡️",
                title: "AES-256-GCM Encryption",
                desc: "YouTube URLs encrypted with military-grade encryption. Keys never leave the server.",
              },
              {
                icon: "🌐",
                title: "Pinata IPFS Storage",
                desc: "Encrypted metadata stored on decentralized IPFS. No central database to hack.",
              },
              {
                icon: "🔮",
                title: "Sui zkLogin",
                desc: "Login with Google, get a Sui wallet address. No seed phrases, no extensions.",
              },
              {
                icon: "⏱️",
                title: "Time-Limited Access",
                desc: "Access expires automatically. Creators control how long viewers can watch.",
              },
              {
                icon: "💰",
                title: "Revenue Cap System",
                desc: "$20 USD gross revenue cap per video. Automatic sold-out when cap is reached.",
              },
              {
                icon: "🔒",
                title: "Server-Side Decryption",
                desc: "Raw YouTube URLs never reach the frontend. Decryption only in API routes.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="glass-card"
                style={{
                  borderRadius: "0.875rem",
                  padding: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                <span style={{ fontSize: "1.5rem" }}>{feature.icon}</span>
                <h3 style={{ fontWeight: 600, color: "#f8fafc", fontSize: "0.9375rem" }}>
                  {feature.title}
                </h3>
                <p style={{ fontSize: "0.8125rem", color: "#94a3b8", lineHeight: 1.6 }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Revenue Model ────────────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto" }}>
          <div
            className="glass-card"
            style={{ borderRadius: "1.25rem", padding: "2.5rem" }}
          >
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#f8fafc",
                  marginBottom: "0.5rem",
                }}
              >
                Revenue Model
              </h2>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                Transparent, on-chain payment splits
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
                gap: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              {[
                { value: "90%", label: "Creator Earnings", color: "#c4b5fd", bg: "rgba(168,85,247,0.1)", border: "rgba(168,85,247,0.2)" },
                { value: "10%", label: "Platform Fee", color: "#93c5fd", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.2)" },
                { value: "$20", label: "Revenue Cap / Video", color: "#86efac", bg: "rgba(34,197,94,0.1)", border: "rgba(34,197,94,0.2)" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    textAlign: "center",
                    padding: "1.25rem",
                    background: stat.bg,
                    border: `1px solid ${stat.border}`,
                    borderRadius: "0.875rem",
                  }}
                >
                  <p style={{ fontSize: "2rem", fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </p>
                  <p style={{ fontSize: "0.8125rem", color: "#94a3b8", marginTop: "0.25rem" }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: "0.75rem", color: "#64748b", textAlign: "center" }}>
              After a video reaches $20 USD gross revenue, it&apos;s automatically
              removed from the marketplace. Existing paid users retain access until expiry.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "2rem 1.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "72rem",
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            fontSize: "0.875rem",
            color: "#64748b",
          }}
        >
          <p>PrivateTube Access Gate — Sui Testnet MVP</p>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <Link href="/marketplace" style={{ color: "#64748b", textDecoration: "none" }}>
              Marketplace
            </Link>
            <Link href="/login" style={{ color: "#64748b", textDecoration: "none" }}>
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
