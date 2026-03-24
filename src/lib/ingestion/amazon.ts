import type { NormalizedProduct } from "./types";

export async function fetchAmazonProducts(): Promise<NormalizedProduct[]> {
  // TODO: Wire PA API once Associates account has 3 qualifying sales
  // Endpoint: https://webservices.amazon.com/paapi5/searchitems
  // Requires: AMAZON_ACCESS_KEY, AMAZON_SECRET_KEY, AMAZON_ASSOCIATE_TAG
  // Search: Keywords='Nebraska basketball', SearchIndex='FashionWomen,FashionMen,SportingGoods'
  return [];
}
