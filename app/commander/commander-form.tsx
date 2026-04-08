"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { StripeEmbeddedCheckout } from "@/components/stripe-embedded-checkout";

const UNIVERSES = [
  { id: "princesse" as const, emoji: "👑", label: "Princesse" },
  { id: "licorne" as const, emoji: "🦄", label: "Licorne" },
  { id: "super-heros" as const, emoji: "🦸", label: "Super-héros" },
  { id: "animaux" as const, emoji: "🐾", label: "Animaux" },
];

const VALEURS = [
  { value: "Générosité", chip: "Générosité" },
  { value: "Partage", chip: "Partage" },
  { value: "Courage", chip: "Courage" },
  { value: "Patience", chip: "Patience" },
  { value: "Respect des parents", chip: "🌹 Respect des parents" },
] as const;

const OCCASIONS = [
  { value: "Aïd el-Fitr", chip: "Aïd el-Fitr" },
  { value: "Aïd el-Adha", chip: "Aïd el-Adha" },
  { value: "Ramadan", chip: "Ramadan" },
  { value: "Anniversaire", chip: "🎂 Anniversaire" },
  { value: "Sans occasion", chip: "Sans occasion" },
] as const;

const PROFILS = [
  { id: "aucun", label: "Pas de profil neuroatypique" },
  { id: "dys", label: "Dys (dyslexie, dyscalculie, dyspraxie...)" },
  { id: "tdah", label: "TDAH" },
  { id: "tsa", label: "Autisme / TSA" },
  { id: "hpi", label: "Haut potentiel (HPI/HQI)" },
] as const;

type SiblingLink = "soeurs" | "freres" | "mixte";

type Genre = "fille" | "garcon";

type FormatId = "pdf" | "pdf-audio";

function genreLibelle(g: Genre): "Fille" | "Garçon" {
  return g === "fille" ? "Fille" : "Garçon";
}

