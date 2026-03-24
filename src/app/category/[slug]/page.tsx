import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, SITE_URL } from "@/lib/constants";
import { getProductsByCategory } from "@/lib/supabase/queries";
import seedProducts from "@/lib/seed-products.json";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import CategoryShopClient from "./CategoryShopClient";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};
  return {
    title: cat.metaTitle,
    description: cat.metaDescription,
    openGraph: {
      title: cat.metaTitle,
      description: cat.metaDescription,
    },
  };
}

export default async function CategorySlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  let products: unknown[] = [];
  try {
    products = await getProductsByCategory(slug);
  } catch {
    // Supabase unavailable
  }
  if (products.length === 0) {
    products = seedProducts.filter((p) => p.category === slug);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.name} — Nebraska Basketball Gear`,
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
          { label: "Shop", href: "/shop" },
          { label: category.name },
        ]}
      />

      {/* Category hero */}
      <div style={{ padding: "40px 20px 32px", background: "var(--s1)" }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}
        >
          <span style={{ fontSize: 48 }}>{category.emoji}</span>
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
            {category.name}
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
          {category.description}
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
      </div>

      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <CategoryShopClient
        initialProducts={products as any[]}
        categorySlug={slug}
      />
    </>
  );
}
