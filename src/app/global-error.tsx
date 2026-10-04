"use client";

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
          textAlign: "center",
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#0F0F0F",
          color: "#ffffff",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(239, 68, 68, 0.1)",
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
            margin: "24px 0 0",
            fontSize: 24,
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
            maxWidth: 360,
            lineHeight: 1.5,
          }}
        >
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "#6b7280" }}>Ref: {error.digest}</p>
        )}
        <button
          onClick={reset}
          style={{
            marginTop: 24,
            padding: "12px 24px",
            border: 0,
            borderRadius: 8,
            background: "#d4af37",
            color: "#0F0F0F",
            fontSize: 14,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          TRY AGAIN
        </button>
      </body>
    </html>
  );
}
