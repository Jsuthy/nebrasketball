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

  // --- Primary keywords (exact sport names) ---
  if (t.includes('football') || t.includes('gridiron') || t.includes('pigskin'))
    return 'football';
  if (t.includes('volleyball') || t.includes('volley ball'))
    return 'volleyball';
  if (t.includes('wrestling') || t.includes('wrestler'))
    return 'wrestling';
  if (t.includes('softball'))                     return 'softball';
  if (t.includes('baseball') || t.includes('base ball'))
    return 'baseball';
  if (/\btrack\b/.test(t) || t.includes('cross country') || t.includes('track & field') || t.includes('track and field'))
    return 'track';
  if (t.includes('basketball') || t.includes('hoops') || t.includes('march madness'))
    return 'basketball';

  // --- Football contextual signals ---
  // Bowl games are always football
  if (/\b(fiesta|orange|sugar|rose|cotton|holiday|sun|gator|outback|alamo|music.city|peach|citrus)\s*bowl\b/.test(t))
    return 'football';
  // Nebraska national championships are football
  if (/national\s*champ/.test(t))                 return 'football';
  if (/\bheisman\b/.test(t))                      return 'football';
  if (/\btailgat/.test(t))                        return 'football';
  if (/\btouchdown\b|\bend.?zone\b/.test(t))      return 'football';
  if (/\bgameday\b|\bgame\s*day\b/.test(t))       return 'football';
  // Football-specific gear terms
  if (/\bhelmet\b/.test(t))                       return 'football';
  if (/\bquarterback\b|\b[qQ][bB]\b/.test(t))    return 'football';
  if (/\blineman\b|\blinemen\b/.test(t))          return 'football';

  // "Husker Power" is a football-specific phrase
  if (/husker\s*power/.test(t))                   return 'football';
  // Rivalry opponents that imply football
  if (/\b(vs\.?\s*|versus\s+)(notre dame|iowa|colorado|oklahoma|wisconsin|michigan|minnesota)\b/.test(t))
    return 'football';
  if (/\biowa\s*hater\b/.test(t))                 return 'football';
  // Nebraska football coaches and notable players
  if (/\b(osborne|tom osborne|scott frost|frank solich|bo pelini|matt rhule|devaney)\b/.test(t))
    return 'football';
  // Memorial Stadium is the football venue
  if (/memorial\s*stadium/.test(t))               return 'football';

  // --- Basketball contextual signals ---
  if (/\bsweet\s*(16|sixteen)\b/.test(t))         return 'basketball';
  if (/\bfinal\s*four\b/.test(t))                 return 'basketball';
  if (/\belite\s*eight\b/.test(t))                return 'basketball';
  if (/\bncaa\s*tournament\b/.test(t))            return 'basketball';
  if (/\bbrice\s*williams\b|\bjuwan\s*gary\b|\bfred\s*hoiberg\b/.test(t))
    return 'basketball';
  // Pinnacle Bank Arena is the basketball venue
  if (/pinnacle\s*bank/.test(t))                  return 'basketball';

  // --- Volleyball contextual signals ---
  if (/\bharper\s*murray\b|\blexi\s*(sun|rodriguez)\b|\bjohn\s*cook\b/.test(t))
    return 'volleyball';

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
