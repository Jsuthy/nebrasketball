"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

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

function getClicks(product: ShopProduct): number {
  return product.click_count ?? product.clicks ?? 0;
}

function getWasPrice(product: ShopProduct): number | null {
  return product.original_price ?? product.was ?? null;
}

function getEmoji(product: ShopProduct): string {
  if (product.emoji) return product.emoji;
  const cat = CATEGORIES.find((c) => c.slug === product.category);
  return cat?.emoji ?? "🏀";
}

export default function ProductMasonryCard({
  product,
  onProductClick,
}: {
  product: ShopProduct;
  onProductClick: (p: ShopProduct) => void;
}) {
  const clicks = getClicks(product);
  const wasPrice = getWasPrice(product);
  const emoji = getEmoji(product);
  const isHot = product.is_featured && clicks > 100;

  return (
    <div
      className="group product-card"
      onClick={() => onProductClick(product)}
      style={{
        position: "relative",
        overflow: "hidden",
        background: "var(--s1)",
        cursor: "pointer",
        borderRadius: 4,
        border: "1px solid var(--border)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style jsx>{`
        .product-card:hover {
          border-color: var(--red) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
      `}</style>

      {/* Image area — fixed aspect ratio */}
      <div
        style={{
          aspectRatio: "1",
          overflow: "hidden",
          position: "relative",
          background: "var(--s2)",
        }}
      >
        <div
          className="group-hover:scale-[1.04]"
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.3s",
          }}
        >
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
              style={{ objectFit: "cover" }}
              unoptimized
            />
          ) : (
            <span style={{ fontSize: 64 }}>{emoji}</span>
          )}
        </div>

        {/* Source badge */}
        <span
          className={`badge-${product.source}`}
          style={{
            position: "absolute",
            top: 8,
            left: 8,
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

        {/* Hot badge */}
        {isHot && (
          <span
            style={{
              position: "absolute",
              top: 8,
              right: 8,
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
      </div>

      {/* Product info — always visible */}
      <div style={{ padding: "12px 14px 14px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: 13,
            textTransform: "uppercase",
            color: "var(--text)",
            lineHeight: 1.25,
            marginBottom: 8,
            flex: 1,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.title}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span
              className="font-display"
              style={{ fontWeight: 900, fontSize: 18, color: "white" }}
            >
              {product.price != null ? formatPrice(product.price) : "—"}
            </span>
            {wasPrice != null && (
              <span
                style={{
                  fontSize: 11,
                  color: "var(--muted)",
                  textDecoration: "line-through",
                  marginLeft: 6,
                }}
              >
                {formatPrice(wasPrice)}
              </span>
            )}
          </div>
          <span
            className="font-display"
            style={{
              fontWeight: 800,
              fontSize: 10,
              textTransform: "uppercase",
              background: "var(--red)",
              color: "white",
              padding: "4px 10px",
              borderRadius: 2,
              whiteSpace: "nowrap",
              transition: "background 0.15s",
            }}
          >
            View Deal
          </span>
        </div>

        {clicks > 0 && (
          <div
            className="font-display"
            style={{
              fontSize: 10,
              color: "var(--muted)",
              marginTop: 6,
            }}
          >
            {clicks} clicks this week
          </div>
        )}
      </div>
    </div>
  );
}
