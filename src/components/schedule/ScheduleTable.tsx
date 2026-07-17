import type { GameWithResult } from "@/lib/schedule/types";

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function ResultCell({ game }: { game: GameWithResult }) {
  if (game.result) {
    const { state, nebraskaScore, opponentScore, won, currentPeriod } =
      game.result;
    const scoreline = `${nebraskaScore ?? "–"}–${opponentScore ?? "–"}`;
    if (state === "live") {
      return (
        <span style={{ color: "var(--red)", fontWeight: 700 }}>
          <span className="pulse" style={{ marginRight: 6 }}>●</span>
          {scoreline} · {currentPeriod}
        </span>
      );
    }
    return (
      <span style={{ fontWeight: 700, color: won ? "#4ade80" : "#f87171" }}>
        {won ? "W" : "L"} {scoreline}
      </span>
    );
  }
  return (
    <span style={{ color: "var(--muted)" }}>
      {game.time ?? "TBA"}
    </span>
  );
}

export default function ScheduleTable({ games }: { games: GameWithResult[] }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 4 }}>
      <table className="sched-table" style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 560 }}>
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
            <th style={{ padding: "10px 14px" }}>TV</th>
            <th style={{ padding: "10px 14px" }}>Time / Result</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr
              key={`${game.date}-${game.opponent}`}
              style={{
                borderTop: "1px solid var(--border)",
                background: game.homeAway === "home" ? "var(--s1)" : "transparent",
              }}
            >
              <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                {formatDate(game.date)}
              </td>
              <td style={{ padding: "12px 14px", fontWeight: 600 }}>
                <span style={{ color: "var(--muted)", marginRight: 6 }}>
                  {game.homeAway === "home" ? "vs" : game.homeAway === "away" ? "at" : "vs*"}
                </span>
                {game.opponent}
                {game.note && (
                  <span
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 400,
                      color: "var(--muted)",
                      marginTop: 2,
                    }}
                  >
                    {game.note}
                  </span>
                )}
              </td>
              <td className="sched-loc" style={{ padding: "12px 14px", color: "var(--muted)", fontSize: 13 }}>
                {game.venue}
                <span style={{ display: "block", fontSize: 11 }}>{game.city}</span>
              </td>
              <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                {game.result?.network ?? game.tv ?? (
                  <span style={{ color: "var(--muted)" }}>TBA</span>
                )}
              </td>
              <td style={{ padding: "12px 14px", whiteSpace: "nowrap" }}>
                <ResultCell game={game} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
