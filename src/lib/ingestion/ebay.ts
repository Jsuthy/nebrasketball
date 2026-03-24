import type { NormalizedProduct } from "./types";
import { categorizeByTitle, generateSlug, isNebraskaProduct } from "./utils";

let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getEbayToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const appId = process.env.EBAY_APP_ID;
  const certId = process.env.EBAY_CERT_ID;
  if (!appId || !certId) throw new Error("eBay credentials not configured");

  const credentials = Buffer.from(`${appId}:${certId}`).toString("base64");
  const res = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope",
  });

  if (!res.ok) throw new Error(`eBay token request failed: ${res.status}`);
  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 60) * 1000;
  return cachedToken!;
}

interface EbayItem {
  itemId: string;
  title: string;
  shortDescription?: string;
  price?: { value: string };
  marketingPrice?: { originalPrice?: { value: string } };
  image?: { imageUrl: string };
  itemWebUrl: string;
  categories?: Array<{ categoryName: string }>;
}

export async function fetchEbayProducts(): Promise<NormalizedProduct[]> {
  const appId = process.env.EBAY_APP_ID;
  if (!appId || appId === "your_ebay_app_id") return [];

  try {
    const token = await getEbayToken();

    const queries = [
      "Nebraska Cornhuskers basketball shirt",
      "Nebraska Huskers basketball hoodie",
      "Nebraska basketball jersey",
      "Nebraska Cornhuskers hat cap basketball",
    ];

    const allItems: NormalizedProduct[] = [];
    const seenIds = new Set<string>();

    for (const q of queries) {
      try {
        const url = new URL(
          "https://api.ebay.com/buy/browse/v1/item_summary/search"
        );
        url.searchParams.set("q", q);
        url.searchParams.set("category_ids", "15687");
        url.searchParams.set("limit", "25");
        url.searchParams.set("filter", "price:[5..300]");

        const res = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${token}`,
            "X-EBAY-C-MARKETPLACE-ID": "EBAY_US",
          },
        });

        if (!res.ok) {
          console.error(`eBay search failed for "${q}": ${res.status}`);
          continue;
        }

        const data = await res.json();
        const items: EbayItem[] = data.itemSummaries || [];

        for (const item of items) {
          if (seenIds.has(item.itemId)) continue;
          if (!isNebraskaProduct(item.title)) continue;

          const price = parseFloat(item.price?.value || "0");
          if (price <= 0) continue;

          seenIds.add(item.itemId);
          const originalPrice =
            parseFloat(
              item.marketingPrice?.originalPrice?.value || "0"
            ) || null;

          allItems.push({
            external_id: item.itemId,
            source: "ebay",
            title: item.title.slice(0, 200),
            description: item.shortDescription || item.title,
            price,
            original_price: originalPrice,
            image_url: item.image?.imageUrl || null,
            affiliate_url: item.itemWebUrl,
            slug: generateSlug(item.title, item.itemId),
            category: categorizeByTitle(item.title),
            tags:
              item.categories?.map((c) => c.categoryName) || [],
            is_featured: false,
            is_active: true,
          });
        }
      } catch (err) {
        console.error(`eBay query error for "${q}":`, err);
      }
    }

    return allItems;
  } catch (err) {
    console.error("eBay ingestion failed:", err);
    return [];
  }
}
