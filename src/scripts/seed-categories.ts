import { createClient } from "../lib/supabase/server";
import { CATEGORIES } from "../lib/constants";

async function main() {
  const supabase = await createClient();

  for (const cat of CATEGORIES) {
    const { error } = await supabase.from("categories").upsert(
      {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        meta_title: cat.metaTitle,
        meta_description: cat.metaDescription,
        product_count: cat.count,
      },
      { onConflict: "slug" }
    );

    if (error) {
      console.error(`Failed to upsert category "${cat.slug}":`, error.message);
    } else {
      console.log(`Upserted category: ${cat.slug}`);
    }
  }

  console.log("Done seeding categories.");
}

main().catch(console.error);
