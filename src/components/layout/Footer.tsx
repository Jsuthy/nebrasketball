import Link from "next/link";
import Disclaimer from "@/components/ui/Disclaimer";

const SPORTS_LINKS = [
  { href: "/basketball", label: "Basketball" },
  { href: "/how-to-watch", label: "How to Watch" },
  { href: "/scores", label: "Live Scores" },
  { href: "/news", label: "Notes" },
];

const OTHER_SPORTS_LINKS = [
  { href: "/football", label: "Football" },
  { href: "/volleyball", label: "Volleyball" },
];

const INFO_LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/legal", label: "Legal & Disclosures" },
  { href: "/legal#affiliate", label: "Affiliate Disclosure" },
  { href: "/legal#privacy", label: "Privacy Policy" },
];

const colHeadingStyle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  fontWeight: 800,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "var(--muted)",
  marginBottom: 10,
};

const linkStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "var(--ink-2)",
  textDecoration: "none",
  lineHeight: 1.9,
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "var(--paper)",
        borderTop: "1px solid var(--rule)",
        padding: "28px 16px 20px",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 28,
          maxWidth: 1100,
          margin: "0 auto",
        }}
        className="footer-grid"
      >
        <div>
          <Link
            href="/"
            style={{
              fontWeight: 800,
              letterSpacing: "-0.03em",
              fontSize: 20,
              textDecoration: "none",
              color: "var(--ink)",
            }}
          >
            Nebrasketball
          </Link>
          <p
            style={{
              fontSize: 13,
              color: "var(--muted)",
              maxWidth: 280,
              lineHeight: 1.55,
              marginTop: 10,
            }}
          >
            Independent beat desk for Nebraska men’s basketball — tip times, TV,
            and scores. Football and volleyball stay in the rail.
          </p>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 10 }}>
            Also from us:{" "}
            <a
              href="https://tariffstool.com"
              target="_blank"
              rel="noopener"
              style={{ color: "var(--ink-2)", textDecoration: "underline" }}
            >
              US tariff &amp; customs duty lookup
            </a>
          </p>
        </div>

        <div>
          <h4 style={colHeadingStyle}>Hoops desk</h4>
          {SPORTS_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={linkStyle}>
              {l.label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={colHeadingStyle}>Other sports</h4>
          {OTHER_SPORTS_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={linkStyle}>
              {l.label}
            </Link>
          ))}
        </div>

        <div>
          <h4 style={colHeadingStyle}>Info</h4>
          {INFO_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={linkStyle}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "8px auto 0" }}>
        <Disclaimer variant="full" />
      </div>

      <style>{`
        @media (max-width: 679px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 22px !important;
          }
        }
      `}</style>
    </footer>
  );
}
