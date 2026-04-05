import type { CategorySlug, SportSlug } from "@/lib/supabase/types";
import { slugify } from "@/lib/utils";

export function categorizeByTitle(title: string): CategorySlug {
  const t = title.toLowerCase();
  if (/hoodie|sweatshirt|crewneck|fleece/.test(t)) return "hoodies";
  if (/hat|cap|snapback|beanie|trucker/.test(t)) return "hats";
  if (/jersey|uniform/.test(t)) return "jerseys";
  if (/women|womens|ladies|girl/.test(t)) return "womens";
  if (/kid|kids|youth|child|children|toddler|baby/.test(t)) return "youth";
  if (/phone|case|pin|flag|car|accessory|mug|cup/.test(t))
    return "accessories";
  return "tees";
}

export function generateSlug(title: string, externalId: string): string {
  return slugify(title).slice(0, 60) + "-" + externalId.slice(-6);
}

export function isNebraskaProduct(title: string): boolean {
  const t = title.toLowerCase();
  return (
    t.includes("nebraska") ||
    t.includes("cornhusker") ||
    t.includes("cornhuskers") ||
    t.includes("husker") ||
    t.includes("huskers") ||
    t.includes("gbr")
  );
}

export function detectSport(title: string): SportSlug {
  const t = title.toLowerCase();
  if (t.includes('football') || t.includes('gridiron')) return 'football';
  if (t.includes('volleyball') || t.includes('volley')) return 'volleyball';
  if (t.includes('wrestling') || t.includes('wrestler')) return 'wrestling';
  if (t.includes('softball')) return 'softball';
  if (t.includes('baseball')) return 'baseball';
  if (t.includes('track') || t.includes('cross country')) return 'track';
  if (t.includes('basketball') || t.includes('hoops')) return 'basketball';
  return 'general';
}

export function detectBrand(title: string): string | null {
  const t = title.toLowerCase();
  if (t.includes('nike'))          return 'nike';
  if (t.includes('adidas'))        return 'adidas';
  if (t.includes('fanatics'))      return 'fanatics';
  if (t.includes('champion'))      return 'champion';
  if (t.includes("'47") || t.includes('47 brand')) return '47brand';
  if (t.includes('columbia'))      return 'columbia';
  if (t.includes('under armour'))  return 'under-armour';
  if (t.includes('homefield'))     return 'homefield';
  if (t.includes('vintage brand')) return 'vintage-brand';
  return null;
}
