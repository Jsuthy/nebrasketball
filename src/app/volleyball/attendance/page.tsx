import type { Metadata } from "next";
import Link from "next/link";
import Disclaimer from "@/components/ui/Disclaimer";
import EmailCapture from "@/components/ui/EmailCapture";

export const metadata: Metadata = {
  title: "Nebraska Volleyball Attendance Records — The 92,003 World Record & Every Mark They Hold",
  description:
    "Nebraska volleyball owns the attendance record book: the 92,003 world record for a women's sporting event, the NCAA indoor record, and road records at arenas across the country. The full tracker.",
  alternates: { canonical: "/volleyball/attendance" },
  openGraph: {
    title: "92,003: Nebraska Volleyball's Attendance Record Book",
    description:
      "The world record, the indoor record, and every road attendance record the Huskers have set.",
  },
};

const ROAD_RECORDS = [
  { figure: "12,707", school: "Michigan", detail: "Crisler Center, Ann Arbor" },
  { figure: "11,578", school: "Michigan State", detail: "Breslin Center, East Lansing" },
  { figure: "10,498", school: "UCLA", detail: "Pauley Pavilion, Los Angeles" },
  { figure: "9,072", school: "USC", detail: "Galen Center, Los Angeles" },
];

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  fontSize: 22,
  fontWeight: 800,
  color: "var(--cream)",
  margin: "0 0 16px",
};

export default function AttendancePage() {
  return (
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: "56px 20px 72px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ghost numeral watermark */}
      <div
        className="ghost-num"
        style={{ top: 10, right: -40, fontSize: "clamp(200px, 34vw, 420px)" }}
        aria-hidden
      >
        92,003
      </div>

      <header style={{ marginBottom: 48, position: "relative", zIndex: 1 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>
          The Record Book Belongs to Lincoln
        </div>
        <h1
          className="stat-hero"
          style={{
            fontSize: "clamp(44px, 7vw, 72px)",
            textTransform: "uppercase",
            margin: 0,
            maxWidth: 700,
          }}
        >
          Nebraska Volleyball Attendance Records
        </h1>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 16,
            lineHeight: 1.65,
            maxWidth: 640,
            marginTop: 18,
          }}
        >
          No fan base in college volleyball — or women&apos;s sports, period —
          shows up like Nebraska&apos;s. The Huskers hold the world attendance
          record for a women&apos;s sporting event, the NCAA indoor record, and
          they set new house records at opposing arenas nearly every time they
          go on the road.
        </p>
      </header>

      {/* THE record — full-bleed numeral */}
      <section className="reveal" style={{ position: "relative", zIndex: 1, marginBottom: 56 }}>
        <div
          className="stat-hero font-data"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(110px, 22vw, 260px)",
          }}
        >
          92,003
        </div>
        <div
          style={{
            borderLeft: "4px solid var(--red)",
            paddingLeft: 18,
            marginTop: 18,
            maxWidth: 560,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: 19,
              color: "var(--cream)",
            }}
          >
            World record — any women&apos;s sporting event
          </div>
          <p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>
            August 30, 2023 · Memorial Stadium, Lincoln. Nebraska beat Omaha
            under the lights in front of the largest crowd ever to watch a
            women&apos;s sporting event anywhere in the world.
          </p>
        </div>
      </section>

      {/* Indoor record */}
      <section className="reveal" style={{ position: "relative", zIndex: 1, marginBottom: 56 }}>
        <div className="stat-hero" style={{ fontSize: "clamp(72px, 13vw, 150px)" }}>
          17,675
        </div>
        <div
          style={{
            borderLeft: "4px solid var(--red)",
            paddingLeft: 18,
            marginTop: 14,
            maxWidth: 560,
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              fontSize: 19,
              color: "var(--cream)",
            }}
          >
            NCAA regular-season indoor record
          </div>
          <p style={{ margin: "8px 0 0", color: "var(--muted)", fontSize: 15, lineHeight: 1.6 }}>
            September 16, 2025 · CHI Health Center, Omaha. A sold-out crowd
            watched Nebraska and Creighton break the DI regular-season indoor
            attendance record.
          </p>
        </div>
      </section>

      {/* Road records */}
      <section className="reveal" style={{ position: "relative", zIndex: 1 }}>
        <h2 style={sectionTitle}>The 2025 Road Show</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 18px", maxWidth: 620 }}>
          In 2025 alone, four programs drew the largest volleyball crowds in
          their history — all with Nebraska as the visiting team. The Huskers
          are the sport&apos;s premier traveling draw.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
            gap: 12,
          }}
        >
          {ROAD_RECORDS.map((entry) => (
            <div
              key={entry.figure}
              style={{
                background: "var(--s1)",
                border: "1px solid var(--border)",
                borderTop: "3px solid var(--red)",
                borderRadius: 6,
                padding: "20px 22px",
              }}
            >
              <div className="stat-hero" style={{ fontSize: 44 }}>{entry.figure}</div>
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  fontSize: 15,
                  color: "var(--text)",
                  margin: "10px 0 2px",
                }}
              >
                {entry.school}&apos;s all-time record
              </div>
              <p style={{ margin: 0, color: "var(--faint)", fontSize: 13 }}>{entry.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="reveal" style={{ marginTop: 64, position: "relative", zIndex: 1 }}>
        <h2 style={sectionTitle}>2026 Record Watch</h2>
        <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.7, maxWidth: 640, margin: 0 }}>
          The 2026 schedule gives Nebraska several shots at adding to the book:
          a season opener at T-Mobile Arena in Las Vegas, an outdoor match at
          Wrigley Field against Missouri, the Creighton rivalry at Pinnacle
          Bank Arena, and road trips to Oregon and Washington. This page
          updates as crowds come in.
        </p>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          <Link href="/volleyball" style={{ color: "var(--accent)", fontWeight: 600 }}>
            Full 2026 Nebraska volleyball schedule →
          </Link>
        </p>
      </section>

      <section className="reveal" style={{ marginTop: 64, position: "relative", zIndex: 1 }}>
        <h2 style={sectionTitle}>Follow the Record Chase</h2>
        <EmailCapture />
      </section>

      <div style={{ marginTop: 48 }}>
        <Disclaimer variant="short" />
      </div>
    </div>
  );
}
