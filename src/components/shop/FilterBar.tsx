"use client";

import { CATEGORIES, SOURCES } from "@/lib/constants";

const CATEGORY_OPTIONS = [
  { slug: "all", name: "All" },
  ...CATEGORIES.filter((c) => c.slug !== "accessories"),
];

interface FilterBarProps {
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  activeSources: Set<string>;
  setActiveSources: (sources: Set<string>) => void;
  sort: string;
  setSort: (sort: string) => void;
  zoomCols: number;
  setZoomCols: (cols: number) => void;
}

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

export default function FilterBar({
  activeCategory,
  setActiveCategory,
  activeSources,
  setActiveSources,
  sort,
  setSort,
  zoomCols,
  setZoomCols,
}: FilterBarProps) {
  function toggleSource(slug: string) {
    const next = new Set(activeSources);
    if (next.has(slug)) {
      if (next.size <= 1) return; // never allow all deselected
      next.delete(slug);
    } else {
      next.add(slug);
    }
    setActiveSources(next);
  }

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 8,
        alignItems: "center",
        padding: "10px 0",
      }}
    >
      {/* Category pills */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {CATEGORY_OPTIONS.map((cat) => {
          const active = activeCategory === cat.slug;
          return (
            <button
              key={cat.slug}
              data-cat={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              style={{
                ...pillBase,
                ...(active
                  ? {
                      background: "var(--red)",
                      color: "white",
                      borderColor: "var(--red)",
                    }
                  : {}),
              }}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 1,
          height: 22,
          background: "var(--border)",
          margin: "0 4px",
        }}
      />

      {/* Source pills */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
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
      </div>

      {/* Divider */}
      <div
        style={{
          width: 1,
          height: 22,
          background: "var(--border)",
          margin: "0 4px",
        }}
      />

      {/* Sort dropdown */}
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

      {/* Zoom slider — hidden on mobile */}
      <div className="zoom-slider" style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}>
        <span style={{ fontSize: 16, color: "var(--muted)", cursor: "pointer" }}>⊟</span>
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
        <span style={{ fontSize: 16, color: "var(--muted)", cursor: "pointer" }}>⊞</span>
      </div>

      <style>{`
        @media (max-width: 680px) {
          .zoom-slider { display: none !important; }
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
  );
}
