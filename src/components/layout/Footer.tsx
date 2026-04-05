import Link from "next/link";
import Image from "next/image";
import Disclaimer from "@/components/ui/Disclaimer";

const SHOP_LINKS = [
  { href: "/category/tees", label: "Tees" },
  { href: "/category/hoodies", label: "Hoodies" },
  { href: "/category/hats", label: "Hats" },
  { href: "/category/jerseys", label: "Jerseys" },
  { href: "/shop", label: "All Gear" },
];

const SPORTS_LINKS = [
  { href: "/gear/football", label: "Football" },
  { href: "/gear/basketball", label: "Basketball" },
  { href: "/gear/volleyball", label: "Volleyball" },
  { href: "/gear/wrestling", label: "Wrestling" },
  { href: "/gear", label: "All Sports" },
];

const INFO_LINKS = [
  { href: "/about", label: "Our Story" },
  { href: "/legal", label: "Legal & Disclosures" },
  { href: "/legal#affiliate", label: "Affiliate Disclosure" },
  { href: "/legal#privacy", label: "Privacy Policy" },
  { href: "/news", label: "News" },
];

const colHeadingStyle: React.CSSProperties = {
  fontFamily: "'Barlow Condensed', sans-serif",
  fontWeight: 700,
  fontSize: 12,
  textTransform: "uppercase",
  letterSpacing: "0.15em",
  color: "rgba(255,255,255,0.45)",
  marginBottom: 14,
};

const linkStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  color: "rgba(255,255,255,0.38)",
  textDecoration: "none",
  lineHeight: 2.1,
  transition: "color 0.15s",
};

export default function Footer() {
  return (
    <footer
      style={{
        background: "#050505",
        borderTop: "1px solid var(--border)",
        padding: "44px 20px 24px",
      }}
    >
      {/* Top grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr",
          gap: 40,
          maxWidth: 960,
          margin: "0 auto",
        }}
        className="footer-grid"
      >
        {/* Col 1 — Brand */}
        <div>
          <Image
            src="/logos/logo-wordmark.png"
            alt="Nebrasketball"
            height={26}
            width={180}
            unoptimized
            style={{ height: 26, width: "auto", opacity: 0.82 }}
          />
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.28)",
              maxWidth: 240,
              lineHeight: 1.65,
              marginTop: 14,
            }}
          >
            The home for Nebraska Cornhuskers gear — every sport, every fan.
            Independent aggregator. Launched during Nebraska&apos;s historic 2026
            Sweet 16 run. GBR.
          </p>
        </div>

        {/* Col 2 — Shop */}
        <div>
          <h4 style={colHeadingStyle}>Shop</h4>
          {SHOP_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={linkStyle}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Col 3 — Sports */}
        <div>
          <h4 style={colHeadingStyle}>Sports</h4>
          {SPORTS_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={linkStyle}>
              {l.label}
            </Link>
          ))}
        </div>

        {/* Col 4 — Info */}
        <div>
          <h4 style={colHeadingStyle}>Info</h4>
          {INFO_LINKS.map((l) => (
            <Link key={l.href} href={l.href} style={linkStyle}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ maxWidth: 960, margin: "24px auto 0" }}>
        <Disclaimer variant="full" />
      </div>

      {/* Responsive: single column on mobile */}
      <style>{`
        @media (max-width: 679px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
            gap: 28px !important;
          }
        }
      `}</style>
    </footer>
  );
}
