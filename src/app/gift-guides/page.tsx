import type { Metadata } from "next";
import Link from "next/link";
import { buildMetaDescription } from "@/lib/compliance";
import { getProgrammaticPages } from "@/lib/supabase/queries";
import Disclaimer from "@/components/ui/Disclaimer";

export const metadata: Metadata = {
  title: "Nebraska Cornhuskers Gift Guide — Perfect Gifts for Husker Fans",
  description: buildMetaDescription(
    "Find the perfect gift for any Nebraska Cornhuskers fan. Football, basketball, volleyball and more — all from top retailers."
  ),
};

const FALLBACK_GUIDES = [
  {
    slug: "gift-guides/nebraska-fan-gifts",
    title: "Nebraska Cornhuskers Gift Guide — Best Gifts for Husker Fans",
    description: "The best Nebraska Cornhuskers gifts for every fan.",
  },
  {
    slug: "gift-guides/nebraska-football-gifts",
    title: "Nebraska Football Gift Guide",
    description: "Best Nebraska Cornhuskers football gifts.",
  },
  {
    slug: "gift-guides/nebraska-basketball-gifts",
    title: "Nebraska Basketball Gift Guide",
    description: "Best Nebraska Cornhuskers basketball gifts.",
  },
  {
    slug: "gift-guides/nebraska-volleyball-gifts",
    title: "Nebraska Volleyball Gift Guide",
    description: "Best Nebraska Cornhuskers volleyball gifts.",
  },
  {
    slug: "gift-guides/nebraska-fan-gifts-under-25",
    title: "Nebraska Cornhuskers Gifts Under $25",
    description: "Affordable options for every Husker fan.",
  },
  {
    slug: "gift-guides/nebraska-fan-gifts-under-50",
    title: "Nebraska Cornhuskers Gifts Under $50",
    description: "Great gift ideas for every sport and every fan.",
  },
  {
    slug: "gift-guides/nebraska-cornhuskers-gift-guide",
    title: "Ultimate Nebraska Cornhuskers Gift Guide",
    description: "The ultimate gift guide covering all sports.",
  },
];

export const revalidate = 21600;

export default async function GiftGuidesPage() {
  let guides = FALLBACK_GUIDES;
  try {
    const pages = await getProgrammaticPages({ page_type: "gift-guide" });
    if (pages.length > 0) {
      guides = pages.map((p) => ({
        slug: p.slug,
        title: p.title,
        description: p.description,
      }));
    }
  } catch {
    // Use fallback
  }

  return (
    <>
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
          Gift Guides
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "var(--muted)",
            maxWidth: 480,
            margin: "0 auto",
          }}
        >
          Find the perfect Nebraska Cornhuskers gift for every fan and every budget.
        </p>
        <Disclaimer variant="short" />
      </section>

      <section style={{ padding: "32px 20px", background: "var(--s1)" }}>
        <div className="guide-grid">
          <style>{`
            .guide-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
              gap: 12px;
              max-width: 900px;
              margin: 0 auto;
            }
          `}</style>
          {guides.map((guide) => {
            const guideSlug = guide.slug.replace("gift-guides/", "");
            return (
              <Link
                key={guide.slug}
                href={`/gift-guides/${guideSlug}`}
                style={{
                  background: "var(--s2)",
                  border: "1px solid var(--border)",
                  padding: "20px",
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: 2,
                  transition: "border-color 0.15s",
                }}
              >
                <h2
                  className="font-display"
                  style={{
                    fontWeight: 800,
                    fontSize: 16,
                    textTransform: "uppercase",
                    margin: "0 0 6px",
                    color: "white",
                  }}
                >
                  {guide.title.split(" — ")[0]}
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--muted)",
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {guide.description.split(". ")[0]}.
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      <Disclaimer variant="full" />
    </>
  );
}
