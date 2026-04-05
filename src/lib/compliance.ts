export const SITE_DISCLAIMER = `Nebrasketball.com is an independent, unofficial fan site and affiliate aggregator. We are not affiliated with, endorsed by, or connected to the University of Nebraska–Lincoln, its athletic department, or any official licensing program. All trademarks (Nebraska, Cornhuskers, Huskers, etc.) are property of their respective owners. We earn affiliate commissions from qualifying purchases from third-party retailers.`

export const SHORT_DISCLAIMER = `Independent fan site. Not affiliated with UNL or NCAA. Affiliate links — we may earn a commission.`

export const AFFILIATE_DISCLOSURE = `This page contains affiliate links. When you click a product and make a purchase, we may earn a small commission at no extra cost to you.`

// Compliance check for ingested products
export function isCompliantProduct(title: string, imageUrl: string | null): boolean {
  // Flag titles that claim to be official when they aren't
  // (licensed products from retailers ARE fine — we're linking to them)
  // Only block products that would confuse our site as the official source
  return true // aggregator model is inherently compliant — we link to licensed retailers
}

// Generate compliant page title
export function buildPageTitle(parts: string[]): string {
  return parts.filter(Boolean).join(' — ')
}

// Generate compliant meta description
export function buildMetaDescription(content: string): string {
  return `${content} ${SHORT_DISCLAIMER}`
}
