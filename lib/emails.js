/**
 * Séquence d'emails post-achat (délais via setTimeout).
 * En production sur Vercel / serverless, les timeouts ne survivent pas à la fin
 * de la requête : remplacer par une vraie file (ex. BullMQ, Inngest) + Vercel Cron Jobs.
 *
 * @typedef {Record<string, unknown>} CommandeInfo
 */

import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { Resend } from "resend";

const QISSALI_ROSE = "#E8A0C0";

/** J+3, J+7, J+30 (en millisecondes) */
export const DELAYS = {
  satisfaction: 3 * 24 * 60 * 60 * 1000,
  relance: 7 * 24 * 60 * 60 * 1000,
  reactivation: 30 * 24 * 60 * 60 * 1000,
};

const QISSALI_MAUVE = "#C49AD8";
const QISSALI_CREAM = "#FEF6FF";

/** @param {string | Buffer | Uint8Array} input */
function toBase64Attachment(input) {
  if (typeof input === "string") return input;
  if (Buffer.isBuffer(input)) return input.toString("base64");
  if (input instanceof Uint8Array) return Buffer.from(input).toString("base64");
  throw new TypeError("pdfBuffer / audioBuffer : Buffer, Uint8Array ou chaîne base64 attendu");
}

function getPublicSiteUrl() {
  return (process.env.NEXT_PUBLIC_URL || "https://qissali.fr").replace(/\/$/, "");
}

/** Logo /public/logo.png encodé en data URI pour les clients mail qui l’acceptent. */
function getLogoDataUri() {
  try {
    const p = join(process.cwd(), "public", "logo.png");
    if (!existsSync(p)) return "";
    const buf = readFileSync(p);
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return "";
  }
}

/** @param {string} s */
function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * HTML de l’email de livraison (PDF + option MP3).
 * @param {string} prenom — prénom affiché (ex. « Amina » ou « Amina et Youssef »)
 * @param {string} customerEmail
 * @param {boolean} hasAudio
 */
