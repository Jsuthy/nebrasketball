import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
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
      <Image
        src="/logos/logo-icon.png"
        alt="Nebrasketball"
        width={120}
        height={54}
        unoptimized
        style={{ marginBottom: 32, height: "auto" }}
      />
      <h1
        className="font-display"
        style={{
          fontWeight: 900,
          fontSize: 96,
          color: "var(--red)",
          lineHeight: 1,
          margin: 0,
        }}
      >
        404
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
        Page Not Found
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/shop"
          className="btn-angled font-display"
          style={{
            background: "var(--red)",
            color: "white",
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
        <Link
          href="/"
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
          Go Home
        </Link>
      </div>
    </div>
  );
}
