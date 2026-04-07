import { createHmac, timingSafeEqual } from "crypto";

type Payload = { sid: string; exp: number; sig: string };

function signingSecret(): string {
  return (
    process.env.ORDER_DOWNLOAD_SECRET?.trim() ||
    process.env.STRIPE_WEBHOOK_SECRET?.trim() ||
    process.env.STRIPE_SECRET_KEY?.trim() ||
    ""
  );
}

/** Durée de validité du lien (secondes). Défaut : 90 jours. */
const DEFAULT_TTL_SEC = 90 * 24 * 60 * 60;

/**
 * Jeton signé (URL-safe) pour télécharger le PDF d’une session Checkout payée.
 */
export function createOrderPdfToken(sessionId: string, ttlSec: number = DEFAULT_TTL_SEC): string {
  const secret = signingSecret();
  if (!secret) {
    throw new Error(
      "ORDER_DOWNLOAD_SECRET, STRIPE_WEBHOOK_SECRET ou STRIPE_SECRET_KEY requis pour le lien PDF."
    );
  }
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const sig = createHmac("sha256", secret)
    .update(`${sessionId}.${exp}`)
    .digest("hex");
  const json = JSON.stringify({ sid: sessionId, exp, sig } satisfies Payload);
  return Buffer.from(json, "utf8").toString("base64url");
}

export function verifyOrderPdfToken(token: string): string | null {
  const secret = signingSecret();
  if (!secret) return null;
  try {
    const raw = Buffer.from(token, "base64url").toString("utf8");
    const p = JSON.parse(raw) as Payload;
    if (!p?.sid || typeof p.exp !== "number" || !p.sig) return null;
    if (Date.now() / 1000 > p.exp) return null;
    const expected = createHmac("sha256", secret)
      .update(`${p.sid}.${p.exp}`)
      .digest("hex");
    const a = Buffer.from(p.sig, "hex");
    const b = Buffer.from(expected, "hex");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
    return p.sid;
  } catch {
    return null;
  }
}
