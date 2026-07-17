import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Shared OG share-card template: official scarlet (#D00000) over black with
 * cream (#F5F1E7) accents. ImageResponse supports flexbox-only CSS.
 */
export function ogCard({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle: string;
}) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0A0A0A",
          backgroundImage:
            "radial-gradient(circle at 25% 20%, rgba(208,0,0,0.35) 0%, rgba(10,10,10,0) 55%)",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 14,
              height: 44,
              backgroundColor: "#D00000",
              display: "flex",
            }}
          />
          <div
            style={{
              fontSize: 30,
              fontWeight: 700,
              color: "#D00000",
              textTransform: "uppercase",
              letterSpacing: 6,
              display: "flex",
            }}
          >
            {kicker}
          </div>
        </div>

        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            color: "#F5F1E7",
            textTransform: "uppercase",
            lineHeight: 1.02,
            display: "flex",
            maxWidth: 1050,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: 32,
              color: "rgba(245,241,231,0.75)",
              display: "flex",
              maxWidth: 800,
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: "#FFFFFF",
              textTransform: "uppercase",
              letterSpacing: 3,
              display: "flex",
            }}
          >
            NEBRASKETBALL.COM
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
