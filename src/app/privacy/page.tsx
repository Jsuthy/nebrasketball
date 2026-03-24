import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how Nebrasketball handles your data. We collect minimal anonymous analytics and never sell your information.",
};

export default function PrivacyPage() {
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
        Privacy Policy
      </h1>

      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, textTransform: "uppercase", marginTop: 32, marginBottom: 12, color: "var(--red)" }}>
        What We Collect
      </h2>
      <p>
        When you click a &ldquo;View Deal&rdquo; button, we log an anonymous click event that includes the product ID, the page you were on, the referring URL, and your browser&apos;s user agent string. No personally identifiable information is collected from this interaction.
      </p>
      <p>
        If you subscribe to our email list, we store your email address in our database. We use it only to send you gear alerts and updates about Nebraska basketball. We never sell, rent, or share your email address with third parties.
      </p>

      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, textTransform: "uppercase", marginTop: 32, marginBottom: 12, color: "var(--red)" }}>
        What We Don&apos;t Collect
      </h2>
      <p>
        We do not collect names, physical addresses, payment information, or any other personal data. All purchases happen directly on the retailer&apos;s website (Amazon, eBay, Etsy, or Fanatics), not on ours.
      </p>

      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, textTransform: "uppercase", marginTop: 32, marginBottom: 12, color: "var(--red)" }}>
        Cookies
      </h2>
      <p>
        Nebrasketball does not set any tracking cookies beyond what is technically required by Next.js for the site to function. We do not use cookie-based advertising or retargeting.
      </p>

      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, textTransform: "uppercase", marginTop: 32, marginBottom: 12, color: "var(--red)" }}>
        Analytics
      </h2>
      <p>
        We may use Google Analytics to understand how visitors use the site. If enabled, Google Analytics collects anonymous usage data. You can opt out using a browser extension or by disabling JavaScript.
      </p>

      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, textTransform: "uppercase", marginTop: 32, marginBottom: 12, color: "var(--red)" }}>
        Third-Party Links
      </h2>
      <p>
        When you click through to Amazon, eBay, Etsy, or Fanatics, their respective privacy policies apply. We encourage you to review those policies on their sites.
      </p>

      <h2 className="font-display" style={{ fontWeight: 800, fontSize: 20, textTransform: "uppercase", marginTop: 32, marginBottom: 12, color: "var(--red)" }}>
        Contact
      </h2>
      <p>
        If you have questions about this privacy policy, email us at{" "}
        <a href="mailto:hello@nebrasketball.com" style={{ color: "var(--red)", textDecoration: "underline" }}>
          hello@nebrasketball.com
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
