/**
 * Génère un PDF d'exemple (Princesse / Générosité / Aïd el-Fitr / Nour).
 * Usage : node scripts/pdf-sample.mjs [fichier-sortie.pdf]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { generateStoryPDF } from "../lib/generatePDF.js";
import { getStory } from "../lib/stories.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const out = process.argv[2] || path.join(__dirname, "..", "test-nour.pdf");

const univers = "Princesse";
const valeur = "Générosité";
const occasion = "Aïd el-Fitr";
const prenom1 = "Nour";
const prenom2 = "";

const story = getStory(univers, valeur, occasion, 1, prenom1, prenom2);

const b64 = generateStoryPDF({
  prenom1,
  prenom2,
  univers,
  valeur,
  occasion,
  ...story,
});

fs.writeFileSync(out, Buffer.from(b64, "base64"));
console.log(`PDF écrit : ${path.resolve(out)}`);
