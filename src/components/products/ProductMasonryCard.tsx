"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";

export interface ShopProduct {
  id: string;
  title: string;
  price: number | null;
  original_price?: number | null;
  was?: number | null;
  image_url?: string | null;
  source: string;
  slug: string;
  category?: string | null;
  is_featured?: boolean;
  affiliate_url: string;
  click_count?: number;
  clicks?: number;
  emoji?: string;
  description?: string | null;
}

function getCardHeight(product: ShopProduct): number {
  const raw = product.id.replace(/-/g, "").slice(-4);
  return 140 + (parseInt(raw, 16) % 161);
}

function getClicks(product: ShopProduct): number {
  return product.click_count ?? product.clicks ?? 0;
}

function getWasPrice(product: ShopProduct): number | null {
  return product.original_price ?? product.was ?? null;
}

function getEmoji(product: ShopProduct): string {
  return product.emoji ?? "🏀";
}

export default function ProductMasonryCard({
  product,
  onProductClick,
}: {
  product: ShopProduct;
  onProductClick: (p: ShopProduct) => void;
}) {
  const h = getCardHeight(product);
  const clicks = getClicks(product);
  const wasPrice = getWasPrice(product);
  const emoji = getEmoji(product);
  const isHot = product.is_featured && clicks > 100;

  return (
    <div
      className="group"
      onClick={() => onProductClick(product)}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--s2)",
        cursor: "pointer",
        breakInside: "avoid",
        marginBottom: 3,
      }}
    >
      {/* Image area */}
      <div style={{ height: h, overflow: "hidden", position: "relative" }}>
        <div
          className="group-hover:scale-[1.04]"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.25s",
          }}
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: Math.round(h * 0.38) }}>{emoji}</span>
          )}
        </div>
      </div>

      {/* Source pin */}
      <span
        className={`badge-${product.source}`}
        style={{
          position: "absolute",
          top: 7,
          left: 7,
          zIndex: 10,
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 9,
          letterSpacing: "0.04em",
          padding: "2px 7px",
          textTransform: "uppercase",
          opacity: 0.9,
        }}
      >
        {product.source}
      </span>

      {/* Hot pin */}
      {isHot && (
        <span
          style={{
            position: "absolute",
            top: 7,
            right: 7,
            zIndex: 10,
            background: "var(--red)",
            color: "white",
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 9,
            letterSpacing: "0.06em",
            padding: "2px 6px",
            textTransform: "uppercase",
          }}
        >
          Hot
        </span>
      )}

      {/* Hover overlay */}
      <div
        className="opacity-0 translate-y-[5px] group-hover:opacity-100 group-hover:translate-y-0"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "8px 10px 10px",
          background: "linear-gradient(transparent, rgba(0,0,0,0.94))",
          transition: "all 0.18s",
        }}
      >
        <div
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: 12,
            textTransform: "uppercase",
            color: "white",
            lineHeight: 1.2,
            marginBottom: 4,
          }}
        >
          {product.title}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span
              className="font-display"
              style={{ fontWeight: 900, fontSize: 17, color: "white" }}
            >
              {product.price != null ? formatPrice(product.price) : "—"}
            </span>
            {wasPrice != null && (
              <span
                style={{
                  fontSize: 10,
                  color: "var(--muted)",
                  textDecoration: "line-through",
                  marginLeft: 4,
                }}
              >
                {formatPrice(wasPrice)}
              </span>
            )}
          </div>
          <span
            className={`badge-${product.source}`}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: 9,
              padding: "2px 6px",
              textTransform: "uppercase",
            }}
          >
            {product.source}
          </span>
        </div>
        {clicks > 0 && (
          <div
            className="font-display"
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              marginTop: 1,
            }}
          >
            {clicks} clicks this week
          </div>
        )}
      </div>

      {/* Red border on hover */}
      <div
        className="opacity-0 group-hover:opacity-100"
        style={{
          position: "absolute",
          inset: 0,
          border: "2px solid var(--red)",
          pointerEvents: "none",
          transition: "opacity 0.15s",
        }}
      />
    </div>
  );
}
