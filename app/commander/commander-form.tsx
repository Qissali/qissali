"use client";

import { useCallback, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
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

const PACKS = {
  solo: { label: "Solo", nbHistoires: 1, prix: 390 },
  duo: { label: "Duo", nbHistoires: 2, prix: 690 },
  trio: { label: "Trio", nbHistoires: 3, prix: 890 },
  famille: { label: "Famille", nbHistoires: 5, prix: 1290 },
} as const;

type PackKey = keyof typeof PACKS;
type SiblingLink = "soeurs" | "freres" | "mixte";
type Genre = "fille" | "garcon";

function genreLibelle(g: Genre): "Fille" | "Garçon" {
  return g === "fille" ? "Fille" : "Garçon";
}

function centsToEuroLabel(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")}€`;
}

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export type HistoireFormState = {
  id: number;
  nbEnfants: 1 | 2;
  prenom1: string;
  age1: string;
  prenom2: string;
  age2: string;
  lien: SiblingLink | "";
  genre1: Genre | "";
  genre2: Genre | "";
  univers: (typeof UNIVERSES)[number]["id"] | "";
  valeur: (typeof VALEURS)[number]["value"] | "";
  occasion: (typeof OCCASIONS)[number]["value"] | "";
  neuroEnabled: boolean;
  profils: string[];
  precisionsNeuro: string;
  message: string;
};

function emptyHistoire(id: number): HistoireFormState {
  return {
    id,
    nbEnfants: 1,
    prenom1: "",
    age1: "",
    prenom2: "",
    age2: "",
    lien: "",
    genre1: "",
    genre2: "",
    univers: "",
    valeur: "",
    occasion: "",
    neuroEnabled: false,
    profils: [],
    precisionsNeuro: "",
    message: "",
  };
}

function CommanderFormInner() {
  const searchParams = useSearchParams();
  const packParam = (searchParams.get("pack") || "solo") as string;
  const pack = PACKS[packParam as PackKey] ?? PACKS.solo;
  const packKey = (packParam in PACKS ? packParam : "solo") as PackKey;

  const [histoires, setHistoires] = useState<HistoireFormState[]>(() =>
    Array.from({ length: pack.nbHistoires }, (_, i) => emptyHistoire(i + 1))
  );
  const [currentHistoire, setCurrentHistoire] = useState(0);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"story" | "payment">("story");

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

  const h = histoires[currentHistoire] ?? histoires[0];

  const patchHistoire = useCallback(
    (updates: Partial<HistoireFormState>) => {
      setHistoires((prev) => {
        const next = [...prev];
        next[currentHistoire] = { ...next[currentHistoire], ...updates };
        return next;
      });
    },
    [currentHistoire]
  );

  const clearError = useCallback((key: string) => {
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }, []);

  const hasNeuroProfile = useMemo(
    () => h.neuroEnabled && h.profils.some((p) => p !== "aucun"),
    [h.neuroEnabled, h.profils]
  );

  const profilsLabel = useMemo(() => {
    if (!hasNeuroProfile) return "";
    return PROFILS.filter((p) => p.id !== "aucun" && h.profils.includes(p.id))
      .map((p) => p.label)
      .join(", ");
  }, [hasNeuroProfile, h.profils]);

  const universeLabelFor = useCallback((u: HistoireFormState["univers"]) => {
    const found = UNIVERSES.find((x) => x.id === u);
    return found ? `${found.emoji} ${found.label}` : "—";
  }, []);

  const validateStep1 = useCallback(() => {
    const e: Record<string, string> = {};
    if (!h.prenom1.trim()) e.child1Name = "Indique le prénom.";
    const a1 = parseInt(h.age1, 10);
    if (Number.isNaN(a1) || a1 < 2 || a1 > 12) e.child1Age = "Âge entre 2 et 12 ans.";
    if (!h.genre1) e.genre1 = "Indique si l’enfant est une fille ou un garçon.";
    if (h.nbEnfants === 2) {
      if (!h.prenom2.trim()) e.child2Name = "Indique le prénom.";
      const a2 = parseInt(h.age2, 10);
      if (Number.isNaN(a2) || a2 < 2 || a2 > 12) e.child2Age = "Âge entre 2 et 12 ans.";
      if (!h.genre2) e.genre2 = "Indique le genre du deuxième enfant.";
      if (!h.lien) e.siblingLink = "Choisis le lien entre les enfants.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [h]);

  const validateStep3 = useCallback(() => {
    const e: Record<string, string> = {};
    if (!h.univers) e.universe = "Choisis un univers.";
    if (!h.valeur) e.valeur = "Choisis une valeur.";
    if (!h.occasion) e.occasion = "Choisis une occasion.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [h]);

  const validatePayment = useCallback(() => {
    const e: Record<string, string> = {};
    if (!email.trim()) e.email = "Indique ton email.";
    else if (!isValidEmail(email)) e.email = "Email invalide.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [email]);

  const globalProgress = useMemo(() => {
    const total = pack.nbHistoires * 3;
    const done = currentHistoire * 3 + (currentStep - 1);
    return Math.min(100, Math.round((done / total) * 100));
  }, [pack.nbHistoires, currentHistoire, currentStep]);

  const handleNextStoryStep = () => {
    if (currentStep === 1 && validateStep1()) setCurrentStep(2);
    else if (currentStep === 2) setCurrentStep(3);
    else if (currentStep === 3 && validateStep3()) {
      if (currentHistoire < pack.nbHistoires - 1) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setCurrentHistoire((c) => c + 1);
        setCurrentStep(1);
      } else {
        setPhase("payment");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrev = () => {
    if (phase === "payment") {
      setPhase("story");
      setCurrentHistoire(pack.nbHistoires - 1);
      setCurrentStep(3);
      return;
    }
    if (currentStep > 1) setCurrentStep((s) => (s === 2 ? 1 : 2) as 1 | 2 | 3);
    else if (currentHistoire > 0) {
      setCurrentHistoire((c) => c - 1);
      setCurrentStep(3);
    }
  };

  const handlePay = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validatePayment()) return;

    const payloadHistoires = histoires.map((story) => {
      const u = UNIVERSES.find((x) => x.id === story.univers);
      const universLabel = u?.label ?? "";
      const profilsStr = story.neuroEnabled
        ? story.profils.filter((p) => p !== "aucun").join(",")
        : "";
      return {
        prenom1: story.prenom1.trim(),
        prenom2: story.nbEnfants === 2 ? story.prenom2.trim() : "",
        age_enfant1: story.age1.trim(),
        age_enfant2: story.nbEnfants === 2 ? story.age2.trim() : "",
        genre1: story.genre1 ? genreLibelle(story.genre1) : "",
        genre2: story.nbEnfants === 2 && story.genre2 ? genreLibelle(story.genre2) : "",
        type_histoire: story.nbEnfants === 1 ? "solo" : "fratrie",
        lien: story.lien || "",
        univers: universLabel,
        valeur: story.valeur,
        occasion: story.occasion,
        profils: profilsStr,
        precisionsNeuro: story.neuroEnabled ? story.precisionsNeuro.trim() : "",
        message: story.message.trim(),
      };
    });

    const first = payloadHistoires[0];
    if (!first?.prenom1) return;

    setCheckoutLoading(true);
    clearError("checkout");
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          prix: pack.prix,
          pack: packKey,
          format: "pdf",
          histoires: payloadHistoires,
          prenom1: first.prenom1,
          prenom2: first.prenom2,
          univers: first.univers,
          valeur: first.valeur,
          occasion: first.occasion,
          message: first.message,
          typeHistoire: first.type_histoire,
          genre1: first.genre1,
          genre2: first.genre2,
          age_enfant1: first.age_enfant1,
          age_enfant2: first.age_enfant2,
          profils: first.profils,
          precisionsNeuro: first.precisionsNeuro,
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
        checkout: "Réponse serveur invalide.",
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

  const recapLine = (story: HistoireFormState, index: number) => {
    const pr = story.prenom1.trim() || "…";
    const u = UNIVERSES.find((x) => x.id === story.univers)?.label ?? "…";
    const v = story.valeur || "…";
    const o = story.occasion || "";
    return `Histoire ${index + 1} : ${pr} · ${u} · ${v}${o ? ` · ${o}` : ""}`;
  };

  const chipBtn =
    "rounded-xl border-2 px-4 py-3 text-center text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qissali-mauve";

  const formShellClass =
    "rounded-2xl border border-qissali-rose/30 bg-white/70 p-6 shadow-lg shadow-qissali-mauve/10 backdrop-blur-sm sm:p-8";

  return (
    <div className="mx-auto max-w-2xl">
      {/* Header fixe */}
      <div className="sticky top-0 z-20 -mx-4 mb-6 border-b border-qissali-rose/20 bg-qissali-cream/95 px-4 py-3 backdrop-blur-sm sm:-mx-0 sm:rounded-t-2xl">
        <p className="text-center text-sm font-semibold text-qissali-mauve-mid">
          Pack {pack.label} · Histoire {currentHistoire + 1}/{pack.nbHistoires}
        </p>
        <div className="mt-2 flex justify-center gap-2">
          {Array.from({ length: pack.nbHistoires }).map((_, i) => (
            <div
              key={i}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                i < currentHistoire
                  ? "bg-qissali-rose text-white"
                  : i === currentHistoire
                    ? "bg-qissali-mauve text-white"
                    : "bg-qissali-rose-light/80 text-qissali-soft"
              }`}
            >
              {i < currentHistoire ? "✓" : i + 1}
            </div>
          ))}
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-qissali-rose/25">
          <div
            className="h-full rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve transition-all duration-500"
            style={{ width: `${globalProgress}%` }}
          />
        </div>
      </div>

      <div className="mb-8 text-center">
        <p className="font-display text-sm uppercase tracking-[0.15em] text-qissali-mauve-mid">Commande</p>
        <h1 className="mt-2 font-display text-3xl font-normal text-qissali-title md:text-4xl">
          Personnalise ton histoire
        </h1>
      </div>

      {embeddedClientSecret ? (
        <div className={formShellClass}>
          <h2 className="mb-2 font-display text-xl text-qissali-title">Paiement sécurisé</h2>
          <p className="mb-4 text-sm text-qissali-body">
            Carte bancaire, Apple Pay ou Google Pay selon l&apos;appareil — le formulaire Stripe
            s&apos;affiche ci-dessous.
          </p>
          <StripeEmbeddedCheckout
            clientSecret={embeddedClientSecret}
            onError={(msg) => setErrors((prev) => ({ ...prev, checkout: msg }))}
          />
          {errors.checkout && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
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
              className="inline-flex items-center justify-center rounded-full border-2 border-qissali-mauve/30 px-6 py-3 text-sm font-medium text-qissali-title transition hover:bg-qissali-mauve/10"
            >
              ← Modifier ma commande
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={phase === "payment" ? handlePay : (e) => e.preventDefault()} className={formShellClass}>
          {phase === "story" && (
            <>
              {currentStep === 1 && (
                <div className="space-y-8">
                  <h2 className="font-display text-xl text-qissali-title">Étape 1 — L&apos;enfant</h2>

                  <div>
                    <p className="mb-3 text-sm font-medium text-qissali-title">Histoire solo ou fratrie ?</p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          patchHistoire({
                            nbEnfants: 1,
                            prenom2: "",
                            age2: "",
                            genre2: "",
                            lien: "",
                          });
                          clearError("siblingLink");
                          clearError("genre2");
                        }}
                        className={`${chipBtn} flex-1 ${
                          h.nbEnfants === 1
                            ? "border-qissali-mauve bg-qissali-cream text-qissali-title shadow-inner"
                            : "border-qissali-rose/40 bg-white text-qissali-body hover:border-qissali-mauve/50"
                        }`}
                      >
                        Un seul enfant
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          patchHistoire({ nbEnfants: 2 });
                          clearError("siblingLink");
                        }}
                        className={`${chipBtn} flex-1 ${
                          h.nbEnfants === 2
                            ? "border-qissali-mauve bg-qissali-cream text-qissali-title shadow-inner"
                            : "border-qissali-rose/40 bg-white text-qissali-body hover:border-qissali-mauve/50"
                        }`}
                      >
                        Deux enfants (fratrie)
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-qissali-title">
                        Prénom enfant 1 <span className="text-qissali-rose">*</span>
                      </label>
                      <input
                        type="text"
                        value={h.prenom1}
                        onChange={(e) => {
                          patchHistoire({ prenom1: e.target.value });
                          clearError("child1Name");
                        }}
                        className="w-full rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 text-qissali-title outline-none focus:border-qissali-mauve focus:ring-2"
                      />
                      {errors.child1Name && <p className="mt-1 text-sm text-red-600">{errors.child1Name}</p>}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-qissali-title">
                        Âge enfant 1 <span className="text-qissali-rose">*</span>
                      </label>
                      <input
                        type="number"
                        min={2}
                        max={12}
                        value={h.age1}
                        onChange={(e) => {
                          patchHistoire({ age1: e.target.value });
                          clearError("child1Age");
                        }}
                        className="w-full rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 outline-none focus:border-qissali-mauve focus:ring-2"
                      />
                      {errors.child1Age && <p className="mt-1 text-sm text-red-600">{errors.child1Age}</p>}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-qissali-title">
                      Genre <span className="text-qissali-rose">*</span>
                    </p>
                    <div className="flex gap-3">
                      {(["fille", "garcon"] as const).map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            patchHistoire({ genre1: g });
                            clearError("genre1");
                          }}
                          className={`${chipBtn} flex-1 ${
                            h.genre1 === g
                              ? "border-qissali-mauve bg-qissali-cream text-qissali-title shadow-inner"
                              : "border-qissali-rose/40 bg-white text-qissali-body hover:border-qissali-mauve/50"
                          }`}
                        >
                          {g === "fille" ? "Fille" : "Garçon"}
                        </button>
                      ))}
                    </div>
                    {errors.genre1 && <p className="mt-2 text-sm text-red-600">{errors.genre1}</p>}
                  </div>

                  {h.nbEnfants === 2 && (
                    <>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-qissali-title">
                            Prénom enfant 2 <span className="text-qissali-rose">*</span>
                          </label>
                          <input
                            type="text"
                            value={h.prenom2}
                            onChange={(e) => {
                              patchHistoire({ prenom2: e.target.value });
                              clearError("child2Name");
                            }}
                            className="w-full rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 outline-none focus:border-qissali-mauve focus:ring-2"
                          />
                          {errors.child2Name && <p className="mt-1 text-sm text-red-600">{errors.child2Name}</p>}
                        </div>
                        <div>
                          <label className="mb-2 block text-sm font-medium text-qissali-title">
                            Âge enfant 2 <span className="text-qissali-rose">*</span>
                          </label>
                          <input
                            type="number"
                            min={2}
                            max={12}
                            value={h.age2}
                            onChange={(e) => {
                              patchHistoire({ age2: e.target.value });
                              clearError("child2Age");
                            }}
                            className="w-full rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 outline-none focus:border-qissali-mauve focus:ring-2"
                          />
                          {errors.child2Age && <p className="mt-1 text-sm text-red-600">{errors.child2Age}</p>}
                        </div>
                      </div>
                      <div>
                        <p className="mb-3 text-sm font-medium text-qissali-title">
                          Genre enfant 2 <span className="text-qissali-rose">*</span>
                        </p>
                        <div className="flex gap-3">
                          {(["fille", "garcon"] as const).map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                patchHistoire({ genre2: g });
                                clearError("genre2");
                              }}
                              className={`${chipBtn} flex-1 ${
                                h.genre2 === g
                                  ? "border-qissali-mauve bg-qissali-cream text-qissali-title shadow-inner"
                                  : "border-qissali-rose/40 bg-white text-qissali-body hover:border-qissali-mauve/50"
                              }`}
                            >
                              {g === "fille" ? "Fille" : "Garçon"}
                            </button>
                          ))}
                        </div>
                        {errors.genre2 && <p className="mt-2 text-sm text-red-600">{errors.genre2}</p>}
                      </div>
                      <div>
                        <p className="mb-3 text-sm font-medium text-qissali-title">Lien entre les enfants</p>
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
                                patchHistoire({ lien: id });
                                clearError("siblingLink");
                              }}
                              className={`${chipBtn} min-w-[100px] flex-1 ${
                                h.lien === id
                                  ? "border-qissali-mauve bg-qissali-cream text-qissali-title"
                                  : "border-qissali-rose/40 bg-white text-qissali-body hover:border-qissali-mauve/50"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        {errors.siblingLink && <p className="mt-2 text-sm text-red-600">{errors.siblingLink}</p>}
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-3 border-t border-qissali-rose/20 pt-6 sm:flex-row sm:justify-between">
                    <Link
                      href="/"
                      className="inline-flex items-center justify-center rounded-full border-2 border-qissali-mauve/30 px-6 py-3 text-center text-sm font-medium text-qissali-title transition hover:bg-qissali-mauve/10"
                    >
                      ← Accueil
                    </Link>
                    <button
                      type="button"
                      onClick={handleNextStoryStep}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8">
                  <h2 className="font-display text-xl text-qissali-title">Étape 2 — Profil neuro (optionnel)</h2>

                  <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-qissali-rose/30 bg-qissali-cream/30 p-4">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 shrink-0 rounded border-qissali-rose/50 text-qissali-mauve focus:ring-qissali-mauve"
                      checked={h.neuroEnabled}
                      onChange={(e) => {
                        const on = e.target.checked;
                        patchHistoire({
                          neuroEnabled: on,
                          profils: on ? h.profils : [],
                          precisionsNeuro: on ? h.precisionsNeuro : "",
                        });
                      }}
                    />
                    <span className="text-sm text-qissali-body">
                      <span className="font-medium text-qissali-title">Adapter l&apos;histoire</span> à un profil
                      neuroatypique (Dys, TDAH, TSA, HPI…)
                    </span>
                  </label>

                  {h.neuroEnabled && (
                    <div className="rounded-xl border border-qissali-rose/25 bg-qissali-cream/40 p-4">
                      <div className="mt-3 flex flex-col gap-2">
                        {PROFILS.map(({ id, label }) => {
                          const selected = h.profils.includes(id);
                          return (
                            <button
                              key={id}
                              type="button"
                              onClick={() => {
                                setHistoires((prev) => {
                                  const cur = { ...prev[currentHistoire] };
                                  if (id === "aucun") {
                                    cur.profils = cur.profils.includes("aucun") ? [] : ["aucun"];
                                    cur.precisionsNeuro = "";
                                  } else {
                                    const w = cur.profils.filter((p) => p !== "aucun");
                                    cur.profils = w.includes(id) ? w.filter((p) => p !== id) : [...w, id];
                                    if (cur.profils.length === 0) cur.precisionsNeuro = "";
                                  }
                                  const next = [...prev];
                                  next[currentHistoire] = cur;
                                  return next;
                                });
                              }}
                              className={`${chipBtn} w-full text-left ${
                                selected
                                  ? "border-qissali-mauve bg-qissali-cream text-qissali-title"
                                  : "border-qissali-rose/40 bg-white text-qissali-body hover:border-qissali-mauve/50"
                              }`}
                            >
                              {label}
                            </button>
                          );
                        })}
                      </div>
                      {hasNeuroProfile && (
                        <textarea
                          rows={3}
                          maxLength={200}
                          value={h.precisionsNeuro}
                          onChange={(e) => patchHistoire({ precisionsNeuro: e.target.value })}
                          placeholder="Précisions éventuelles…"
                          className="mt-3 w-full resize-y rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 text-sm outline-none focus:border-qissali-mauve focus:ring-2"
                        />
                      )}
                    </div>
                  )}

                  <div className="flex flex-col gap-3 border-t border-qissali-rose/20 pt-6 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex items-center justify-center rounded-full border-2 border-qissali-mauve/30 px-6 py-3 text-sm font-medium text-qissali-title transition hover:bg-qissali-mauve/10"
                    >
                      ← Retour
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8">
                  <h2 className="font-display text-xl text-qissali-title">Étape 3 — L&apos;histoire</h2>

                  <div>
                    <p className="mb-3 text-sm font-medium text-qissali-title">Univers</p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {UNIVERSES.map(({ id, emoji, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            patchHistoire({ univers: id });
                            clearError("universe");
                          }}
                          className={`${chipBtn} flex flex-col items-center gap-1 py-4 ${
                            h.univers === id
                              ? "border-qissali-mauve bg-qissali-cream text-qissali-title"
                              : "border-qissali-rose/40 bg-white text-qissali-body hover:border-qissali-mauve/50"
                          }`}
                        >
                          <span className="text-3xl" aria-hidden>
                            {emoji}
                          </span>
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                    {errors.universe && <p className="mt-2 text-sm text-red-600">{errors.universe}</p>}
                    {hasNeuroProfile && (
                      <p className="mt-2 text-sm text-qissali-mauve-mid">
                        ✨ Adaptation pour : {profilsLabel}
                      </p>
                    )}
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-qissali-title">Valeur</p>
                    <div className="flex flex-col gap-2">
                      {VALEURS.map(({ value, chip }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            patchHistoire({ valeur: value });
                            clearError("valeur");
                          }}
                          className={`${chipBtn} w-full text-left ${
                            h.valeur === value
                              ? "border-qissali-mauve bg-qissali-cream text-qissali-title"
                              : "border-qissali-rose/40 bg-white text-qissali-body hover:border-qissali-mauve/50"
                          }`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                    {errors.valeur && <p className="mt-2 text-sm text-red-600">{errors.valeur}</p>}
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-qissali-title">Occasion</p>
                    <div className="flex flex-col gap-2">
                      {OCCASIONS.map(({ value, chip }) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => {
                            patchHistoire({ occasion: value });
                            clearError("occasion");
                          }}
                          className={`${chipBtn} w-full text-left ${
                            h.occasion === value
                              ? "border-qissali-mauve bg-qissali-cream text-qissali-title"
                              : "border-qissali-rose/40 bg-white text-qissali-body hover:border-qissali-mauve/50"
                          }`}
                        >
                          {chip}
                        </button>
                      ))}
                    </div>
                    {errors.occasion && <p className="mt-2 text-sm text-red-600">{errors.occasion}</p>}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-qissali-title">
                      Message <span className="text-qissali-soft">(optionnel)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={h.message}
                      onChange={(e) => patchHistoire({ message: e.target.value })}
                      className="w-full resize-y rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 text-sm outline-none focus:border-qissali-mauve focus:ring-2"
                    />
                  </div>

                  {currentHistoire < pack.nbHistoires - 1 && (
                    <div className="rounded-xl border border-qissali-mauve/25 bg-qissali-cream/80 p-4">
                      <p className="text-sm text-qissali-title">
                        ✓ Histoire {currentHistoire + 1} : {h.prenom1.trim() || "…"} ·{" "}
                        {UNIVERSES.find((x) => x.id === h.univers)?.label ?? "…"} · {h.valeur || "…"}
                      </p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 border-t border-qissali-rose/20 pt-6 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-flex items-center justify-center rounded-full border-2 border-qissali-mauve/30 px-6 py-3 text-sm font-medium text-qissali-title transition hover:bg-qissali-mauve/10"
                    >
                      ← Retour
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStoryStep}
                      className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:brightness-105"
                    >
                      {currentHistoire < pack.nbHistoires - 1
                        ? `Histoire ${currentHistoire + 2} →`
                        : "Voir le récapitulatif"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {phase === "payment" && (
            <div className="space-y-8">
              <h2 className="font-display text-xl text-qissali-title">Récapitulatif & paiement</h2>

              <ul className="space-y-2 rounded-xl border border-qissali-rose/25 bg-qissali-cream/50 p-4 text-sm text-qissali-title">
                {histoires.map((story, i) => (
                  <li key={story.id}>{recapLine(story, i)}</li>
                ))}
              </ul>

              <div>
                <label htmlFor="email-pay" className="mb-2 block text-sm font-medium text-qissali-title">
                  Email de livraison <span className="text-qissali-rose">*</span>
                </label>
                <input
                  id="email-pay"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError("email");
                  }}
                  className="w-full rounded-xl border border-qissali-rose/40 bg-white px-4 py-3 outline-none focus:border-qissali-mauve focus:ring-2"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-qissali-title">Format</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div
                    className={`${chipBtn} flex flex-col items-start border-qissali-mauve bg-qissali-cream py-4 text-left text-qissali-title`}
                  >
                    <span className="font-semibold">PDF illustré</span>
                    <span className="mt-1 font-display text-2xl italic text-qissali-rose">Inclus</span>
                  </div>
                  <div
                    className={`${chipBtn} flex cursor-not-allowed flex-col items-start border-dashed border-qissali-rose-light bg-qissali-section py-4 text-left opacity-70`}
                  >
                    <span className="font-semibold text-qissali-soft">PDF + Audio</span>
                    <span className="mt-1 text-xs text-qissali-soft">Bientôt disponible</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-qissali-mauve/20 bg-white px-4 py-3">
                <span className="text-sm font-medium text-qissali-body">Total pack {pack.label}</span>
                <span className="font-display text-2xl font-bold text-qissali-title">
                  {centsToEuroLabel(pack.prix)}
                </span>
              </div>

              {errors.checkout && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
                  {errors.checkout}
                </p>
              )}

              <p className="text-center text-sm text-qissali-body">
                {canUseEmbeddedCheckout
                  ? "Paiement Stripe sur cette page."
                  : "Redirection vers Stripe pour le paiement sécurisé."}
              </p>

              <div className="flex flex-col gap-3 border-t border-qissali-rose/20 pt-6 sm:flex-row sm:justify-between">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={checkoutLoading}
                  className="inline-flex items-center justify-center rounded-full border-2 border-qissali-mauve/30 px-6 py-3 text-sm font-medium text-qissali-title transition hover:bg-qissali-mauve/10 disabled:opacity-50"
                >
                  ← Modifier
                </button>
                <button
                  type="submit"
                  disabled={checkoutLoading}
                  className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve px-8 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-105 disabled:opacity-60"
                >
                  {checkoutLoading
                    ? "Préparation…"
                    : `Payer ${centsToEuroLabel(pack.prix)} →`}
                </button>
              </div>
            </div>
          )}
        </form>
      )}

      <p className="mt-8 text-center text-xs text-qissali-soft">
        <Link href="/" className="text-qissali-mauve-mid underline-offset-2 hover:underline">
          Retour à l&apos;accueil
        </Link>
      </p>
    </div>
  );
}

export function CommanderForm() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-2xl rounded-2xl border border-qissali-rose-light bg-white/90 p-12 text-center text-qissali-body">
          Chargement du formulaire…
        </div>
      }
    >
      <CommanderFormInner />
    </Suspense>
  );
}
