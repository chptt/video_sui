"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { LoadingSpinner } from "./LoadingSpinner";
import { SlushWalletBar } from "./SlushWalletBar";

interface User {
  email: string;
  suiAddress: string;
  isAdmin?: boolean;
}

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setLoggingOut(false);
    router.push("/");
  };

  const formatAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      style={{
        fontSize: "0.875rem",
        color: pathname === href ? "#a855f7" : "#94a3b8",
        textDecoration: "none",
        transition: "color 0.2s",
      }}
    >
      {label}
    </Link>
  );

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        background: "rgba(5,8,20,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          maxWidth: "80rem",
          margin: "0 auto",
          padding: "0 1.5rem",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #a855f7, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "0.75rem",
            }}
          >
            PT
          </div>
          <span style={{ fontWeight: 600, color: "#f8fafc", fontSize: "0.9375rem" }}>
            PrivateTube
          </span>
        </Link>

        {/* Desktop nav links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
          }}
          className="hidden-mobile"
        >
          {navLink("/marketplace", "Marketplace")}
          {user && navLink("/dashboard", "Dashboard")}
          {user && navLink("/create", "Create")}
        </div>

        {/* Right side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            flexShrink: 0,
          }}
        >
          {/* Slush wallet */}
          <SlushWalletBar />

          {loading ? (
            <LoadingSpinner size="sm" />
          ) : user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end",
                }}
                className="hidden-mobile"
              >
                <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
                  {user.email}
                </span>
                <span
                  style={{
                    fontSize: "0.6875rem",
                    color: "#a855f7",
                    fontFamily: "monospace",
                  }}
                >
                  {formatAddress(user.suiAddress)}
                </span>
              </div>
              {user.isAdmin && (
                <span
                  style={{
                    fontSize: "0.6875rem",
                    padding: "0.125rem 0.5rem",
                    background: "rgba(234,179,8,0.15)",
                    border: "1px solid rgba(234,179,8,0.3)",
                    color: "#fde047",
                    borderRadius: "9999px",
                  }}
                >
                  Admin
                </span>
              )}
              <button
                onClick={handleLogout}
                disabled={loggingOut}
                style={{
                  padding: "0.375rem 0.875rem",
                  fontSize: "0.8125rem",
                  color: "#94a3b8",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "0.5rem",
                  background: "transparent",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {loggingOut ? <LoadingSpinner size="sm" /> : "Logout"}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              style={{
                padding: "0.5rem 1.25rem",
                fontSize: "0.875rem",
                fontWeight: 500,
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                color: "white",
                borderRadius: "0.625rem",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Hide on mobile helper — inline style approach */}
      <style>{`
        @media (max-width: 640px) {
          .hidden-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
