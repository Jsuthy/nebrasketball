import type { CategorySlug } from "@/lib/supabase/types";
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