const FORMATS: { id: FormatId; label: string; price: string }[] = [
  { id: "pdf", label: "PDF illustré", price: "3,90€" },
  { id: "pdf-audio", label: "PDF + Audio", price: "7,90€" },
];

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function CommanderForm() {
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [childCount, setChildCount] = useState<1 | 2>(1);
  const [child1Name, setChild1Name] = useState("");
  const [child1Age, setChild1Age] = useState("");
  const [genre1, setGenre1] = useState<Genre | "">("");
  const [child2Name, setChild2Name] = useState("");
  const [child2Age, setChild2Age] = useState("");
  const [genre2, setGenre2] = useState<Genre | "">("");
  const [siblingLink, setSiblingLink] = useState<SiblingLink | "">("");
  const [profils, setProfils] = useState<string[]>([]);
  const [precisionsNeuro, setPrecisionsNeuro] = useState("");

  const [universe, setUniverse] = useState<(typeof UNIVERSES)[number]["id"] | "">("");
  const [valeur, setValeur] = useState<(typeof VALEURS)[number]["value"] | "">("");
  const [occasion, setOccasion] = useState<(typeof OCCASIONS)[number]["value"] | "">("");

  const [format, setFormat] = useState<FormatId>("pdf");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [embeddedClientSecret, setEmbeddedClientSecret] = useState<string | null>(null);

  const canUseEmbeddedCheckout = useMemo(
    () =>
      Boolean(
        typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "string" &&
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.length > 0
      ),
    []
  );

  const clearError = useCallback((key: string) => {
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }, []);

  const validateStep1 = useCallback(() => {
    const e: Record<string, string> = {};
    if (!child1Name.trim()) e.child1Name = "Indique le prénom.";
    const a1 = parseInt(child1Age, 10);
    if (Number.isNaN(a1) || a1 < 2 || a1 > 12) {
      e.child1Age = "Âge entre 2 et 12 ans.";
    }
    if (!genre1) e.genre1 = "Indique si l’enfant est une fille ou un garçon.";
    if (childCount === 2) {
      if (!child2Name.trim()) e.child2Name = "Indique le prénom.";
      const a2 = parseInt(child2Age, 10);
      if (Number.isNaN(a2) || a2 < 2 || a2 > 12) {
        e.child2Age = "Âge entre 2 et 12 ans.";
      }
      if (!genre2) e.genre2 = "Indique le genre du deuxième enfant.";
      if (!siblingLink) e.siblingLink = "Choisis le lien entre les enfants.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [
    child1Name,
    child1Age,
    genre1,
    child2Name,
    child2Age,
    genre2,
    childCount,
    siblingLink,
  ]);

  const validateStep2 = useCallback(() => {
    const e: Record<string, string> = {};
    if (!universe) e.universe = "Choisis un univers.";
    if (!valeur) e.valeur = "Choisis une valeur.";
    if (!occasion) e.occasion = "Choisis une occasion.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [universe, valeur, occasion]);

  const validateStep3 = useCallback(() => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Indique ton email.";
    else if (!isValidEmail(email)) e.email = "Email invalide.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [email]);

  const goNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const goBack = () => {
    if (step > 1) setStep((s) => (s === 2 ? 1 : 2) as 1 | 2 | 3);
  };

  const universeLabel = useMemo(() => {
    const u = UNIVERSES.find((x) => x.id === universe);
    return u ? `${u.emoji} ${u.label}` : "—";
  }, [universe]);

  const hasNeuroProfile = useMemo(
    () => profils.some((p) => p !== "aucun"),
    [profils]
  );

  const profilsLabel = useMemo(() => {
    if (!hasNeuroProfile) return "";
    return PROFILS.filter((p) => p.id !== "aucun" && profils.includes(p.id))
      .map((p) => p.label)
      .join(", ");
  }, [hasNeuroProfile, profils]);

  const formatLabel = useMemo(() => {
    const f = FORMATS.find((x) => x.id === format);
    return f ? `${f.label} — ${f.price}` : "—";
  }, [format]);

  const handlePay = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validateStep3()) return;

    const universLabel = UNIVERSES.find((u) => u.id === universe)?.label ?? universe;

    setCheckoutLoading(true);
    clearError("checkout");
    try {
      const montant = format === "pdf" ? 390 : 790;
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          montant,
          prenom1: child1Name.trim(),
          prenom2: childCount === 2 ? child2Name.trim() : "",
          univers: universLabel,
          valeur,
          occasion,
          format,
          message: message.trim(),
          typeHistoire: childCount === 1 ? "solo" : "fratrie",
          genre1: genre1 ? genreLibelle(genre1) : "",
          genre2:
            childCount === 2 && genre2 ? genreLibelle(genre2) : "",
          age_enfant1: child1Age.trim(),
          age_enfant2: childCount === 2 ? child2Age.trim() : "",
          profils: profils.join(","),
          precisionsNeuro: precisionsNeuro.trim(),
          embedded: canUseEmbeddedCheckout,
        }),
      });

      const data = (await res.json()) as {
        url?: string;
        clientSecret?: string;
        error?: string;
      };

      if (!res.ok) {
        setErrors((e) => ({
          ...e,
          checkout: data.error || "Impossible de créer la session de paiement.",
        }));
        return;
      }

      if (data.clientSecret) {
        setEmbeddedClientSecret(data.clientSecret);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setErrors((e) => ({
        ...e,
        checkout:
          "Réponse serveur invalide (pas d’URL ni de session de paiement intégrée).",
      }));
    } catch {
      setErrors((e) => ({
        ...e,
        checkout: "Impossible de contacter le serveur. Réessaie dans un instant.",
      }));
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formShellClass =
    "rounded-2xl border border-qissali-rose/30 bg-white/70 p-6 shadow-lg shadow-qissali-mauve/10 backdrop-blur-sm sm:p-8";

  const chipBtn =
    "rounded-xl border-2 px-4 py-3 text-center text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qissali-mauve";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-10">
        <p className="text-center font-display text-sm uppercase tracking-[0.15em] text-qissali-mauve">
          Commande
        </p>
        <h1 className="mt-2 text-center font-display text-3xl font-normal text-qissali-mauve md:text-4xl">
          Personnalise ton histoire
        </h1>
      </div>

      {/* Barre de progression */}
      <div className="mb-10" aria-label="Progression du formulaire">
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((s) => (
            <div
              key={s}
              className={`h-2 flex-1 rounded-full transition-colors ${
                step >= s ? "bg-gradient-to-r from-qissali-rose to-qissali-mauve" : "bg-qissali-rose/25"
              }`}
            />
          ))}
        </div>
        <div className="mt-3 flex justify-between text-xs text-slate-500">
          <span className={step === 1 ? "font-semibold text-qissali-mauve" : ""}>
            L&apos;enfant
          </span>
          <span className={step === 2 ? "font-semibold text-qissali-mauve" : ""}>
            L&apos;histoire
          </span>
          <span className={step === 3 ? "font-semibold text-qissali-mauve" : ""}>
            Livraison
          </span>
        </div>
      </div>

      {embeddedClientSecret ? (
        <div className={formShellClass}>
          <h2 className="mb-2 font-display text-xl text-qissali-mauve">
            Paiement sécurisé
          </h2>
          <p className="mb-4 text-sm text-slate-600">
            Carte bancaire, Apple Pay ou Google Pay selon l&apos;appareil — le formulaire
            Stripe s&apos;affiche ci-dessous, sans quitter le site.
          </p>
          <StripeEmbeddedCheckout
            clientSecret={embeddedClientSecret}
            onError={(msg) => setErrors((prev) => ({ ...prev, checkout: msg }))}
          />
          {errors.checkout && (
            <p
              className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
              role="alert"
            >
              {errors.checkout}
            </p>
          )}
          <div className="mt-6 flex justify-start border-t border-qissali-rose/20 pt-6">
            <button
              type="button"
              onClick={() => {
                setEmbeddedClientSecret(null);
                clearError("checkout");
              }}
              className="inline-flex items-center justify-center rounded-full border-2 border-qissali-mauve/30 px-6 py-3 text-sm font-medium text-qissali-mauve transition hover:bg-qissali-mauve/10"
            >
              ← Modifier ma commande
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handlePay} className={formShellClass}>
        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-8">
            <div>
              <h2 className="font-display text-xl text-qissali-mauve">Étape 1 — L&apos;enfant</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Inclut la partie{" "}
                <span className="font-medium text-qissali-mauve">neuroatypie</span> (optionnelle) : si tu
                coches un profil, l&apos;histoire pourra être adaptée.
              </p>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">Histoire solo ou fratrie ?</p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setChildCount(1);
                    clearError("siblingLink");
                    clearError("genre2");
                    setSiblingLink("");
                    setChild2Name("");
                    setChild2Age("");
                    setGenre2("");
                  }}
                  className={`${chipBtn} flex-1 ${
                    childCount === 1
                      ? "border-qissali-mauve bg-qissali-cream text-qissali-mauve shadow-inner"
                      : "border-qissali-rose/40 bg-white text-slate-600 hover:border-qissali-mauve/50"
                  }`}
                >
                  Un seul enfant
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setChildCount(2);
                    clearError("siblingLink");
                  }}
                  className={`${chipBtn} flex-1 ${
                    childCount === 2
                      ? "border-qissali-mauve bg-qissali-cream text-qissali-mauve shadow-inner"
                      : "border-qissali-rose/40 bg-white text-slate-600 hover:border-qissali-mauve/50"
                  }`}
                >
                  Deux enfants (fratrie)
                </button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="c1-name" className="mb-2 block text-sm font-medium text-slate-700">
                  Prénom enfant 1 <span className="text-qissali-rose">*</span>
                </label>
                <input
                  id="c1-name"
                  type="text"
                  autoComplete="given-name"
                  value={child1Name}
                  onChange={(e) => {
                    setChild1Name(e.target.value);
                    clearError("child1Name");
                  }}
                  className="w-full rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 text-slate-800 outline-none ring-qissali-mauve/30 transition focus:border-qissali-mauve focus:ring-2"
                />
                {errors.child1Name && (
                  <p className="mt-1 text-sm text-red-600">{errors.child1Name}</p>
                )}
              </div>
              <div>
                <label htmlFor="c1-age" className="mb-2 block text-sm font-medium text-slate-700">
                  Âge enfant 1 <span className="text-qissali-rose">*</span>
                </label>
                <input
                  id="c1-age"
                  type="number"
                  min={2}
                  max={12}
                  inputMode="numeric"
                  value={child1Age}
                  onChange={(e) => {
                    setChild1Age(e.target.value);
                    clearError("child1Age");
                  }}
                  className="w-full rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 text-slate-800 outline-none focus:border-qissali-mauve focus:ring-2 focus:ring-qissali-mauve/30"
                />
                {errors.child1Age && (
                  <p className="mt-1 text-sm text-red-600">{errors.child1Age}</p>
                )}
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">
                Genre <span className="text-qissali-rose">*</span>
              </p>
              <div className="flex gap-3">
                {(["fille", "garcon"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => {
                      setGenre1(g);
                      clearError("genre1");
                    }}
                    className={`${chipBtn} flex-1 ${
                      genre1 === g
                        ? "border-qissali-mauve bg-qissali-cream text-qissali-mauve shadow-inner"
                        : "border-qissali-rose/40 bg-white text-slate-600 hover:border-qissali-mauve/50"
                    }`}
                  >
                    {g === "fille" ? "Fille" : "Garçon"}
                  </button>
                ))}
              </div>
              {errors.genre1 && <p className="mt-2 text-sm text-red-600">{errors.genre1}</p>}
            </div>

            {childCount === 2 && (
              <>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c2-name" className="mb-2 block text-sm font-medium text-slate-700">
                      Prénom enfant 2 <span className="text-qissali-rose">*</span>
                    </label>
                    <input
                      id="c2-name"
                      type="text"
                      value={child2Name}
                      onChange={(e) => {
                        setChild2Name(e.target.value);
                        clearError("child2Name");
                      }}
                      className="w-full rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 outline-none focus:border-qissali-mauve focus:ring-2 focus:ring-qissali-mauve/30"
                    />
                    {errors.child2Name && (
                      <p className="mt-1 text-sm text-red-600">{errors.child2Name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="c2-age" className="mb-2 block text-sm font-medium text-slate-700">
                      Âge enfant 2 <span className="text-qissali-rose">*</span>
                    </label>
                    <input
                      id="c2-age"
                      type="number"
                      min={2}
                      max={12}
                      inputMode="numeric"
                      value={child2Age}
                      onChange={(e) => {
                        setChild2Age(e.target.value);
                        clearError("child2Age");
                      }}
                      className="w-full rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 outline-none focus:border-qissali-mauve focus:ring-2 focus:ring-qissali-mauve/30"
                    />
                    {errors.child2Age && (
                      <p className="mt-1 text-sm text-red-600">{errors.child2Age}</p>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700">
                    Genre enfant 2 <span className="text-qissali-rose">*</span>
                  </p>
                  <div className="flex gap-3">
                    {(["fille", "garcon"] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => {
                          setGenre2(g);
                          clearError("genre2");
                        }}
                        className={`${chipBtn} flex-1 ${
                          genre2 === g
                            ? "border-qissali-mauve bg-qissali-cream text-qissali-mauve shadow-inner"
                            : "border-qissali-rose/40 bg-white text-slate-600 hover:border-qissali-mauve/50"
                        }`}
                      >
                        {g === "fille" ? "Fille" : "Garçon"}
                      </button>
                    ))}
                  </div>
                  {errors.genre2 && <p className="mt-2 text-sm text-red-600">{errors.genre2}</p>}
                </div>

                <div>
                  <p className="mb-3 text-sm font-medium text-slate-700">Lien entre les enfants</p>
                  <div className="flex flex-wrap gap-3">
                    {(
                      [
                        { id: "soeurs" as const, label: "Sœurs" },
                        { id: "freres" as const, label: "Frères" },
                        { id: "mixte" as const, label: "Mixte" },
                      ] as const
                    ).map(({ id, label }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => {
                          setSiblingLink(id);
                          clearError("siblingLink");
                        }}
                        className={`${chipBtn} flex-1 min-w-[100px] ${
                          siblingLink === id
                            ? "border-qissali-mauve bg-qissali-cream text-qissali-mauve"
                            : "border-qissali-rose/40 bg-white text-slate-600 hover:border-qissali-mauve/50"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  {errors.siblingLink && (
                    <p className="mt-2 text-sm text-red-600">{errors.siblingLink}</p>
                  )}
                </div>
              </>
            )}

            <div className="rounded-xl border border-qissali-rose/25 bg-qissali-cream/40 p-4">
              <p className="text-sm font-semibold text-qissali-mauve">Neuroatypie</p>
              <p className="mt-1 text-sm font-medium text-slate-700">
                Votre enfant a-t-il un profil neuroatypique ou des besoins particuliers ?
                <span className="font-normal text-slate-500">
                  {" "}
                  (optionnel — pour personnaliser l&apos;histoire)
                </span>
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Ces informations restent privées et servent uniquement à adapter l&apos;histoire.
              </p>

              <div className="mt-3 flex flex-col gap-2">
                {PROFILS.map(({ id, label }) => {
                  const selected = profils.includes(id);
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        setProfils((prev) => {
                          if (id === "aucun") {
                            setPrecisionsNeuro("");
                            return prev.includes("aucun") ? [] : ["aucun"];
                          }
                          const withoutAucun = prev.filter((p) => p !== "aucun");
                          const next = withoutAucun.includes(id)
                            ? withoutAucun.filter((p) => p !== id)
                            : [...withoutAucun, id];
                          if (next.length === 0) setPrecisionsNeuro("");
                          return next;
                        });
                      }}
                      className={`${chipBtn} w-full text-left ${
                        selected
                          ? "border-qissali-mauve bg-qissali-cream text-qissali-mauve"
                          : "border-qissali-rose/40 bg-white text-slate-600 hover:border-qissali-mauve/50"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {hasNeuroProfile && (
                <div className="mt-3">
                  <label
                    htmlFor="precisions-neuro"
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    Vous pouvez préciser si vous le souhaitez
                  </label>
                  <textarea
                    id="precisions-neuro"
                    rows={3}
                    maxLength={200}
                    value={precisionsNeuro}
                    onChange={(e) => setPrecisionsNeuro(e.target.value)}
                    placeholder="Ex : dyslexie sévère, TDAH avec hyperactivité, TSA sans trouble du langage..."
                    className="w-full resize-y rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 text-slate-800 outline-none focus:border-qissali-mauve focus:ring-2 focus:ring-qissali-mauve/30"
                  />
                </div>
              )}

              <p className="mt-3 text-xs text-slate-500">
                🔒 Ces informations ne sont pas stockées et servent uniquement à l&apos;histoire
              </p>
            </div>

            <div className="flex flex-col gap-3 border-t border-qissali-rose/20 pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border-2 border-qissali-mauve/30 px-6 py-3 text-center text-sm font-medium text-qissali-mauve transition hover:bg-qissali-mauve/10"
              >
                ← Accueil
              </Link>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve px-8 py-3 text-sm font-semibold text-white shadow-md shadow-qissali-mauve/20 transition hover:brightness-105"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-8">
            <h2 className="font-display text-xl text-qissali-mauve">Étape 2 — L&apos;histoire</h2>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">Univers (un seul choix)</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {UNIVERSES.map(({ id, emoji, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setUniverse(id);
                      clearError("universe");
                    }}
                    className={`${chipBtn} flex flex-col items-center gap-1 py-4 ${
                      universe === id
                        ? "border-qissali-mauve bg-qissali-cream text-qissali-mauve"
                        : "border-qissali-rose/40 bg-white text-slate-600 hover:border-qissali-mauve/50"
                    }`}
                  >
                    <span className="text-3xl" aria-hidden>
                      {emoji}
                    </span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
              {errors.universe && (
                <p className="mt-2 text-sm text-red-600">{errors.universe}</p>
              )}
              {hasNeuroProfile && (
                <p className="mt-2 text-sm text-qissali-mauve">
                  ✨ Nous adaptons l&apos;histoire à la neuroatypie indiquée ({profilsLabel}). Votre sélection
                  sera prise en compte.
                </p>
              )}
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">Valeur (un seul choix)</p>
              <div className="flex flex-col gap-2">
                {VALEURS.map(({ value, chip }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setValeur(value);
                      clearError("valeur");
                    }}
                    className={`${chipBtn} w-full text-left ${
                      valeur === value
                        ? "border-qissali-mauve bg-qissali-cream text-qissali-mauve"
                        : "border-qissali-rose/40 bg-white text-slate-600 hover:border-qissali-mauve/50"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              {errors.valeur && <p className="mt-2 text-sm text-red-600">{errors.valeur}</p>}
            </div>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">Occasion (un seul choix)</p>
              <div className="flex flex-col gap-2">
                {OCCASIONS.map(({ value, chip }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => {
                      setOccasion(value);
                      clearError("occasion");
                    }}
                    className={`${chipBtn} w-full text-left ${
                      occasion === value
                        ? "border-qissali-mauve bg-qissali-cream text-qissali-mauve"
                        : "border-qissali-rose/40 bg-white text-slate-600 hover:border-qissali-mauve/50"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
              {errors.occasion && (
                <p className="mt-2 text-sm text-red-600">{errors.occasion}</p>
              )}
            </div>

            <div className="flex flex-col gap-3 border-t border-qissali-rose/20 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center justify-center rounded-full border-2 border-qissali-mauve/30 px-6 py-3 text-sm font-medium text-qissali-mauve transition hover:bg-qissali-mauve/10"
              >
                ← Retour
              </button>
              <button
                type="button"
                onClick={goNext}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-8">
            <h2 className="font-display text-xl text-qissali-mauve">Étape 3 — Livraison</h2>

            <div>
              <p className="mb-3 text-sm font-medium text-slate-700">Format</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {FORMATS.map(({ id, label, price }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setFormat(id)}
                    className={`${chipBtn} flex flex-col items-start py-4 text-left ${
                      format === id
                        ? "border-qissali-mauve bg-qissali-cream text-qissali-mauve"
                        : "border-qissali-rose/40 bg-white text-slate-600 hover:border-qissali-mauve/50"
                    }`}
                  >
                    <span className="font-semibold">{label}</span>
                    <span className="mt-1 font-display text-2xl italic text-qissali-rose">{price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">
                Email <span className="text-qissali-rose">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                className="w-full rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 outline-none focus:border-qissali-mauve focus:ring-2 focus:ring-qissali-mauve/30"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="msg" className="mb-2 block text-sm font-medium text-slate-700">
                Message personnalisé <span className="text-slate-400">(optionnel)</span>
              </label>
              <textarea
                id="msg"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Une dédicace, une consigne pour l’histoire…"
                className="w-full resize-y rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 text-slate-800 outline-none focus:border-qissali-mauve focus:ring-2 focus:ring-qissali-mauve/30"
              />
            </div>

            <div className="rounded-xl border border-qissali-mauve/20 bg-qissali-cream/80 p-5">
              <h3 className="mb-4 font-display text-lg text-qissali-mauve">Récapitulatif</h3>
              <dl className="space-y-2 text-sm text-slate-700">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Type</dt>
                  <dd className="text-right font-medium">
                    {childCount === 1 ? "Solo (un enfant)" : "Fratrie (deux enfants)"}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Enfant(s)</dt>
                  <dd className="text-right font-medium">
                    {child1Name.trim()} ({child1Age} ans
                    {genre1 ? `, ${genreLibelle(genre1)}` : ""})
                    {childCount === 2 && (
                      <>
                        {" "}
                        · {child2Name.trim()} ({child2Age} ans
                        {genre2 ? `, ${genreLibelle(genre2)}` : ""})
                      </>
                    )}
                  </dd>
                </div>
                {childCount === 2 && siblingLink && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Lien</dt>
                    <dd className="text-right">
                      {siblingLink === "soeurs"
                        ? "Sœurs"
                        : siblingLink === "freres"
                          ? "Frères"
                          : "Mixte"}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Univers</dt>
                  <dd className="text-right">{universeLabel}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Valeur</dt>
                  <dd className="text-right">{valeur || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-500">Occasion</dt>
                  <dd className="text-right">{occasion || "—"}</dd>
                </div>
                {hasNeuroProfile && (
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500">Neuroatypie</dt>
                    <dd className="text-right">{profilsLabel}</dd>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t border-qissali-rose/20 pt-3">
                  <dt className="text-slate-500">Format</dt>
                  <dd className="text-right font-semibold text-qissali-mauve">{formatLabel}</dd>
                </div>
              </dl>
            </div>

            {errors.checkout && (
              <p
                className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                role="alert"
              >
                {errors.checkout}
              </p>
            )}

            <p className="text-center text-sm text-slate-600">
              {canUseEmbeddedCheckout
                ? "Tu vas ouvrir le paiement Stripe sur cette page (carte, Apple Pay, Google Pay…)."
                : "Tu seras redirigé·e vers une page Stripe : carte bancaire, Apple Pay ou Google Pay selon l’appareil."}
            </p>

            <div className="flex flex-col gap-3 border-t border-qissali-rose/20 pt-6 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={goBack}
                disabled={checkoutLoading}
                className="inline-flex items-center justify-center rounded-full border-2 border-qissali-mauve/30 px-6 py-3 text-sm font-medium text-qissali-mauve transition hover:bg-qissali-mauve/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                ← Retour
              </button>
              <button
                type="submit"
                disabled={checkoutLoading}
                aria-busy={checkoutLoading}
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-qissali-mauve/25 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {checkoutLoading
                  ? canUseEmbeddedCheckout
                    ? "Préparation du paiement…"
                    : "Redirection vers Stripe…"
                  : canUseEmbeddedCheckout
                    ? "Continuer vers le paiement"
                    : "Commander et payer"}
              </button>
            </div>
          </div>
        )}
        </form>
      )}

      <p className="mt-8 text-center text-xs text-slate-500">
        <Link href="/" className="text-qissali-mauve underline-offset-2 hover:underline">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}
