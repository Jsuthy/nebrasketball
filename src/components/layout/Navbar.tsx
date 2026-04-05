"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/gear", label: "All Gear" },
  { href: "/shop", label: "Shop" },
  { href: "/news", label: "News" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 400,
        height: 56,
        background: "rgba(8,8,8,0.97)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
      }}
    >
      {/* LEFT — Logo */}
      <Link href="/" style={{ display: "flex", alignItems: "center" }}>
        <Image
          src="/logos/logo-icon.png"
          alt="Nebrasketball"
          height={34}
          width={34}
          unoptimized
          style={{ height: 34, width: "auto" }}
        />
      </Link>

      {/* CENTER — Nav links */}
      <div
        style={{
          display: "flex",
          gap: 4,
          alignItems: "center",
        }}
        className="nav-center"
      >
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: "0.09em",
                textTransform: "uppercase",
                textDecoration: "none",
                color: isActive ? "#fff" : "var(--muted)",
                background: isActive ? "rgba(255,255,255,0.06)" : "transparent",
                padding: "6px 11px",
                borderRadius: 2,
                transition: "color 0.15s, background 0.15s",
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </div>

      {/* RIGHT — Shop Gear button */}
      <Link
        href="/shop"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          fontSize: 12,
          textTransform: "uppercase",
          textDecoration: "none",
          color: "#fff",
          background: "var(--red)",
          padding: "8px 18px",
          borderRadius: 2,
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "var(--red-dk)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = "var(--red)")
        }
      >
        Shop Gear
      </Link>

      {/* Hide center nav on mobile */}
      <style>{`
        @media (max-width: 679px) {
          .nav-center { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
