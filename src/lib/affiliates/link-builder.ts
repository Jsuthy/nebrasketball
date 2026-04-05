const AMAZON_TAG = "nebrasketball-20";

export function buildAmazonUrl(searchTerm: string): string {
  const encoded = encodeURIComponent(searchTerm);
  return `https://www.amazon.com/s?k=${encoded}&tag=${AMAZON_TAG}`;
}

export function appendAmazonTag(url: string): string {
  if (!url.includes("amazon.com")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}tag=${AMAZON_TAG}`;
}
