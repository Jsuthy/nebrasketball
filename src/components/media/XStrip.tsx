import { createClient } from "@supabase/supabase-js";

// "Latest from @Nebrasketball" rendered from the posting engine's own ledger
// (no external scripts, no API reads) + a follow strip of official accounts.

const FOLLOW_ACCOUNTS = [
  { handle: "Nebrasketball", label: "Nebrasketball — this site" },
  { handle: "Huskers", label: "Huskers — official athletics" },
  { handle: "HuskerVBall", label: "Nebraska Volleyball — official" },
  { handle: "HuskerHoops", label: "Nebraska Basketball — official" },
];

async function latestPost(): Promise<{
  body: string;
  tweetId: string;
  postedAt: string;
} | null> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data } = await supabase
      .from("social_posts")
      .select("body, tweet_id, posted_at")
      .not("tweet_id", "is", null)
      .order("posted_at", { ascending: false })
      .limit(1)
      .single();
    if (!data?.tweet_id) return null;
    return { body: data.body, tweetId: data.tweet_id, postedAt: data.posted_at };
  } catch {
    return null;
  }
}

export default async function XStrip() {
  const post = await latestPost();

  return (
    <section className="reveal" style={{ marginTop: 64, position: "relative", zIndex: 1 }}>
      <h2
        style={{
          fontFamily: "var(--font-display)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          fontSize: 22,
          fontWeight: 800,
          color: "var(--cream)",
          margin: "0 0 16px",
        }}
      >
        Husker Nation on X
      </h2>
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "stretch" }}>
        {post && (
          <a
            href={`https://x.com/Nebrasketball/status/${post.tweetId}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: "2 1 340px",
              background: "var(--s1)",
              border: "1px solid var(--border)",
              borderTop: "3px solid var(--red)",
              borderRadius: 6,
              padding: "18px 22px",
              textDecoration: "none",
              color: "var(--text)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontSize: 13,
                color: "var(--accent)",
              }}
            >
              Latest from @Nebrasketball
            </div>
            <p style={{ margin: 0, whiteSpace: "pre-line", fontSize: 15, lineHeight: 1.55 }}>
              {post.body}
            </p>
            <span style={{ color: "var(--faint)", fontSize: 12 }}>
              View on X →
            </span>
          </a>
        )}
        <div
          style={{
            flex: "1 1 260px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          {FOLLOW_ACCOUNTS.map((account) => (
            <a
              key={account.handle}
              href={`https://x.com/${account.handle}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: "var(--s1)",
                border: "1px solid var(--border)",
                borderRadius: 6,
                padding: "12px 16px",
                textDecoration: "none",
                color: "var(--text)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 14,
              }}
            >
              <span>
                <span style={{ fontWeight: 700, color: "var(--cream)" }}>
                  @{account.handle}
                </span>
                <span style={{ display: "block", fontSize: 12, color: "var(--faint)" }}>
                  {account.label}
                </span>
              </span>
              <span style={{ color: "var(--accent)", fontWeight: 700 }}>→</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
