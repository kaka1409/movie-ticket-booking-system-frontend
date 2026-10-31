"use client";

import Link from "next/link";

/**
 * Catches errors thrown in the ROOT layout — providers and global CSS
 * may be unavailable here, so this component is fully self-contained
 * (hardcoded English, inline styles only).
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const cardStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: 440,
    padding: "40px 32px",
    borderRadius: 16,
    background: "#1c1b1b",
    border: "1px solid #2e2e2e",
    boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
    textAlign: "center",
  };

  const buttonBase: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: "12px 20px",
    borderRadius: 12,
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
    textDecoration: "none",
  };

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#0F0F0F",
          color: "#ffffff",
        }}
      >
        <div style={cardStyle}>
          <div
            style={{
              width: 64,
              height: 64,
              margin: "0 auto",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            &#9888;
          </div>
          <h1
            style={{
              margin: "20px 0 0",
              fontSize: "clamp(20px, 4vw, 26px)",
              fontWeight: 900,
              letterSpacing: "0.1em",
            }}
          >
            SOMETHING WENT WRONG
          </h1>
          <p
            style={{
              margin: "12px 0 0",
              fontSize: 14,
              color: "#9ca3af",
              lineHeight: 1.5,
            }}
          >
            An unexpected error occurred. Please try again.
          </p>
          {error.digest && (
            <p
              style={{
                margin: "12px 0 0",
                fontSize: 11,
                color: "#6b7280",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                wordBreak: "break-all",
              }}
            >
              Ref: {error.digest}
            </p>
          )}
          <div
            style={{
              marginTop: 24,
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <button
              onClick={reset}
              style={{
                ...buttonBase,
                background: "#d4af37",
                color: "#0F0F0F",
                border: 0,
              }}
            >
              TRY AGAIN
            </button>
            <Link
              href="/"
              style={{
                ...buttonBase,
                background: "transparent",
                color: "#d4af37",
                border: "1px solid rgba(212, 175, 55, 0.6)",
              }}
            >
              BACK TO HOME
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
