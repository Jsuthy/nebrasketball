import { createClient } from "@supabase/supabase-js";
import { fetchEbayProducts } from "./ebay";
import { fetchEtsyProducts } from "./etsy";
import { fetchAmazonProducts } from "./amazon";
import { fetchFanaticsProducts } from "./fanatics";
import { generateProgrammaticPages } from "@/lib/programmatic/generate-pages";
import type { NormalizedProduct, IngestionResult } from "./types";
import type { SportSlug } from "@/lib/supabase/types";

export type { NormalizedProduct, IngestionResult };

const SPORT_SLUGS: SportSlug[] = [
  "football", "basketball", "volleyball", "wrestling",
  "baseball", "softball", "track", "general",
];

export async function runIngestion(): Promise<IngestionResult> {
  const bySport = Object.fromEntries(
    SPORT_SLUGS.map((s) => [s, 0])
  ) as Record<SportSlug, number>;

  const result: IngestionResult = {
    added: 0,
    updated: 0,
    failed: 0,
    errors: [],
    sources: { ebay: 0, etsy: 0, amazon: 0, fanatics: 0, manual: 0 },
    bySport,
  };

  const [ebayResult, etsyResult, amazonResult, fanaticsResult] = await Promise.allSettled([
    fetchEbayProducts(),
    fetchEtsyProducts(),
    fetchAmazonProducts(),
    fetchFanaticsProducts(),
  ]);

  const allProducts: NormalizedProduct[] = [];

  if (ebayResult.status === "fulfilled") {
    result.sources.ebay = ebayResult.value.length;
    allProducts.push(...ebayResult.value);
  } else {
    result.errors.push(`eBay fetch failed: ${ebayResult.reason}`);
  }

  if (etsyResult.status === "fulfilled") {
    result.sources.etsy = etsyResult.value.length;
    allProducts.push(...etsyResult.value);
  } else {
    result.errors.push(`Etsy fetch failed: ${etsyResult.reason}`);
  }

  if (amazonResult.status === "fulfilled") {
    result.sources.amazon = amazonResult.value.length;
    allProducts.push(...amazonResult.value);
  } else {
    result.errors.push(`Amazon fetch failed: ${amazonResult.reason}`);
  }

  if (fanaticsResult.status === "fulfilled") {
    result.sources.fanatics = fanaticsResult.value.length;
    allProducts.push(...fanaticsResult.value);
  } else {
    result.errors.push(`Fanatics fetch failed: ${fanaticsResult.reason}`);
  }

  // Deduplicate by (external_id + source)
  const seen = new Set<string>();
  const unique = allProducts.filter((p) => {
    const key = `${p.source}:${p.external_id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Count by sport
  for (const p of unique) {
    if (p.sport in result.bySport) {
      result.bySport[p.sport]++;
    }
  }

  if (unique.length === 0) {
    result.errors.push(
      "No products fetched from any source — API keys may not be configured"
    );
    return result;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Upsert in batches of 50
  for (let i = 0; i < unique.length; i += 50) {
    const batch = unique.slice(i, i + 50).map((p) => ({
      external_id: p.external_id,
      source: p.source,
      title: p.title,
      description: p.description,
      price: p.price,
      original_price: p.original_price,
      image_url: p.image_url,
      affiliate_url: p.affiliate_url,
      slug: p.slug,
      category: p.category,
      sport: p.sport,
      brand: p.brand,
      tags: p.tags,
      is_featured: p.is_featured,
      is_active: p.is_active,
    }));

    try {
      const { data, error } = await supabase
        .from("products")
        .upsert(batch, {
          onConflict: "external_id,source",
          ignoreDuplicates: false,
        })
        .select("id");

      if (error) {
        result.failed += batch.length;
        result.errors.push(`Batch upsert error: ${error.message}`);
      } else {
        const count = data?.length ?? batch.length;
        result.added += count;
      }
    } catch (err) {
      result.failed += batch.length;
      result.errors.push(
        `Batch upsert exception: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  const sportCount = Object.values(result.bySport).filter((v) => v > 0).length;
  console.log(
    `Ingestion complete: ${result.added} products across ${sportCount} sports`
  );

  // Generate programmatic pages after ingestion
  try {
    const pageResult = await generateProgrammaticPages();
    console.log(
      `Pages generated: ${pageResult.created} created, ${pageResult.skipped} failed`
    );
  } catch (err) {
    console.error("Page generation failed:", err);
    result.errors.push(
      `Page generation failed: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  return result;
}
