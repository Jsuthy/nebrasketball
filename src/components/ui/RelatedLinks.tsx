import Link from "next/link";
import { SITE_URL } from "@/lib/constants";

// Descriptive-anchor internal links on every sports page: cross-linking for
// readers and topical-authority signals for search. Excludes the current page.

const ALL_LINKS = [
  { href: "/basketball", label: "Nebraska Basketball HQ — 2026-27 schedule & roster" },
  { href: "/volleyball", label: "Nebraska volleyball schedule 2026 — times & TV" },
  { href: "/volleyball/roster", label: "Nebraska volleyball roster 2026 — every player" },
  { href: "/volleyball/attendance", label: "Volleyball attendance records — the 92,003 book" },
  { href: "/football", label: "Nebraska football schedule 2026 — kickoffs & TV" },
  { href: "/scores", label: "Live Husker scoreboard — every sport, today" },
  { href: "/news", label: "Husker news & headlines" },
];

export function relatedBreadcrumbJsonLd(pagePath: string, pageName: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Nebrasketball", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: pageName, item: `${SITE_URL}${pagePath}` },
    ],
  };
}

export default function RelatedLinks({ currentPath }: { currentPath: string }) {
  const links = ALL_LINKS.filter((l) => l.href !== currentPath);
  return (
    <section className="reveal" style={{ marginTop: 64, position: "relative", zIndex: 1 }}>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: 22,
          fontWeight: 800,
          color: "var(--cream)",
          margin: "0 0 16px",
        }}
      >
        More Husker HQ
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 10,
        }}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="news-card"
            style={{
              background: "var(--s1)",
              border: "1px solid var(--border)",
              borderRadius: 6,
              padding: "13px 18px",
              textDecoration: "none",
              color: "var(--text)",
              fontSize: 14,
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              gap: 10,
              alignItems: "center",
            }}
          >
            {link.label}
            <span style={{ color: "var(--accent)", flexShrink: 0 }}>→</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
