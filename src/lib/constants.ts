export const SITE_NAME = "Nebrasketball";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nebrasketball.com";
export const SITE_DESCRIPTION =
  "Shop every Nebraska Cornhuskers gear drop from Amazon, eBay, Etsy and Fanatics — all sports, all in one place.";

export const CATEGORIES = [
  {
    slug: "tees",
    name: "Tees",
    emoji: "👕",
    description: "Nebraska Huskers t-shirts, graphic tees, and game-day shirts.",
    metaTitle: "Nebraska Tees | Cornhuskers T-Shirts",
    metaDescription:
      "Shop Nebraska Cornhuskers t-shirts from Amazon, eBay, Etsy and Fanatics.",
    count: 0,
  },
  {
    slug: "hoodies",
    name: "Hoodies",
    emoji: "🧥",
    description: "Nebraska hoodies, crewnecks, and pullover sweatshirts.",
    metaTitle: "Nebraska Hoodies | Cornhuskers Sweatshirts",
    metaDescription:
      "Shop Nebraska hoodies and sweatshirts from top retailers.",
    count: 0,
  },
  {
    slug: "hats",
    name: "Hats",
    emoji: "🧢",
    description: "Nebraska Huskers caps, snapbacks, beanies, and trucker hats.",
    metaTitle: "Nebraska Hats | Cornhuskers Caps",
    metaDescription:
      "Shop Nebraska Cornhuskers hats, snapbacks, and caps.",
    count: 0,
  },
  {
    slug: "jerseys",
    name: "Jerseys",
    emoji: "🏀",
    description: "Official and replica Nebraska jerseys.",
    metaTitle: "Nebraska Jerseys | Cornhuskers Jerseys",
    metaDescription:
      "Shop official Nebraska Cornhuskers jerseys from Fanatics and more.",
    count: 0,
  },
  {
    slug: "womens",
    name: "Women's",
    emoji: "👚",
    description: "Nebraska apparel designed for women.",
    metaTitle: "Women's Nebraska Gear | Cornhuskers Women's Apparel",
    metaDescription:
      "Shop women's Nebraska Cornhuskers gear and apparel.",
    count: 0,
  },
  {
    slug: "youth",
    name: "Youth",
    emoji: "👦",
    description: "Nebraska gear for kids and young fans.",
    metaTitle: "Youth Nebraska Gear | Kids Cornhuskers Apparel",
    metaDescription:
      "Shop youth and kids Nebraska Cornhuskers apparel.",
    count: 0,
  },
  {
    slug: "accessories",
    name: "Accessories",
    emoji: "🎒",
    description: "Nebraska accessories — pins, phone cases, flags, and more.",
    metaTitle: "Nebraska Accessories | Cornhuskers Gear",
    metaDescription:
      "Shop Nebraska Cornhuskers accessories and collectibles.",
    count: 0,
  },
] as const;

