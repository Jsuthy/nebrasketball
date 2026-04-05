import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SPORTS, CATEGORIES, PRICE_RANGES, BRANDS, SITE_URL } from "@/lib/constants";
import {
  getProductsBySportAndCategory,
  getProductsBySportAndPriceRange,
  getProgrammaticPageBySlug,
  getProgrammaticPages,
} from "@/lib/supabase/queries";
import seedProducts from "@/lib/seed-products.json";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import CategoryShopClient from "@/app/category/[slug]/CategoryShopClient";
import Disclaimer from "@/components/ui/Disclaimer";

export async function generateStaticParams() {
  // Try to read from programmatic_pages
  let dbParams: { sport: string; filter: string }[] = [];
  try {
    const pages = await getProgrammaticPages();
    dbParams = pages
      .filter((p) =>
        ["sport-category", "sport-price", "sport-brand"].includes(p.page_type)
      )
      .map((p) => {
        const parts = p.slug.split("/");
        return { sport: parts[1], filter: parts[2] };
      })
      .filter((p) => p.sport && p.filter);
  } catch {
    // Supabase unavailable — fall back to constants
  }

  if (dbParams.length > 0) return dbParams;

  // Fall back: all sport x CATEGORIES combinations
  const params: { sport: string; filter: string }[] = [];
  for (const sport of SPORTS) {
    for (const cat of CATEGORIES) {
      params.push({ sport: sport.slug, filter: cat.slug });
    }
    for (const range of PRICE_RANGES) {
      params.push({ sport: sport.slug, filter: range.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ sport: string; filter: string }>;
}): Promise<Metadata> {
  const { sport: sportSlug, filter } = await params;
  const sport = SPORTS.find((s) => s.slug === sportSlug);
  if (!sport) return {};

  let title: string = `Nebraska Cornhuskers ${sport.name.replace("Nebraska ", "")} Gear`;
  let description: string = sport.metaDescription;

  try {
    const page = await getProgrammaticPageBySlug(`gear/${sportSlug}/${filter}`);
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

export default async function SportFilterPage({
  params,
}: {
  params: Promise<{ sport: string; filter: string }>;
}) {
  const { sport: sportSlug, filter } = await params;
  const sport = SPORTS.find((s) => s.slug === sportSlug);
  if (!sport) notFound();

  const isCategory = CATEGORIES.some((c) => c.slug === filter);
  const isPriceRange = PRICE_RANGES.some((p) => p.slug === filter);
  const isBrand = BRANDS.some((b) => b.slug === filter);

  if (!isCategory && !isPriceRange && !isBrand) notFound();

  let filterLabel = filter;
  if (isCategory) {
    filterLabel = CATEGORIES.find((c) => c.slug === filter)?.name || filter;
  } else if (isPriceRange) {
    filterLabel = PRICE_RANGES.find((p) => p.slug === filter)?.label || filter;
  } else if (isBrand) {
    filterLabel = BRANDS.find((b) => b.slug === filter)?.name || filter;
  }

  let products: unknown[] = [];
  try {
    if (isCategory) {
      products = await getProductsBySportAndCategory(sportSlug, filter);
    } else if (isPriceRange) {
      products = await getProductsBySportAndPriceRange(sportSlug, filter);
    }
  } catch {
    // Supabase unavailable
  }
  if (products.length === 0) {
    products = seedProducts;
  }

  let pageTitle = `${sport.name} ${filterLabel}`;
  try {
    const page = await getProgrammaticPageBySlug(`gear/${sportSlug}/${filter}`);
    if (page) pageTitle = page.title;
  } catch {
    // Use default
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: pageTitle,
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
          { label: sport.name, href: `/gear/${sportSlug}` },
          { label: filterLabel },
        ]}
      />

      {/* Hero */}
      <div style={{ padding: "40px 20px 20px", background: "var(--s1)" }}>
        <h1
          className="font-display"
          style={{
            fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 48px)",
            textTransform: "uppercase",
            lineHeight: 1,
            margin: "0 0 8px",
          }}
        >
          {pageTitle}
        </h1>
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

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CategoryShopClient
        initialProducts={products as any[]}
        categorySlug={isCategory ? filter : ""}
      />

      <Disclaimer variant="full" />
    </>
  );
}
