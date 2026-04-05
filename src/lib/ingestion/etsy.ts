import type { NormalizedProduct } from "./types";
import { categorizeByTitle, generateSlug, isNebraskaProduct, detectSport, detectBrand } from "./utils";
import { SPORTS } from "@/lib/constants";

interface EtsyListing {
  listing_id: number;
  title: string;
  description?: string;
  price: { amount: number; divisor: number };
  url: string;
  state: string;
  tags?: string[];
  primary_image?: { url_570xN: string };
  images?: Array<{ url_570xN: string }>;
}

export async function fetchEtsyProducts(): Promise<NormalizedProduct[]> {
  const apiKey = process.env.ETSY_API_KEY;
  if (!apiKey || apiKey === "your_etsy_api_key") return [];

  try {
    // Build queries from all sports
    const queries: { query: string; sportSlug: string }[] = [];
    for (const sport of SPORTS) {
      for (const term of sport.searchTerms) {
        queries.push({ query: term, sportSlug: sport.slug });
      }
    }

    const allItems: NormalizedProduct[] = [];
    const seenIds = new Set<string>();

    for (const { query: q, sportSlug } of queries) {
      try {
        console.log(`Fetching Etsy: ${sportSlug} - ${q}`);

        const url = new URL(
          "https://openapi.etsy.com/v3/application/listings/active"
        );
        url.searchParams.set("keywords", q);
        url.searchParams.set("limit", "50");
        url.searchParams.set("includes", "Images,MainImage");

        const res = await fetch(url.toString(), {
          headers: { "x-api-key": apiKey },
        });

        if (!res.ok) {
          console.error(`Etsy search failed for "${q}": ${res.status}`);
          continue;
        }

        const data = await res.json();
        const listings: EtsyListing[] = data.results || [];

        for (const listing of listings) {
          const id = listing.listing_id.toString();
          if (seenIds.has(id)) continue;
          if (!isNebraskaProduct(listing.title)) continue;

          const price = listing.price.amount / listing.price.divisor;
          if (price <= 4) continue;
          if (listing.state !== "active") continue;

          const imageUrl =
            listing.primary_image?.url_570xN ||
            listing.images?.[0]?.url_570xN ||
            null;
          if (!imageUrl) continue;

          seenIds.add(id);
          allItems.push({
            external_id: id,
            source: "etsy",
            title: listing.title.slice(0, 200),
            description:
              listing.description?.slice(0, 500) || listing.title,
            price,
            original_price: null,
            image_url: imageUrl,
            affiliate_url: listing.url,
            slug: generateSlug(listing.title, id),
            category: categorizeByTitle(listing.title),
            sport: detectSport(listing.title),
            brand: detectBrand(listing.title),
            tags: listing.tags || [],
            is_featured: false,
            is_active: true,
          });
        }

        // Rate limit protection
        await new Promise((r) => setTimeout(r, 250));
      } catch (err) {
        console.error(`Etsy query error for "${q}":`, err);
      }
    }

    return allItems;
  } catch (err) {
    console.error("Etsy ingestion failed:", err);
    return [];
  }
}
