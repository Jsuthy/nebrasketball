"use client";

import Image from "next/image";
import { formatPrice } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

export interface SeedProduct {
  id: string;
  title: string;
  price: number;
  was: number | null;
  category: string;
  source: string;
  emoji: string;
  clicks: number;
  description: string;
  slug: string;
  affiliate_url: string;
  is_featured: boolean;
  is_active: boolean;
}

interface DBProduct {
  id: string;
  title: string;
  price: number | null;
  original_price: number | null;
  image_url: string | null;
  source: string;
  slug: string;
  category: string | null;
  is_featured: boolean;
  affiliate_url: string;
  [key: string]: unknown;
}

type ProductProp = SeedProduct | DBProduct;

function isSeedProduct(p: ProductProp): p is SeedProduct {
  return "emoji" in p;
}

export default function MiniProductCard({ product }: { product: ProductProp }) {
  const title = product.title;
  const price = product.price;
  const wasPrice = isSeedProduct(product) ? product.was : (product as DBProduct).original_price;
  const imageUrl = isSeedProduct(product) ? null : (product as DBProduct).image_url;
  const emoji = isSeedProduct(product)
    ? product.emoji
    : (CATEGORIES.find((c) => c.slug === (product as DBProduct).category)?.emoji ?? "🏀");
  const source = product.source;

  return (
    <div
      className="mini-product-card"
      style={{
        background: "var(--s1)",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style jsx>{`
        .mini-product-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border: 2px solid transparent;
          transition: border-color 0.2s;
          pointer-events: none;
        }
        .mini-product-card:hover::after {
          border-color: var(--red);
        }
      `}</style>

      {/* Image area */}
      <div
        style={{
          aspectRatio: "1",
          background: "var(--s2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, 175px"
            style={{ objectFit: "cover" }}
            unoptimized
          />
        ) : (
          <span style={{ fontSize: 52 }}>{emoji}</span>
        )}
        <span
          className={`badge-${source}`}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            fontSize: 9,
            padding: "2px 7px",
            textTransform: "uppercase",
            zIndex: 1,
          }}
        >
          {source}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: "10px 12px 14px" }}>
        <div
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: 14,
            textTransform: "uppercase",
            lineHeight: 1.2,
            marginBottom: 8,
            color: "white",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <span
              className="font-display"
              style={{ fontWeight: 900, fontSize: 18, color: "white" }}
            >
              {price != null ? formatPrice(price) : "—"}
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
              padding: "5px 10px",
              borderRadius: 1,
              whiteSpace: "nowrap",
            }}
          >
            View Deal
          </span>
        </div>
      </div>
    </div>
  );
}
