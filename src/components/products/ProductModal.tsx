"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatPrice, capFirst } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import type { ShopProduct } from "./ProductMasonryCard";

function getCategoryEmoji(product: ShopProduct): string {
  if (product.emoji) return product.emoji;
  const cat = CATEGORIES.find((c) => c.slug === product.category);
  return cat?.emoji ?? "🏀";
}

interface ProductModalProps {
  product: ShopProduct;
  allProducts: ShopProduct[];
  onClose: () => void;
  onProductClick: (p: ShopProduct) => void;
}

export default function ProductModal({
  product,
  allProducts,
  onClose,
  onProductClick,
}: ProductModalProps) {
  const [ctaText, setCtaText] = useState(
    `View Deal on ${capFirst(product.source)} →`
  );

  // Reset CTA text when product changes
  useEffect(() => {
    setCtaText(`View Deal on ${capFirst(product.source)} →`);
  }, [product.id, product.source]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const wasPrice = product.original_price ?? product.was ?? null;
  const clicks = product.click_count ?? product.clicks ?? 0;
  const emoji = getCategoryEmoji(product);

  const similar = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 8);

  async function handleViewDeal() {
    setCtaText("✓ Opening...");
    try {
      fetch("/api/track-click", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: product.id,
          source_page: "modal",
        }),
      });
    } catch {
      // fire and forget
    }
    window.open(product.affiliate_url, "_blank", "noopener,noreferrer");
    setTimeout(
      () => setCtaText(`View Deal on ${capFirst(product.source)} →`),
      1500
    );
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        className="modal-pop"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--s1)",
          maxWidth: 760,
          width: "100%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          border: "1px solid var(--border)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 12,
            right: 14,
            fontSize: 24,
            color: "var(--muted)",
            background: "none",
            border: "none",
            cursor: "pointer",
            zIndex: 10,
            lineHeight: 1,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
        >
          ×
        </button>

        {/* Two-column grid */}
        <div className="modal-grid">
          {/* LEFT — Image */}
          <div
            style={{
              background: "var(--s2)",
              minHeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                sizes="380px"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span style={{ fontSize: 90 }}>{emoji}</span>
            )}
          </div>

          {/* RIGHT — Info */}
          <div style={{ padding: "28px 22px" }}>
            <span
              className={`badge-${product.source}`}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: 11,
                padding: "3px 10px",
                display: "inline-block",
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              {product.source}
            </span>

            <h2
              className="font-display"
              style={{
                fontWeight: 900,
                fontSize: 22,
                textTransform: "uppercase",
                lineHeight: 1.1,
                marginBottom: 10,
                marginTop: 0,
              }}
            >
              {product.title}
            </h2>

            <div
              className="font-display"
              style={{ fontWeight: 900, fontSize: 34, marginBottom: 4 }}
            >
              {product.price != null ? formatPrice(product.price) : "—"}
            </div>

            {wasPrice != null && (
              <div
                style={{
                  fontSize: 14,
                  color: "var(--muted)",
                  textDecoration: "line-through",
                  marginBottom: 8,
                }}
              >
                {formatPrice(wasPrice)}
              </div>
            )}

            <div
              className="font-display"
              style={{
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#4CAF50",
                marginBottom: 16,
              }}
            >
              ✓ In Stock — Ships Fast
            </div>

            {product.description && (
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.75,
                  color: "rgba(255,255,255,0.58)",
                  marginBottom: 22,
                  marginTop: 0,
                }}
              >
                {product.description}
              </p>
            )}

            <button
              onClick={handleViewDeal}
              className="font-display"
              style={{
                width: "100%",
                padding: 15,
                fontWeight: 900,
                fontSize: 16,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                background: "var(--red)",
                color: "white",
                border: "none",
                borderRadius: 2,
                marginBottom: 12,
                cursor: "pointer",
              }}
              data-rel="noopener noreferrer"
            >
              {ctaText}
            </button>

            <div
              style={{
                display: "flex",
                gap: 14,
                fontSize: 11,
                color: "var(--muted)",
                flexWrap: "wrap",
              }}
            >
              <span>🔒 Secure checkout</span>
              <span>↩ Easy returns</span>
              <span>🚚 Fast shipping</span>
            </div>

            <div
              className="font-display"
              style={{
                fontSize: 11,
                color: "var(--muted)",
                marginTop: 14,
                paddingTop: 12,
                borderTop: "1px solid var(--border)",
              }}
            >
              {clicks} fans clicked this deal this week
            </div>
          </div>
        </div>

        {/* Similar gear */}
        {similar.length > 0 && (
          <div
            style={{
              borderTop: "1px solid var(--border)",
              padding: "16px 22px",
            }}
          >
            <h4
              className="font-display"
              style={{
                fontWeight: 700,
                fontSize: 12,
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--muted)",
                marginBottom: 12,
                marginTop: 0,
              }}
            >
              Similar Gear
            </h4>
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 4,
              }}
            >
              {similar.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onProductClick(p)}
                  className="similar-card"
                  style={{
                    flexShrink: 0,
                    width: 96,
                    cursor: "pointer",
                    background: "var(--s2)",
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid transparent",
                    transition: "border-color 0.15s",
                  }}
                >
                  <div
                    style={{
                      height: 68,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {p.image_url ? (
                      <Image
                        src={p.image_url}
                        alt={p.title}
                        width={52}
                        height={52}
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: 26 }}>{getCategoryEmoji(p)}</span>
                    )}
                  </div>
                  <div
                    className="font-display"
                    style={{
                      fontWeight: 700,
                      fontSize: 11,
                      textTransform: "uppercase",
                      padding: "4px 6px",
                      lineHeight: 1.2,
                      color: "white",
                    }}
                  >
                    {p.title.length > 28
                      ? p.title.slice(0, 28) + "…"
                      : p.title}
                  </div>
                  <div
                    className="font-display"
                    style={{
                      fontWeight: 800,
                      fontSize: 12,
                      padding: "2px 6px 6px",
                      color: "white",
                    }}
                  >
                    {p.price != null ? formatPrice(p.price) : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        .modal-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        @media (max-width: 640px) {
          .modal-grid {
            grid-template-columns: 1fr;
          }
        }
        .similar-card:hover {
          border-color: var(--red) !important;
        }
      `}</style>
    </div>
  );
}
