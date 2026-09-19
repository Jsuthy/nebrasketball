"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const PRIMARY = [
  { href: "/basketball", label: "Hoops" },
  { href: "/news", label: "Notes" },
  { href: "/how-to-watch", label: "Watch" },
  { href: "/scores", label: "Scores" },
];

const DIMMED = [
  { href: "/volleyball", label: "VB" },
  { href: "/football", label: "FB" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 400,
        background: "var(--ink)",
        color: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 16px",
          gap: 16,
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 800,
            letterSpacing: "-0.03em",
            fontSize: 22,
            textDecoration: "none",
            color: "#fff",
            lineHeight: 1,
          }}
        >
          Nebrasketball
        </Link>

        <nav
          className="beat-nav"
          style={{
            display: "flex",
            gap: 14,
            fontSize: 13,
            fontWeight: 700,
            alignItems: "center",
          }}
        >
          {PRIMARY.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: isActive(pathname, link.href) ? "#fff" : "#ddd6c8",
                textDecoration: "none",
                borderBottom: isActive(pathname, link.href)
                  ? "2px solid var(--scarlet)"
                  : "2px solid transparent",
                paddingBottom: 2,
              }}
            >
              {link.label}
            </Link>
          ))}
          {DIMMED.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                color: isActive(pathname, link.href) ? "#fff" : "#8a8478",
                fontWeight: 500,
                textDecoration: "none",
                borderBottom: isActive(pathname, link.href)
                  ? "2px solid var(--scarlet)"
                  : "2px solid transparent",
                paddingBottom: 2,
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          className="beat-nav-toggle"
          aria-expanded={open}
          aria-controls="beat-mobile-nav"
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "transparent",
            border: "1px solid #8a8478",
            color: "#fff",
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "6px 10px",
            cursor: "pointer",
          }}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      {open && (
        <nav
          id="beat-mobile-nav"
          className="beat-mobile-nav"
          style={{
            display: "grid",
            gap: 2,
            padding: "0 16px 12px",
            borderTop: "1px solid #3a3732",
          }}
        >
          {[...PRIMARY, ...DIMMED].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                color: isActive(pathname, link.href) ? "#fff" : "#ddd6c8",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: 14,
                padding: "10px 0",
                borderBottom: "1px solid #3a3732",
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}

      <style>{`
        .beat-nav-toggle { display: none; }
        @media (max-width: 760px) {
          .beat-nav { display: none !important; }
          .beat-nav-toggle { display: inline-block; }
        }
      `}</style>
    </header>
  );
}
