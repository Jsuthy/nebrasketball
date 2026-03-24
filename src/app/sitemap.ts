import type { MetadataRoute } from "next";
import { CATEGORIES, SITE_URL } from "@/lib/constants";
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

  const [productsResult, newsResult] = await Promise.allSettled([
    (async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("products")
        .select("slug")
        .eq("is_active", true)
        .limit(1000);
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

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/category`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/affiliate-disclosure`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${SITE_URL}/product/${slug}`,
    changeFrequency: "daily" as const,
    priority: 0.6,
  }));

  const newsPages: MetadataRoute.Sitemap = newsSlugs.map((slug) => ({
    url: `${SITE_URL}/news/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages, ...newsPages];
}
