"use client";

import { useState } from "react";

const UNIVERS_OPTIONS = ["princesse", "licorne", "super-heros", "animaux"];
const VALEUR_OPTIONS = ["generosite", "partage", "courage", "patience", "respect-des-parents"];
const OCCASION_OPTIONS = ["aid-el-fitr", "aid-el-adha", "ramadan", "anniversaire", "sans-occasion"];
const NB_ENFANTS_OPTIONS = [1, 2];
const PROFIL_OPTIONS = ["dys", "tdah", "tsa", "hpi"];

export default function TestNeuro() {
  if (process.env.NODE_ENV !== "development") {
    return <div>Non disponible en production</div>;
  }

  const [form, setForm] = useState({
    univers: "princesse",
    valeur: "courage",
    occasion: "aid-el-fitr",
    nbEnfants: 1,
    prenom1: "Nour",
    prenom2: "",
    profil: "dys",
    precisions: "",
  });
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState("");

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const generate = async () => {
    setLoading(true);
    setError("");
    const start = Date.now();

    try {
      const res = await fetch("/api/generate-neuro-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      setTimer(((Date.now() - start) / 1000).toFixed(1));

      if (!res.ok) {
        setStory(null);
        setError(data?.error || "Erreur lors de la génération");
        return;
      }

      setStory(data.story || null);
    } catch {
      setStory(null);
      setError("Erreur réseau");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <h1>Test Génération Neuro</h1>

      <div style={{ display: "grid", gap: 12, marginTop: 16, marginBottom: 16 }}>
        <label>
          Univers
          <select
            value={form.univers}
            onChange={(e) => updateField("univers", e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          >
            {UNIVERS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label>
          Valeur
          <select
            value={form.valeur}
            onChange={(e) => updateField("valeur", e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          >
            {VALEUR_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label>
          Occasion
          <select
            value={form.occasion}
            onChange={(e) => updateField("occasion", e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          >
            {OCCASION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label>
          Nombre d&apos;enfants
          <select
            value={form.nbEnfants}
            onChange={(e) => updateField("nbEnfants", Number(e.target.value))}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          >
            {NB_ENFANTS_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label>
          Prénom 1
          <input
            type="text"
            value={form.prenom1}
            onChange={(e) => updateField("prenom1", e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Prénom 2 (optionnel)
          <input
            type="text"
            value={form.prenom2}
            onChange={(e) => updateField("prenom2", e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </label>

        <label>
          Profil
          <select
            value={form.profil}
            onChange={(e) => updateField("profil", e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          >
            {PROFIL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </label>

        <label>
          Précisions
          <textarea
            rows={3}
            value={form.precisions}
            onChange={(e) => updateField("precisions", e.target.value)}
            style={{ display: "block", width: "100%", marginTop: 4 }}
          />
        </label>
      </div>

      <button type="button" onClick={generate} disabled={loading}>
        Générer l&apos;histoire neuro
      </button>

      {loading && <p>Génération en cours...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {story && (
        <div style={{ marginTop: 24 }}>
          <p>
            ⏱ Généré en {timer}s
            {story.fromCache ? " (depuis cache)" : " (via Claude)"}
          </p>
          <h2>{story.titre}</h2>
          <p style={{ whiteSpace: "pre-wrap" }}>{story.texte}</p>
          <blockquote>{story.citation}</blockquote>
          <p>{story.source}</p>
          <ul>
            {story.questions.map((q, i) => (
              <li key={i}>{q}</li>
            ))}
          </ul>
          <p>
            <strong>Défi :</strong> {story.defi}
          </p>
        </div>
      )}
    </div>
  );
}
