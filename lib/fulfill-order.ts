import type Stripe from "stripe";
import { Resend } from "resend";
import { generateStoryPDF } from "./generatePDF.js";
import { getStory } from "./stories.js";
import type { StoryMetadata } from "./story-metadata";
import { prenomDisplay } from "./story-metadata";

const QISSALI_ROSE = "#E8A0C0";
const QISSALI_MAUVE = "#C49AD8";
const QISSALI_CREAM = "#FEF6FF";

function getResendFrom(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || "Qissali <onboarding@resend.dev>";
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

function buildCustomerEmailHtml(prenomLabel: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
</head>
<body style="margin:0;padding:0;background:${QISSALI_CREAM};font-family:'Segoe UI',Tahoma,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${QISSALI_CREAM};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(196,154,216,0.2);">
          <tr>
            <td style="padding:32px 28px 16px;text-align:center;background:linear-gradient(135deg,${QISSALI_ROSE}33,${QISSALI_MAUVE}33);">
              <div style="font-size:48px;line-height:1;">&#127769;</div>
              <h1 style="margin:16px 0 0;font-family:Georgia,serif;font-size:26px;font-weight:400;color:${QISSALI_MAUVE};font-style:italic;">Qissali</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 36px;color:#4a4a55;font-size:16px;line-height:1.65;">
              <p style="margin:0 0 16px;">As-salamu alaykum,</p>
              <p style="margin:0 0 16px;">Ta commande est pr&#234;te ! Tu trouveras l&#8217;histoire personnalis&#233;e de <strong style="color:${QISSALI_MAUVE};">${escapeHtml(
                prenomLabel
              )}</strong> en pi&#232;ce jointe (PDF).</p>
              <p style="margin:0 0 16px;">Qu&#8217;Allah accepte nos bonnes actions et b&#233;nisse ton foyer.</p>
              <p style="margin:0;font-style:italic;color:${QISSALI_ROSE};">Barakallahu fik &#8212; l&#8217;&#233;quipe Qissali</p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-size:12px;color:#888;">qissali.fr</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
  const safeFile =
    meta.prenom1.replace(/[^a-zA-ZÀ-ÿ0-9-_]/g, "-").slice(0, 40) || "enfant";
  const filename = `histoire-qissali-${safeFile}.pdf`;

  const amount =
    session.amount_total != null
      ? `${(session.amount_total / 100).toFixed(2)} ${(session.currency || "eur").toUpperCase()}`
      : "—";

  const resend = new Resend(apiKey);
  const from = getResendFrom();

  const subject = `🌙 L'histoire de ${prenomLabel} est prête !`;

  const customerSend = await resend.emails.send({
    from,
    to: [clientEmail],
    subject,
    html: buildCustomerEmailHtml(prenomLabel),
    attachments: [{ filename, content: pdfBase64 }],
  });

  if (customerSend.error) {
    console.error("Resend client email:", customerSend.error);
    return { ok: false, reason: `Email client: ${JSON.stringify(customerSend.error)}` };
  }

  const adminSend = await resend.emails.send({
    from,
    to: ["contact@qissali.fr"],
    subject: `[Qissali] Commande — ${prenomLabel}`,
    html: buildAdminEmailHtml(meta, { sessionId: session.id, amountTotal: amount }),
  });

  if (adminSend.error) {
    console.error("Resend admin email (non bloquant):", adminSend.error);
  }

  return { ok: true };
}
