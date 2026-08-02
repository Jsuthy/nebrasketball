import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, source } = body as { email?: string; source?: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email" },
        { status: 400 }
      );
    }

    // Persist with the service-role client (bypasses RLS). Any failure —
    // duplicate email, missing env, network — is logged and swallowed so the
    // signup UX never breaks. Dedupe is silent via upsert on the unique email.
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );

      const { error } = await supabase
        .from("email_subscribers")
        .upsert(
          { email, source: typeof source === "string" ? source : null },
          { onConflict: "email", ignoreDuplicates: true }
        );

      if (error) {
        console.error("email_subscribers upsert error:", error.message);
      }
    } catch (dbErr) {
      console.error(
        "email_subscribers persistence failed:",
        dbErr instanceof Error ? dbErr.message : dbErr
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
