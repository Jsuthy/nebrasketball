"use client";

import { useState } from "react";

// Click-to-play YouTube facade: only a thumbnail <img> loads up front (zero
// iframe cost for Core Web Vitals); the privacy-enhanced player mounts on tap.
export default function LiteVideo({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 6, overflow: "hidden" }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      </div>
    );
  }

  return (
    <button
      onClick={() => setPlaying(true)}
      aria-label={`Play: ${title}`}
      style={{
        position: "relative",
        aspectRatio: "16/9",
        width: "100%",
        border: "1px solid var(--border)",
        borderRadius: 6,
        overflow: "hidden",
        cursor: "pointer",
        padding: 0,
        background: "var(--s1)",
        display: "block",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(0deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.1) 50%)",
        }}
      />
      <span
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 58,
          height: 58,
          borderRadius: "50%",
          background: "var(--red)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            width: 0,
            height: 0,
            borderTop: "11px solid transparent",
            borderBottom: "11px solid transparent",
            borderLeft: "18px solid #fff",
            marginLeft: 5,
          }}
        />
      </span>
      <span
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 10,
          textAlign: "left",
          color: "var(--cream)",
          fontSize: 13,
          fontWeight: 600,
          lineHeight: 1.4,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {title}
      </span>
    </button>
  );
}
