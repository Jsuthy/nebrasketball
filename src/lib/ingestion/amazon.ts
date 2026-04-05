import type { NormalizedProduct } from "./types";
import { categorizeByTitle, generateSlug, isNebraskaProduct, detectSport, detectBrand } from "./utils";
import { SPORTS } from "@/lib/constants";

async function signRequest(params: {
  method: string;
  host: string;
  path: string;
  body: string;
  region: string;
  service: string;
}): Promise<Record<string, string>> {
  const { createHmac, createHash } = await import("crypto");

  const now = new Date();
  const date = now.toISOString().replace(/[:-]|\.\d{3}/g, "").slice(0, 15) + "Z";
  const dateShort = date.slice(0, 8);

  const canonicalHeaders = `content-type:application/json\nhost:${params.host}\nx-amz-date:${date}\n`;
  const signedHeaders = "content-type;host;x-amz-date";
  const payloadHash = createHash("sha256").update(params.body).digest("hex");

  const canonicalRequest = [
    params.method,
    params.path,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const credentialScope = `${dateShort}/${params.region}/${params.service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    date,
    credentialScope,
    createHash("sha256").update(canonicalRequest).digest("hex"),
  ].join("\n");

  const hmac = (key: Buffer | string, data: string) =>
    createHmac("sha256", key).update(data).digest();

  const signingKey = hmac(
    hmac(
      hmac(
        hmac(`AWS4${process.env.AMAZON_SECRET_KEY}`, dateShort),
        params.region
      ),
      params.service
    ),
    "aws4_request"
  );

  const signature = createHmac("sha256", signingKey)
    .update(stringToSign)
    .digest("hex");
  const authorization = `AWS4-HMAC-SHA256 Credential=${process.env.AMAZON_ACCESS_KEY}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    "Content-Type": "application/json",
    "X-Amz-Date": date,
    Authorization: authorization,
  };
}

export async function fetchAmazonProducts(): Promise<NormalizedProduct[]> {
  if (
    !process.env.AMAZON_ACCESS_KEY ||
    process.env.AMAZON_ACCESS_KEY === "pending" ||
    process.env.AMAZON_ACCESS_KEY === "placeholder"
  ) {
    console.log("Amazon PA API: credentials not configured, skipping");
    return [];
  }

  const HOST = "webservices.amazon.com";
  const PATH = "/paapi5/searchitems";
  const REGION = "us-east-1";

  const allProducts: NormalizedProduct[] = [];

  // Search all sports — take first 2 terms per sport
  const queries = SPORTS.flatMap((sport) =>
    sport.searchTerms.slice(0, 2).map((term) => ({
      query: term,
      sportSlug: sport.slug,
    }))
  );

  for (const { query, sportSlug } of queries) {
    try {
      console.log(`Fetching Amazon: ${sportSlug} - ${query}`);

      const body = JSON.stringify({
        Keywords: query,
        SearchIndex: "All",
        PartnerTag: process.env.AMAZON_ASSOCIATE_TAG,
        PartnerType: "Associates",
        Marketplace: "www.amazon.com",
        Resources: [
          "Images.Primary.Large",
          "ItemInfo.Title",
          "Offers.Listings.Price",
          "ItemInfo.Features",
          "DetailPageURL",
        ],
      });

      const headers = await signRequest({
        method: "POST",
        host: HOST,
        path: PATH,
        body,
        region: REGION,
        service: "ProductAdvertisingAPI",
      });

      const response = await fetch(`https://${HOST}${PATH}`, {
        method: "POST",
        headers,
        body,
      });

      if (!response.ok) {
        console.error(`Amazon API error for "${query}": ${response.status}`);
        continue;
      }

      const data = await response.json();
      const items = data.SearchResult?.Items || [];

      const mapped = items
        .filter((item: Record<string, unknown>) => {
          const offers = item.Offers as Record<string, unknown> | undefined;
          const listings = offers?.Listings as Array<Record<string, unknown>> | undefined;
          return listings?.[0] && (listings[0].Price as Record<string, unknown>)?.Amount;
        })
        .map((item: Record<string, unknown>) => {
          const itemInfo = item.ItemInfo as Record<string, unknown>;
          const titleObj = itemInfo?.Title as Record<string, unknown>;
          const title = (titleObj?.DisplayValue as string) || "";
          const featuresObj = itemInfo?.Features as Record<string, unknown>;
          const features = (featuresObj?.DisplayValues as string[]) || [];
          const offers = item.Offers as Record<string, unknown>;
          const listings = offers?.Listings as Array<Record<string, unknown>>;
          const priceObj = listings[0].Price as Record<string, unknown>;
          const images = item.Images as Record<string, unknown>;
          const primary = images?.Primary as Record<string, unknown>;
          const large = primary?.Large as Record<string, unknown>;

          return {
            external_id: item.ASIN as string,
            source: "amazon" as const,
            title,
            description: features.join(" ") || "",
            price: priceObj.Amount as number,
            original_price: null,
            image_url: (large?.URL as string) || null,
            affiliate_url: item.DetailPageURL as string,
            slug: generateSlug(title || (item.ASIN as string), item.ASIN as string),
            category: categorizeByTitle(title),
            sport: detectSport(title),
            brand: detectBrand(title),
            tags: [] as string[],
            is_featured: false,
            is_active: true,
          };
        })
        .filter(
          (p: NormalizedProduct) => isNebraskaProduct(p.title) && p.price > 0
        );

      allProducts.push(...mapped);
      await new Promise((r) => setTimeout(r, 300)); // rate limit
    } catch (error) {
      console.error(`Amazon fetch error for "${query}":`, error);
    }
  }

  // Deduplicate by ASIN
  const seen = new Set<string>();
  return allProducts.filter((p) => {
    if (seen.has(p.external_id)) return false;
    seen.add(p.external_id);
    return true;
  });
}
