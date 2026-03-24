import { createClient } from "../lib/supabase/server";
import seedProducts from "../lib/seed-products.json";

async function main() {
  const supabase = await createClient();

  const rows = seedProducts.map((p) => ({
    external_id: `seed-${p.id}`,
    source: p.source,
    title: p.title,
    description: p.description,
    price: p.price,
    original_price: p.was,
    image_url: null,
    affiliate_url: p.affiliate_url,
    slug: p.slug,
    category: p.category,
    tags: [],
    is_featured: p.is_featured,
    is_active: p.is_active,
    click_count: p.clicks,
  }));

  const { data, error } = await supabase
    .from("products")
    .upsert(rows, { onConflict: "external_id,source", ignoreDuplicates: false })
    .select("id");

  if (error) {
    console.error("Failed to upsert products:", error.message);
  } else {
    console.log(`Upserted ${data?.length ?? 0} products.`);
  }

  console.log("Done seeding products.");
}

main().catch(console.error);
