import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createHash } from "crypto";

const ENDPOINT_URL =
  "https://nebrasketball.com/api/ebay/account-deletion";

// GET — eBay challenge verification
export async function GET(request: NextRequest) {
  const challengeCode = request.nextUrl.searchParams.get("challenge_code");

  if (!challengeCode) {
    return NextResponse.json(
      { error: "Missing challenge_code" },
      { status: 400 }
    );
  }

  const verificationToken = process.env.EBAY_VERIFICATION_TOKEN;
  if (!verificationToken) {
    console.error("EBAY_VERIFICATION_TOKEN not configured");
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 }
    );
  }

  const hash = createHash("sha256")
    .update(challengeCode + verificationToken + ENDPOINT_URL)
    .digest("hex");

  return NextResponse.json(
    { challengeResponse: hash },
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// POST — eBay account deletion notification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log for compliance records
    console.log(
      "eBay account deletion notification received:",
      JSON.stringify({
        topic: body?.metadata?.topic,
        userId: body?.notification?.data?.userId,
        timestamp: new Date().toISOString(),
      })
    );

    // We only store anonymous click events with no eBay user IDs,
    // so there is no user-specific data to delete. Acknowledge receipt.
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
