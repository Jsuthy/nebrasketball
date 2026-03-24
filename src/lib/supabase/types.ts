export type ProductSource = "amazon" | "ebay" | "etsy" | "fanatics" | "manual";

export type CategorySlug =
  | "tees"
  | "hoodies"
  | "hats"
  | "jerseys"
  | "womens"
  | "youth"
  | "accessories";

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
