export const SITE_NAME = "Nebrasketball";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nebrasketball.com";
export const SITE_DESCRIPTION =
  "Shop every Nebraska Cornhuskers basketball gear drop from Amazon, eBay, Etsy and Fanatics — all in one place.";

export const CATEGORIES = [
  {
    slug: "tees",
    name: "Tees",
    emoji: "👕",
    description: "Nebraska Huskers basketball t-shirts, graphic tees, and game-day shirts.",
    metaTitle: "Nebraska Basketball Tees | Cornhuskers T-Shirts",
    metaDescription:
      "Shop Nebraska Cornhuskers basketball t-shirts from Amazon, eBay, Etsy and Fanatics.",
    count: 0,
  },
  {
    slug: "hoodies",
    name: "Hoodies",
    emoji: "🧥",
    description: "Nebraska basketball hoodies, crewnecks, and pullover sweatshirts.",
    metaTitle: "Nebraska Basketball Hoodies | Cornhuskers Sweatshirts",
    metaDescription:
      "Shop Nebraska basketball hoodies and sweatshirts from top retailers.",
    count: 0,
  },
  {
    slug: "hats",
    name: "Hats",
    emoji: "🧢",
    description: "Nebraska Huskers basketball caps, snapbacks, beanies, and trucker hats.",
    metaTitle: "Nebraska Basketball Hats | Cornhuskers Caps",
    metaDescription:
      "Shop Nebraska Cornhuskers basketball hats, snapbacks, and caps.",
    count: 0,
  },
  {
    slug: "jerseys",
    name: "Jerseys",
    emoji: "🏀",
    description: "Official and replica Nebraska basketball jerseys.",
    metaTitle: "Nebraska Basketball Jerseys | Cornhuskers Jerseys",
    metaDescription:
      "Shop official Nebraska Cornhuskers basketball jerseys from Fanatics and more.",
    count: 0,
  },
  {
    slug: "womens",
    name: "Women's",
    emoji: "👚",
    description: "Nebraska basketball apparel designed for women.",
    metaTitle: "Women's Nebraska Basketball Gear | Cornhuskers Women's Apparel",
    metaDescription:
      "Shop women's Nebraska Cornhuskers basketball gear and apparel.",
    count: 0,
  },
  {
    slug: "youth",
    name: "Youth",
    emoji: "👦",
    description: "Nebraska basketball gear for kids and young fans.",
    metaTitle: "Youth Nebraska Basketball Gear | Kids Cornhuskers Apparel",
    metaDescription:
      "Shop youth and kids Nebraska Cornhuskers basketball apparel.",
    count: 0,
  },
  {
    slug: "accessories",
    name: "Accessories",
    emoji: "🎒",
    description: "Nebraska basketball accessories — pins, phone cases, flags, and more.",
    metaTitle: "Nebraska Basketball Accessories | Cornhuskers Gear",
    metaDescription:
      "Shop Nebraska Cornhuskers basketball accessories and collectibles.",
    count: 0,
  },
] as const;

export const SOURCES = [
  { slug: "amazon", name: "Amazon", color: "#FF9900", textColor: "#000000" },
  { slug: "ebay", name: "eBay", color: "#E53238", textColor: "#FFFFFF" },
  { slug: "etsy", name: "Etsy", color: "#F56400", textColor: "#FFFFFF" },
  { slug: "fanatics", name: "Fanatics", color: "#003DA5", textColor: "#FFFFFF" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/category/tees", label: "Tees" },
  { href: "/category/hoodies", label: "Hoodies" },
  { href: "/category/hats", label: "Hats" },
  { href: "/category/jerseys", label: "Jerseys" },
  { href: "/news", label: "News" },
] as const;
