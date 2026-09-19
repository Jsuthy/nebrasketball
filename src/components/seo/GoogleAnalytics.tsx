import Script from "next/script";

// Optional GA4. Set NEXT_PUBLIC_GA_MEASUREMENT_ID (or legacy NEXT_PUBLIC_GA_ID)
// to a real G-XXXXXXXX ID in the environment. Leave empty — do not invent one.
const GA_ID = (
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
  process.env.NEXT_PUBLIC_GA_ID ||
  ""
).trim();

function isMeasurementId(id: string): boolean {
  return /^G-[A-Z0-9]+$/i.test(id);
}

export default function GoogleAnalytics() {
  if (!isMeasurementId(GA_ID)) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-gtag" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
      </Script>
    </>
  );
}
