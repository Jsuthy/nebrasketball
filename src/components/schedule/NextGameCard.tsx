import Link from "next/link";
import type { GameWithResult } from "@/lib/schedule/types";

export default function NextGameCard({
  game,
  record,
  sportLabel,
  watchHref,
}: {
  game: GameWithResult;
  record: { wins: number; losses: number };
  sportLabel: string;
  watchHref?: string;
}) {
  const [year, month, day] = game.date.split("-").map(Number);
  const dateLabel = new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const hasRecord = record.wins + record.losses > 0;
  const matchupLabel =
    game.homeAway === "away" ? `at ${game.opponent}` : `vs ${game.opponent}`;

  return (
    <div className="beat-widget">
      <div className="beat-sec">
        Next {sportLabel}
        {hasRecord && (
          <span className="font-data" style={{ marginLeft: 10, color: "var(--muted)" }}>
            {record.wins}–{record.losses}
          </span>
        )}
      </div>
      <h2
        style={{
          fontSize: "clamp(22px, 3vw, 28px)",
          fontWeight: 800,
          letterSpacing: "-0.03em",
          margin: "6px 0 8px",
          textTransform: "none",
        }}
      >
        Nebraska {matchupLabel}
      </h2>
      <p style={{ margin: "0 0 10px", color: "var(--ink-2)", fontSize: 14 }}>
        {dateLabel}
        {game.time ? ` · ${game.time}` : " · Time TBA"} · {game.venue}, {game.city}
      </p>
      {watchHref ? (
        <Link href={watchHref} className="beat-aff-link">
          {game.tv ? `How to watch · ${game.tv}` : "How to watch · TV TBA"}
        </Link>
      ) : (
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>
          {game.tv ? `TV: ${game.tv}` : "TV: TBA"}
        </div>
      )}
    </div>
  );
}
