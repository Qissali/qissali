import type Stripe from "stripe";
import { Resend } from "resend";
import { sendDeliveryEmail, sendEmailSequence } from "./emails.js";
import { generateStoryPDF } from "./generatePDF.js";
import { getStory } from "./stories.js";
import type { StoryMetadata } from "./story-metadata";
import { prenomDisplay } from "./story-metadata";

const QISSALI_MAUVE = "#C49AD8";
const QISSALI_CREAM = "#FEF6FF";

function getResendFrom(): string {
  return (
    process.env.EMAIL_FROM?.trim() ||
    process.env.RESEND_FROM_EMAIL?.trim() ||
    "Qissali <onboarding@resend.dev>"
  );
}

function getAdminEmail(): string {
  return process.env.EMAIL_ADMIN?.trim() || "contact@qissali.fr";
}

function sessionToMetadata(
  metadata: Record<string, string> | null | undefined
): StoryMetadata | null {
  if (!metadata) return null;
  const prenom1 = metadata.prenom1?.trim() || "";
  if (!prenom1) return null;
  return {
    prenom1,
    prenom2: metadata.prenom2?.trim() || "",
    univers: metadata.univers || "",
    valeur: metadata.valeur || "",
    occasion: metadata.occasion || "",
    format: metadata.format || "",
    message: metadata.message || "",
    email: metadata.email?.trim() || "",
  };
}

function buildAdminEmailHtml(meta: StoryMetadata, extras: { sessionId: string; amountTotal: string }): string {
  const rows: [string, string][] = [
    ["Session Stripe", extras.sessionId],
    ["Montant", extras.amountTotal],
    ["Email client", meta.email],
    ["Prénom(s)", prenomDisplay(meta)],
    ["Univers", meta.univers],
    ["Valeur", meta.valeur],
    ["Occasion", meta.occasion],
    ["Format", meta.format],
    ["Message", meta.message || "—"],
  ];
  const bodyRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;font-weight:600;color:${QISSALI_MAUVE};width:140px;">${escapeHtml(
          k
        )}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;">${escapeHtml(v)}</td></tr>`
    )
    .join("");
  return `<!DOCTYPE html><html><head><meta charset="utf-8"/></head><body style="margin:0;padding:24px;background:${QISSALI_CREAM};font-family:sans-serif;font-size:14px;">
  <h2 style="color:${QISSALI_MAUVE};">Nouvelle commande Qissali</h2>
  <table style="width:100%;max-width:560px;background:#fff;border-radius:12px;border-collapse:collapse;">${bodyRows}</table>
  </body></html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Après paiement confirmé (webhook) : PDF + emails client et admin.
 */
export async function fulfillOrderFromSession(
  session: Stripe.Checkout.Session
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const meta = sessionToMetadata(session.metadata as Record<string, string> | null);
  if (!meta) {
    return { ok: false, reason: "Metadata invalides ou prenom1 manquant." };
  }

  const clientEmail =
    meta.email ||
    (typeof session.customer_email === "string" ? session.customer_email : "") ||
    "";
  if (!clientEmail) {
    return { ok: false, reason: "Email client introuvable (metadata ou session)." };
  }
  meta.email = clientEmail;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { ok: false, reason: "RESEND_API_KEY manquant." };
  }

  const nbEnfants = meta.prenom2.trim() ? 2 : 1;
  const story = getStory(
    meta.univers,
    meta.valeur,
    meta.occasion,
    nbEnfants,
    meta.prenom1,
    meta.prenom2
  );
  const pdfBase64 = generateStoryPDF({
    prenom1: meta.prenom1,
    prenom2: meta.prenom2,
    univers: meta.univers,
    valeur: meta.valeur,
    occasion: meta.occasion,
    titre: story.titre,
    texte: story.texte,
    citation: story.citation,
    source: story.source,
    questions: story.questions,
    defi: story.defi,
  });
  const prenomLabel = prenomDisplay(meta);

  const amount =
    session.amount_total != null
      ? `${(session.amount_total / 100).toFixed(2)} ${(session.currency || "eur").toUpperCase()}`
      : "—";

  const resend = new Resend(apiKey);
  const from = getResendFrom();

  const customerSend = await sendDeliveryEmail(clientEmail, prenomLabel, pdfBase64, undefined);

  if (customerSend.error) {
    console.error("Resend client email:", customerSend.error);
    return { ok: false, reason: `Email client: ${JSON.stringify(customerSend.error)}` };
  }

  const adminSend = await resend.emails.send({
    from,
    to: [getAdminEmail()],
    subject: `[Qissali] Commande — ${prenomLabel}`,
    html: buildAdminEmailHtml(meta, { sessionId: session.id, amountTotal: amount }),
  });

  if (adminSend.error) {
    console.error("Resend admin email (non bloquant):", adminSend.error);
  }

  sendEmailSequence(clientEmail, meta.prenom1, meta.prenom2, {
    sessionId: session.id,
    amountTotal: amount,
  });

  return { ok: true };
}
