import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SPORTS, CATEGORIES, PRICE_RANGES, SITE_URL } from "@/lib/constants";
import { buildMetaDescription } from "@/lib/compliance";
import { getProductsBySport, getProgrammaticPageBySlug } from "@/lib/supabase/queries";
import seedProducts from "@/lib/seed-products.json";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import CategoryShopClient from "@/app/category/[slug]/CategoryShopClient";
import Disclaimer from "@/components/ui/Disclaimer";

export function generateStaticParams() {
  return SPORTS.map((s) => ({ sport: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string }>;
}): Promise<Metadata> {
  const { sport: sportSlug } = await params;
  const sport = SPORTS.find((s) => s.slug === sportSlug);
  if (!sport) return {};

  let title: string = sport.metaTitle;
  let description: string = buildMetaDescription(sport.metaDescription);

  try {
    const page = await getProgrammaticPageBySlug(`gear/${sportSlug}`);
    if (page) {
      title = page.title;
      description = page.description;
    }
  } catch {
    // Use defaults
  }

  return {
    title,
    description,
    openGraph: { title, description },
  };
}

export const revalidate = 21600;

export default async function SportPage({
  params,
}: {
  params: Promise<{ sport: string }>;
}) {
  const { sport: sportSlug } = await params;
  const sport = SPORTS.find((s) => s.slug === sportSlug);
  if (!sport) notFound();

  let products: unknown[] = [];
  try {
    products = await getProductsBySport(sportSlug);
  } catch {
    // Supabase unavailable
  }
  if (products.length === 0) {
    products = seedProducts;
  }

  const categories = CATEGORIES.filter((c) => c.slug !== "accessories");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${sport.name} — Nebraska Cornhuskers Gear`,
    itemListElement: (products as Array<{ title: string; slug: string }>)
      .slice(0, 10)
      .map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: `${SITE_URL}/product/${p.slug}`,
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Gear", href: "/gear" },
          { label: sport.name },
        ]}
      />

      {/* Sport hero */}
      <div style={{ padding: "40px 20px 32px", background: "var(--s1)" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 8,
          }}
        >
          <span style={{ fontSize: 64 }}>{sport.emoji}</span>
          <h1
            className="font-display"
            style={{
              fontWeight: 900,
              fontSize: "clamp(36px, 6vw, 60px)",
              textTransform: "uppercase",
              lineHeight: 1,
              margin: 0,
            }}
          >
            {sport.name}
          </h1>
        </div>
        <p
          style={{
            fontSize: 14,
            color: "var(--muted)",
            marginTop: 8,
            marginBottom: 12,
            maxWidth: 560,
          }}
        >
          {sport.description}
        </p>
        <span
          className="font-display"
          style={{
            fontWeight: 700,
            fontSize: 12,
            textTransform: "uppercase",
            background: "var(--s2)",
            border: "1px solid var(--border)",
            padding: "4px 12px",
            borderRadius: 2,
            color: "var(--muted)",
          }}
        >
          {products.length} items
        </span>
        <Disclaimer variant="short" />
      </div>

      {/* Category grid for this sport */}
      <section style={{ background: "var(--black)", padding: "24px 20px" }}>
        <h2
          className="font-display"
          style={{
            fontWeight: 800,
            fontSize: 18,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Shop by Type
        </h2>
        <div className="cat-grid-sport">
          <style>{`
            .cat-grid-sport {
              display: grid;
              grid-template-columns: repeat(6, 1fr);
              gap: 2px;
            }
            @media (max-width: 640px) {
              .cat-grid-sport {
                grid-template-columns: repeat(3, 1fr);
              }
            }
            .cat-card-sport:hover .cat-emoji-sport {
              transform: scale(1.08);
            }
          `}</style>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/gear/${sportSlug}/${cat.slug}`}
              className="cat-card-sport"
              style={{
                aspectRatio: "1/1",
                background: "var(--s2)",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span
                className="cat-emoji-sport"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
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
                    "linear-gradient(0deg, rgba(0,0,0,0.85) 0%, transparent 55%)",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  padding: "10px 12px",
                  width: "100%",
                  alignSelf: "flex-end",
                }}
              >
                <span
                  className="font-display"
                  style={{
                    fontWeight: 900,
                    fontSize: 14,
                    textTransform: "uppercase",
                    color: "white",
                    lineHeight: 1,
                    display: "block",
                  }}
                >
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Product masonry */}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CategoryShopClient
        initialProducts={products as any[]}
        categorySlug=""
      />

      {/* Price range section */}
      <section style={{ background: "var(--black)", padding: "32px 20px" }}>
        <h2
          className="font-display"
          style={{
            fontWeight: 800,
            fontSize: 18,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          Shop by Budget
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
          className="price-grid"
        >
          <style>{`
            @media (max-width: 640px) {
              .price-grid {
                grid-template-columns: repeat(2, 1fr) !important;
              }
            }
          `}</style>
          {PRICE_RANGES.map((range) => (
            <Link
              key={range.slug}
              href={`/gear/${sportSlug}/${range.slug}`}
              style={{
                background: "var(--s2)",
                border: "1px solid var(--border)",
                padding: "16px",
                textDecoration: "none",
                color: "white",
                textAlign: "center",
                borderRadius: 2,
                transition: "border-color 0.15s",
              }}
            >
              <span
                className="font-display"
                style={{
                  fontWeight: 900,
                  fontSize: 18,
                  textTransform: "uppercase",
                  display: "block",
                }}
              >
                {range.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Disclaimer variant="full" />
    </>
  );
}
