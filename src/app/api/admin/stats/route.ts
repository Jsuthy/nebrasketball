import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get("authorization");
  const tokenParam = request.nextUrl.searchParams.get("token");
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken) return false;
  if (authHeader === `Bearer ${adminToken}`) return true;
  if (tokenParam === adminToken) return true;
  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    const [productsRes, clicksRes, sourcesRes, newsRes, topProductsRes] =
      await Promise.all([
        supabase
          .from("products")
          .select("id", { count: "exact", head: true })
          .eq("is_active", true),
        supabase.from("products").select("click_count").eq("is_active", true),
        supabase.from("products").select("source").eq("is_active", true),
        supabase
          .from("news_posts")
          .select("id", { count: "exact", head: true })
          .eq("is_published", true),
        supabase
          .from("products")
          .select("id, title, source, price, click_count, is_featured, slug, category")
          .eq("is_active", true)
          .order("click_count", { ascending: false })
          .limit(20),
      ]);

    const totalProducts = productsRes.count ?? 0;
    const totalClicks =
      clicksRes.data?.reduce((sum, p) => sum + (p.click_count ?? 0), 0) ?? 0;

    const sourceSet = new Set(sourcesRes.data?.map((p) => p.source) ?? []);
    const activeSources = sourceSet.size;

    const totalNews = newsRes.count ?? 0;
    const topProducts = topProductsRes.data ?? [];

    return NextResponse.json({
      totalProducts,
      totalClicks,
      activeSources,
      totalNews,
      topProducts,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
