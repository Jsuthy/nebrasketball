import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description:
    "Nebrasketball participates in affiliate programs. Learn how we earn commissions and how it affects your experience.",
};

export default function AffiliateDisclosurePage() {
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
        Affiliate Disclosure
      </h1>

      <p>
        Nebrasketball participates in affiliate programs including Amazon Associates, the eBay Partner Network, Etsy Affiliates, and the Fanatics affiliate program via Commission Junction. These partnerships allow us to earn a small commission when you make a purchase through our links.
      </p>

      <p>
        When you click a link marked &ldquo;View Deal&rdquo; on this site and make a purchase on the retailer&apos;s website, we may receive a small referral commission. This comes at no additional cost to you — the price you pay is exactly the same whether or not you use our link.
      </p>

      <p>
        We only link to products that are genuinely relevant to Nebraska basketball fans. Our goal is to help you find the gear you&apos;re looking for, not to push products for the sake of commissions.
      </p>

      <p>
        All affiliate links on this site are marked with <code style={{ background: "var(--s2)", padding: "2px 6px", borderRadius: 2, fontSize: 13 }}>rel=&quot;sponsored&quot;</code> per Google&apos;s guidelines for affiliate and paid links.
      </p>

      <p>
        Commissioned links do not influence which products appear on this site or how they are ranked. Products are ranked by fan engagement — specifically, click count — not by commission rate or affiliate status.
      </p>

      <p>
        For more information about affiliate marketing disclosures, see the FTC&apos;s guidance:{" "}
        <a
          href="https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--red)", textDecoration: "underline" }}
        >
          Disclosures 101 for Social Media Influencers
        </a>.
      </p>

      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 32, fontStyle: "italic" }}>
        Last updated: March 2026
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
