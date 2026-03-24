"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      style={{
        padding: "80px 20px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        className="font-display"
        style={{
          fontWeight: 900,
          fontSize: 72,
          color: "var(--red)",
          lineHeight: 1,
          margin: 0,
        }}
      >
        Oops
      </h1>
      <h2
        className="font-display"
        style={{
          fontWeight: 700,
          fontSize: 24,
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: 16,
          marginTop: 8,
        }}
      >
        Something went wrong
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
        An unexpected error occurred. Our team has been notified.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          className="btn-angled font-display"
          style={{
            background: "var(--red)",
            color: "white",
            fontWeight: 800,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "12px 28px",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try Again
        </button>
        <Link
          href="/shop"
          className="btn-angled font-display"
          style={{
            background: "transparent",
            color: "white",
            border: "1px solid rgba(255,255,255,0.22)",
            fontWeight: 800,
            fontSize: 14,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            padding: "12px 28px",
            textDecoration: "none",
            display: "inline-block",
          }}
        >
          ← Back to Shop
        </Link>
      </div>
    </div>
  );
}