function buildDeliveryEmailHtml(prenom, customerEmail, hasAudio) {
  const safePrenom = escapeHtml(prenom);
  const baseUrl = getPublicSiteUrl();
  const logoSrc = getLogoDataUri();
  const unsubUrl = `${baseUrl}/desabonnement`;
  const cgvUrl = `${baseUrl}/cgv`;
  const legalUrl = `${baseUrl}/mentions-legales`;

  const btnPrimary = `${baseUrl}/`;
  const btnListen = `${baseUrl}/`;

  const logoBlock = logoSrc
    ? `<img src="${logoSrc}" alt="Qissali" width="160" style="display:block;margin:0 auto 16px;max-width:160px;height:auto;border:0;" />`
    : `<p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:28px;font-weight:bold;color:#fff;">Qissali</p>`;

  const audioRow = hasAudio
    ? `<tr><td align="center" style="padding:8px 24px 24px;">
        <a href="${btnListen}" style="display:inline-block;padding:14px 28px;background:${QISSALI_ROSE};color:#4a4a55;text-decoration:none;border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;border:2px solid ${QISSALI_MAUVE};">Écouter l'histoire</a>
      </td></tr>`
    : "";

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background:${QISSALI_CREAM};font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${QISSALI_CREAM};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 12px 40px rgba(196,154,216,0.25);">
          <tr>
            <td style="padding:32px 28px 28px;text-align:center;background:linear-gradient(145deg,${QISSALI_ROSE} 0%,${QISSALI_MAUVE} 100%);">
              ${logoBlock}
              <h1 style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:26px;font-weight:bold;color:#ffffff;line-height:1.3;text-shadow:0 1px 2px rgba(0,0,0,0.08);">🌙 Barakallahu fik !</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 28px 16px;text-align:center;">
              <p style="margin:0;font-family:'Playfair Display',Georgia,'Times New Roman',serif;font-size:28px;font-weight:600;line-height:1.25;color:${QISSALI_MAUVE};">L'histoire de ${safePrenom} est arrivée !</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 28px 24px;color:#4a4a55;font-size:16px;line-height:1.7;">
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;">Nous avons créé avec amour l'histoire de <strong style="color:${QISSALI_MAUVE};">${safePrenom}</strong>. Tu trouveras en pièce jointe son histoire personnalisée, prête à être lue ensemble ce soir.</p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:8px 24px 12px;">
              <a href="${btnPrimary}" style="display:inline-block;padding:14px 28px;background:${QISSALI_MAUVE};color:#ffffff;text-decoration:none;border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;">Ouvrir mon histoire</a>
            </td>
          </tr>
          ${audioRow}
          <tr>
            <td style="padding:28px 28px 8px;border-top:1px solid #f0e8f5;">
              <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:18px;font-weight:bold;color:${QISSALI_MAUVE};text-align:center;">Comment lire l'histoire ensemble ?</p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;color:#4a4a55;line-height:1.6;">
                <tr><td style="padding:10px 0;">📖 Installe-toi confortablement avec ton enfant</td></tr>
                <tr><td style="padding:10px 0;">🌙 Lis l'histoire en prenant le temps</td></tr>
                <tr><td style="padding:10px 0;">💬 Utilise les questions du débat à la fin</td></tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 28px 32px;text-align:center;background:#faf8fc;border-top:1px solid #eee;">
              <p style="margin:0 0 12px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:#777;">Créé avec ❤️ par Qissali — <a href="${baseUrl}" style="color:${QISSALI_MAUVE};text-decoration:underline;">qissali.fr</a></p>
              <p style="margin:0 0 10px;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
                <a href="${unsubUrl}?email=${encodeURIComponent(customerEmail)}" style="color:#999;text-decoration:underline;">Se désabonner</a>
              </p>
              <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;">
                <a href="${cgvUrl}" style="color:${QISSALI_MAUVE};text-decoration:underline;">CGV</a>
                <span style="color:#ccc;"> &nbsp;|&nbsp; </span>
                <a href="${legalUrl}" style="color:${QISSALI_MAUVE};text-decoration:underline;">Mentions légales</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Envoie l’email de livraison avec PDF obligatoire et MP3 optionnel.
 * @param {string} email
 * @param {string} prenom — libellé prénom(s) pour le corps du message
 * @param {string | Buffer | Uint8Array} pdfBuffer — PDF (Buffer / Uint8Array ou chaîne base64)
 * @param {string | Buffer | Uint8Array | null | undefined} audioBuffer — MP3 optionnel
 * @returns {Promise<{ data?: unknown; error?: unknown }>}
 */
export async function sendDeliveryEmail(email, prenom, pdfBuffer, audioBuffer) {
  const cfg = getResend();
  if (!cfg) {
    return { error: { message: "RESEND_API_KEY manquant" } };
  }
  const { client, from } = cfg;
  const to = (email || "").trim();
  if (!to) {
    return { error: { message: "email vide" } };
  }

  const safeFile =
    String(prenom || "enfant")
      .replace(/[^a-zA-ZÀ-ÿ0-9-_]/g, "-")
      .slice(0, 48) || "enfant";
  const pdfBase64 = toBase64Attachment(pdfBuffer);
  const hasAudio =
    audioBuffer != null &&
    audioBuffer !== "" &&
    (Buffer.isBuffer(audioBuffer) || audioBuffer instanceof Uint8Array
      ? audioBuffer.length > 0
      : typeof audioBuffer === "string"
        ? audioBuffer.length > 0
        : false);
  const attachments = [
    {
      filename: `histoire-qissali-${safeFile}.pdf`,
      content: pdfBase64,
    },
  ];
  if (hasAudio) {
    attachments.push({
      filename: `histoire-qissali-${safeFile}.mp3`,
      content: toBase64Attachment(/** @type {string | Buffer | Uint8Array} */ (audioBuffer)),
    });
  }

  const prenomLabel = (prenom || "").trim() || "ton enfant";
  const subject = `🌙 L'histoire de ${prenomLabel} est prête !`;

  return client.emails.send({
    from,
    to: [to],
    subject,
    html: buildDeliveryEmailHtml(prenomLabel, to, hasAudio),
    attachments,
  });
}

/**
 * @param {string} prenom1
 * @param {string} [prenom2]
 */
function labelEnfants(prenom1, prenom2) {
  const a = (prenom1 || "").trim();
  const b = (prenom2 || "").trim();
  if (a && b) return `${a} et ${b}`;
  return a || b || "ton enfant";
}

function shellHtml(title, bodyParagraphs) {
  const inner = bodyParagraphs.map((p) => `<p style="margin:0 0 16px;">${p}</p>`).join("");
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/></head>
<body style="margin:0;padding:0;background:${QISSALI_CREAM};font-family:'Segoe UI',Tahoma,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${QISSALI_CREAM};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 32px rgba(196,154,216,0.2);">
        <tr><td style="padding:28px 28px 8px;text-align:center;">
          <h1 style="margin:0;font-family:Georgia,serif;font-size:22px;font-weight:400;color:${QISSALI_MAUVE};font-style:italic;">Qissali</h1>
        </td></tr>
        <tr><td style="padding:16px 28px 32px;color:#4a4a55;font-size:16px;line-height:1.65;">
          <p style="margin:0 0 20px;font-weight:600;color:${QISSALI_MAUVE};">${escapeHtml(title)}</p>
          ${inner}
          <p style="margin:0;font-style:italic;color:#888;font-size:14px;">Barakallahu fik — l'équipe Qissali</p>
        </td></tr>
      </table>
      <p style="margin:24px 0 0;font-size:12px;color:#888;">qissali.fr</p>
    </td></tr>
  </table>
</body></html>`;
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  const from =
    process.env.EMAIL_FROM?.trim() || process.env.RESEND_FROM_EMAIL?.trim() || "Qissali <onboarding@resend.dev>";
  return { client: new Resend(apiKey), from };
}

/**
 * Envoie la séquence post-achat : emails à J+3 (satisfaction), J+7 (relance), J+30 (réactivation).
 * Retourne les identifiants des timers pour tests / annulation éventuelle.
 *
 * @param {string} email
 * @param {string} prenom1
 * @param {string} [prenom2]
 * @param {CommandeInfo} [commande]
 * @returns {{ timeouts: import("node:timers").Timeout[] }}
 */
export function sendEmailSequence(email, prenom1, prenom2, commande = {}) {
  const cfg = getResend();
  if (!cfg) {
    console.warn("[sendEmailSequence] RESEND_API_KEY manquant — séquence ignorée.");
    return { timeouts: [] };
  }

  const { client, from } = cfg;
  const to = email.trim();
  if (!to) {
    console.warn("[sendEmailSequence] email vide — séquence ignorée.");
    return { timeouts: [] };
  }

  const enfants = labelEnfants(prenom1, prenom2);
  const cmdRef =
    typeof commande?.sessionId === "string"
      ? commande.sessionId
      : typeof commande?.id === "string"
        ? commande.id
        : "";

  const send = async (subject, html) => {
    try {
      const result = await client.emails.send({ from, to: [to], subject, html });
      if (result.error) console.error("[sendEmailSequence] Resend:", result.error);
    } catch (e) {
      console.error("[sendEmailSequence] envoi échoué:", e);
    }
  };

  const t1 = setTimeout(() => {
    void send(
      `Comment s'est passée la lecture avec ${enfants} ?`,
      shellHtml(`As-salamu alaykum`, [
        `Nous espérons que l'histoire de <strong>${escapeHtml(enfants)}</strong> a plu à toute la famille.`,
        `Ton avis compte beaucoup pour nous : un mot, une étoile, ou une idée sur <a href="https://qissali.fr" style="color:${QISSALI_MAUVE};">qissali.fr</a> nous aide à grandir.`,
        cmdRef ? `<span style="font-size:12px;color:#aaa;">Réf. commande : ${escapeHtml(cmdRef)}</span>` : "",
      ].filter(Boolean))
    );
  }, DELAYS.satisfaction);

  const t2 = setTimeout(() => {
    void send(
      `Une autre histoire pour ${enfants} ?`,
      shellHtml(`As-salamu alaykum`, [
        `Il y a quelques jours, tu as offert une histoire personnalisée pour <strong>${escapeHtml(enfants)}</strong>.`,
        `Si tu veux découvrir un nouvel univers ou une autre occasion, passe sur <a href="https://qissali.fr/commander" style="color:${QISSALI_MAUVE};">notre page commander</a>.`,
      ])
    );
  }, DELAYS.relance);

  const t3 = setTimeout(() => {
    void send(
      `On pense à vous — Qissali`,
      shellHtml(`As-salamu alaykum`, [
        `Cela fait un moment que nous n'avons pas eu de nouvelles : les histoires de <strong>${escapeHtml(enfants)}</strong> méritent peut-être une suite.`,
        `Découvre les nouveautés sur <a href="https://qissali.fr" style="color:${QISSALI_MAUVE};">qissali.fr</a> quand tu veux.`,
      ])
    );
  }, DELAYS.reactivation);

  return { timeouts: [t1, t2, t3] };
}
