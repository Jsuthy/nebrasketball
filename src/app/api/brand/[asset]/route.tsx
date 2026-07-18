import { ImageResponse } from "next/og";
import { barlowCondensed900, barlowCondensed600 } from "@/lib/brand/font";
import { BadgeMark, BallMark, CREAM, INK, SCARLET } from "@/lib/brand/marks";

export const revalidate = 86400;

const FONTS = async () => [
  { name: "Barlow Condensed", data: await barlowCondensed900(), weight: 900 as const },
  { name: "Barlow Condensed SemiBold", data: await barlowCondensed600(), weight: 600 as const },
];

function LogoIcon() {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex" }}>
      <BadgeMark size={800} />
    </div>
  );
}

function LogoStacked() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 34,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
        <BadgeMark size={220} />
        <div
          style={{
            display: "flex",
            fontFamily: "Barlow Condensed",
            fontSize: 210,
            color: CREAM,
            letterSpacing: -2,
            lineHeight: 0.9,
          }}
        >
          NEBRASKETBALL
        </div>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Barlow Condensed SemiBold",
          fontSize: 56,
          letterSpacing: 26,
          color: SCARLET,
          marginLeft: 26,
        }}
      >
        SCHEDULES · SCORES · GBR
      </div>
    </div>
  );
}

function Banner() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        backgroundColor: INK,
        backgroundImage:
          "radial-gradient(circle at 18% 30%, rgba(208,0,0,0.32) 0%, rgba(18,18,18,0) 55%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ghost record numeral */}
      <div
        style={{
          display: "flex",
          position: "absolute",
          right: -30,
          top: -60,
          fontFamily: "Barlow Condensed",
          fontSize: 430,
          color: "rgba(255,255,255,0.045)",
          lineHeight: 1,
        }}
      >
        92,003
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 46,
          paddingLeft: 84,
        }}
      >
        <BadgeMark size={250} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Barlow Condensed",
              fontSize: 150,
              color: CREAM,
              lineHeight: 0.9,
              letterSpacing: -1,
            }}
          >
            NEBRASKETBALL
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 22,
            }}
          >
            <div style={{ display: "flex", width: 62, height: 8, backgroundColor: SCARLET }} />
            <div
              style={{
                display: "flex",
                fontFamily: "Barlow Condensed SemiBold",
                fontSize: 44,
                letterSpacing: 8,
                color: "rgba(245,241,231,0.8)",
              }}
            >
              HUSKER SCHEDULES · LIVE SCORES · RECORDS
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Barlow Condensed SemiBold",
              fontSize: 34,
              letterSpacing: 6,
              color: "rgba(245,241,231,0.45)",
              marginTop: 6,
            }}
          >
            UNOFFICIAL FAN HQ · NEBRASKETBALL.COM
          </div>
        </div>
      </div>
    </div>
  );
}

function Wordmark() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        gap: 24,
      }}
    >
      <BadgeMark size={120} />
      <div
        style={{
          display: "flex",
          fontFamily: "Barlow Condensed",
          fontSize: 118,
          color: CREAM,
          letterSpacing: -1,
          lineHeight: 0.9,
        }}
      >
        NEBRASKETBALL
      </div>
    </div>
  );
}

const ASSETS: Record<
  string,
  { width: number; height: number; node: () => React.ReactElement }
> = {
  banner: { width: 1500, height: 500, node: Banner },
  logo: { width: 800, height: 800, node: LogoIcon },
  "logo-stacked": { width: 1600, height: 560, node: LogoStacked },
  wordmark: { width: 900, height: 130, node: Wordmark },
  ball: { width: 800, height: 800, node: () => <BallMark size={800} ball={CREAM} seams={SCARLET} /> },
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ asset: string }> }
) {
  const { asset } = await params;
  const spec = ASSETS[asset];
  if (!spec) return new Response("Not found", { status: 404 });
  return new ImageResponse(spec.node(), {
    width: spec.width,
    height: spec.height,
    fonts: await FONTS(),
  });
}
