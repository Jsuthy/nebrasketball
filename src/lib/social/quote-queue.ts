import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { postTweet, tweetIdFromUrl, xCredentialsPresent } from "./x-client";

// Human-in-the-loop queue for quote-tweeting (reposting with comment) big
// Nebraska accounts. Auto-amplifying other people's posts is the highest
// brand-risk thing this account can do — one out-of-context quote, or a
// cheerful comment on bad news, is unrecoverable. So NOTHING here posts on
// its own: a candidate is enqueued (today by hand; later by an automated
// monitor once a paid X read tier exists), a human approves it, and only
// then does it go out.

export type QuoteStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "posted"
  | "failed";

export interface QuoteCandidate {
  id: string;
  source_url: string;
  source_handle: string | null;
  source_text: string | null;
  source_tweet_id: string | null;
  proposed_comment: string;
  status: QuoteStatus;
  posted_tweet_id: string | null;
  error: string | null;
  created_at: string;
  decided_at: string | null;
}

function serviceClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface EnqueueInput {
  sourceUrl: string;
  sourceHandle?: string | null;
  sourceText?: string | null;
  proposedComment: string;
}

export interface EnqueueResult {
  ok: boolean;
  id?: string;
  error?: string;
}

/**
 * Adds a quote-tweet candidate for review. Validates the source URL is a real
 * status link and that the comment fits (280 minus room for the quoted link).
 */
export async function enqueueQuote(input: EnqueueInput): Promise<EnqueueResult> {
  const sourceUrl = input.sourceUrl?.trim() ?? "";
  const proposedComment = input.proposedComment?.trim() ?? "";
  const sourceTweetId = tweetIdFromUrl(sourceUrl);

  if (!sourceTweetId) {
    return { ok: false, error: "source_url is not a valid x.com/status link" };
  }
  if (!proposedComment) {
    return { ok: false, error: "proposed_comment is required" };
  }
  // A quoted tweet consumes ~24 chars of the 280 budget for the appended link.
  if (proposedComment.length > 256) {
    return {
      ok: false,
      error: `proposed_comment is ${proposedComment.length} chars; keep it ≤ 256 to leave room for the quoted link`,
    };
  }

  const supabase = serviceClient();
  const { data, error } = await supabase
    .from("quote_queue")
    .insert({
      source_url: sourceUrl,
      source_handle: input.sourceHandle?.trim() || null,
      source_text: input.sourceText?.trim() || null,
      source_tweet_id: sourceTweetId,
      proposed_comment: proposedComment,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data.id };
}

export async function listQuotes(
  status: QuoteStatus | "all" = "pending",
  limit = 50
): Promise<QuoteCandidate[]> {
  const supabase = serviceClient();
  let query = supabase
    .from("quote_queue")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (status !== "all") query = query.eq("status", status);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as QuoteCandidate[];
}

export interface DecisionResult {
  ok: boolean;
  status?: QuoteStatus;
  tweetId?: string;
  error?: string;
}

/**
 * Approve (post the quote-tweet now) or reject a pending candidate. Only acts
 * on rows still in "pending" so a double-click can never post twice.
 */
export async function decideQuote(
  id: string,
  decision: "approve" | "reject"
): Promise<DecisionResult> {
  const supabase = serviceClient();

  // Claim the row only if still pending — the WHERE status='pending' guard
  // makes approval idempotent against concurrent/duplicate requests.
  const claimStatus = decision === "approve" ? "approved" : "rejected";
  const { data: claimed, error: claimErr } = await supabase
    .from("quote_queue")
    .update({ status: claimStatus, decided_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "pending")
    .select("*")
    .maybeSingle();

  if (claimErr) return { ok: false, error: claimErr.message };
  if (!claimed) {
    return { ok: false, error: "not found or already decided" };
  }

  if (decision === "reject") {
    return { ok: true, status: "rejected" };
  }

  const row = claimed as QuoteCandidate;
  if (!xCredentialsPresent()) {
    // Leave it "approved" (not posted) so it can go out once creds exist.
    return {
      ok: false,
      status: "approved",
      error: "approved but not posted: X credentials are not configured",
    };
  }

  try {
    const tweetId = await postTweet(row.proposed_comment, {
      quoteTweetId: row.source_tweet_id ?? undefined,
    });
    await supabase
      .from("quote_queue")
      .update({ status: "posted", posted_tweet_id: tweetId })
      .eq("id", id);
    return { ok: true, status: "posted", tweetId };
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown";
    await supabase
      .from("quote_queue")
      .update({ status: "failed", error: message })
      .eq("id", id);
    return { ok: false, status: "failed", error: message };
  }
}
