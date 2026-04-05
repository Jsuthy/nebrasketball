"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SOURCES } from "@/lib/constants";
import SearchBar from "@/components/shop/SearchBar";
import FilterBar from "@/components/shop/FilterBar";
import MasonryGrid from "@/components/products/MasonryGrid";
import ProductModal from "@/components/products/ProductModal";
import type { ShopProduct } from "@/components/products/ProductMasonryCard";

const ALL_SOURCE_SLUGS = SOURCES.map((s) => s.slug);

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("cat") || "all"
  );
  const [activeSources, setActiveSources] = useState<Set<string>>(() => {
    const srcParam = searchParams.get("src");
    if (srcParam) return new Set(srcParam.split(",").filter(Boolean));
    return new Set(ALL_SOURCE_SLUGS);
  });
  const [sort, setSort] = useState(
    searchParams.get("sort") || "popular"
  );
  const [zoomCols, setZoomCols] = useState(4);
  const [selectedProduct, setSelectedProduct] = useState<ShopProduct | null>(
    null
  );

  // Fetch products once on mount
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  // Sync state → URL
  const syncUrl = useCallback(
    (q: string, cat: string, srcs: Set<string>, s: string) => {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (cat && cat !== "all") params.set("cat", cat);
      const srcStr = Array.from(srcs).sort().join(",");
      if (srcStr !== ALL_SOURCE_SLUGS.sort().join(",")) {
        params.set("src", srcStr);
      }
      if (s && s !== "popular") params.set("sort", s);
      const qs = params.toString();
      router.replace(`/shop${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router]
  );

  function handleQueryChange(q: string) {
    setQuery(q);
    syncUrl(q, activeCategory, activeSources, sort);
  }

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat);
    syncUrl(query, cat, activeSources, sort);
  }

  function handleSourcesChange(srcs: Set<string>) {
    setActiveSources(srcs);
    syncUrl(query, activeCategory, srcs, sort);
  }

  function handleSortChange(s: string) {
    setSort(s);
    syncUrl(query, activeCategory, activeSources, s);
  }

  // Client-side filter + sort
  const filtered = products.filter((p) => {
    if (activeCategory !== "all" && p.category !== activeCategory) return false;
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
          onChange={handleQueryChange}
          onClear={() => handleQueryChange("")}
        />
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={handleCategoryChange}
          activeSources={activeSources}
          setActiveSources={handleSourcesChange}
          sort={sort}
          setSort={handleSortChange}
          zoomCols={zoomCols}
          setZoomCols={setZoomCols}
        />
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
        results for{" "}
        {query ? `"${query}"` : "Nebraska basketball gear"}
      </div>

      {/* Content */}
      {loading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${zoomCols}, 1fr)`,
            gap: 16,
            padding: 16,
          }}
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "var(--s1)",
                borderRadius: 4,
                border: "1px solid var(--border)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  aspectRatio: "1",
                  background: "var(--s2)",
                  animation: "pulse 1.5s infinite",
                }}
              />
              <div style={{ padding: "12px 14px 14px" }}>
                <div
                  style={{
                    height: 14,
                    width: "80%",
                    background: "var(--s2)",
                    borderRadius: 2,
                    marginBottom: 8,
                    animation: "pulse 1.5s infinite",
                  }}
                />
                <div
                  style={{
                    height: 20,
                    width: "40%",
                    background: "var(--s2)",
                    borderRadius: 2,
                    animation: "pulse 1.5s infinite",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
          }}
        >
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
          allProducts={products}
          onClose={() => setSelectedProduct(null)}
          onProductClick={setSelectedProduct}
        />
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 20, textAlign: "center", color: "var(--muted)" }}>
          Loading...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
