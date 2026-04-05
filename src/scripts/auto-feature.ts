/* eslint-disable @typescript-eslint/no-require-imports */
require("dotenv").config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function autoFeature() {
  const categories = ["tees", "hoodies", "hats", "jerseys", "womens", "youth", "accessories"];

  // Clear existing featured flags first
  await supabase
    .from("products")
    .update({ is_featured: false })
    .eq("is_featured", true);

  for (const category of categories) {
    const { data } = await supabase
      .from("products")
      .select("id")
      .eq("category", category)
      .eq("is_active", true)
      .limit(2);

    if (data && data.length > 0) {
      const ids = data.map((p) => p.id);
      await supabase
        .from("products")
        .update({ is_featured: true })
        .in("id", ids);
      console.log(`Featured ${ids.length} products in ${category}`);
    } else {
      console.log(`No products found in ${category}`);
    }
  }

  console.log("Done featuring products.");
  process.exit(0);
}

autoFeature().catch(console.error);
