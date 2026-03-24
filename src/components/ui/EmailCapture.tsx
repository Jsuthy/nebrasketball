"use client";

import { useState, type FormEvent } from "react";

export default function EmailCapture() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError("Something went wrong. Try again.");
      }
    } catch {
      setError("Something went wrong. Try again.");
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
        style={{
          fontWeight: 800,
          fontSize: 13,
          textTransform: "uppercase",
          background: "black",
          color: "white",
          border: "1px solid rgba(255,255,255,0.3)",
          padding: "12px 20px",
          whiteSpace: "nowrap",
          cursor: "pointer",
        }}
      >
        {submitted ? "✓ You're in!" : "Join GBR List"}
      </button>
      {error && (
        <div style={{ width: "100%", fontSize: 12, marginTop: 6, color: "rgba(255,255,255,0.7)" }}>
          {error}
        </div>
      )}
    </form>
  );
}
