"use client";

import { useState } from "react";
import { capFirst } from "@/lib/utils";

interface Props {
  affiliateUrl: string;
  source: string;
  productId: string;
}

export default function ProductCTA({ affiliateUrl, source, productId }: Props) {
  const defaultText = `View Deal on ${capFirst(source)} →`;
  const [text, setText] = useState(defaultText);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    setText("✓ Opening...");

    try {
      fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          source_page: "product-page",
        }),
      });
    } catch {
      // fire and forget
    }

    window.open(affiliateUrl, "_blank", "noopener,noreferrer");
    setTimeout(() => setText(defaultText), 1500);
  }

  return (
    <a
      href={affiliateUrl}
      onClick={handleClick}
      rel="noopener noreferrer sponsored"
      className="font-display"
      style={{
        display: "block",
        width: "100%",
        padding: 16,
        fontWeight: 900,
        fontSize: 18,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        background: "var(--red)",
        color: "white",
        borderRadius: 2,
        marginBottom: 12,
        textDecoration: "none",
        textAlign: "center",
        cursor: "pointer",
      }}
    >
      {text}
    </a>
  );
}
