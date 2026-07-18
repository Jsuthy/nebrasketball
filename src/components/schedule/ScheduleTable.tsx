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
        <span className="font-data" style={{ color: "var(--accent)", fontWeight: 700 }}>
          <span
            className="pulse"
            style={{
              display: "inline-block",
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--red)",
              marginRight: 8,
            }}
          />
          {scoreline} · {currentPeriod}
        </span>
      );
    }
    return (
      <span
        className="font-data"
        style={{ fontWeight: 700, color: won ? "#66BB6A" : "var(--accent)" }}
      >
        {won ? "W" : "L"} {scoreline}
      </span>
    );
  }
  return (
    <span className="font-data" style={{ color: "var(--muted)", fontSize: 13 }}>
      {game.time ?? "TBA"}
    </span>
  );
}

export default function ScheduleTable({ games }: { games: GameWithResult[] }) {
  return (
    <div
      style={{
        overflowX: "auto",
        background: "var(--s1)",
        border: "1px solid var(--border)",
        borderRadius: 6,
      }}
    >
      <table
        className="sched-table"
        style={{ width: "100%", borderCollapse: "collapse", fontSize: 14, minWidth: 560 }}
      >
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
            <th style={{ padding: "12px 16px" }}>Date</th>
            <th style={{ padding: "12px 16px" }}>Opponent</th>
            <th className="sched-loc" style={{ padding: "12px 16px" }}>Location</th>
            <th style={{ padding: "12px 16px" }}>TV</th>
            <th style={{ padding: "12px 16px" }}>Time / Result</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr
              key={`${game.date}-${game.opponent}`}
              style={{
                borderTop: "1px solid var(--border)",
                background: game.homeAway === "home" ? "var(--s2)" : "transparent",
              }}
            >
              <td
                className="font-data"
                style={{ padding: "13px 16px", whiteSpace: "nowrap", fontSize: 13 }}
              >
                {formatDate(game.date)}
              </td>
              <td style={{ padding: "13px 16px", fontWeight: 600 }}>
                <span style={{ color: "var(--faint)", marginRight: 6 }}>
                  {game.homeAway === "home" ? "vs" : game.homeAway === "away" ? "at" : "vs*"}
                </span>
                <span style={{ color: "var(--text)" }}>{game.opponent}</span>
                {game.note && (
                  <span
                    style={{
                      display: "block",
                      fontSize: 11,
                      fontWeight: 400,
                      color: "var(--faint)",
                      marginTop: 3,
                    }}
                  >
                    {game.note}
                  </span>
                )}
              </td>
              <td
                className="sched-loc"
                style={{ padding: "13px 16px", color: "var(--muted)", fontSize: 13 }}
              >
                {game.venue}
                <span style={{ display: "block", fontSize: 11, color: "var(--faint)" }}>
                  {game.city}
                </span>
              </td>
              <td style={{ padding: "13px 16px", whiteSpace: "nowrap", fontSize: 13 }}>
                {game.result?.network ?? game.tv ?? (
                  <span style={{ color: "var(--faint)" }}>TBA</span>
                )}
              </td>
              <td style={{ padding: "13px 16px", whiteSpace: "nowrap" }}>
                <ResultCell game={game} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
