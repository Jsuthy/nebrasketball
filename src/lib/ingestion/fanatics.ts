import * as cheerio from "cheerio";
import type { NormalizedProduct } from "./types";
import {
  categorizeByTitle,
  generateSlug,
  isNebraskaProduct,
  detectSport,
  detectBrand,
} from "./utils";

const FANATICS_URLS = [
  "https://www.fanatics.com/nebraska-cornhuskers/o-3869+t-25523209+z-9-1432958948",
];

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

export async function fetchFanaticsProducts(): Promise<NormalizedProduct[]> {
  const allProducts: NormalizedProduct[] = [];
  const seenIds = new Set<string>();

  for (const pageUrl of FANATICS_URLS) {
    try {
      console.log(`Fetching Fanatics: ${pageUrl}`);

      const res = await fetch(pageUrl, {
        headers: {
          "User-Agent": USER_AGENT,
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });

      if (!res.ok) {
        console.error(`Fanatics fetch failed: ${res.status}`);
        continue;
      }

      const html = await res.text();
      const $ = cheerio.load(html);

      // Fanatics product cards use various selectors — try common patterns
      const selectors = [
        "[data-talos='product-card']",
        ".product-card",
        ".product-image-container",
        "[class*='ProductCard']",
        ".product-card-container",
        "a[href*='/nebraska-cornhuskers/']",
      ];

      let cards = $(selectors[0]);
      cards = cards.slice(0, 0); // empty selection
      for (const sel of selectors) {
        cards = $(sel);
        if (cards.length > 0) {
          console.log(
            `Fanatics: found ${cards.length} elements with selector "${sel}"`
          );
          break;
        }
      }

      if (cards.length === 0) {
        // Try parsing JSON-LD structured data as fallback
        const jsonLd = $('script[type="application/ld+json"]');
        jsonLd.each((_, el) => {
          try {
            const data = JSON.parse($(el).text());
            const items = Array.isArray(data)
              ? data
              : data["@graph"] || [data];
            for (const item of items) {
              if (item["@type"] !== "Product") continue;
              const title = item.name || "";
              if (!title || !isNebraskaProduct(title)) continue;

              const id = item.sku || item.productID || title.slice(0, 20);
              if (seenIds.has(id)) continue;
              seenIds.add(id);

              const offer = Array.isArray(item.offers)
                ? item.offers[0]
                : item.offers;
              const price = parseFloat(offer?.price || "0");
              if (price <= 0) continue;

              allProducts.push({
                external_id: String(id),
                source: "fanatics",
                title: title.slice(0, 200),
                description: item.description || title,
                price,
                original_price: null,
                image_url: item.image?.url || item.image || null,
                affiliate_url: offer?.url || item.url || pageUrl,
                slug: generateSlug(title, String(id)),
                category: categorizeByTitle(title),
                sport: detectSport(title),
                brand: detectBrand(title) || "fanatics",
                tags: ["fanatics"],
                is_featured: false,
                is_active: true,
              });
            }
          } catch {
            // ignore malformed JSON-LD
          }
        });

        if (allProducts.length === 0) {
          // Last resort: parse any product-like links with prices
          $("a[href]").each((_, el) => {
            const $el = $(el);
            const href = $el.attr("href") || "";
            if (!href.includes("/nebraska-cornhuskers/")) return;
            if (href.includes("/o-") && !href.includes("-t-")) return; // category links

            const title =
              $el.attr("title") ||
              $el.find("img").attr("alt") ||
              $el.text().trim();
            if (!title || title.length < 10 || !isNebraskaProduct(title))
              return;

            const id = href.split("/").pop()?.split("?")[0] || "";
            if (!id || seenIds.has(id)) return;
            seenIds.add(id);

            // Try to find price nearby
            const priceText =
              $el.find("[class*='price']").first().text() ||
              $el.parent().find("[class*='price']").first().text() ||
              "";
            const priceMatch = priceText.match(/\$?([\d,]+\.?\d{0,2})/);
            const price = priceMatch
              ? parseFloat(priceMatch[1].replace(",", ""))
              : 0;

            const fullUrl = href.startsWith("http")
              ? href
              : `https://www.fanatics.com${href}`;

            allProducts.push({
              external_id: id,
              source: "fanatics",
              title: title.slice(0, 200),
              description: title,
              price: price > 0 ? price : 29.99, // placeholder if price not found
              original_price: null,
              image_url: $el.find("img").attr("src") || null,
              affiliate_url: fullUrl,
              slug: generateSlug(title, id),
              category: categorizeByTitle(title),
              sport: detectSport(title),
              brand: detectBrand(title) || "fanatics",
              tags: ["fanatics"],
              is_featured: false,
              is_active: true,
            });
          });
        }

        console.log(
          `Fanatics: extracted ${allProducts.length} products via fallback parsing`
        );
        continue;
      }

      // Standard card parsing
      cards.each((_, el) => {
        const $card = $(el);
        const titleEl =
          $card.find("[class*='title']").first() ||
          $card.find("img").first();

        const title =
          titleEl.text().trim() || $card.find("img").attr("alt") || "";
        if (!title || !isNebraskaProduct(title)) return;

        const linkEl = $card.is("a") ? $card : $card.find("a").first();
        const href = linkEl.attr("href") || "";
        const id = href.split("/").pop()?.split("?")[0] || title.slice(0, 20);
        if (seenIds.has(id)) return;
        seenIds.add(id);

        const priceText = $card.find("[class*='price']").first().text();
        const priceMatch = priceText.match(/\$?([\d,]+\.?\d{0,2})/);
        const price = priceMatch
          ? parseFloat(priceMatch[1].replace(",", ""))
          : 0;
        if (price <= 0) return;

        const imgUrl =
          $card.find("img").attr("src") ||
          $card.find("img").attr("data-src") ||
          null;

        const fullUrl = href.startsWith("http")
          ? href
          : `https://www.fanatics.com${href}`;

        allProducts.push({
          external_id: String(id),
          source: "fanatics",
          title: title.slice(0, 200),
          description: title,
          price,
          original_price: null,
          image_url: imgUrl,
          affiliate_url: fullUrl,
          slug: generateSlug(title, String(id)),
          category: categorizeByTitle(title),
          sport: detectSport(title),
          brand: detectBrand(title) || "fanatics",
          tags: ["fanatics"],
          is_featured: false,
          is_active: true,
        });
      });

      console.log(
        `Fanatics: ${allProducts.length} products from card parsing`
      );
    } catch (err) {
      console.error("Fanatics scrape error:", err);
    }
  }

  return allProducts;
}
