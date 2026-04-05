import { createClient as createServerClient } from "@supabase/supabase-js";
import { SPORTS, CATEGORIES, PRICE_RANGES } from "@/lib/constants";
import { buildMetaDescription } from "@/lib/compliance";

interface ProgrammaticPageInsert {
  slug: string;
  page_type: string;
  sport?: string;
  category?: string;
  brand?: string;
  price_range?: string;
  title: string;
  description: string;
  product_count: number;
}

export async function generateProgrammaticPages(): Promise<{
  created: number;
  updated: number;
  skipped: number;
}> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const pages: ProgrammaticPageInsert[] = [];
  const MIN_PRODUCTS = 3;

  // 1. Sport-only pages (one per sport)
  for (const sport of SPORTS) {
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("sport", sport.slug)
      .eq("is_active", true);

    if ((count || 0) >= MIN_PRODUCTS) {
      const sportLabel = sport.name.replace("Nebraska ", "");
      pages.push({
        slug: `gear/${sport.slug}`,
        page_type: "sport",
        sport: sport.slug,
        title: `Nebraska Cornhuskers ${sportLabel} Gear — Fan Apparel & Merchandise`,
        description: buildMetaDescription(
          `Shop Nebraska Cornhuskers ${sportLabel} gear including jerseys, shirts, hoodies, hats and more. Find the best deals from Amazon, eBay, Etsy and Fanatics.`
        ),
        product_count: count || 0,
      });
    }
  }

  // 2. Sport x Category pages
  for (const sport of SPORTS) {
    for (const category of CATEGORIES) {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("sport", sport.slug)
        .eq("category", category.slug)
        .eq("is_active", true);

      if ((count || 0) >= MIN_PRODUCTS) {
        const sportLabel = sport.name.replace("Nebraska ", "");
        const catLabel = category.name;
        pages.push({
          slug: `gear/${sport.slug}/${category.slug}`,
          page_type: "sport-category",
          sport: sport.slug,
          category: category.slug,
          title: `Nebraska Cornhuskers ${sportLabel} ${catLabel} — Fan Gear`,
          description: buildMetaDescription(
            `Find Nebraska Cornhuskers ${sportLabel} ${catLabel.toLowerCase()} from Amazon, eBay, Etsy and Fanatics. Updated daily with the latest products and deals.`
          ),
          product_count: count || 0,
        });
      }
    }
  }

  // 3. Sport x Price Range pages
  for (const sport of SPORTS) {
    for (const range of PRICE_RANGES) {
      const { count } = await supabase
        .from("products")
        .select("*", { count: "exact", head: true })
        .eq("sport", sport.slug)
        .eq("price_range", range.slug)
        .eq("is_active", true);

      if ((count || 0) >= MIN_PRODUCTS) {
        const sportLabel = sport.name.replace("Nebraska ", "");
        pages.push({
          slug: `gear/${sport.slug}/${range.slug}`,
          page_type: "sport-price",
          sport: sport.slug,
          price_range: range.slug,
          title: `Nebraska Cornhuskers ${sportLabel} Gear ${range.label} — Fan Merchandise`,
          description: buildMetaDescription(
            `Nebraska Cornhuskers ${sportLabel} fan gear ${range.label.toLowerCase()}. Browse hundreds of products from top retailers.`
          ),
          product_count: count || 0,
        });
      }
    }
  }

  // 4. Gift guide pages (static slugs, always generate)
  const giftGuides = [
    {
      slug: "gift-guides/nebraska-fan-gifts",
      title: "Nebraska Cornhuskers Gift Guide — Best Gifts for Husker Fans",
      description:
        "The best Nebraska Cornhuskers gifts for every fan. From jerseys to hats to home decor — find the perfect Husker gift.",
    },
    {
      slug: "gift-guides/nebraska-football-gifts",
      title:
        "Nebraska Football Gift Guide — Fan Gifts for Husker Football Fans",
      description:
        "Best Nebraska Cornhuskers football gifts. Jerseys, hoodies, hats and more for the Husker football fan in your life.",
    },
    {
      slug: "gift-guides/nebraska-basketball-gifts",
      title:
        "Nebraska Basketball Gift Guide — Fan Gifts for Husker Hoops Fans",
      description:
        "Best Nebraska Cornhuskers basketball gifts celebrating the historic 2026 Sweet 16 run.",
    },
    {
      slug: "gift-guides/nebraska-volleyball-gifts",
      title:
        "Nebraska Volleyball Gift Guide — Gifts for Husker Volleyball Fans",
      description:
        "Best Nebraska Cornhuskers volleyball gifts for fans of one of college volleyball's elite programs.",
    },
    {
      slug: "gift-guides/nebraska-fan-gifts-under-25",
      title:
        "Nebraska Cornhuskers Gifts Under $25 — Affordable Husker Fan Gifts",
      description:
        "Nebraska Cornhuskers fan gifts under $25. Affordable options for every Husker fan.",
    },
    {
      slug: "gift-guides/nebraska-fan-gifts-under-50",
      title:
        "Nebraska Cornhuskers Gifts Under $50 — Husker Fan Gift Ideas",
      description:
        "Nebraska Cornhuskers fan gifts under $50. Great gift ideas for every sport and every fan.",
    },
    {
      slug: "gift-guides/nebraska-cornhuskers-gift-guide",
      title:
        "Ultimate Nebraska Cornhuskers Gift Guide — All Sports Fan Gifts",
      description:
        "The ultimate Nebraska Cornhuskers gift guide covering football, basketball, volleyball and more.",
    },
  ];

  for (const guide of giftGuides) {
    pages.push({
      ...guide,
      page_type: "gift-guide",
      description: buildMetaDescription(guide.description),
      product_count: 0,
    });
  }

  // Upsert all pages
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const page of pages) {
    const { error } = await supabase
      .from("programmatic_pages")
      .upsert(page, { onConflict: "slug" });

    if (error) {
      console.error(`Failed to upsert page ${page.slug}:`, error);
      skipped++;
    } else {
      created++;
    }
  }

  console.log(`Pages generated: ${created} upserted, ${skipped} failed`);
  return { created, updated, skipped };
}
