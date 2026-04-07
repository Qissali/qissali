import type Stripe from "stripe";
import { sendAdminNotification, sendDeliveryEmail, sendEmailSequence } from "./emails.js";
import { generateStoryPDF } from "./generatePDF.js";
import { getStory } from "./stories.js";
import type { StoryMetadata } from "./story-metadata";
import { prenomDisplay } from "./story-metadata";

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
    age_enfant1: metadata.age_enfant1?.trim() || "",
    age_enfant2: metadata.age_enfant2?.trim() || "",
  };
}

function formatOrderFormatLabel(formatId: string): string {
  if (formatId === "pdf-audio") return "PDF + Audio";
  if (formatId === "pdf") return "PDF illustré";
  return formatId || "—";
}

function formatAgeLine(meta: StoryMetadata): string {
  const a = meta.age_enfant1?.trim();
  const b = meta.age_enfant2?.trim();
  if (a && b) return `${a} ans et ${b} ans`;
  if (a) return `${a} ans`;
  return "—";
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

  if (!process.env.RESEND_API_KEY?.trim()) {
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

  const prixEuro =
    session.amount_total != null
      ? `${(session.amount_total / 100).toFixed(2).replace(".", ",")} €`
      : "—";

  const timestamp =
    session.created != null
      ? new Date(session.created * 1000).toLocaleString("fr-FR", {
          dateStyle: "short",
          timeStyle: "short",
        })
      : new Date().toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" });

  const customerSend = await sendDeliveryEmail(clientEmail, prenomLabel, pdfBase64, undefined);

  if (customerSend.error) {
    console.error("Resend client email:", customerSend.error);
    return { ok: false, reason: `Email client: ${JSON.stringify(customerSend.error)}` };
  }

  const adminSend = await sendAdminNotification({
    prenom1: meta.prenom1,
    prenom2: meta.prenom2,
    age: formatAgeLine(meta),
    univers: meta.univers,
    valeur: meta.valeur,
    occasion: meta.occasion,
    format: formatOrderFormatLabel(meta.format),
    prix: prixEuro,
    emailClient: clientEmail,
    timestamp,
    sessionId: session.id,
  });

  if (adminSend.error) {
    console.error("Resend admin email (non bloquant):", adminSend.error);
  }

  sendEmailSequence(clientEmail, meta.prenom1, meta.prenom2, {
    sessionId: session.id,
    amountTotal: prixEuro,
  });

  return { ok: true };
}
