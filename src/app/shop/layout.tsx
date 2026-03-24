import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop Nebraska Basketball Gear — Tees, Hoodies, Jerseys & More",
  description:
    "Search every Nebraska Cornhuskers basketball product from Amazon, eBay, Etsy and Fanatics in one place. Filter by type, source, and price.",
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
