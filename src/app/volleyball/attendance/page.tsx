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

interface RecordEntry {
  figure: string;
  title: string;
  detail: string;
}

const HEADLINE_RECORDS: RecordEntry[] = [
  {
    figure: "92,003",
    title: "World record — any women's sporting event",
    detail:
      "August 30, 2023 · Memorial Stadium, Lincoln. Nebraska beat Omaha under the lights in front of 92,003 fans — the largest crowd ever to watch a women's sporting event anywhere in the world.",
  },
  {
    figure: "17,675",
    title: "NCAA regular-season indoor record",
    detail:
      "September 16, 2025 · CHI Health Center, Omaha. A sold-out crowd of 17,675 watched Nebraska and Creighton break the DI regular-season indoor attendance record.",
  },
];

const ROAD_RECORDS: RecordEntry[] = [
  {
    figure: "12,707",
    title: "Michigan's all-time record",
    detail: "2025 · Set when Nebraska visited Ann Arbor.",
  },
  {
    figure: "11,578",
    title: "Michigan State's all-time record",
    detail: "2025 · Set when Nebraska visited East Lansing.",
  },
  {
    figure: "10,498",
    title: "UCLA's all-time record",
    detail: "2025 · Set when Nebraska visited Pauley Pavilion.",
  },
  {
    figure: "9,072",
    title: "USC's all-time record",
    detail: "2025 · Set when Nebraska visited Los Angeles.",
  },
];

const sectionTitle: React.CSSProperties = {
  fontFamily: "var(--font-display)",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  fontSize: 17,
  fontWeight: 800,
  margin: "0 0 14px",
};

function RecordCard({ entry, big }: { entry: RecordEntry; big?: boolean }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--red)",
        borderRadius: 4,
        background: "var(--s1)",
        padding: big ? "24px 26px" : "16px 20px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 900,
          fontSize: big ? 52 : 32,
          lineHeight: 1,
          color: "var(--red)",
        }}
      >
        {entry.figure}
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
          fontSize: big ? 17 : 14,
          margin: "8px 0 6px",
        }}
      >
        {entry.title}
      </div>
      <p style={{ margin: 0, color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>
        {entry.detail}
      </p>
    </div>
  );
}

export default function AttendancePage() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 20px 60px" }}>
      <header style={{ marginBottom: 28 }}>
        <div
          style={{
            fontFamily: "var(--font-display)",
            color: "var(--red)",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          The Record Book Belongs to Lincoln
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 44,
            fontWeight: 900,
            textTransform: "uppercase",
            lineHeight: 1.05,
            margin: 0,
          }}
        >
          Nebraska Volleyball Attendance Records
        </h1>
        <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.6, maxWidth: 660, marginTop: 12 }}>
          No fan base in college volleyball — or women&apos;s sports, period —
          shows up like Nebraska&apos;s. The Huskers hold the world attendance
          record for a women&apos;s sporting event, the NCAA indoor record, and
          they set new house records at opposing arenas nearly every time they
          go on the road. This tracker keeps the full list.
        </p>
      </header>

      <section>
        <h2 style={sectionTitle}>The Headliners</h2>
        <div style={{ display: "grid", gap: 14 }}>
          {HEADLINE_RECORDS.map((entry) => (
            <RecordCard key={entry.figure} entry={entry} big />
          ))}
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={sectionTitle}>The 2025 Road Show</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, margin: "0 0 14px", maxWidth: 640 }}>
          In 2025 alone, four programs drew the largest volleyball crowds in
          their history — all with Nebraska as the visiting team. The Huskers
          are the sport&apos;s premier traveling draw.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: 12,
          }}
        >
          {ROAD_RECORDS.map((entry) => (
            <RecordCard key={entry.figure} entry={entry} />
          ))}
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={sectionTitle}>2026 Record Watch</h2>
        <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.7, maxWidth: 660, margin: 0 }}>
          The 2026 schedule gives Nebraska several shots at adding to the book:
          a season opener at T-Mobile Arena in Las Vegas, an outdoor match at
          Wrigley Field against Missouri in the Big Ten/SEC Challenge, the
          Creighton rivalry at Pinnacle Bank Arena, and road trips to Oregon and
          Washington. We&apos;ll update this page as crowds come in.
        </p>
        <p style={{ marginTop: 14, fontSize: 14 }}>
          <Link href="/volleyball" style={{ color: "var(--red)", fontWeight: 600 }}>
            Full 2026 Nebraska volleyball schedule →
          </Link>
        </p>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={sectionTitle}>Follow the Record Chase</h2>
        <EmailCapture />
      </section>

      <div style={{ marginTop: 40 }}>
        <Disclaimer variant="short" />
      </div>
    </div>
  );
}
