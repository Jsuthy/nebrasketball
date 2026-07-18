import type { Metadata } from "next";
import Link from "next/link";
import Disclaimer from "@/components/ui/Disclaimer";
import EmailCapture from "@/components/ui/EmailCapture";
import RelatedLinks, { relatedBreadcrumbJsonLd } from "@/components/ui/RelatedLinks";
import HighlightsRail from "@/components/media/HighlightsRail";
import { SITE_URL } from "@/lib/constants";
import {
  VOLLEYBALL_ROSTER_2026,
  VOLLEYBALL_COACH,
  VOLLEYBALL_COACH_NOTE,
  ROSTER_STORYLINE,
} from "@/lib/schedule/volleyball-roster";

export const metadata: Metadata = {
  title: "Nebraska Volleyball Roster 2026 — Players, Positions & Numbers",
  description:
    "The full 2026 Nebraska volleyball roster: every player with jersey number, position, height, class and hometown — led by Harper Murray, Andi Jackson and Bergen Reilly under coach Dani Busboom Kelly.",
  alternates: { canonical: "/volleyball/roster" },
  openGraph: {
    title: "Nebraska Volleyball Roster 2026",
    description:
      "Every Husker on the 2026 roster — numbers, positions, heights and hometowns.",
  },
};

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: 22,
  fontWeight: 800,
  color: "var(--cream)",
  margin: "0 0 16px",
};

function rosterJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name: "Nebraska Volleyball",
    sport: "Volleyball",
    url: `${SITE_URL}/volleyball/roster`,
    coach: { "@type": "Person", name: VOLLEYBALL_COACH },
    athlete: VOLLEYBALL_ROSTER_2026.map((p) => ({
      "@type": "Person",
      name: p.name,
    })),
  };
}

export default function RosterPage() {
  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "56px 20px 72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(rosterJsonLd()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            relatedBreadcrumbJsonLd("/volleyball/roster", "Nebraska Volleyball Roster 2026")
          ),
        }}
      />

      <div className="ghost-num" style={{ top: -30, right: -20, fontSize: "clamp(160px, 28vw, 320px)" }} aria-hidden>
        27
      </div>

      <header style={{ marginBottom: 40, position: "relative", zIndex: 1 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>
          Go Big Red · 2026 Season
        </div>
        <h1
          className="stat-hero"
          style={{ fontSize: "clamp(46px, 8vw, 84px)", textTransform: "uppercase", margin: 0 }}
        >
          Nebraska Volleyball Roster 2026
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 16, lineHeight: 1.65, maxWidth: 660, marginTop: 18 }}>
          {ROSTER_STORYLINE} Head coach: {VOLLEYBALL_COACH} — {VOLLEYBALL_COACH_NOTE}
        </p>
      </header>

      <section className="reveal" style={{ position: "relative", zIndex: 1 }}>
        <h2 style={sectionTitle}>The 2026 Huskers</h2>
        <div style={{ overflowX: "auto", background: "var(--s1)", border: "1px solid var(--border)", borderRadius: 6 }}>
          <table className="sched-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 560 }}>
            <thead>
              <tr
                style={{
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  fontSize: 12,
                  color: "var(--faint)",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "12px 16px" }}>#</th>
                <th style={{ padding: "12px 16px" }}>Player</th>
                <th style={{ padding: "12px 16px" }}>Pos</th>
                <th style={{ padding: "12px 16px" }}>Ht</th>
                <th style={{ padding: "12px 16px" }}>Class</th>
                <th className="sched-loc" style={{ padding: "12px 16px" }}>Hometown</th>
              </tr>
            </thead>
            <tbody>
              {VOLLEYBALL_ROSTER_2026.map((p) => (
                <tr key={p.num} style={{ borderTop: "1px solid var(--border)", background: p.note ? "var(--s2)" : "transparent" }}>
                  <td className="font-data" style={{ padding: "13px 16px", color: "var(--accent)", fontWeight: 700 }}>
                    {p.num}
                  </td>
                  <td style={{ padding: "13px 16px", fontWeight: 600, color: "var(--text)" }}>
                    {p.name}
                    {p.note && (
                      <span style={{ display: "block", fontSize: 11, fontWeight: 400, color: "var(--faint)", marginTop: 3 }}>
                        {p.note}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "13px 16px" }}>{p.pos}</td>
                  <td className="font-data" style={{ padding: "13px 16px", fontSize: 13 }}>{p.height}</td>
                  <td style={{ padding: "13px 16px", color: "var(--muted)", fontSize: 13 }}>{p.year}</td>
                  <td className="sched-loc" style={{ padding: "13px 16px", color: "var(--muted)", fontSize: 13 }}>
                    {p.hometown}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: "var(--faint)", fontSize: 12, marginTop: 12 }}>
          Verified against the official roster, July 2026. National-team camp selections highlighted.
        </p>
      </section>

      <HighlightsRail sport="volleyball" title="Latest Volleyball Video" />

      <section className="reveal" style={{ marginTop: 64, position: "relative", zIndex: 1 }}>
        <h2 style={sectionTitle}>Follow This Team</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 14px", maxWidth: 620 }}>
          The 2026 schedule opens August 29 in Las Vegas — every match, time and
          TV channel is on the{" "}
          <Link href="/volleyball" style={{ color: "var(--accent)", fontWeight: 600 }}>
            full volleyball schedule
          </Link>
          , and the crowds they draw live on the{" "}
          <Link href="/volleyball/attendance" style={{ color: "var(--accent)", fontWeight: 600 }}>
            attendance record tracker
          </Link>
          .
        </p>
        <EmailCapture />
      </section>

      <RelatedLinks currentPath="/volleyball/roster" />

      <div style={{ marginTop: 48 }}>
        <Disclaimer variant="short" />
      </div>
    </div>
  );
}
