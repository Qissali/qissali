/** Sérialise les histoires pour les métadonnées Stripe (limite ~500 car. par clé). */

const CHUNK = 450;
const PREFIX = "hj";

export function histoiresToStripeMetadata(
  histoires: unknown
): Record<string, string> {
  const raw = JSON.stringify(histoires);
  const out: Record<string, string> = {};
  let idx = 0;
  for (let i = 0; i < raw.length; i += CHUNK) {
    out[`${PREFIX}_${idx}`] = raw.slice(i, i + CHUNK);
    idx++;
  }
  out[`${PREFIX}_count`] = String(idx);
  return out;
}

export function histoiresFromStripeMetadata(
  metadata: Record<string, string> | null | undefined
): unknown[] | null {
  if (!metadata) return null;
  const n = parseInt(metadata[`${PREFIX}_count`] || "0", 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  let s = "";
  for (let i = 0; i < n; i++) {
    s += metadata[`${PREFIX}_${i}`] ?? "";
  }
  try {
    const parsed = JSON.parse(s) as unknown;
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
