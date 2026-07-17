import { ogCard, OG_SIZE } from "@/lib/og-card";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Nebraska Volleyball Attendance Records — 92,003";

export default function Image() {
  return ogCard({
    kicker: "World Record · 92,003",
    title: "The Record Book Belongs to Lincoln",
    subtitle: "Every attendance record Nebraska volleyball holds",
  });
}
