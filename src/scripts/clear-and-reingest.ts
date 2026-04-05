/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Inline the ingestion logic since we can't use Next.js server imports
import { fetchEtsyProducts } from "../lib/ingestion/etsy";
import { fetchEbayProducts } from "../lib/ingestion/ebay";

async function clearAndReingest() {
  console.log("Deleting all existing products...");
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (deleteError) {
    console.error("Delete failed:", deleteError);
    process.exit(1);
  }
  console.log("All products cleared.");

  console.log("\nFetching from eBay...");
  let ebayProducts: Awaited<ReturnType<typeof fetchEbayProducts>> = [];
  try {
    ebayProducts = await fetchEbayProducts();
    console.log(`eBay: ${ebayProducts.length} products`);
  } catch (err) {
    console.error("eBay failed:", err);
  }

  console.log("Fetching from Etsy...");
  let etsyProducts: Awaited<ReturnType<typeof fetchEtsyProducts>> = [];
  try {
    etsyProducts = await fetchEtsyProducts();
    console.log(`Etsy: ${etsyProducts.length} products`);
  } catch (err) {
    console.error("Etsy failed:", err);
  }

  const allProducts = [...ebayProducts, ...etsyProducts];

  if (allProducts.length === 0) {
    console.error("\nNo products fetched from any source. Check your API keys.");
    process.exit(1);
  }

  console.log(`\nUpserting ${allProducts.length} products...`);

  // Batch upsert in groups of 50
  let added = 0;
  for (let i = 0; i < allProducts.length; i += 50) {
    const batch = allProducts.slice(i, i + 50).map((p) => ({
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
      tags: p.tags,
      is_featured: p.is_featured,
      is_active: p.is_active,
      sport: p.sport,
      brand: p.brand,
    }));

    const { data, error } = await supabase
      .from("products")
      .upsert(batch, { onConflict: "external_id,source", ignoreDuplicates: false })
      .select("id");

    if (error) {
      console.error(`Batch error:`, error.message);
    } else {
      added += data?.length ?? batch.length;
    }
  }

  console.log(`\nDone. ${added} real products now in database.`);
  console.log(`  eBay: ${ebayProducts.length}`);
  console.log(`  Etsy: ${etsyProducts.length}`);
  process.exit(0);
}

clearAndReingest().catch(console.error);
