import { createClient } from "./server";
import type { Product, Category, NewsPost, ClickEvent } from "./types";

export interface ProductFilters {
  category?: string;
  source?: string;
  search?: string;
  sort?: "popular" | "price_asc" | "price_desc" | "newest";
  limit?: number;
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true);

  if (filters?.category) {
    query = query.eq("category", filters.category);
  }
  if (filters?.source) {
    query = query.eq("source", filters.source);
  }
  if (filters?.search) {
    query = query.ilike("title", `%${filters.search}%`);
  }

  switch (filters?.sort) {
    case "popular":
      query = query.order("click_count", { ascending: false });
      break;
    case "price_asc":
      query = query.order("price", { ascending: true, nullsFirst: false });
      break;
    case "price_desc":
      query = query.order("price", { ascending: false });
      break;
    case "newest":
    default:
      query = query.order("created_at", { ascending: false });
      break;
  }

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("click_count", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return (data as Product) ?? null;
}

export async function getProductsByCategory(category: string): Promise<Product[]> {
  return getProducts({ category, sort: "popular" });
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) throw error;
  return (data ?? []) as Category[];
}

export async function getNewsPost(slug: string): Promise<NewsPost | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error && error.code !== "PGRST116") throw error;
  return (data as NewsPost) ?? null;
}

export async function getNewsPosts(limit = 20): Promise<NewsPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("news_posts")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as NewsPost[];
}

export async function incrementClickCount(productId: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("increment_click_count", {
    product_id: productId,
  });
  if (error) {
    // Fallback: read current count and update
    const { data } = await supabase
      .from("products")
      .select("click_count")
      .eq("id", productId)
      .single();
    if (data) {
      await supabase
        .from("products")
        .update({ click_count: (data.click_count ?? 0) + 1 })
        .eq("id", productId);
    }
  }
}

export async function insertClickEvent(
  data: Partial<ClickEvent>
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("click_events").insert(data);
  if (error) throw error;
}
