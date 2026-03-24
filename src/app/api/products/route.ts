import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getProducts } from "@/lib/supabase/queries";
import type { ProductFilters } from "@/lib/supabase/queries";
import seedProducts from "@/lib/seed-products.json";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get("q") || undefined;
  const cat = searchParams.get("cat") || undefined;
  const src = searchParams.get("src") || undefined;
  const sort = (searchParams.get("sort") as ProductFilters["sort"]) || undefined;
  const limit = searchParams.get("limit")
    ? Number(searchParams.get("limit"))
    : undefined;

  const filters: ProductFilters = {
    search: q,
    category: cat,
    source: src,
    sort,
    limit,
  };

  let products: unknown[] = [];
  try {
    products = await getProducts(filters);
  } catch {
    products = [];
  }

  if (products.length === 0) {
    return NextResponse.json(seedProducts, {
      headers: { "Cache-Control": "no-store" },
    });
  }

  return NextResponse.json(products, {
    headers: { "Cache-Control": "no-store" },
  });
}
