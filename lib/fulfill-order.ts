import type Stripe from "stripe";
import {
  sendAdminNotification,
  sendDeliveryEmail,
  sendEmailSequence,
  sendMissingStoryAdminEmail,
  sendStoryPendingClientEmail,
} from "./emails.js";
import { generateStoryPDF } from "./generatePDF.js";
import { createOrderPdfToken } from "./order-pdf-token";
import { getStory, getStoryOrDefault, storyKey } from "./stories.js";
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
    profils: metadata.profils?.trim() || "",
    precisionsNeuro: metadata.precisionsNeuro?.trim() || "",
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

function safePdfFilename(prenomLabel: string): string {
  const safe =
    String(prenomLabel || "enfant")
      .replace(/[^a-zA-ZÀ-ÿ0-9-_]/g, "-")
      .slice(0, 48) || "enfant";
  return `histoire-qissali-${safe}.pdf`;
}

/**
 * Régénère le PDF à partir d’une session Checkout (paiement confirmé).
 * Utilisé par l’email (pièce jointe) et la route /api/order-pdf.
 */
export function buildPdfFromCheckoutSession(
  session: Stripe.Checkout.Session,
  options?: { profils?: string; precisionsNeuro?: string }
):
  | { ok: true; base64: string; filename: string }
  | { ok: false; reason: string } {
  const meta = sessionToMetadata(session.metadata as Record<string, string> | null);
  if (!meta) {
    return { ok: false, reason: "Metadata invalides ou prenom1 manquant." };
  }
  if (options?.profils !== undefined) meta.profils = options.profils;
  if (options?.precisionsNeuro !== undefined) meta.precisionsNeuro = options.precisionsNeuro;
  const nbEnfants = meta.prenom2.trim() ? 2 : 1;
  const story = getStoryOrDefault(
    meta.univers,
    meta.valeur,
    meta.occasion,
    nbEnfants,
    meta.prenom1,
    meta.prenom2,
    meta.profils || "",
    meta.precisionsNeuro || ""
  );
  const base64 = generateStoryPDF({
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
  return { ok: true, base64, filename: safePdfFilename(prenomLabel) };
}

/**
 * Après paiement confirmé (webhook) : PDF + emails client et admin.
 */
export async function fulfillOrderFromSession(
  session: Stripe.Checkout.Session,
  options?: { profils?: string; precisionsNeuro?: string }
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const meta = sessionToMetadata(session.metadata as Record<string, string> | null);
  if (!meta) {
    return { ok: false, reason: "Metadata invalides ou prenom1 manquant." };
  }
  if (options?.profils !== undefined) meta.profils = options.profils;
  if (options?.precisionsNeuro !== undefined) meta.precisionsNeuro = options.precisionsNeuro;

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
  const prenomLabel = prenomDisplay(meta);

  const storyResolved = getStory(
    meta.univers,
    meta.valeur,
    meta.occasion,
    nbEnfants,
    meta.prenom1,
    meta.prenom2,
    meta.profils || "",
    meta.precisionsNeuro || ""
  );

  if (storyResolved === null) {
    console.error(
      "[Qissali] Histoire manquante (getStory null)",
      JSON.stringify(
        {
          sessionId: session.id,
          storyKey: storyKey(meta.univers, meta.valeur, meta.occasion, nbEnfants),
          univers: meta.univers,
          valeur: meta.valeur,
          occasion: meta.occasion,
          nbEnfants,
          emailClient: clientEmail,
          prenom1: meta.prenom1,
          prenom2: meta.prenom2,
        },
        null,
        2
      )
    );

    const adminMissing = await sendMissingStoryAdminEmail({
      sessionId: session.id,
      univers: meta.univers,
      valeur: meta.valeur,
      occasion: meta.occasion,
      nbEnfants,
      emailClient: clientEmail,
    });
    if (adminMissing.error) {
      console.error("sendMissingStoryAdminEmail:", adminMissing.error);
    }

    const clientPending = await sendStoryPendingClientEmail(clientEmail, prenomLabel);
    if (clientPending.error) {
      return {
        ok: false,
        reason: `Email client (histoire en préparation): ${JSON.stringify(clientPending.error)}`,
      };
    }

    return { ok: true };
  }

  const built = buildPdfFromCheckoutSession(session, {
    profils: meta.profils || "",
    precisionsNeuro: meta.precisionsNeuro || "",
  });
  if (!built.ok) {
    return { ok: false, reason: built.reason };
  }
  const pdfBase64 = built.base64;

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

  let downloadPdfUrl = "";
  try {
    const token = createOrderPdfToken(session.id);
    const base =
      process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "") || "https://qissali.com";
    downloadPdfUrl = `${base}/api/order-pdf?token=${encodeURIComponent(token)}`;
  } catch (e) {
    console.error("Lien téléchargement PDF email:", e);
  }

  const customerSend = await sendDeliveryEmail(clientEmail, prenomLabel, pdfBase64, undefined, {
    downloadPdfUrl,
  });

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
