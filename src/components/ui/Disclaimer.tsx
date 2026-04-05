import Link from "next/link";
import { SITE_DISCLAIMER, SHORT_DISCLAIMER, AFFILIATE_DISCLOSURE } from "@/lib/compliance";

interface DisclaimerProps {
  variant: "full" | "short" | "affiliate";
}

export default function Disclaimer({ variant }: DisclaimerProps) {
  if (variant === "full") {
    return (
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: 16,
          fontSize: 11,
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.3)",
        }}
      >
        <p style={{ margin: "0 0 8px" }}>{SITE_DISCLAIMER}</p>
        <Link
          href="/legal"
          style={{
            color: "rgba(255,255,255,0.4)",
            textDecoration: "underline",
            fontSize: 11,
          }}
        >
          Full legal terms, privacy policy & disclosures
        </Link>
      </div>
    );
  }

  if (variant === "affiliate") {
    return (
      <p
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.35)",
          lineHeight: 1.5,
          margin: "8px 0",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 14,
            height: 14,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.2)",
            fontSize: 9,
            flexShrink: 0,
          }}
        >
          i
        </span>
        {AFFILIATE_DISCLOSURE}
      </p>
    );
  }

  // short
  return (
    <p
      style={{
        fontSize: 11,
        color: "rgba(255,255,255,0.3)",
        lineHeight: 1.5,
        margin: "8px 0",
      }}
    >
      {SHORT_DISCLAIMER}
    </p>
  );
}
