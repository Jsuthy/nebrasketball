export type ProductSource = "amazon" | "ebay" | "etsy" | "fanatics" | "manual";

export type CategorySlug =
  | "tees"
  | "hoodies"
  | "hats"
  | "jerseys"
  | "womens"
  | "youth"
  | "accessories";

export type SportSlug =
  | "football"
  | "basketball"
  | "volleyball"
  | "wrestling"
  | "baseball"
  | "softball"
  | "track"
  | "general";

export type PriceRangeSlug = "under-25" | "25-to-50" | "50-to-100" | "over-100";

export interface Product {
  id: string;
  external_id: string;
  source: ProductSource;
  title: string;
  description: string | null;
  price: number | null;
  original_price: number | null;
  image_url: string | null;
  affiliate_url: string;
  slug: string;
  category: CategorySlug | null;
  sport: SportSlug;
  brand: string | null;
  price_range: PriceRangeSlug | null;
  tags: string[] | null;
  is_featured: boolean;
  is_active: boolean;
  click_count: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  product_count: number;
}

export interface Sport {
  id: string;
  slug: SportSlug;
  name: string;
  emoji: string | null;
  description: string | null;
  is_active: boolean;
  sort_order: number;
}

export interface ProgrammaticPage {
  id: string;
  slug: string;
  page_type: string;
  sport: string | null;
  category: string | null;
  brand: string | null;
  price_range: string | null;
  title: string;
  description: string;
  product_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewsPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string | null;
  hero_image_url: string | null;
  published_at: string;
  is_published: boolean;
  created_at: string;
}

export interface ClickEvent {
  id: string;
  product_id: string | null;
  source_page: string | null;
  referrer: string | null;
  user_agent: string | null;
  created_at: string;
}
