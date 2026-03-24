import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Nebrasketball | Nebraska Basketball Gear Aggregator",
  description:
    "Nebrasketball aggregates Nebraska Cornhuskers basketball gear from Amazon, eBay, Etsy, and Fanatics — all in one place.",
};

export default function AboutPage() {
  return (
    <article className="prose-page" style={{ maxWidth: 680, margin: "0 auto", padding: "36px 20px" }}>
      <h1
        className="font-display"
        style={{
          fontWeight: 900,
          fontSize: "clamp(28px, 5vw, 44px)",
          textTransform: "uppercase",
          lineHeight: 0.95,
          marginBottom: 24,
          marginTop: 0,
        }}
      >
        About Nebrasketball
      </h1>

      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, textTransform: "uppercase", marginTop: 32, marginBottom: 12, color: "var(--red)" }}>
        The Origin
      </h2>
      <p>
        Nebrasketball was built the week Nebraska made its first-ever Sweet 16 in March 2026. For 127 years, Nebraska basketball had never won an NCAA Tournament game — nine appearances, zero wins. That changed in Oklahoma City when the Huskers beat Troy 76-47 and then survived a Vanderbilt thriller to punch their ticket to the Sweet 16.
      </p>
      <p>
        The moment was bigger than basketball. Fans across the state wanted gear to celebrate the historic run, but finding it meant searching four or five different retailers. Nebrasketball was launched to give Husker fans one place to find every piece of gear celebrating the moment that changed Nebraska basketball forever.
      </p>

      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, textTransform: "uppercase", marginTop: 32, marginBottom: 12, color: "var(--red)" }}>
        How It Works
      </h2>
      <p>
        Nebrasketball aggregates Nebraska basketball gear from Amazon, eBay, Etsy, Fanatics, and independent fan shops. We don&apos;t sell anything directly — we index everything and link you straight to the best deals on the retailer&apos;s site.
      </p>
      <p>
        Our product catalog updates automatically every six hours, so new drops from any source show up fast. You can search, filter by category or source, and sort by price or popularity — all without leaving the site.
      </p>

      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, textTransform: "uppercase", marginTop: 32, marginBottom: 12, color: "var(--red)" }}>
        Affiliate Disclosure
      </h2>
      <p>
        When you click a deal and buy something, we may earn a small commission. This comes at no extra cost to you — the price you pay is the same whether or not you use our link. It&apos;s how we keep the lights on. For the full details, see our{" "}
        <Link href="/affiliate-disclosure" style={{ color: "var(--red)", textDecoration: "underline" }}>
          affiliate disclosure
        </Link>.
      </p>

      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, textTransform: "uppercase", marginTop: 32, marginBottom: 12, color: "var(--red)" }}>
        Contact
      </h2>
      <p>
        Have a product suggestion or want to get your shop listed? Email us at{" "}
        <a href="mailto:hello@nebrasketball.com" style={{ color: "var(--red)", textDecoration: "underline" }}>
          hello@nebrasketball.com
        </a>.
      </p>

      <style>{`
        .prose-page p {
          font-size: 15px;
          line-height: 1.8;
          color: rgba(255,255,255,0.68);
          margin-bottom: 16px;
        }
      `}</style>
    </article>
  );
}
