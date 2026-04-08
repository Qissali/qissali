"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { getStoryOrDefault, STORIES } from "@/lib/stories.js";

/** Même grille que le formulaire commander (4 × 5 × 5 × 2). */
const POSSIBLE_COMBINATIONS = 4 * 5 * 5 * 2;

const UNIVERSE_SEGMENTS = ["super-héros", "princesse", "licorne", "animaux"];

const VALEUR_SEGMENTS = [
  "respect-des-parents",
  "générosité",
  "partage",
  "courage",
  "patience",
  "sacrifice",
];

const OCCASION_SEGMENTS = [
  "sans-occasion",
  "aid-el-fitr",
  "aid-el-adha",
  "anniversaire",
  "ramadan",
];

const UNIV_META = {
  princesse: { emoji: "👑", form: "Princesse" },
  licorne: { emoji: "🦄", form: "Licorne" },
  "super-héros": { emoji: "🦸", form: "Super-héros" },
  animaux: { emoji: "🐾", form: "Animaux" },
};

const VAL_FORM = {
  générosité: "Générosité",
  partage: "Partage",
  courage: "Courage",
  patience: "Patience",
  "respect-des-parents": "Respect des parents",
  sacrifice: "Sacrifice",
};

const OCC_FORM = {
  "aid-el-fitr": "Aïd el-Fitr",
  "aid-el-adha": "Aïd el-Adha",
  ramadan: "Ramadan",
  anniversaire: "Anniversaire",
  "sans-occasion": "Sans occasion",
};

function sortSegDesc(arr) {
  return [...arr].sort((a, b) => b.length - a.length);
}

/**
 * Décompose une clé STORIES en segments (univers, valeur, occasion, 1|2).
 * @param {string} key
 */
function parseStoryKey(key) {
  const m = key.match(/^(.+)-([12])$/);
  if (!m) return null;
  let rest = m[1];
  const nbEnfants = parseInt(m[2], 10);

  let univers = null;
  for (const u of sortSegDesc(UNIVERSE_SEGMENTS)) {
    if (rest.startsWith(`${u}-`)) {
      univers = u;
      rest = rest.slice(u.length + 1);
      break;
    }
  }
  if (!univers) return null;

  let valeur = null;
  for (const v of sortSegDesc(VALEUR_SEGMENTS)) {
    if (rest.startsWith(`${v}-`)) {
      valeur = v;
      rest = rest.slice(v.length + 1);
      break;
    }
    if (rest === v) {
      valeur = v;
      rest = "";
      break;
    }
  }
  if (!valeur) {
    return { univers, valeur: null, occasion: rest, nbEnfants };
  }

  return { univers, valeur, occasion: rest, nbEnfants };
}

function storyParamsForGetStory(parsed) {
  if (!parsed || !parsed.valeur) return null;
  const u = UNIV_META[parsed.univers]?.form;
  const v = VAL_FORM[parsed.valeur];
  if (!u || !v) return null;
  if (parsed.occasion === undefined || parsed.occasion === "") return null;
  const o = OCC_FORM[parsed.occasion] || parsed.occasion;
  return {
    univers: u,
    valeur: v,
    occasion: o,
    nbEnfants: parsed.nbEnfants === 2 ? 2 : 1,
  };
}

function firstLines(text, n) {
  return String(text || "")
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .slice(0, n);
}

function statusForStory(story) {
  const t = story?.texte || "";
  if (t.includes("[Coller ici") || t.toLowerCase().includes("placeholder")) {
    return "⚠️";
  }
  return "✅";
}

