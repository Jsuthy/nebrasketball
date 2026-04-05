import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { buildMetaDescription } from "@/lib/compliance";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s | Nebrasketball",
    default: "Nebrasketball — Nebraska Cornhuskers Gear for Every Sport",
  },
  description: buildMetaDescription(
    "Shop every Nebraska Cornhuskers gear drop from Amazon, eBay, Etsy and Fanatics — all sports, all in one place. GBR."
  ),
  keywords: [
    "nebraska cornhuskers gear",
    "nebraska football gear",
    "nebraska basketball gear",
    "nebraska volleyball gear",
    "husker apparel",
    "cornhuskers merchandise",
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