export const SPORTS = [
  {
    slug: 'football',
    name: 'Nebraska Football',
    emoji: '🏈',
    description: 'Nebraska Cornhuskers football fan gear — jerseys, hoodies, hats and more.',
    metaTitle: 'Nebraska Cornhuskers Football Gear — Fan Apparel & Merchandise',
    metaDescription: 'Shop Nebraska Cornhuskers football gear from top retailers. Jerseys, hoodies, hats and more. Independent fan aggregator.',
    searchTerms: [
      'nebraska cornhuskers football',
      'nebraska huskers football shirt',
      'nebraska football jersey',
      'nebraska football hoodie',
      'huskers football hat',
      'nebraska football sweatshirt',
      'go big red football',
    ]
  },
  {
    slug: 'basketball',
    name: 'Nebraska Basketball',
    emoji: '🏀',
    description: 'Nebraska Cornhuskers basketball fan gear — celebrating the historic 2026 Sweet 16 run.',
    metaTitle: 'Nebraska Cornhuskers Basketball Gear — Fan Apparel & Merchandise',
    metaDescription: 'Shop Nebraska Cornhuskers basketball gear. Tees, hoodies, jerseys and more from top retailers. Independent fan aggregator.',
    searchTerms: [
      'nebraska cornhuskers basketball',
      'nebraska huskers basketball shirt',
      'nebraska basketball hoodie',
      'nebraska basketball jersey',
      'huskers basketball hat',
      'brice williams nebraska',
      'juwan gary nebraska',
    ]
  },
  {
    slug: 'volleyball',
    name: 'Nebraska Volleyball',
    emoji: '🏐',
    description: 'Nebraska Cornhuskers volleyball fan gear — one of college volleyball\'s elite programs.',
    metaTitle: 'Nebraska Cornhuskers Volleyball Gear — Fan Apparel & Merchandise',
    metaDescription: 'Shop Nebraska Cornhuskers volleyball gear from top retailers. Independent fan aggregator.',
    searchTerms: [
      'nebraska cornhuskers volleyball',
      'nebraska volleyball shirt',
      'nebraska volleyball jersey',
      'huskers volleyball gear',
      'harper murray nebraska',
      'nebraska volleyball hoodie',
    ]
  },
  {
    slug: 'wrestling',
    name: 'Nebraska Wrestling',
    emoji: '🤼',
    description: 'Nebraska Cornhuskers wrestling fan gear and apparel.',
    metaTitle: 'Nebraska Cornhuskers Wrestling Gear — Fan Apparel',
    metaDescription: 'Shop Nebraska Cornhuskers wrestling fan gear. Independent aggregator.',
    searchTerms: [
      'nebraska cornhuskers wrestling',
      'nebraska wrestling shirt',
      'huskers wrestling gear',
      'nebraska wrestling hoodie',
    ]
  },
  {
    slug: 'baseball',
    name: 'Nebraska Baseball',
    emoji: '⚾',
    description: 'Nebraska Cornhuskers baseball fan gear and apparel.',
    metaTitle: 'Nebraska Cornhuskers Baseball Gear — Fan Apparel',
    metaDescription: 'Shop Nebraska Cornhuskers baseball fan gear from top retailers. Independent aggregator.',
    searchTerms: [
      'nebraska cornhuskers baseball',
      'nebraska baseball jersey',
      'huskers baseball hat',
      'nebraska baseball hoodie',
    ]
  },
  {
    slug: 'softball',
    name: 'Nebraska Softball',
    emoji: '🥎',
    description: 'Nebraska Cornhuskers softball fan apparel and gear.',
    metaTitle: 'Nebraska Cornhuskers Softball Gear — Fan Apparel',
    metaDescription: 'Shop Nebraska Cornhuskers softball fan gear. Independent aggregator.',
    searchTerms: [
      'nebraska cornhuskers softball',
      'nebraska softball shirt',
      'huskers softball gear',
    ]
  },
  {
    slug: 'track',
    name: 'Nebraska Track',
    emoji: '🏃',
    description: 'Nebraska Cornhuskers track and field fan gear.',
    metaTitle: 'Nebraska Cornhuskers Track & Field Gear — Fan Apparel',
    metaDescription: 'Shop Nebraska Cornhuskers track and field fan gear. Independent aggregator.',
    searchTerms: [
      'nebraska cornhuskers track',
      'nebraska track shirt',
      'huskers track gear',
    ]
  },
  {
    slug: 'general',
    name: 'Nebraska Cornhuskers',
    emoji: '🌽',
    description: 'General Nebraska Cornhuskers fan gear covering all sports.',
    metaTitle: 'Nebraska Cornhuskers Fan Gear — All Sports Apparel & Merchandise',
    metaDescription: 'Shop Nebraska Cornhuskers fan gear for all sports. Independent fan aggregator.',
    searchTerms: [
      'nebraska cornhuskers gear',
      'nebraska huskers merchandise',
      'cornhuskers gift',
      'nebraska fan shirt',
      'go big red shirt',
      'nebraska cornhuskers hoodie',
      'nebraska scarlet cream',
    ]
  }
] as const;

export const PRICE_RANGES = [
  { slug: 'under-25',  label: 'Under $25',   min: 0,   max: 24.99 },
  { slug: '25-to-50',  label: '$25 to $50',  min: 25,  max: 49.99 },
  { slug: '50-to-100', label: '$50 to $100', min: 50,  max: 99.99 },
  { slug: 'over-100',  label: 'Over $100',   min: 100, max: 9999  },
] as const;

export const BRANDS = [
  { slug: 'nike',          name: 'Nike'           },
  { slug: 'adidas',        name: 'Adidas'         },
  { slug: 'fanatics',      name: 'Fanatics'       },
  { slug: 'champion',      name: 'Champion'       },
  { slug: '47brand',       name: "'47 Brand"      },
  { slug: 'columbia',      name: 'Columbia'       },
  { slug: 'under-armour',  name: 'Under Armour'   },
  { slug: 'homefield',     name: 'Homefield'      },
  { slug: 'vintage-brand', name: 'Vintage Brand'  },
] as const;

export const SOURCES = [
  { slug: "amazon", name: "Amazon", color: "#FF9900", textColor: "#000000" },
  { slug: "ebay", name: "eBay", color: "#E53238", textColor: "#FFFFFF" },
  { slug: "etsy", name: "Etsy", color: "#F56400", textColor: "#FFFFFF" },
  { slug: "fanatics", name: "Fanatics", color: "#003DA5", textColor: "#FFFFFF" },
] as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gear", label: "All Gear" },
  { href: "/shop", label: "Shop" },
  { href: "/news", label: "News" },
] as const;