export function TestStoriesClient() {
  const keys = useMemo(() => Object.keys(STORIES).sort(), []);
  const [activeKey, setActiveKey] = useState(null);

  const preview = useMemo(() => {
    if (!activeKey) return null;
    const parsed = parseStoryKey(activeKey);
    const params = storyParamsForGetStory(parsed);
    const prenom1 = "Nour";
    const prenom2 = parsed?.nbEnfants === 2 ? "Youssef" : "";
    if (!params) {
      return {
        key: activeKey,
        error: "Impossible de parser la clé pour getStoryOrDefault.",
      };
    }
    const story = getStoryOrDefault(
      params.univers,
      params.valeur,
      params.occasion,
      params.nbEnfants,
      prenom1,
      prenom2
    );
    return {
      key: activeKey,
      titre: story.titre,
      lines: firstLines(story.texte, 3),
      citation: story.citation,
      defi: story.defi,
      prenom1,
      prenom2,
    };
  }, [activeKey]);

  return (
    <div className="min-h-screen bg-qissali-cream">
      <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-qissali-body">
            <strong>{keys.length}</strong> histoires disponibles sur{" "}
            <strong>{POSSIBLE_COMBINATIONS}</strong> combinaisons possibles
          </p>
          <h1 className="mt-2 font-display text-2xl text-qissali-title">
            Test des histoires (dev)
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-xl border border-qissali-rose-light px-4 py-2 text-sm text-qissali-mauve-mid hover:bg-qissali-section"
        >
          ← Accueil
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-qissali-rose-light bg-white shadow-sm shadow-qissali-mauve/10">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm text-qissali-body">
          <thead>
            <tr className="border-b border-qissali-rose-light bg-qissali-section">
              <th className="px-3 py-3 font-semibold text-qissali-title">Clé</th>
              <th className="px-3 py-3 font-semibold text-qissali-title">Univers</th>
              <th className="px-3 py-3 font-semibold text-qissali-title">Valeur</th>
              <th className="px-3 py-3 font-semibold text-qissali-title">Occasion</th>
              <th className="px-3 py-3 font-semibold text-qissali-title">Enfants</th>
              <th className="px-3 py-3 font-semibold text-qissali-title">Statut</th>
              <th className="px-3 py-3 font-semibold text-qissali-title"> </th>
            </tr>
          </thead>
          <tbody>
            {keys.map((key) => {
              const parsed = parseStoryKey(key);
              const metaU = parsed ? UNIV_META[parsed.univers] : null;
              const occLabel = parsed?.occasion ? OCC_FORM[parsed.occasion] || parsed.occasion : "—";
              const valLabel = parsed?.valeur ? VAL_FORM[parsed.valeur] || parsed.valeur : "—";
              const raw = STORIES[key];
              const statut = raw ? statusForStory({ texte: raw.texte }) : "❓";

              return (
                <tr key={key} className="border-b border-qissali-rose-light/60 hover:bg-qissali-section/50">
                  <td className="max-w-[220px] break-all px-3 py-2 font-mono text-xs text-qissali-title">
                    {key}
                  </td>
                  <td className="px-3 py-2 text-lg">{metaU?.emoji ?? "—"}</td>
                  <td className="px-3 py-2">{valLabel}</td>
                  <td className="px-3 py-2">{occLabel}</td>
                  <td className="px-3 py-2">
                    {parsed?.nbEnfants ?? "—"}
                  </td>
                  <td className="px-3 py-2">{statut}</td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => setActiveKey(key)}
                      className="rounded-lg bg-gradient-to-r from-qissali-rose to-qissali-mauve px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:opacity-95"
                    >
                      Tester
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {preview && (
        <section
          className="mt-8 rounded-2xl border border-qissali-rose-light bg-qissali-section/60 p-6"
          aria-live="polite"
        >
          <h2 className="font-display text-lg text-qissali-title">Aperçu</h2>
          {"error" in preview && preview.error ? (
            <p className="mt-2 text-sm text-red-600">{preview.error}</p>
          ) : (
            <>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-qissali-mauve-mid">Clé</dt>
                  <dd className="font-mono text-xs text-qissali-title">{preview.key}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-qissali-mauve-mid">
                    Titre (prénoms de test : {preview.prenom1}
                    {preview.prenom2 ? ` & ${preview.prenom2}` : ""})
                  </dt>
                  <dd className="text-qissali-body">{preview.titre}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-qissali-mauve-mid">
                    Les 3 premières lignes du texte
                  </dt>
                  <dd className="whitespace-pre-wrap text-qissali-body">
                    {preview.lines.join("\n")}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-qissali-mauve-mid">Citation</dt>
                  <dd className="italic text-qissali-body">{preview.citation}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-qissali-mauve-mid">Défi</dt>
                  <dd className="text-qissali-body">{preview.defi}</dd>
                </div>
              </dl>
            </>
          )}
        </section>
      )}
      </div>
    </div>
  );
}
