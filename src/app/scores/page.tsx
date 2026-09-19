import type { Metadata } from "next";
import Link from "next/link";
import LiveScores from "@/components/scores/LiveScores";
import Disclaimer from "@/components/ui/Disclaimer";
import EmailCapture from "@/components/ui/EmailCapture";
import AffiliateRail from "@/components/beat/AffiliateRail";
import { getScoreboard, type NcaaSport } from "@/lib/ncaa/api";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Nebraska Live Scores — Husker Volleyball, Football & Basketball Today",
  description:
    "Live Nebraska Cornhuskers scores today, updated every minute — Husker volleyball, football, and basketball, plus top-25 games around the country.",
  alternates: { canonical: "/scores" },
};

const SPORTS: Array<{ sport: NcaaSport; label: string }> = [
  { sport: "basketball-men", label: "Basketball" },
  { sport: "football", label: "Football" },
  { sport: "volleyball-women", label: "Volleyball" },
];

function centralToday(): { year: number; month: number; day: number } {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  return { year: get("year"), month: get("month"), day: get("day") };
}

export default async function ScoresPage() {
  const today = centralToday();
  const boards = await Promise.all(
    SPORTS.map(async ({ sport, label }) => ({
      sport,
      label,
      games: (await getScoreboard(sport, today, 60)).slice(0, 12),
    }))
  );
  const initial = { sports: boards.filter((b) => b.games.length > 0) };

  return (
    <div className="beat-wrap">
      <div className="beat-stack">
        <div>
          <article className="beat-lead">
            <div className="beat-pad">
              <div className="beat-sec">Live · refreshes every minute</div>
              <h1>Husker scoreboard</h1>
              <p>
                Today’s Nebraska games plus ranked matchups in basketball,
                football, and volleyball. Basketball leads the desk; football
                and volleyball stay in the rail.
              </p>
            </div>
          </article>
          <div style={{ marginTop: 12 }}>
            <LiveScores initial={initial} />
          </div>
        </div>
        <aside className="beat-rail">
          <AffiliateRail tv="BTN" />
          <EmailCapture source="scores" variant="rail" />
          <div className="beat-widget">
            <h2>Desk links</h2>
            <div style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 700 }}>
              <Link href="/basketball" style={{ textDecoration: "none" }}>
                Basketball HQ →
              </Link>
              <Link href="/how-to-watch" style={{ textDecoration: "none" }}>
                How to watch →
              </Link>
              <Link href="/football" style={{ textDecoration: "none", color: "var(--muted)", fontWeight: 500 }}>
                Football schedule
              </Link>
              <Link href="/volleyball" style={{ textDecoration: "none", color: "var(--muted)", fontWeight: 500 }}>
                Volleyball schedule
              </Link>
            </div>
          </div>
        </aside>
      </div>
      <Disclaimer variant="short" />
    </div>
  );
}
