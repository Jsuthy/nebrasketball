"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface QuoteCandidate {
  id: string;
  source_url: string;
  source_handle: string | null;
  source_text: string | null;
  proposed_comment: string;
  status: string;
  posted_tweet_id: string | null;
  error: string | null;
  created_at: string;
}

function SocialQueue() {
  const token = useSearchParams().get("token") || "";

  const [items, setItems] = useState<QuoteCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Enqueue form
  const [url, setUrl] = useState("");
  const [handle, setHandle] = useState("");
  const [srcText, setSrcText] = useState("");
  const [comment, setComment] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/social/queue?status=pending&token=${token}`);
      const data = await res.json();
      setItems(res.ok ? data.items ?? [] : []);
      if (!res.ok) setMsg(data.error || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function decide(id: string, decision: "approve" | "reject") {
    setBusy(id);
    setMsg(null);
    try {
      const res = await fetch(`/api/social/queue/${id}?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg(
          decision === "approve"
            ? `Posted ✓ ${data.tweetId ? `(tweet ${data.tweetId})` : ""}`
            : "Rejected"
        );
      } else {
        setMsg(data.error || "Failed");
      }
      await load();
    } finally {
      setBusy(null);
    }
  }

  async function enqueue(e: React.FormEvent) {
    e.preventDefault();
    setBusy("new");
    setMsg(null);
    try {
      const res = await fetch(`/api/social/queue?token=${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceUrl: url,
          sourceHandle: handle,
          sourceText: srcText,
          proposedComment: comment,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMsg("Added to queue ✓");
        setUrl("");
        setHandle("");
        setSrcText("");
        setComment("");
        await load();
      } else {
        setMsg(data.error || "Failed to add");
      }
    } finally {
      setBusy(null);
    }
  }

  if (!token) {
    return (
      <main style={{ padding: 40, fontFamily: "system-ui" }}>
        <p>Add <code>?token=YOUR_ADMIN_TOKEN</code> to the URL.</p>
      </main>
    );
  }

  const commentLen = comment.trim().length;

  return (
    <main
      style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "32px 20px 80px",
        fontFamily: "system-ui, sans-serif",
        color: "#121212",
      }}
    >
      <h1 style={{ fontSize: 24, marginBottom: 4 }}>Quote-tweet review queue</h1>
      <p style={{ color: "#666", fontSize: 14, marginTop: 0 }}>
        Nothing posts without approval. Approving publishes the quote-tweet to
        @nebrasketball immediately.
      </p>

      {msg && (
        <div
          style={{
            background: "#F5F1E7",
            borderLeft: "4px solid #D00000",
            padding: "10px 14px",
            margin: "16px 0",
            fontSize: 14,
          }}
        >
          {msg}
        </div>
      )}

      <section
        style={{
          border: "1px solid #e4ddcb",
          borderRadius: 8,
          padding: 16,
          margin: "20px 0",
        }}
      >
        <h2 style={{ fontSize: 16, marginTop: 0 }}>Add a candidate</h2>
        <form onSubmit={enqueue} style={{ display: "grid", gap: 8 }}>
          <input
            required
            placeholder="Source tweet URL (x.com/HuskerVB/status/…)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="Source handle (optional, e.g. @HuskerVB)"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            style={inputStyle}
          />
          <textarea
            placeholder="What the source tweet says (optional context for review)"
            value={srcText}
            onChange={(e) => setSrcText(e.target.value)}
            rows={2}
            style={inputStyle}
          />
          <textarea
            required
            placeholder="Your comment (factual but lively) — posted above the quoted tweet"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            style={inputStyle}
          />
          <div style={{ fontSize: 12, color: commentLen > 256 ? "#D00000" : "#888" }}>
            {commentLen}/256
          </div>
          <button type="submit" disabled={busy === "new"} style={primaryBtn}>
            {busy === "new" ? "Adding…" : "Add to queue"}
          </button>
        </form>
      </section>

      <h2 style={{ fontSize: 16 }}>Pending ({items.length})</h2>
      {loading ? (
        <p>Loading…</p>
      ) : items.length === 0 ? (
        <p style={{ color: "#888" }}>Queue is empty.</p>
      ) : (
        items.map((it) => (
          <article
            key={it.id}
            style={{
              border: "1px solid #e4ddcb",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ fontSize: 13, color: "#666" }}>
              {it.source_handle || "unknown"} ·{" "}
              <a href={it.source_url} target="_blank" rel="noreferrer" style={{ color: "#D00000" }}>
                source tweet ↗
              </a>
            </div>
            {it.source_text && (
              <blockquote
                style={{
                  borderLeft: "3px solid #ddd",
                  margin: "8px 0",
                  paddingLeft: 10,
                  color: "#555",
                  fontSize: 14,
                }}
              >
                {it.source_text}
              </blockquote>
            )}
            <p style={{ fontSize: 15, fontWeight: 600, margin: "10px 0" }}>
              {it.proposed_comment}
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => decide(it.id, "approve")}
                disabled={busy === it.id}
                style={primaryBtn}
              >
                {busy === it.id ? "…" : "Approve & post"}
              </button>
              <button
                onClick={() => decide(it.id, "reject")}
                disabled={busy === it.id}
                style={ghostBtn}
              >
                Reject
              </button>
            </div>
          </article>
        ))
      )}
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: "8px 10px",
  border: "1px solid #ccc",
  borderRadius: 6,
  fontSize: 14,
  fontFamily: "inherit",
  width: "100%",
  boxSizing: "border-box",
};
const primaryBtn: React.CSSProperties = {
  background: "#D00000",
  color: "#fff",
  border: "none",
  borderRadius: 6,
  padding: "9px 16px",
  fontSize: 14,
  fontWeight: 600,
  cursor: "pointer",
};
const ghostBtn: React.CSSProperties = {
  background: "#fff",
  color: "#121212",
  border: "1px solid #ccc",
  borderRadius: 6,
  padding: "9px 16px",
  fontSize: 14,
  cursor: "pointer",
};

export default function Page() {
  return (
    <Suspense fallback={<main style={{ padding: 40 }}>Loading…</main>}>
      <SocialQueue />
    </Suspense>
  );
}
