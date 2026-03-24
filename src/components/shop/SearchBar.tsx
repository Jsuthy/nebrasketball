"use client";

import { useRef, useEffect } from "react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

export default function SearchBar({ value, onChange, onClear }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search Nebraska basketball gear — tees, hoodies, jerseys, hats..."
        style={{
          width: "100%",
          border: "1.5px solid rgba(209,31,58,0.5)",
          background: "var(--s2)",
          color: "var(--text)",
          fontFamily: "var(--font-body)",
          fontSize: 15,
          padding: "11px 40px 11px 14px",
          outline: "none",
          transition: "border-color 0.15s",
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--red)")}
        onBlur={(e) =>
          (e.currentTarget.style.borderColor = "rgba(209,31,58,0.5)")
        }
      />
      {value.length > 0 && (
        <button
          onClick={onClear}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            color: "var(--muted)",
            fontSize: 18,
            cursor: "pointer",
            padding: 0,
            lineHeight: 1,
          }}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
}
