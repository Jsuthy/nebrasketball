import type { Metadata } from "next";
import Link from "next/link";
import Disclaimer from "@/components/ui/Disclaimer";
import EmailCapture from "@/components/ui/EmailCapture";
import BasketballRankings from "@/components/schedule/BasketballRankings";
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

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontSize: 17,
  fontWeight: 800,
  margin: "0 0 14px",
};

const MILESTONES = [
  {
    stat: "28-7",
    label: "2025-26 record",
    detail:
      "A 20-0 start, a peak of No. 5 in the AP Poll, and a program-record 15 Big Ten wins.",
  },
  {
    stat: "1st",
    label: "NCAA Tournament win in program history",
    detail:
      "March 19, 2026: Nebraska 76, Troy 47. The 0-for-7 tournament drought — over.",
  },
  {
    stat: "S16",
    label: "First Sweet 16, as a 4-seed",
    detail:
      "Beat Vanderbilt 74-72 to break through, then fell 77-71 to Iowa. The rematch comes to Lincoln this season.",
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
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 4,
        background: "var(--s1)",
        padding: "14px 18px",
        flex: 1,
        minWidth: 240,
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          fontSize: 14,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
        {teams.map((team) => (
          <li
            key={team}
            style={{
              padding: "5px 0",
              borderTop: "1px solid var(--border)",
              color: "var(--muted)",
              fontSize: 14,
            }}
          >
            {team}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function BasketballPage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px 60px" }}>
      <header style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--red)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          This Is Nebrasketball
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 44,
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Nebraska Basketball HQ
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, maxWidth: 660, marginTop: 12 }}>
          The site is named for this team for a reason. Fred Hoiberg&apos;s
          Huskers finally broke through in 2026 — the first NCAA tournament win
          in program history and a Sweet 16 run — and nearly the entire core
          returns. This page is the year-round home for the schedule as
          it&apos;s announced, live scores, rankings, and the roster chasing
          the next one.
        </p>
      </header>

      <section>
        <h2 style={sectionTitle}>The 2026 Breakthrough</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {MILESTONES.map((m) => (
            <div
              key={m.stat}
              style={{
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--red)",
                borderRadius: 4,
                background: "var(--s1)",
                padding: "18px 20px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 900,
                  fontSize: 40,
                  lineHeight: 1,
                  color: "var(--red)",
                }}
              >
                {m.stat}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  fontSize: 14,
                  margin: "8px 0 4px",
                }}
              >
                {m.label}
              </div>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: 13, lineHeight: 1.5 }}>
                {m.detail}
              </p>
            </div>
          ))}
        </div>
        <p style={{ marginTop: 14, fontSize: 14 }}>
          <Link href="/news" style={{ color: "var(--red)", fontWeight: 600 }}>
            Full Sweet 16 coverage in News →
          </Link>
        </p>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={sectionTitle}>2026-27: Announced So Far</h2>
        <div
          style={{
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--red)",
            borderRadius: 4,
            background: "var(--s1)",
            padding: "16px 20px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              textTransform: "uppercase",
              fontSize: 15,
              marginBottom: 4,
            }}
          >
            🏆 The defending national champs are coming to Lincoln
          </div>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
            2026 champion Michigan visits Pinnacle Bank Arena this season — the
            first reigning national champ to play in Lincoln since Kansas in
            2009. Iowa also comes to town for a Sweet 16 rematch. Dates land
            with the full Big Ten schedule release in late summer.
          </p>
        </div>

        <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 4 }}>
          <table className="sched-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 520 }}>
            <thead>
              <tr
                style={{
                  fontFamily: "var(--font-display)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: 12,
                  color: "var(--muted)",
                  textAlign: "left",
                }}
              >
                <th style={{ padding: "10px 14px" }}>Date</th>
                <th style={{ padding: "10px 14px" }}>Opponent</th>
                <th className="sched-loc" style={{ padding: "10px 14px" }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {ANNOUNCED_GAMES_2026_27.map((game) => (
                <tr
                  key={`${game.date}-${game.opponent}`}
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                    {game.date ? formatDate(game.date) : "TBA"}
                  </td>
                  <td style={{ padding: "12px 14px", fontWeight: 600 }}>
                    <span style={{ color: "var(--muted)", marginRight: 6 }}>
                      {game.homeAway === "home" ? "vs" : game.homeAway === "away" ? "at" : "vs*"}
                    </span>
                    {game.opponent}
                    {game.note && (
                      <span style={{ display: "block", fontSize: 11, fontWeight: 400, color: "var(--muted)", marginTop: 2 }}>
                        {game.note}
                      </span>
                    )}
                  </td>
                  <td className="sched-loc" style={{ padding: "12px 14px", color: "var(--muted)", fontSize: 13 }}>
                    {game.venue}
                    <span style={{ display: "block", fontSize: 11 }}>{game.city}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: "var(--muted)", fontSize: 12, marginTop: 10 }}>
          * neutral site. Home nonconference games, Big Ten dates, and TV
          assignments are still to be announced — this page updates as they
          land, and live scores appear here and on the{" "}
          <Link href="/scores" style={{ color: "var(--red)" }}>
            Husker scoreboard
          </Link>{" "}
          all season.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 16 }}>
          <OpponentList title="Big Ten — At Pinnacle Bank Arena" teams={BIG_TEN_HOME} />
          <OpponentList title="Big Ten — On the Road" teams={BIG_TEN_AWAY} />
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={sectionTitle}>The 2026-27 Roster</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 14px", maxWidth: 660 }}>
          The core that made history returns — led by first-team All-Big Ten
          forward Pryce Sandfort and Sixth Man of the Year Braden Frager — plus
          a transfer class built to go further.
        </p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <OpponentList title="Key Returners" teams={RETURNING} />
          <OpponentList title="New Huskers" teams={INCOMING} />
        </div>
      </section>

      <BasketballRankings />

      <section style={{ marginTop: 48 }}>
        <h2 style={sectionTitle}>How to Watch Nebraska Basketball</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, maxWidth: 660, margin: 0 }}>
          Big Ten basketball airs across FOX, FS1, CBS, NBC/Peacock, and BTN,
          with non-televised games streaming on B1G+ — assignments are announced
          with the full conference schedule. BTN and FS1 are carried on most
          cable packages and live-TV streamers like YouTube TV, Hulu + Live TV,
          and Fubo. TV info lands here automatically as each game is announced.
        </p>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={sectionTitle}>Never Miss a Game</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 14px" }}>
          Schedule releases, TV announcements, and score recaps in your inbox.
        </p>
        <EmailCapture />
        <p style={{ marginTop: 20, fontSize: 14 }}>
          <Link href="/gear/basketball" style={{ color: "var(--red)", fontWeight: 600 }}>
            Shop Nebraska basketball gear →
          </Link>
        </p>
      </section>

      <div style={{ marginTop: 40 }}>
        <Disclaimer variant="short" />
      </div>
    </div>
  );
}
