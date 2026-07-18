"use client";

import { useEffect, useState } from "react";
import type { ScoreboardGame } from "@/lib/ncaa/api";

interface ScoresPayload {
  sports: Array<{ sport: string; label: string; games: ScoreboardGame[] }>;
}

const POLL_MS = 60_000;

function TeamRow({ team, state }: { team: ScoreboardGame["home"]; state: string }) {
  const isNebraska = team.seo === "nebraska";
  const dimmed = state === "final" && !team.winner;
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "7px 0",
        fontWeight: isNebraska ? 700 : 500,
        color: dimmed ? "var(--faint)" : "var(--text)",
      }}
    >
      <span style={{ fontSize: 15 }}>
        {team.rank !== null && (
          <span
            className="font-data"
            style={{ color: "var(--faint)", fontSize: 11, marginRight: 7 }}
          >
            {team.rank}
          </span>
        )}
        {team.name}
        {isNebraska && (
          <span
            style={{
              color: "var(--accent)",
              fontSize: 10,
              marginLeft: 7,
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              letterSpacing: "0.1em",
            }}
          >
            GBR
          </span>
        )}
      </span>
      <span
        className="font-data"
        style={{
          fontSize: 26,
          fontWeight: 800,
          color: dimmed ? "var(--faint)" : "var(--cream)",
          lineHeight: 1,
        }}
      >
        {team.score ?? ""}
      </span>
    </div>
  );
}

function GameCard({ game }: { game: ScoreboardGame }) {
  const isLive = game.state === "live";
  return (
    <div
      style={{
        background: "var(--s1)",
        border: isLive ? "1px solid rgba(208,0,0,0.5)" : "1px solid var(--border)",
        borderRadius: 6,
        padding: "14px 18px",
        minWidth: 240,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: isLive ? "var(--accent)" : "var(--faint)",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isLive && (
            <span
              className="pulse"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--red)",
                display: "inline-block",
              }}
            />
          )}
          <span className={isLive || game.state === "pre" ? "font-data" : undefined}>
            {isLive
              ? game.currentPeriod
              : game.state === "final"
                ? "Final"
                : game.startTime}
          </span>
        </span>
        {game.network && <span>{game.network}</span>}
      </div>
      <TeamRow team={game.away} state={game.state} />
      <TeamRow team={game.home} state={game.state} />
    </div>
  );
}

export default function LiveScores({ initial }: { initial: ScoresPayload }) {
  const [data, setData] = useState<ScoresPayload>(initial);

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch("/api/scores");
        if (res.ok) setData(await res.json());
      } catch {
        // keep showing the last good data
      }
    }, POLL_MS);
    return () => clearInterval(id);
  }, []);

  if (data.sports.length === 0) {
    return (
      <div
        style={{
          background: "var(--s1)",
          border: "1px solid var(--border)",
          borderRadius: 6,
          padding: "48px 24px",
          textAlign: "center",
        }}
      >
        <div
          className="stat-hero"
          style={{ fontSize: 34, textTransform: "uppercase", marginBottom: 8 }}
        >
          No Games Today
        </div>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: 0 }}>
          Check the schedules for what&apos;s next — Go Big Red.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      {data.sports.map((board) => (
        <section key={board.sport}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: 17,
              fontWeight: 800,
              color: "var(--cream)",
              margin: "0 0 14px",
            }}
          >
            {board.label}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {board.games.map((game) => (
              <GameCard key={game.gameId} game={game} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
