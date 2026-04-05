import type { Metadata } from "next";
import Link from "next/link";
import { SPORTS, SITE_URL } from "@/lib/constants";
import { buildMetaDescription } from "@/lib/compliance";
import { getFeaturedProducts, getSports } from "@/lib/supabase/queries";
import seedProducts from "@/lib/seed-products.json";
import MiniProductCard from "@/components/products/MiniProductCard";
import Disclaimer from "@/components/ui/Disclaimer";

export const metadata: Metadata = {
  title: "Nebraska Cornhuskers Gear for Every Sport — Independent Fan Aggregator",
  description: buildMetaDescription(
    "Shop Nebraska Cornhuskers gear for football, basketball, volleyball, wrestling and more. All products link to Amazon, eBay, Etsy and Fanatics."
  ),
};

export const revalidate = 21600;

export default async function GearPage() {
  let sports = SPORTS.map((s) => ({ ...s, productCount: 0 }));
  try {
    const dbSports = await getSports();
    if (dbSports.length > 0) {
      sports = SPORTS.map((s) => {
        const db = dbSports.find((d) => d.slug === s.slug);
        return { ...s, productCount: db ? 0 : 0 };
      });
    }
  } catch {
    // Supabase unavailable
  }

  let featuredProducts: unknown[] = [];
  try {
    featuredProducts = await getFeaturedProducts(12);
  } catch {
    // Supabase unavailable
  }
  if (featuredProducts.length === 0) {
    featuredProducts = seedProducts.filter((p) => p.is_featured).slice(0, 12);
  }

  return (
    <>
      {/* Hero section */}
      <section
        style={{
          padding: "48px 20px 36px",
          textAlign: "center",
          background:
            "radial-gradient(ellipse 80% 55% at 50% 40%, rgba(209,31,58,0.10) 0%, transparent 70%)",
        }}
      >
        <h1
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: "clamp(32px, 6vw, 56px)",
            textTransform: "uppercase",
            lineHeight: 0.9,
            margin: "0 0 14px",
          }}
        >
          Nebraska Cornhuskers Gear — All Sports
        </h1>
        <p
          className="font-display"
          style={{
            fontWeight: 400,
            fontSize: "clamp(13px, 2.2vw, 16px)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: 12,
          }}
        >
          Your independent source for fan gear across every Husker sport
        </p>
        <Disclaimer variant="short" />
      </section>

      {/* Sport cards grid */}
      <section style={{ background: "var(--black)", padding: "32px 20px" }}>
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
          Browse by Sport
        </span>
        <h2
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 48px)",
            textTransform: "uppercase",
            lineHeight: 0.9,
            margin: "0 0 18px",
          }}
        >
          Choose Your Sport
        </h2>

        <div className="sport-grid">
          <style>{`
            .sport-grid {
              display: grid;
              grid-template-columns: repeat(4, 1fr);
              gap: 2px;
            }
            @media (max-width: 640px) {
              .sport-grid {
                grid-template-columns: repeat(2, 1fr);
              }
            }
            .sport-card:hover .sport-emoji {
              transform: scale(1.08);
            }
          `}</style>
          {sports.map((sport) => (
            <Link
              key={sport.slug}
              href={`/gear/${sport.slug}`}
              className="sport-card"
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
                className="sport-emoji"
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
                {sport.emoji}
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
                    fontSize: 20,
                    textTransform: "uppercase",
                    color: "white",
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  {sport.name.replace("Nebraska ", "")}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured products section */}
      <section style={{ background: "var(--s1)", padding: "40px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: 18,
          }}
        >
          <div>
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
              All Sports
            </span>
            <h2
              className="font-display"
              style={{
                fontWeight: 900,
                fontSize: "clamp(28px, 5vw, 48px)",
                textTransform: "uppercase",
                lineHeight: 0.9,
                margin: 0,
              }}
            >
              Featured Gear
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-display"
            style={{
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--red)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Browse All →
          </Link>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
            gap: 2,
          }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(featuredProducts as any[]).map((product) => (
            <MiniProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <Disclaimer variant="full" />
    </>
  );
}
