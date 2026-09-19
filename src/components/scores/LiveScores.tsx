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
      className="beat-scoreline"
      style={{
        fontWeight: isNebraska ? 800 : 600,
        color: dimmed ? "var(--faint)" : "var(--ink)",
      }}
    >
      <span style={{ fontSize: 14 }}>
        {team.rank !== null && (
          <span className="font-data" style={{ color: "var(--muted)", fontSize: 11, marginRight: 7 }}>
            {team.rank}
          </span>
        )}
        {team.name}
        {isNebraska && (
          <span style={{ color: "var(--scarlet)", fontSize: 10, marginLeft: 7, fontWeight: 800 }}>
            GBR
          </span>
        )}
      </span>
      <span className="font-data" style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>
        {team.score ?? ""}
      </span>
    </div>
  );
}

function GameCard({ game }: { game: ScoreboardGame }) {
  const isLive = game.state === "live";
  return (
    <div className="beat-widget">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <span className="beat-sec">
          {isLive && (
            <span
              className="pulse"
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--scarlet)",
                display: "inline-block",
                marginRight: 6,
              }}
            />
          )}
          {isLive ? game.currentPeriod : game.state === "final" ? "Final" : game.startTime}
        </span>
        {game.network && <span style={{ fontSize: 11, color: "var(--muted)" }}>{game.network}</span>}
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
      <div className="beat-widget" style={{ textAlign: "center", padding: "36px 16px" }}>
        <h2 style={{ fontSize: 22, letterSpacing: "-0.03em", textTransform: "none" }}>
          No games today
        </h2>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "8px 0 0" }}>
          Check the schedules for what’s next.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {data.sports.map((board) => (
        <section key={board.sport}>
          <h2 className="beat-widget-title" style={{ marginBottom: 8 }}>
            {board.label}
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 10,
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
