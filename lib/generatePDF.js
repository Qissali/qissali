/**
 * @typedef {Object} GenerateStoryParams
 * @property {string} prenom1
 * @property {string} [prenom2]
 * @property {string} univers
 * @property {string} valeur
 * @property {string} occasion
 * @property {string} titre
 * @property {string} texte
 * @property {string} citation
 * @property {string} source
 * @property {string[]} questions
 * @property {string} defi
 */

import { jsPDF } from "jspdf";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 18;
const INNER_W = PAGE_W - 2 * MARGIN;

/** @param {string} univers */
function universToTheme(univers) {
  const u = String(univers || "").toLowerCase();
  if (u.includes("princesse")) {
    return { bg: [232, 160, 192], accent: [160, 80, 120], emoji: "👑" };
  }
  if (u.includes("licorne")) {
    return { bg: [196, 154, 216], accent: [120, 60, 130], emoji: "🦄" };
  }
  if (u.includes("super") || u.includes("héros")) {
    return { bg: [126, 182, 232], accent: [40, 80, 140], emoji: "🦸" };
  }
  if (u.includes("animaux") || u.includes("animal")) {
    return { bg: [144, 198, 150], accent: [50, 100, 60], emoji: "🐾" };
  }
  return { bg: [254, 246, 255], accent: [120, 80, 120], emoji: "🌙" };
}

/**
 * @param {GenerateStoryParams} params
 * @returns {string} PDF encodé en base64 (sans préfixe data:)
 */
