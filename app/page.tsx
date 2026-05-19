import Link from "next/link";
import { LoginButton } from "@/components/LoginButton";

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        {/* Glow */}
        <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "400px", background: "radial-gradient(ellipse, rgba(120,40,200,0.2) 0%, transparent 65%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", top: "40%", left: "15%", width: "350px", height: "250px", background: "radial-gradient(ellipse, rgba(37,99,235,0.12) 0%, transparent 65%)", borderRadius: "50%" }} />
          <div style={{ position: "absolute", top: "30%", right: "10%", width: "300px", height: "200px", background: "radial-gradient(ellipse, rgba(6,182,212,0.1) 0%, transparent 65%)", borderRadius: "50%" }} />
        </div>

        <div style={{ position: "relative", maxWidth: "60rem", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem" }}>
          {/* Badge */}
          <div className="badge badge-purple" style={{ fontSize: "0.875rem", padding: "0.5rem 1.25rem" }}>
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#a855f7", display: "inline-block" }} className="animate-pulse" />
            Powered by Sui zkLogin + Pinata IPFS
          </div>

          {/* Headline */}
          <h1 className="hero-title">
            Encrypted Video<br />
            <span className="gradient-text">Access Gate</span>
          </h1>

          <p className="hero-sub">
            Creators encrypt YouTube links with AES-256-GCM. Viewers login with Google zkLogin,
            pay SUI testnet, and watch for limited time — all metadata stored on Pinata IPFS.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <LoginButton label="Get Started with Google" />
            <Link href="/marketplace" className="btn btn-outline btn-lg">
              Browse Marketplace
            </Link>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", justifyContent: "center", marginTop: "1rem" }}>
            {[
              { value: "AES-256-GCM", label: "Encryption" },
              { value: "Pinata IPFS", label: "Storage" },
              { value: "Sui Testnet", label: "Payments" },
              { value: "zkLogin", label: "Auth" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <p style={{ fontSize: "0.9375rem", fontWeight: 700, color: "#f8fafc" }}>{s.value}</p>
                <p style={{ fontSize: "0.75rem", color: "#475569" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section style={{ padding: "6rem 1.5rem" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 className="section-title">How It Works</h2>
            <p className="section-sub">Four steps from upload to secure viewing</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "🔐", step: "01", title: "Creator Encrypts", desc: "Upload an unlisted YouTube link. It's encrypted with AES-256-GCM and stored on Pinata IPFS — never in plaintext." },
              { icon: "🔑", step: "02", title: "zkLogin Auth", desc: "Viewers sign in with Google via Sui zkLogin. No wallet seed phrase, no browser extension needed." },
              { icon: "💎", step: "03", title: "Pay with SUI", desc: "Pay SUI testnet tokens via Slush wallet. 90% goes to creator, 10% platform fee. All verified on-chain." },
              { icon: "▶️", step: "04", title: "Watch Securely", desc: "Backend decrypts the URL server-side and returns only a safe embed URL for the access period." },
            ].map(item => (
              <div key={item.step} className="step-card">
                <span className="step-num">{item.step}</span>
                <div style={{ fontSize: "2.25rem", marginBottom: "1rem" }}>{item.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#f8fafc", marginBottom: "0.625rem" }}>{item.title}</h3>
                <p style={{ fontSize: "0.875rem", color: "#64748b", lineHeight: 1.65 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Security Features ────────────────────────────────── */}
      <section style={{ padding: "6rem 1.5rem", background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 className="section-title">Built for Security</h2>
            <p className="section-sub">Every layer designed to protect creator content</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: "1.25rem" }}>
            {[
              { icon: "🛡️", title: "AES-256-GCM Encryption", desc: "YouTube URLs encrypted with military-grade encryption. Keys never leave the server." },
              { icon: "🌐", title: "Pinata IPFS Storage", desc: "Encrypted metadata stored on decentralized IPFS. No central database to hack." },
              { icon: "🔮", title: "Sui zkLogin", desc: "Login with Google, get a Sui wallet address. No seed phrases, no extensions required." },
              { icon: "⏱️", title: "Time-Limited Access", desc: "Access expires automatically. Creators control exactly how long viewers can watch." },
              { icon: "💰", title: "Revenue Cap System", desc: "$20 USD gross revenue cap per video. Automatic sold-out when cap is reached." },
              { icon: "🔒", title: "Server-Side Decryption", desc: "Raw YouTube URLs never reach the frontend. Decryption only happens in API routes." },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Revenue Model ────────────────────────────────────── */}
      <section style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: "52rem", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 className="section-title">Revenue Model</h2>
            <p className="section-sub">Transparent, on-chain payment splits</p>
          </div>
          <div className="card" style={{ padding: "2.5rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1.25rem", marginBottom: "2rem" }}>
              {[
                { value: "90%", label: "Creator Earnings", color: "#c4b5fd", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.2)" },
                { value: "10%", label: "Platform Fee", color: "#93c5fd", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.2)" },
                { value: "$20", label: "Revenue Cap / Video", color: "#86efac", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
              ].map(s => (
                <div key={s.label} style={{ textAlign: "center", padding: "1.5rem 1rem", background: s.bg, border: `1px solid ${s.border}`, borderRadius: "1rem" }}>
                  <p style={{ fontSize: "2.25rem", fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: "0.8125rem", color: "#64748b", marginTop: "0.5rem" }}>{s.label}</p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "0.875rem", color: "#475569", textAlign: "center", lineHeight: 1.7 }}>
              After a video reaches $20 USD gross revenue, it&apos;s automatically removed from the marketplace.
              Existing paid users retain access until their access period expires.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section style={{ padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "52rem", margin: "0 auto", textAlign: "center" }} className="stack-lg">
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 800, color: "#f8fafc" }}>
            Ready to monetize your content?
          </h2>
          <p style={{ color: "#64748b", fontSize: "1.0625rem" }}>
            Create your first encrypted video listing in under 2 minutes.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center" }}>
            <LoginButton label="Start Creating" />
            <Link href="/marketplace" className="btn btn-outline btn-lg">View Marketplace</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "2.5rem 1.5rem" }}>
        <div className="container" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "7px", background: "linear-gradient(135deg, #7c3aed, #2563eb)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "0.6875rem" }}>PT</div>
            <span style={{ fontSize: "0.875rem", color: "#475569" }}>PrivateTube Access Gate — Sui Testnet MVP</span>
          </div>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {[{ href: "/marketplace", label: "Marketplace" }, { href: "/login", label: "Login" }].map(l => (
              <Link key={l.href} href={l.href} style={{ fontSize: "0.875rem", color: "#475569", transition: "color 0.15s" }}
                onMouseEnter={undefined}>{l.label}</Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
