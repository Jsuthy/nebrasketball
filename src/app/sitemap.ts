import type { MetadataRoute } from "next";
import { CATEGORIES, SPORTS, SITE_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import seedProducts from "@/lib/seed-products.json";

const FALLBACK_NEWS_SLUGS = [
  "nebraska-basketball-sweet-16-2026",
  "nebraska-first-ncaa-tournament-win",
  "nebraska-basketball-4-seed-2026-tournament",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let productSlugs: string[] = [];
  let newsSlugs: string[] = [];
  let progPages: Array<{ slug: string; page_type: string }> = [];

  const [productsResult, newsResult, pagesResult] = await Promise.allSettled([
    (async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("products")
        .select("slug")
        .eq("is_active", true)
        .limit(10000);
      return (data ?? []).map((p) => p.slug);
    })(),
    (async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("news_posts")
        .select("slug")
        .eq("is_published", true);
      return (data ?? []).map((p) => p.slug);
    })(),
    (async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("programmatic_pages")
        .select("slug, page_type")
        .eq("is_active", true)
        .gte("product_count", 3);
      return (data ?? []) as Array<{ slug: string; page_type: string }>;
    })(),
  ]);

  if (productsResult.status === "fulfilled" && productsResult.value.length > 0) {
    productSlugs = productsResult.value;
  } else {
    productSlugs = seedProducts.map((p) => p.slug);
  }

  if (newsResult.status === "fulfilled" && newsResult.value.length > 0) {
    newsSlugs = newsResult.value;
  } else {
    newsSlugs = FALLBACK_NEWS_SLUGS;
  }

  if (pagesResult.status === "fulfilled") {
    progPages = pagesResult.value;
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/gear`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/gift-guides`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.75 },
    { url: `${SITE_URL}/legal`, changeFrequency: "monthly", priority: 0.3 },
  ];

  // Sport pages
  const sportPages: MetadataRoute.Sitemap = SPORTS.map((s) => ({
    url: `${SITE_URL}/gear/${s.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.85,
  }));

  // Programmatic pages from DB
  const programmaticSitemap: MetadataRoute.Sitemap = progPages.map((p) => {
    let priority = 0.7;
    let changeFrequency: "daily" | "weekly" = "weekly";
    if (p.page_type === "sport-category") {
      priority = 0.75;
      changeFrequency = "daily";
    } else if (p.page_type === "sport-price") {
      priority = 0.65;
    } else if (p.page_type === "gift-guide") {
      priority = 0.7;
    }
    return {
      url: `${SITE_URL}/${p.slug}`,
      changeFrequency,
      priority,
    };
  });

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Product pages
  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${SITE_URL}/product/${slug}`,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  // News pages
  const newsPages: MetadataRoute.Sitemap = newsSlugs.map((slug) => ({
    url: `${SITE_URL}/news/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...sportPages,
    ...programmaticSitemap,
    ...categoryPages,
    ...productPages,
    ...newsPages,
  ];
}
