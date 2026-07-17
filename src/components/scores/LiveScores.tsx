"use client";

import { useEffect, useState } from "react";
import type { ScoreboardGame } from "@/lib/ncaa/api";

interface ScoresPayload {
  sports: Array<{ sport: string; label: string; games: ScoreboardGame[] }>;
}

const POLL_MS = 60_000;

function TeamRow({ team, state }: { team: ScoreboardGame["home"]; state: string }) {
  const isNebraska = team.seo === "nebraska";
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 0",
        fontWeight: isNebraska ? 700 : 500,
        color: state === "final" && !team.winner ? "var(--muted)" : "var(--text)",
      }}
    >
      <span>
        {team.rank !== null && (
          <span style={{ color: "var(--muted)", fontSize: 12, marginRight: 6 }}>
            #{team.rank}
          </span>
        )}
        {team.name}
        {isNebraska && (
          <span style={{ color: "var(--red)", fontSize: 11, marginLeft: 6 }}>
            GBR
          </span>
        )}
      </span>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 800 }}>
        {team.score ?? ""}
      </span>
    </div>
  );
}

function GameCard({ game }: { game: ScoreboardGame }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 4,
        background: "var(--s1)",
        padding: "12px 16px",
        minWidth: 240,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 11,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: game.state === "live" ? "var(--red)" : "var(--muted)",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        <span>
          {game.state === "live" && <span className="pulse">● </span>}
          {game.state === "live"
            ? game.currentPeriod
            : game.state === "final"
              ? "Final"
              : game.startTime}
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
      <p style={{ color: "var(--muted)", padding: "40px 0", textAlign: "center" }}>
        No games today. Check the schedules for what&apos;s next — Go Big Red.
      </p>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {data.sports.map((board) => (
        <section key={board.sport}>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              fontSize: 15,
              fontWeight: 800,
              margin: "0 0 12px",
            }}
          >
            {board.label}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
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
