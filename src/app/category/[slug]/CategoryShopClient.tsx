"use client";

import { useState } from "react";
import { CATEGORIES, SOURCES } from "@/lib/constants";
import SearchBar from "@/components/shop/SearchBar";
import MasonryGrid from "@/components/products/MasonryGrid";
import ProductModal from "@/components/products/ProductModal";
import type { ShopProduct } from "@/components/products/ProductMasonryCard";

const ALL_SOURCE_SLUGS = SOURCES.map((s) => s.slug);

const pillBase: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 700,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  padding: "5px 11px",
  borderRadius: 2,
  cursor: "pointer",
  transition: "all 0.12s",
  border: "1px solid var(--border)",
  background: "transparent",
  color: "var(--muted)",
  whiteSpace: "nowrap",
};

interface Props {
  initialProducts: ShopProduct[];
  categorySlug: string;
}

export default function CategoryShopClient({
  initialProducts,
  categorySlug,
}: Props) {
  const [query, setQuery] = useState("");
  const [activeSources, setActiveSources] = useState<Set<string>>(
    new Set(ALL_SOURCE_SLUGS)
  );
  const [sort, setSort] = useState("popular");
  const [zoomCols, setZoomCols] = useState(4);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(
    null
  );

  function toggleSource(slug: string) {
    const next = new Set(activeSources);
    if (next.has(slug)) {
      if (next.size <= 1) return;
      next.delete(slug);
    } else {
      next.add(slug);
    }
    setActiveSources(next);
  }

  const otherCategories = CATEGORIES.filter(
    (c) => c.slug !== categorySlug && c.slug !== "accessories"
  );

  const filtered = initialProducts.filter((p) => {
    if (!activeSources.has(p.source)) return false;
    if (query) {
      const q = query.toLowerCase();
      if (!p.title.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    switch (sort) {
      case "popular":
        return (
          ((b.click_count ?? b.clicks ?? 0) as number) -
          ((a.click_count ?? a.clicks ?? 0) as number)
        );
      case "price_asc":
        return (a.price ?? 9999) - (b.price ?? 9999);
      case "price_desc":
        return (b.price ?? 0) - (a.price ?? 0);
      case "newest":
      default:
        return 0;
    }
  });

  return (
    <div>
      {/* Sticky header */}
      <div
        style={{
          position: "sticky",
          top: 56,
          zIndex: 40,
          background: "rgba(8,8,8,0.97)",
          borderBottom: "1px solid var(--border)",
          backdropFilter: "blur(14px)",
          WebkitBackdropFilter: "blur(14px)",
          padding: "10px 16px 0",
        }}
      >
        <SearchBar
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
        />
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            alignItems: "center",
            padding: "10px 0",
          }}
        >
          {/* Locked current category pill */}
          <button
            style={{
              ...pillBase,
              background: "var(--red)",
              color: "white",
              borderColor: "var(--red)",
              cursor: "default",
            }}
          >
            {CATEGORIES.find((c) => c.slug === categorySlug)?.name ??
              categorySlug}
          </button>

          {/* Also browse */}
          {otherCategories.map((cat) => (
            <a
              key={cat.slug}
              href={`/category/${cat.slug}`}
              style={{
                ...pillBase,
                textDecoration: "none",
              }}
            >
              {cat.name}
            </a>
          ))}

          <div
            style={{
              width: 1,
              height: 22,
              background: "var(--border)",
              margin: "0 4px",
            }}
          />

          {/* Source pills */}
          {SOURCES.map((src) => {
            const active = activeSources.has(src.slug);
            return (
              <button
                key={src.slug}
                onClick={() => toggleSource(src.slug)}
                style={{
                  ...pillBase,
                  ...(active
                    ? {
                        background: src.color,
                        borderColor: src.color,
                        color: src.textColor,
                      }
                    : {}),
                }}
              >
                {src.name}
              </button>
            );
          })}

          <div
            style={{
              width: 1,
              height: 22,
              background: "var(--border)",
              margin: "0 4px",
            }}
          />

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: 11,
              textTransform: "uppercase",
              background: "var(--s2)",
              border: "1px solid var(--border)",
              color: "var(--text)",
              padding: "5px 8px",
              cursor: "pointer",
              outline: "none",
              borderRadius: 2,
            }}
          >
            <option value="popular">Most Popular</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="newest">Newest</option>
          </select>

          {/* Zoom slider */}
          <div
            className="zoom-slider-cat"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginLeft: "auto",
            }}
          >
            <span
              style={{ fontSize: 16, color: "var(--muted)", cursor: "pointer" }}
            >
              ⊟
            </span>
            <input
              type="range"
              min={2}
              max={6}
              step={1}
              value={zoomCols}
              onChange={(e) => setZoomCols(Number(e.target.value))}
              className="zoom-range"
              style={{ width: 80, cursor: "pointer" }}
            />
            <span
              style={{ fontSize: 16, color: "var(--muted)", cursor: "pointer" }}
            >
              ⊞
            </span>
          </div>

          <style>{`
            @media (max-width: 680px) {
              .zoom-slider-cat { display: none !important; }
            }
            .zoom-range {
              -webkit-appearance: none;
              appearance: none;
              height: 3px;
              background: var(--s3);
              outline: none;
              border-radius: 2px;
            }
            .zoom-range::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: var(--red);
              cursor: pointer;
            }
            .zoom-range::-moz-range-thumb {
              width: 14px;
              height: 14px;
              border-radius: 50%;
              background: var(--red);
              cursor: pointer;
              border: none;
            }
          `}</style>
        </div>
      </div>

      {/* Result meta bar */}
      <div
        className="font-display"
        style={{
          padding: "6px 16px",
          fontWeight: 600,
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "var(--muted)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <strong style={{ color: "var(--text)" }}>{sorted.length}</strong>{" "}
        results
        {query ? ` for "${query}"` : ""}
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h3
            className="font-display"
            style={{
              fontWeight: 900,
              fontSize: 28,
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            No results found
          </h3>
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Try a different search or adjust your filters.
          </p>
        </div>
      ) : (
        <MasonryGrid
          products={sorted}
          onProductClick={setSelectedProduct}
          cols={zoomCols}
        />
      )}

      {/* Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          allProducts={initialProducts}
          onClose={() => setSelectedProduct(null)}
          onProductClick={setSelectedProduct}
        />
      )}
    </div>
  );
}
