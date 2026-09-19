import Link from "next/link";
import { SITE_DISCLAIMER, SHORT_DISCLAIMER, AFFILIATE_DISCLOSURE } from "@/lib/compliance";

interface DisclaimerProps {
  variant: "full" | "short" | "affiliate";
}

export default function Disclaimer({ variant }: DisclaimerProps) {
  if (variant === "full") {
    return (
      <div className="beat-disclaimer">
        <p style={{ margin: "0 0 8px" }}>{SITE_DISCLAIMER}</p>
        <Link
          href="/legal"
          style={{
            color: "#5a564c",
            textDecoration: "underline",
            fontSize: 12,
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
          fontSize: 12,
          color: "var(--muted)",
          lineHeight: 1.5,
          margin: "8px 0",
        }}
      >
        {AFFILIATE_DISCLOSURE}
      </p>
    );
  }

  return (
    <p
      style={{
        fontSize: 12,
        color: "var(--muted)",
        lineHeight: 1.55,
        margin: "8px 0",
      }}
    >
      {SHORT_DISCLAIMER}
    </p>
  );
}
