import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Disclaimer from "@/components/ui/Disclaimer";
import EmailCapture from "@/components/ui/EmailCapture";
import BasketballRankings from "@/components/schedule/BasketballRankings";
import HighlightsRail from "@/components/media/HighlightsRail";
import RelatedLinks, { relatedBreadcrumbJsonLd } from "@/components/ui/RelatedLinks";
import { PhotoCredit } from "@/components/media/PhotoHero";
import AffiliateRail from "@/components/beat/AffiliateRail";
import ScoreboardWidget from "@/components/beat/ScoreboardWidget";
import { PHOTOS } from "@/lib/media/photos";
import {
  ANNOUNCED_GAMES_2026_27,
  BIG_TEN_HOME,
  BIG_TEN_AWAY,
  RETURNING,
  INCOMING,
} from "@/lib/schedule/basketball-data";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Nebraska Basketball 2026-27 — Schedule, Roster & the Sweet 16 Momentum",
  description:
    "The home of Nebrasketball: the announced 2026-27 Nebraska basketball schedule, Big Ten opponents, roster, rankings, and the program's historic Sweet 16 run — with defending champ Michigan coming to Lincoln.",
  alternates: { canonical: "/basketball" },
  openGraph: {
    title: "Nebrasketball — Nebraska Basketball HQ",
    description:
      "Sweet 16 momentum, the 2026-27 schedule as it's announced, and the defending national champs coming to Lincoln.",
  },
};

const MILESTONES = [
  {
    kicker: "Record",
    title: "28-7, a 20-0 start, No. 5 peak",
    detail: "Program-record 15 Big Ten wins. The Sweet 16 hangover still has a schedule.",
  },
  {
    kicker: "Firsts",
    title: "First NCAA Tournament win, then a Sweet 16",
    detail: "March 19: Nebraska 76, Troy 47. Then Vanderbilt 74-72. Iowa 77-71 ended it.",
  },
  {
    kicker: "Lincoln",
    title: "Iowa rematch and Michigan, dates TBA",
    detail: "Defending champ Michigan is the first reigning title team in Lincoln since Kansas in 2009.",
  },
];

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function OpponentList({ title, teams }: { title: string; teams: string[] }) {
  return (
    <div className="beat-widget" style={{ flex: 1, minWidth: 240 }}>
      <h2>{title}</h2>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {teams.map((team) => (
          <li
            key={team}
            className="beat-scoreline"
            style={{ fontWeight: 500, fontSize: 13 }}
          >
            <span>{team}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BasketballPage() {
  const photo = PHOTOS.pinnacleBankArena;

  return (
    <div className="beat-wrap">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(relatedBreadcrumbJsonLd("/basketball", "Nebraska Basketball HQ")),
        }}
      />

      <div className="beat-stack">
        <div>
          <article className="beat-lead">
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              priority
              className="beat-lead-photo"
              sizes="(max-width: 760px) 100vw, 680px"
            />
            <div className="beat-pad">
              <div className="beat-sec">Men’s basketball · Lincoln</div>
              <h1>Nebraska Basketball HQ — the Sweet 16 rematch has a home date, not a day.</h1>
              <p>
                Fred Hoiberg’s Huskers broke through in 2026: first NCAA tournament
                win, first Sweet 16. Nearly the entire core returns. This page is
                the year-round desk for the announced slate, live scores, rankings,
                and the roster chasing the next one.
              </p>
              <div style={{ marginTop: 10 }}>
                <PhotoCredit photo={photo} />
              </div>
            </div>
          </article>

          <div className="beat-river">
            {MILESTONES.map((m) => (
              <article key={m.kicker} className="beat-story" style={{ gridTemplateColumns: "1fr" }}>
                <div>
                  <div className="beat-sec">{m.kicker}</div>
                  <h3>{m.title}</h3>
                  <span>{m.detail}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="beat-rail">
          <ScoreboardWidget
            lines={[
              { left: "NEB 71", right: "IOWA 77" },
              { left: "NEB 74", right: "VAN 72" },
              { left: "NEB 76", right: "TROY 47" },
              { left: "Next: at BYU", right: "Oct 16", next: true },
            ]}
          />
          <AffiliateRail tv="BTN" />
          <EmailCapture source="basketball" variant="rail" />
        </aside>
      </div>

      <section style={{ marginTop: 18 }}>
        <div className="beat-widget">
          <h2>2026-27 — announced so far</h2>
          <p style={{ margin: "0 0 10px", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>
            Michigan visits Pinnacle Bank Arena — first reigning national champ
            in Lincoln since Kansas in 2009. Iowa also comes to town. Dates land
            with the Big Ten release.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table className="beat-table sched-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Opponent</th>
                  <th className="sched-loc">Location</th>
                </tr>
              </thead>
              <tbody>
                {ANNOUNCED_GAMES_2026_27.map((game) => (
                  <tr key={`${game.date}-${game.opponent}`}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      {game.date ? formatDate(game.date) : "TBA"}
                    </td>
                    <td>
                      <strong>
                        {game.homeAway === "home" ? "vs" : game.homeAway === "away" ? "at" : "vs*"}{" "}
                        {game.opponent}
                      </strong>
                      {game.note && (
                        <span style={{ display: "block", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                          {game.note}
                        </span>
                      )}
                    </td>
                    <td className="sched-loc" style={{ color: "var(--muted)", fontSize: 13 }}>
                      {game.venue}
                      <span style={{ display: "block", fontSize: 11 }}>{game.city}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: "var(--muted)", fontSize: 12, margin: "10px 0 0" }}>
            * neutral site. Home nonconference games, Big Ten dates, and TV
            assignments are still to be announced. Live scores on the{" "}
            <Link href="/scores" style={{ color: "var(--scarlet)", fontWeight: 700 }}>
              Husker scoreboard
            </Link>
            .
          </p>
        </div>
      </section>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        <OpponentList title="Big Ten — at Pinnacle Bank Arena" teams={BIG_TEN_HOME} />
        <OpponentList title="Big Ten — on the road" teams={BIG_TEN_AWAY} />
      </div>

      <section style={{ marginTop: 12 }}>
        <div className="beat-widget">
          <h2>The 2026-27 roster</h2>
          <p style={{ margin: "0 0 10px", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}>
            The core that made history returns — Pryce Sandfort and Braden Frager
            — plus a transfer class built to go further.
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
          <OpponentList title="Key returners" teams={RETURNING} />
          <OpponentList title="New Huskers" teams={INCOMING} />
        </div>
      </section>

      <HighlightsRail sport="basketball" title="Latest basketball video" />

      <BasketballRankings />

      <section className="beat-widget" style={{ marginTop: 18 }}>
        <h2>How to watch Nebraska basketball</h2>
        <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.6 }}>
          Big Ten basketball airs across FOX, FS1, CBS, NBC/Peacock, and BTN,
          with non-televised games streaming on B1G+. Channel assignments land
          with the conference schedule. Affiliate streamers sit in the rail —
          Fubo, YouTube TV, Sling — as a native desk module.
        </p>
      </section>

      <RelatedLinks currentPath="/basketball" />

      <div style={{ marginTop: 16 }}>
        <Disclaimer variant="short" />
      </div>
    </div>
  );
}
