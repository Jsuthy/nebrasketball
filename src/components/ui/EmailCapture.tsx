"use client";

import { useState, type FormEvent } from "react";

export default function EmailCapture({
  source,
  variant = "inline",
}: {
  source?: string;
  variant?: "rail" | "inline";
}) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const rail = variant === "rail";

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: source ?? "site" }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={rail ? "beat-mail" : undefined}
      style={
        rail
          ? undefined
          : {
              display: "grid",
              gap: 6,
              maxWidth: 420,
            }
      }
    >
      {rail && (
        <p>Beat notes in the inbox. Tip times and TV only.</p>
      )}
      <input
        type="email"
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitted || pending}
        autoComplete="email"
        aria-label="Email"
        style={{
          width: "100%",
          padding: rail ? "7px 8px" : "10px 12px",
          border: rail ? 0 : "1px solid var(--rule)",
          background: rail ? "#fff" : "var(--card)",
          color: "var(--ink)",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          marginBottom: rail ? 6 : 0,
          outline: "none",
        }}
      />
      <button
        type="submit"
        disabled={submitted || pending}
        style={{
          width: "100%",
          background: "var(--scarlet)",
          color: "#fff",
          border: 0,
          padding: rail ? 8 : "10px 12px",
          fontWeight: 800,
          fontSize: 13,
          cursor: submitted || pending ? "default" : "pointer",
          fontFamily: "var(--font-body)",
        }}
      >
        {submitted ? "You're in" : pending ? "Joining…" : "Subscribe"}
      </button>
      {error && (
        <div
          style={{
            width: "100%",
            fontSize: 12,
            marginTop: 4,
            color: rail ? "#ece6d8" : "var(--scarlet)",
          }}
        >
          {error}
        </div>
      )}
      <div
        style={{
          width: "100%",
          fontSize: 11,
          marginTop: 6,
          color: rail ? "#c8c0b2" : "var(--muted)",
        }}
      >
        Game-week alerts only.{" "}
        <a
          href="/legal#privacy"
          style={{
            color: rail ? "#ece6d8" : "var(--ink-2)",
            textDecoration: "underline",
          }}
        >
          Privacy
        </a>
        {" · "}
        <a
          href="/legal#affiliate"
          style={{
            color: rail ? "#ece6d8" : "var(--ink-2)",
            textDecoration: "underline",
          }}
        >
          Affiliate disclosure
        </a>
      </div>
    </form>
  );
}
