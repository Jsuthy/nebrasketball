import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import { getAllGames } from "@/lib/schedule/games";

const FALLBACK_NEWS_SLUGS = [
  "nebraska-basketball-sweet-16-2026",
  "nebraska-first-ncaa-tournament-win",
  "nebraska-basketball-4-seed-2026-tournament",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let newsSlugs: string[] = [];

  const newsResult = await Promise.allSettled([
    (async () => {
      const supabase = await createClient();
      const { data } = await supabase
        .from("news_posts")
        .select("slug")
        .eq("is_published", true);
      return (data ?? []).map((p) => p.slug);
    })(),
  ]);

  if (newsResult[0].status === "fulfilled" && newsResult[0].value.length > 0) {
    newsSlugs = newsResult[0].value;
  } else {
    newsSlugs = FALLBACK_NEWS_SLUGS;
  }

  // Live, indexable surfaces only. Retired commerce/merch/gear routes return
  // 410 + noindex via src/proxy.ts and must not re-enter this sitemap.
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${SITE_URL}/basketball`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${SITE_URL}/how-to-watch`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/scores`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${SITE_URL}/volleyball`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    { url: `${SITE_URL}/football`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    { url: `${SITE_URL}/volleyball/attendance`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/volleyball/roster`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/legal`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const newsPages: MetadataRoute.Sitemap = newsSlugs.map((slug) => ({
    url: `${SITE_URL}/news/${slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const howToWatchPages: MetadataRoute.Sitemap = getAllGames().map((g) => ({
    url: `${SITE_URL}/how-to-watch/${g.slug}`,
    changeFrequency: "daily" as const,
    priority: g.sportSlug === "basketball" ? 0.85 : 0.75,
  }));

  return [...staticPages, ...newsPages, ...howToWatchPages];
}
