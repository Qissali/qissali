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
import { histoiresFromStripeMetadata } from "./checkout-histoires";

function strMeta(v: unknown): string {
  if (v == null) return "";
  return String(v);
}

function itemToStoryMeta(
  item: Record<string, unknown>,
  email: string,
  format: string
): StoryMetadata {
  return {
    prenom1: strMeta(item.prenom1),
    prenom2: strMeta(item.prenom2),
    univers: strMeta(item.univers),
    valeur: strMeta(item.valeur),
    occasion: strMeta(item.occasion),
    format,
    message: strMeta(item.message),
    email,
    age_enfant1: strMeta(item.age_enfant1),
    age_enfant2: strMeta(item.age_enfant2),
    profils: strMeta(item.profils),
    precisionsNeuro: strMeta(item.precisionsNeuro),
  };
}

async function fulfillPackHistoires(
  session: Stripe.Checkout.Session,
  items: Record<string, unknown>[]
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const baseMeta = sessionToMetadata(session.metadata as Record<string, string> | null);
  if (!baseMeta) {
    return { ok: false, reason: "Metadata invalides." };
  }
  const clientEmail =
    baseMeta.email ||
    (typeof session.customer_email === "string" ? session.customer_email : "") ||
    "";
  if (!clientEmail) {
    return { ok: false, reason: "Email client introuvable." };
  }
  if (!process.env.RESEND_API_KEY?.trim()) {
    return { ok: false, reason: "RESEND_API_KEY manquant." };
  }

  const format = baseMeta.format || "pdf";
  const multiPdf: { filename: string; content: string }[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i] as Record<string, unknown>;
    const meta = itemToStoryMeta(item, clientEmail, format);
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
    const label = prenomDisplay(meta).replace(/[^a-zA-ZÀ-ÿ0-9-_]/g, "-").slice(0, 40) || "enfant";
    multiPdf.push({
      filename: `histoire-qissali-${i + 1}-${label}.pdf`,
      content: base64,
    });
  }

  const prenomLabel =
    items.length > 1 ? "vos histoires" : prenomDisplay(itemToStoryMeta(items[0] as Record<string, unknown>, clientEmail, format));

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

  const customerSend = await sendDeliveryEmail(clientEmail, prenomLabel, "", undefined, {
    multiPdfAttachments: multiPdf,
  });

  if (customerSend.error) {
    console.error("Resend client email (pack):", customerSend.error);
    return { ok: false, reason: `Email client: ${JSON.stringify(customerSend.error)}` };
  }

  const first = itemToStoryMeta(items[0] as Record<string, unknown>, clientEmail, format);
  const adminSend = await sendAdminNotification({
    prenom1: `${items.length} histoire(s) — ${first.prenom1}`,
    prenom2: first.prenom2,
    age: formatAgeLine(first),
    univers: first.univers,
    valeur: first.valeur,
    occasion: first.occasion,
    format: formatOrderFormatLabel(format),
    prix: prixEuro,
    emailClient: clientEmail,
    timestamp,
    sessionId: session.id,
  });

  if (adminSend.error) {
    console.error("Resend admin email (non bloquant):", adminSend.error);
  }

  sendEmailSequence(clientEmail, first.prenom1, first.prenom2, {
    sessionId: session.id,
    amountTotal: prixEuro,
  });

  return { ok: true };
}

type ResolvedStory = {
  titre: string;
  texte: string;
  citation: string;
  source: string;
  questions: string[];
  defi: string;
};

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
    pack: metadata.pack?.trim() || "",
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
  options?: { profils?: string; precisionsNeuro?: string; storyOverride?: ResolvedStory | null }
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
  const story =
    options?.storyOverride ||
    getStoryOrDefault(
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
  options?: { profils?: string; precisionsNeuro?: string; storyOverride?: ResolvedStory | null }
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const rawMd = session.metadata as Record<string, string> | null;
  if (rawMd?.hj_count) {
    const list = histoiresFromStripeMetadata(rawMd);
    if (list && Array.isArray(list) && list.length > 0) {
      return fulfillPackHistoires(session, list as Record<string, unknown>[]);
    }
  }

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

  const storyResolved =
    options?.storyOverride ||
    getStory(
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
    storyOverride: storyResolved,
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
