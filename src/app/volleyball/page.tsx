import type { Metadata } from "next";
import Link from "next/link";
import SchedulePageContent from "@/components/schedule/SchedulePageContent";
import HighlightsRail from "@/components/media/HighlightsRail";
import { VOLLEYBALL_2026 } from "@/lib/schedule/data";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Nebraska Volleyball Schedule 2026 — Dates, Times, TV & How to Watch",
  description:
    "Full 2026 Nebraska volleyball schedule with match times, TV channels, live scores, and how to watch every Husker match — from the Las Vegas opener to Wrigley Field. Auto-updated all season.",
  alternates: { canonical: "/volleyball" },
  openGraph: {
    title: "Nebraska Volleyball Schedule 2026 — TV, Times & Scores",
    description:
      "Every 2026 Husker volleyball match: dates, times, TV channels, and live scores. Updated automatically all season.",
  },
};

const HOW_TO_WATCH = [
  {
    label: "Big Ten Network & B1G+",
    body: "Most Nebraska volleyball matches air on Big Ten Network or stream on B1G+ (subscription). BTN is carried on most cable/satellite packages plus live-TV streamers like YouTube TV, Hulu + Live TV, and Fubo. Conference broadcast assignments are announced in waves — this page updates automatically when each match's TV home is set.",
  },
  {
    label: "FOX Big Ten/SEC Challenge",
    body: "The September 6 match against Missouri — played outdoors at Wrigley Field in Chicago — airs nationally on FOX as part of the Big Ten/SEC Challenge.",
  },
  {
    label: "Listen / follow live",
    body: "Husker Radio Network carries every match statewide, and live scores appear right on this page on match days.",
  },
];

function AttendanceTeaser() {
  return (
    <section style={{ marginTop: 48 }}>
      <div
        style={{
          border: "1px solid var(--border)",
          borderLeft: "3px solid var(--red)",
          borderRadius: 4,
          background: "var(--s1)",
          padding: "18px 22px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 800,
            textTransform: "uppercase",
            fontSize: 16,
            marginBottom: 6,
          }}
        >
          92,003 — a world record that still stands
        </div>
        <p style={{ margin: "0 0 10px", color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
          Nebraska volleyball doesn&apos;t just win — it sets attendance records
          nobody else can touch, at home and on the road.
        </p>
        <Link
          href="/volleyball/attendance"
          style={{ color: "var(--red)", fontWeight: 600, fontSize: 14 }}
        >
          See the Husker volleyball attendance record tracker →
        </Link>
      </div>
    </section>
  );
}

export default function VolleyballPage() {
  return (
    <SchedulePageContent
      schedule={VOLLEYBALL_2026}
      pagePath="/volleyball"
      heroKicker="Go Big Red · 2026 Season"
      heroTitle="Nebraska Volleyball Schedule 2026"
      intro="Every Husker volleyball match in one place — dates, times, TV channels, and live scores, updated automatically all season. Nebraska opens in Las Vegas on August 29, plays outdoors at Wrigley Field on September 6, and hosts a loaded Big Ten slate at the Devaney Center."
      howToWatch={HOW_TO_WATCH}
      rankingsNote="Nebraska highlighted. Updates automatically when new polls are released."
      gearSlug="volleyball"
      extraSection={
        <>
          <AttendanceTeaser />
          <HighlightsRail sport="volleyball" title="Latest Volleyball Video" />
        </>
      }
    />
  );
}
