"use client";

import { useState, type FormEvent } from "react";

export default function EmailCapture({ source }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

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
      style={{
        display: "flex",
        maxWidth: 420,
        margin: "0 auto",
        flexWrap: "wrap",
      }}
    >
      <input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={submitted || pending}
        autoComplete="email"
        style={{
          background: "rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.3)",
          borderRight: "none",
          color: "white",
          padding: "12px 16px",
          flex: 1,
          outline: "none",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          minWidth: 180,
        }}
      />
      <button
        type="submit"
        className="font-display"
        disabled={submitted || pending}
        style={{
          fontWeight: 800,
          fontSize: 13,
          textTransform: "uppercase",
          background: "black",
          color: "white",
          border: "1px solid rgba(255,255,255,0.3)",
          padding: "12px 20px",
          whiteSpace: "nowrap",
          cursor: submitted || pending ? "default" : "pointer",
        }}
      >
        {submitted ? "✓ You're in!" : pending ? "Joining…" : "Join GBR List"}
      </button>
      {error && (
        <div style={{ width: "100%", fontSize: 12, marginTop: 6, color: "rgba(255,255,255,0.7)" }}>
          {error}
        </div>
      )}
      <div style={{ width: "100%", fontSize: 11, marginTop: 8, color: "rgba(255,255,255,0.55)" }}>
        Game-week alerts only.{" "}
        <a href="/legal#privacy" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline" }}>
          Privacy
        </a>
        {" · "}
        <a href="/legal#affiliate" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "underline" }}>
          Affiliate disclosure
        </a>
      </div>
    </form>
  );
}
