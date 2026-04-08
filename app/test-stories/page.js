import Link from "next/link";
import { redirect } from "next/navigation";
import { normalize, storyKey, STORIES } from "@/lib/stories.js";

const UNIVERSES = ["Princesse", "Licorne", "Super-héros", "Animaux"];
const VALEURS = ["Générosité", "Partage", "Courage", "Patience", "Respect des parents"];
const OCCASIONS = ["Aïd el-Fitr", "Aïd el-Adha", "Ramadan", "Anniversaire", "Sans occasion"];
const ENFANTS = [1, 2];
const NEURO_KEYS = [
  "princesse-courage-dys",
  "super-heros-patience-dys",
  "animaux-generosite-dys",
  "super-heros-courage-tdah",
  "licorne-patience-tdah",
  "animaux-partage-tdah",
  "licorne-courage-tsa",
  "princesse-respect-de-soi-tsa",
  "animaux-generosite-tsa",
];

function variants(key) {
  const out = new Set([key]);
  out.add(key.replace(/aïd/g, "aid"));
  out.add(
    key
      .replace(/é/g, "e")
      .replace(/è/g, "e")
      .replace(/ê/g, "e")
      .replace(/ï/g, "i")
      .replace(/à/g, "a")
      .replace(/ô/g, "o")
      .replace(/ù/g, "u")
      .replace(/ç/g, "c")
  );
  return [...out];
}

function findExistingKey(univers, valeur, occasion, nbEnfants) {
  const normalized = `${normalize(univers)}-${normalize(valeur)}-${normalize(occasion)}-${nbEnfants}`;
  const segmented = storyKey(univers, valeur, occasion, nbEnfants);
  const candidates = [...variants(normalized), ...variants(segmented)];
  return candidates.find((k) => Boolean(STORIES[k])) || null;
}

function buildRows() {
  const rows = [];
  for (const univers of UNIVERSES) {
    for (const valeur of VALEURS) {
      for (const occasion of OCCASIONS) {
        for (const nbEnfants of ENFANTS) {
          const expectedKey = `${normalize(univers)}-${normalize(valeur)}-${normalize(occasion)}-${nbEnfants}`;
          const foundKey = findExistingKey(univers, valeur, occasion, nbEnfants);
          const entry = foundKey ? STORIES[foundKey] : null;
          rows.push({
            key: foundKey || expectedKey,
            univers,
            valeur,
            occasion,
            enfants: nbEnfants,
            titre: entry?.titre || "—",
            status: entry ? "✅" : "❌",
            missingId: entry ? null : expectedKey,
          });
        }
      }
    }
  }
  return rows;
}

function buildNeuroRows() {
  return NEURO_KEYS.map((key) => {
    const entry = STORIES[key] || null;
    const parts = key.split("-");
    const profil = parts[parts.length - 1] || "—";
    const univers = parts[0] || "—";
    const valeur = parts.slice(1, -1).join("-") || "—";
    return {
      key,
      profil: profil.toUpperCase(),
      univers,
      valeur,
      titre: entry?.titre || "—",
      status: entry ? "✅" : "❌",
    };
  });
}

export default function TestStoriesPage() {
  if (process.env.NODE_ENV !== "development") redirect("/");

  const rows = buildRows();
  const totalStories = Object.keys(STORIES).length;
  const covered = rows.filter((r) => r.status === "✅").length;
  const totalCombos = rows.length;
  const missing = rows.filter((r) => r.status === "❌");
  const neuroRows = buildNeuroRows();

  return (
    <div className="min-h-screen bg-qissali-cream">
      <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl text-qissali-title">Catalogue des histoires (dev)</h1>
        <Link href="/" className="rounded-lg border border-qissali-rose-light px-3 py-2 text-sm text-qissali-body hover:bg-qissali-section">
          ← Accueil
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-qissali-rose-light bg-white">
        <table className="w-full min-w-[1100px] text-left text-sm text-qissali-body">
          <thead className="bg-qissali-section text-qissali-title">
            <tr>
              <th className="px-3 py-2">Clé</th>
              <th className="px-3 py-2">Univers</th>
              <th className="px-3 py-2">Valeur</th>
              <th className="px-3 py-2">Occasion</th>
              <th className="px-3 py-2">Enfants</th>
              <th className="px-3 py-2">Titre</th>
              <th className="px-3 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.key}-${row.univers}-${row.valeur}-${row.occasion}-${row.enfants}`} className="border-t">
                <td className="px-3 py-2 font-mono text-xs">{row.key}</td>
                <td className="px-3 py-2">{row.univers}</td>
                <td className="px-3 py-2">{row.valeur}</td>
                <td className="px-3 py-2">{row.occasion}</td>
                <td className="px-3 py-2">{row.enfants}</td>
                <td className="px-3 py-2">{row.titre}</td>
                <td className="px-3 py-2">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 space-y-2 text-sm text-qissali-body">
        <p>
          Nombre total d&apos;histoires : <strong>{totalStories}</strong>
        </p>
        <p>
          Combinaisons couvertes : <strong>{covered}</strong> / <strong>{totalCombos}</strong>
        </p>
        <p>
          Combinaisons manquantes :{" "}
          {missing.length === 0 ? (
            <strong>Aucune</strong>
          ) : (
            <span className="font-mono text-xs">{missing.map((m) => m.missingId).join(", ")}</span>
          )}
        </p>
      </div>

      <div className="mt-10">
        <h2 className="mb-3 font-display text-xl text-qissali-title">Histoires profils neuro</h2>
        <div className="overflow-x-auto rounded-xl border border-qissali-rose-light bg-white">
          <table className="w-full min-w-[1000px] text-left text-sm text-qissali-body">
            <thead className="bg-qissali-section text-qissali-title">
              <tr>
                <th className="px-3 py-2">Clé</th>
                <th className="px-3 py-2">Profil</th>
                <th className="px-3 py-2">Univers</th>
                <th className="px-3 py-2">Valeur</th>
                <th className="px-3 py-2">Titre</th>
                <th className="px-3 py-2">Statut</th>
              </tr>
            </thead>
            <tbody>
              {neuroRows.map((row) => (
                <tr key={row.key} className="border-t">
                  <td className="px-3 py-2 font-mono text-xs">{row.key}</td>
                  <td className="px-3 py-2">{row.profil}</td>
                  <td className="px-3 py-2">{row.univers}</td>
                  <td className="px-3 py-2">{row.valeur}</td>
                  <td className="px-3 py-2">{row.titre}</td>
                  <td className="px-3 py-2">{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
