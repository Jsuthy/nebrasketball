import type { ProductSource, CategorySlug, SportSlug } from "@/lib/supabase/types";

export interface NormalizedProduct {
  external_id: string;
  source: ProductSource;
  title: string;
  description: string;
  price: number;
  original_price: number | null;
  image_url: string | null;
  affiliate_url: string;
  slug: string;
  category: CategorySlug;
  sport: SportSlug;
  brand: string | null;
  tags: string[];
  is_featured: boolean;
  is_active: boolean;
  sourceData?: unknown;
}

export interface IngestionResult {
  added: number;
  updated: number;
  failed: number;
  errors: string[];
  sources: { ebay: number; etsy: number; amazon: number; manual: number };
  bySport: Record<SportSlug, number>;
}
