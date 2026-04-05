/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { CATEGORIES } from "../lib/constants";

async function main() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

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
