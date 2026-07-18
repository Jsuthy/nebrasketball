import Image from "next/image";
import type { SitePhoto } from "@/lib/media/photos";

/** Full-bleed photo band behind hero content, with the required CC credit. */
export function HeroBackdrop({ photo }: { photo: SitePhoto }) {
  return (
    <>
      <Image
        src={photo.src}
        alt=""
        fill
        priority
        sizes="100vw"
        style={{ objectFit: "cover", objectPosition: "center 30%" }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(18,18,18,0.72) 0%, rgba(18,18,18,0.82) 55%, var(--black) 100%)",
        }}
      />
    </>
  );
}

export function PhotoCredit({
  photo,
  style,
}: {
  photo: SitePhoto;
  style?: React.CSSProperties;
}) {
  return (
    <a
      href={photo.creditUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        fontSize: 10,
        color: "rgba(255,255,255,0.35)",
        textDecoration: "none",
        letterSpacing: "0.04em",
        ...style,
      }}
    >
      {photo.credit}
    </a>
  );
}
