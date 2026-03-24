import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Shop Nebraska Basketball Gear by Category | Nebrasketball",
  description:
    "Browse Nebraska Cornhuskers basketball gear by type — tees, hoodies, hats, jerseys, women's and youth apparel.",
};

const categories = CATEGORIES.filter((c) => c.slug !== "accessories");

export default function CategoriesPage() {
  return (
    <section style={{ background: "var(--black)", padding: "40px 20px" }}>
      <span
        className="font-display"
        style={{
          fontWeight: 700,
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--red)",
          display: "block",
          marginBottom: 6,
        }}
      >
        Browse by Category
      </span>
      <h1
        className="font-display"
        style={{
          fontWeight: 900,
          fontSize: "clamp(28px, 5vw, 48px)",
          textTransform: "uppercase",
          lineHeight: 0.9,
          margin: "0 0 18px",
        }}
      >
        Shop by Type
      </h1>

      <div className="category-grid">
        <style>{`
          .category-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 2px;
          }
          @media (max-width: 640px) {
            .category-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          .cat-card:hover .cat-emoji {
            transform: scale(1.08);
          }
        `}</style>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/category/${cat.slug}`}
            className="cat-card"
            style={{
              aspectRatio: "4/3",
              background: "var(--s2)",
              position: "relative",
              overflow: "hidden",
              cursor: "pointer",
              display: "flex",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <span
              className="cat-emoji"
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 52,
                transition: "transform 0.3s",
              }}
            >
              {cat.emoji}
            </span>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(0deg, rgba(0,0,0,0.88) 0%, transparent 60%)",
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                padding: "14px 16px",
                width: "100%",
                alignSelf: "flex-end",
              }}
            >
              <span
                className="font-display"
                style={{
                  fontWeight: 900,
                  fontSize: 22,
                  textTransform: "uppercase",
                  color: "white",
                  lineHeight: 1,
                  display: "block",
                }}
              >
                {cat.name}
              </span>
              <span
                className="font-display"
                style={{
                  fontWeight: 600,
                  fontSize: 11,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {cat.count} items
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
