import crypto from "node:crypto";

// Minimal OAuth 1.0a client for POST https://api.x.com/2/tweets.
// Requires a developer app with Read/Write permissions; user-context keys:
//   X_API_KEY, X_API_SECRET  (consumer key/secret)
//   X_ACCESS_TOKEN, X_ACCESS_TOKEN_SECRET  (for the @nebrasketball account)

const TWEET_URL = "https://api.x.com/2/tweets";

function percentEncode(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`
  );
}

export function xCredentialsPresent(): boolean {
  return Boolean(
    process.env.X_API_KEY &&
      process.env.X_API_SECRET &&
      process.env.X_ACCESS_TOKEN &&
      process.env.X_ACCESS_TOKEN_SECRET
  );
}

/** Posts a tweet. Returns the created tweet id. Throws on API errors. */
export async function postTweet(text: string): Promise<string> {
  const consumerKey = process.env.X_API_KEY!;
  const consumerSecret = process.env.X_API_SECRET!;
  const accessToken = process.env.X_ACCESS_TOKEN!;
  const accessSecret = process.env.X_ACCESS_TOKEN_SECRET!;

  const oauthParams: Record<string, string> = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: String(Math.floor(Date.now() / 1000)),
    oauth_token: accessToken,
    oauth_version: "1.0",
  };

  // JSON request bodies are excluded from the OAuth 1.0a signature base.
  const paramString = Object.keys(oauthParams)
    .sort()
    .map((k) => `${percentEncode(k)}=${percentEncode(oauthParams[k])}`)
    .join("&");
  const baseString = [
    "POST",
    percentEncode(TWEET_URL),
    percentEncode(paramString),
  ].join("&");
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(accessSecret)}`;
  const signature = crypto
    .createHmac("sha1", signingKey)
    .update(baseString)
    .digest("base64");

  const authHeader =
    "OAuth " +
    Object.entries({ ...oauthParams, oauth_signature: signature })
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${percentEncode(k)}="${percentEncode(v)}"`)
      .join(", ");

  const res = await fetch(TWEET_URL, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `X API ${res.status}: ${JSON.stringify(body).slice(0, 300)}`
    );
  }
  return body?.data?.id ?? "unknown";
}
