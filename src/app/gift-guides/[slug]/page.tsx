import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/constants";
import { buildMetaDescription } from "@/lib/compliance";
import {
  getProgrammaticPageBySlug,
  getProgrammaticPages,
  getFeaturedProducts,
  getProductsBySport,
  getProducts,
} from "@/lib/supabase/queries";
import seedProducts from "@/lib/seed-products.json";
import MiniProductCard from "@/components/products/MiniProductCard";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import Disclaimer from "@/components/ui/Disclaimer";
import Link from "next/link";

const GUIDE_CONTENT: Record<string, string> = {
  "nebraska-fan-gifts":
    "Whether they bleed Scarlet and Cream on game day or rock Husker gear year-round, every Nebraska fan deserves a gift that matches their passion. From classic hoodies to vintage-inspired tees, we have curated the best options from Amazon, eBay, Etsy and Fanatics so you can find something special without visiting a dozen stores.",
  "nebraska-football-gifts":
    "Nebraska football is more than a sport — it is a way of life. Help the Husker football fan in your life show their pride with jerseys, hoodies, hats and more. Every product links directly to trusted retailers so you can shop with confidence.",
  "nebraska-basketball-gifts":
    "After the historic 2026 Sweet 16 run, Nebraska basketball gear has never been more popular. Celebrate this unforgettable season with tees, jerseys, and hoodies that capture the magic of March. Every item ships from authorized retailers.",
  "nebraska-volleyball-gifts":
    "Nebraska volleyball is an institution — consistently one of the nation's elite programs. Show your support for the Husker volleyball tradition with fan gear that ranges from match-day tees to cozy hoodies and accessories.",
  "nebraska-fan-gifts-under-25":
    "Great gifts do not have to break the bank. We have rounded up the best Nebraska Cornhuskers fan gifts under $25 — from stickers and pins to t-shirts and hats. Perfect for stocking stuffers, Secret Santa, or just because.",
  "nebraska-fan-gifts-under-50":
    "Looking for a meaningful Husker gift that fits a reasonable budget? These Nebraska Cornhuskers fan gifts under $50 include hoodies, premium tees, hats and more from every sport. All from trusted retailers with easy returns.",
  "nebraska-cornhuskers-gift-guide":
    "The ultimate guide to shopping for any Nebraska Cornhuskers fan. Whether they follow football, basketball, volleyball, wrestling or all of the above, you will find the perfect gift here. We aggregate the best products from Amazon, eBay, Etsy and Fanatics in one place.",
};

export async function generateStaticParams() {
  let slugs: string[] = [];
  try {
    const pages = await getProgrammaticPages({ page_type: "gift-guide" });
    slugs = pages.map((p) => p.slug.replace("gift-guides/", ""));
  } catch {
    // Use fallback
  }

  if (slugs.length === 0) {
    slugs = Object.keys(GUIDE_CONTENT);
  }

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let title = "Nebraska Cornhuskers Gift Guide";
  let description = buildMetaDescription("Find the perfect Nebraska Cornhuskers gift.");

  try {
    const page = await getProgrammaticPageBySlug(`gift-guides/${slug}`);
    if (page) {
      title = page.title;
      description = page.description;
    }
  } catch {
    // Use defaults
  }

  return { title, description, openGraph: { title, description } };
}

export const revalidate = 21600;

export default async function GiftGuidePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let page = null;
  try {
    page = await getProgrammaticPageBySlug(`gift-guides/${slug}`);
  } catch {
    // fallback
  }
  if (!page && !GUIDE_CONTENT[slug]) notFound();

  const title = page?.title || "Nebraska Cornhuskers Gift Guide";
  const description = page?.description || "";
  const content = GUIDE_CONTENT[slug] || description;

  // Fetch products based on guide context
  let products: unknown[] = [];
  try {
    if (slug.includes("football")) {
      products = await getProductsBySport("football");
    } else if (slug.includes("basketball")) {
      products = await getProductsBySport("basketball");
    } else if (slug.includes("volleyball")) {
      products = await getProductsBySport("volleyball");
    } else if (slug.includes("under-25")) {
      products = await getProducts({ sort: "price_asc", limit: 16 });
      products = (products as Array<{ price: number | null }>).filter(
        (p) => p.price !== null && p.price < 25
      );
    } else if (slug.includes("under-50")) {
      products = await getProducts({ sort: "price_asc", limit: 16 });
      products = (products as Array<{ price: number | null }>).filter(
        (p) => p.price !== null && p.price < 50
      );
    } else {
      products = await getFeaturedProducts(16);
    }
  } catch {
    // Supabase unavailable
  }
  if (products.length === 0) {
    products = seedProducts.filter((p) => p.is_featured).slice(0, 16);
  }

  // Related guides
  const allGuideSlugs = Object.keys(GUIDE_CONTENT).filter((s) => s !== slug);
  const relatedSlugs = allGuideSlugs.slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
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
          { label: "Gift Guides", href: "/gift-guides" },
          { label: title.split(" — ")[0] },
        ]}
      />

      <div style={{ padding: "40px 20px 20px", background: "var(--s1)" }}>
        <h1
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 44px)",
            textTransform: "uppercase",
            lineHeight: 0.95,
            margin: "0 0 12px",
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "rgba(255,255,255,0.68)",
            lineHeight: 1.7,
            maxWidth: 600,
          }}
        >
          {content}
        </p>
        <Disclaimer variant="affiliate" />
      </div>

      {/* Product grid */}
      <section style={{ background: "var(--s1)", padding: "0 20px 40px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
            gap: 2,
          }}
        >
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(products as any[]).slice(0, 16).map((product) => (
            <MiniProductCard key={product.id || product.slug} product={product} />
          ))}
        </div>
      </section>

      {/* Related guides */}
      <section style={{ padding: "32px 20px", background: "var(--black)" }}>
        <h2
          className="font-display"
          style={{
            fontWeight: 800,
            fontSize: 18,
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          More Gift Guides
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 10,
          }}
        >
          {relatedSlugs.map((rs) => (
            <Link
              key={rs}
              href={`/gift-guides/${rs}`}
              style={{
                background: "var(--s2)",
                border: "1px solid var(--border)",
                padding: "16px",
                textDecoration: "none",
                color: "white",
                borderRadius: 2,
              }}
            >
              <span
                className="font-display"
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  textTransform: "uppercase",
                }}
              >
                {rs.replace(/-/g, " ")}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Disclaimer variant="full" />
    </>
  );
}
