import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";
import { buildMetaDescription } from "@/lib/compliance";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Nebrasketball",
    default: "Nebrasketball — Nebraska Men’s Basketball Command Center",
  },
  description: buildMetaDescription(
    "Next Nebraska men’s basketball game, how to watch, live scores and 2026-27 season HQ. Independent Husker fan site. GBR."
  ),
  keywords: [
    "nebraska basketball",
    "how to watch nebraska basketball",
    "nebraska cornhuskers scores",
    "husker basketball schedule",
    "nebrasketball",
  ],
  openGraph: {
    type: "website",
    siteName: "Nebrasketball",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://nebrasketball.com"
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-body antialiased min-h-screen flex flex-col">
        <GoogleAnalytics />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