export function generateStoryPDF(params) {
  const {
    univers,
    valeur,
    occasion,
    titre,
    texte,
    citation,
    source,
    questions,
    defi,
  } = params;

  const theme = universToTheme(univers);

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  // ——— PAGE 1 — Couverture
  doc.setFillColor(theme.bg[0], theme.bg[1], theme.bg[2]);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");

  doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("Qissali", PAGE_W / 2, 38, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Une histoire islamique personnalisee", PAGE_W / 2, 48, { align: "center" });

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(55, 55, 62);
  const titreLines = doc.splitTextToSize(String(titre || ""), INNER_W - 8);
  let titleY = 64;
  for (const tl of titreLines) {
    doc.text(tl, PAGE_W / 2, titleY, { align: "center" });
    titleY += 8;
  }

  const chipY = Math.max(titleY + 14, 88);
  const chipH = 10;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(255, 255, 255);
  doc.roundedRect(MARGIN, chipY, 80, chipH, 3, 3, "FD");
  doc.roundedRect(MARGIN + 88, chipY, 88, chipH, 3, 3, "FD");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(70, 70, 78);
  doc.text(String(occasion || "").slice(0, 42), MARGIN + 4, chipY + 6.5);
  doc.text(String(valeur || "").slice(0, 40), MARGIN + 92, chipY + 6.5);

  const illY = Math.max(118, chipY + chipH + 16);
  const illW = 120;
  const illH = 55;
  const illX = (PAGE_W - illW) / 2;
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(illX, illY, illW, illH, 6, 6, "FD");
  doc.setFontSize(42);
  doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.text(theme.emoji, PAGE_W / 2, illY + illH / 2 + 8, { align: "center" });

  doc.setFontSize(10);
  doc.setTextColor(90, 90, 98);
  doc.text(String(univers || ""), PAGE_W / 2, illY + illH + 14, { align: "center" });

  // ——— Pages texte (histoire)
  const storyText = String(texte || "").replace(/\r\n/g, "\n");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(45, 45, 52);

  doc.addPage();
  drawStoryPageFrame(doc);

  const lineHeight = 6;
  const textTop = MARGIN + 8;
  const textBottom = PAGE_H - MARGIN - 14;
  let y = textTop;

  const paragraphs = storyText.split(/\n\n+/);
  /** @type {string[]} */
  const lines = [];
  for (const block of paragraphs) {
    const wrapped = doc.splitTextToSize(block.trim(), INNER_W - 4);
    for (const line of wrapped) lines.push(line);
    lines.push("");
  }

  for (const line of lines) {
    if (line === "") {
      y += lineHeight * 0.5;
      continue;
    }
    if (y > textBottom) {
      doc.addPage();
      drawStoryPageFrame(doc);
      y = textTop;
    }
    doc.text(line, MARGIN + 2, y);
    y += lineHeight;
  }

  // ——— Page(s) fin
  doc.addPage();
  drawFinPageBackground(doc);

  doc.setFont("helvetica", "italic");
  doc.setFontSize(28);
  doc.setTextColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.text("Fin.", PAGE_W / 2, 46, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(55, 55, 62);
  const citeLines = doc.splitTextToSize(String(citation || ""), INNER_W);
  let cy = 64;
  for (const cl of citeLines) {
    if (cy > PAGE_H - MARGIN - 50) {
      doc.addPage();
      drawFinPageBackground(doc);
      cy = MARGIN + 10;
    }
    doc.text(cl, MARGIN, cy);
    cy += lineHeight;
  }

  cy += 6;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 110);
  const sourceLines = doc.splitTextToSize(String(source || ""), INNER_W);
  for (const sl of sourceLines) {
    if (cy > PAGE_H - MARGIN - 50) {
      doc.addPage();
      drawFinPageBackground(doc);
      cy = MARGIN + 10;
    }
    doc.text(sl, MARGIN, cy);
    cy += lineHeight - 1;
  }

  cy += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(120, 60, 120);
  if (cy > PAGE_H - MARGIN - 40) {
    doc.addPage();
    drawFinPageBackground(doc);
    cy = MARGIN + 10;
  }
  doc.text("Et toi qu'en penses-tu ?", MARGIN, cy);
  cy += 10;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(45, 45, 52);
  const qs = Array.isArray(questions) ? questions : [];
  qs.forEach((q, i) => {
    const prefix = `${i + 1}. `;
    const wrapped = doc.splitTextToSize(prefix + q, INNER_W - 4);
    for (const line of wrapped) {
      if (cy > PAGE_H - MARGIN - 30) {
        doc.addPage();
        drawFinPageBackground(doc);
        cy = MARGIN + 10;
      }
      doc.text(line, MARGIN + 2, cy);
      cy += lineHeight;
    }
    cy += 3;
  });

  cy += 4;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(120, 60, 120);
  if (cy > PAGE_H - MARGIN - 24) {
    doc.addPage();
    drawFinPageBackground(doc);
    cy = MARGIN + 10;
  }
  doc.text("Défi", MARGIN, cy);
  cy += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(45, 45, 52);
  const defiText = String(defi || "").replace(/\r\n/g, "\n");
  const defiLines = doc.splitTextToSize(defiText, INNER_W);
  for (const dl of defiLines) {
    if (cy > PAGE_H - MARGIN - 28) {
      doc.addPage();
      drawFinPageBackground(doc);
      cy = MARGIN + 10;
    }
    doc.text(dl, MARGIN, cy);
    cy += lineHeight;
  }

  doc.setFont("helvetica", "italic");
  doc.setFontSize(12);
  doc.setTextColor(196, 154, 216);
  doc.text("Qissali", PAGE_W / 2, PAGE_H - 22, { align: "center" });

  // Numéros : pas sur la couverture (page 1), puis 2, 3, 4…
  const total = doc.getNumberOfPages();
  for (let p = 2; p <= total; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(140, 140, 150);
    doc.text(String(p), PAGE_W / 2, PAGE_H - 10, { align: "center" });
  }

  const buf = Buffer.from(doc.output("arraybuffer"));
  return buf.toString("base64");
}

/** @param {import("jspdf").jsPDF} doc */
function drawStoryPageFrame(doc) {
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
  doc.setDrawColor(220, 180, 210);
  doc.setLineWidth(0.6);
  doc.rect(MARGIN - 3, MARGIN - 3, PAGE_W - 2 * (MARGIN - 3), PAGE_H - 2 * (MARGIN - 3));
  doc.setDrawColor(240, 220, 235);
  doc.setLineWidth(0.25);
  doc.rect(MARGIN - 1, MARGIN - 1, PAGE_W - 2 * (MARGIN - 1), PAGE_H - 2 * (MARGIN - 1));
}

/** @param {import("jspdf").jsPDF} doc */
function drawFinPageBackground(doc) {
  doc.setFillColor(254, 246, 255);
  doc.rect(0, 0, PAGE_W, PAGE_H, "F");
}
