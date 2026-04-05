import type { Metadata } from "next";
import Link from "next/link";
import { SITE_DISCLAIMER } from "@/lib/compliance";
import Disclaimer from "@/components/ui/Disclaimer";

export const metadata: Metadata = {
  title: "Legal — Terms, Privacy & Trademark Disclaimer",
  description:
    "Legal terms, trademark disclaimer, affiliate disclosure, privacy policy and terms of use for Nebrasketball.com. Independent fan site. Not affiliated with UNL or NCAA.",
};

const headingStyle: React.CSSProperties = {
  fontWeight: 800,
  fontSize: 20,
  textTransform: "uppercase",
  marginTop: 40,
  marginBottom: 12,
  color: "var(--red)",
};

export default function LegalPage() {
  return (
    <article
      className="prose-page"
      style={{ maxWidth: 680, margin: "0 auto", padding: "36px 20px" }}
    >
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
        Legal
      </h1>

      {/* 1. TRADEMARK DISCLAIMER */}
      <h2 id="trademark" className="font-display" style={headingStyle}>
        Trademark Disclaimer
      </h2>
      <p>
        Nebrasketball.com is an independent, unofficial fan site and affiliate
        aggregator. We are not affiliated with, endorsed by, or connected to the
        University of Nebraska&ndash;Lincoln, its athletic department, the Big
        Ten Conference, or any official licensing program. This site is operated
        by fans, for fans.
      </p>
      <p>
        All team names, logos, and trademarks &mdash; including &ldquo;Nebraska,&rdquo;
        &ldquo;Cornhuskers,&rdquo; &ldquo;Huskers,&rdquo; and associated marks
        &mdash; are property of the University of Nebraska&ndash;Lincoln and its
        officially licensed vendors. We reference them in a descriptive,
        nominative fair-use capacity to help fans identify and find third-party
        products from authorized retailers.
      </p>
      <p>
        We do not sell merchandise directly. All purchases happen on third-party
        platforms (Amazon, eBay, Etsy, Fanatics, and others) that are licensed
        to carry this merchandise. Our role is limited to aggregating and
        linking to products on those platforms.
      </p>

      {/* 2. AFFILIATE DISCLOSURE */}
      <h2 id="affiliate" className="font-display" style={headingStyle}>
        Affiliate Disclosure
      </h2>
      <p>
        Nebrasketball participates in affiliate programs including Amazon
        Associates, the eBay Partner Network, Etsy Affiliates, and the Fanatics
        affiliate program via Commission Junction. These partnerships allow us
        to earn a small commission when you make a purchase through our links.
      </p>
      <p>
        When you click a link marked &ldquo;View Deal&rdquo; on this site and
        make a purchase on the retailer&apos;s website, we may receive a small
        referral commission. This comes at no additional cost to you &mdash; the
        price you pay is exactly the same whether or not you use our link.
      </p>
      <p>
        All affiliate links on this site are marked with{" "}
        <code
          style={{
            background: "var(--s2)",
            padding: "2px 6px",
            borderRadius: 2,
            fontSize: 13,
          }}
        >
          rel=&quot;sponsored&quot;
        </code>{" "}
        per Google&apos;s guidelines. Products are ranked by fan engagement
        (click count), not by commission rate or affiliate status.
      </p>
      <p>
        For more information about affiliate marketing disclosures, see the{" "}
        <a
          href="https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "var(--red)", textDecoration: "underline" }}
        >
          FTC&apos;s Disclosures 101 guide
        </a>
        .
      </p>

      {/* 3. TERMS OF USE */}
      <h2 id="terms" className="font-display" style={headingStyle}>
        Terms of Use
      </h2>
      <p>
        This site is for informational and discovery purposes. We aggregate
        product listings from third-party retailers to help fans find Nebraska
        Cornhuskers merchandise.
      </p>
      <ul style={{ color: "rgba(255,255,255,0.68)", fontSize: 15, lineHeight: 1.8 }}>
        <li>We make no warranties about product availability or pricing.</li>
        <li>
          Prices shown may not reflect current retailer pricing &mdash; always
          verify the price on the retailer&apos;s website before purchasing.
        </li>
        <li>Product images are sourced from retailer APIs and belong to their respective owners.</li>
        <li>We reserve the right to update or remove listings at any time.</li>
      </ul>
      <p>
        Questions? Contact us at{" "}
        <a
          href="mailto:hello@nebrasketball.com"
          style={{ color: "var(--red)", textDecoration: "underline" }}
        >
          hello@nebrasketball.com
        </a>
        .
      </p>

      {/* 4. PRIVACY POLICY */}
      <h2 id="privacy" className="font-display" style={headingStyle}>
        Privacy Policy
      </h2>
      <p>
        <strong>What we collect:</strong> When you click a &ldquo;View
        Deal&rdquo; button, we log an anonymous click event (product ID, page,
        referrer, user agent). If you subscribe to our email list, we store your
        email address for gear alerts only.
      </p>
      <p>
        <strong>What we don&apos;t collect:</strong> Names, physical addresses,
        payment information, or any other personal data. All purchases happen
        directly on the retailer&apos;s website.
      </p>
      <p>
        <strong>Cookies:</strong> We do not set tracking cookies beyond what
        Next.js requires for the site to function. No cookie-based advertising
        or retargeting.
      </p>
      <p>
        <strong>Analytics:</strong> We may use Google Analytics for anonymous
        usage data. You can opt out using a browser extension or by disabling
        JavaScript.
      </p>
      <p>
        <strong>Third-party links:</strong> When you click through to Amazon,
        eBay, Etsy, or Fanatics, their privacy policies apply.
      </p>

      <p
        style={{
          fontSize: 12,
          color: "var(--muted)",
          marginTop: 32,
          fontStyle: "italic",
        }}
      >
        Last updated: April 2026
      </p>

      <Disclaimer variant="full" />

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
