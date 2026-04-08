"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { StripeEmbeddedCheckout } from "@/components/stripe-embedded-checkout";

const UNIVERSES = [
  { id: "princesse", emoji: "👑", label: "Princesse" },
  { id: "licorne", emoji: "🦄", label: "Licorne" },
  { id: "super-heros", emoji: "🦸", label: "Super-héros" },
  { id: "animaux", emoji: "🐾", label: "Animaux parlants" },
];

const VALEURS = [
  "Générosité",
  "Partage",
  "Courage",
  "Patience",
  "Respect des parents",
];

const OCCASIONS = [
  "Aïd el-Fitr",
  "Aïd el-Adha",
  "Ramadan",
  "Anniversaire",
  "Sans occasion",
];

const PROFILS = [
  { id: "aucun", label: "Pas de profil neuroatypique" },
  { id: "dys", label: "Dys (dyslexie, dyscalculie, dyspraxie...)" },
  { id: "tdah", label: "TDAH" },
  { id: "tsa", label: "Autisme / TSA" },
  { id: "hpi", label: "Haut potentiel (HPI/HQI)" },
];

function isValidEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).trim());
}

function genreLibelle(g) {
  return g === "fille" ? "Fille" : "Garçon";
}

const chipBase =
  "rounded-2xl border-2 px-3 py-2.5 text-center text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve-deep)] sm:px-4";

const OrderModalContext = createContext(null);

export function useOrderModal() {
  const ctx = useContext(OrderModalContext);
  if (!ctx) {
    throw new Error("useOrderModal doit être utilisé dans OrderModalProvider.");
  }
  return ctx;
}

/** Bouton qui ouvre le modal de commande (à utiliser dans OrderModalProvider). */
export function CommanderModalTrigger({ children, className = "", ...rest }) {
  const { openModal } = useOrderModal();
  return (
    <button
      type="button"
      className={className}
      onClick={openModal}
      {...rest}
    >
      {children}
    </button>
  );
}

export function OrderModalProvider({ children }) {
  const [open, setOpen] = useState(false);
  const openModal = useCallback(() => setOpen(true), []);
  const closeModal = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ openModal, closeModal }),
    [openModal, closeModal]
  );

  return (
    <OrderModalContext.Provider value={value}>
      {children}
      <OrderModalDialog open={open} onClose={() => setOpen(false)} />
    </OrderModalContext.Provider>
  );
}

function OrderModalDialog({ open, onClose }) {
  const [step, setStep] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [embeddedClientSecret, setEmbeddedClientSecret] = useState(null);

  const canUseEmbeddedCheckout = useMemo(
    () =>
      Boolean(
        typeof process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "string" &&
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.length > 0
      ),
    []
  );

  const [childCount, setChildCount] = useState(1);
  const [child1Name, setChild1Name] = useState("");
  const [child1Age, setChild1Age] = useState("");
  const [genre1, setGenre1] = useState("");
  const [child2Name, setChild2Name] = useState("");
  const [child2Age, setChild2Age] = useState("");
  const [genre2, setGenre2] = useState("");
  const [siblingLink, setSiblingLink] = useState("");

  const [neuroEnabled, setNeuroEnabled] = useState(false);
  const [profils, setProfils] = useState([]);
  const [precisionsNeuro, setPrecisionsNeuro] = useState("");

  const [universe, setUniverse] = useState("");
  const [valeur, setValeur] = useState("");
  const [occasion, setOccasion] = useState("");

  const [format, setFormat] = useState("pdf");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const clearError = useCallback((key) => {
    setErrors((e) => {
      const next = { ...e };
      delete next[key];
      return next;
    });
  }, []);

  const resetForm = useCallback(() => {
    setStep(1);
    setShowSuccess(false);
    setCheckoutUrl(null);
    setEmbeddedClientSecret(null);
    setCheckoutLoading(false);
    setChildCount(1);
    setChild1Name("");
    setChild1Age("");
    setGenre1("");
    setChild2Name("");
    setChild2Age("");
    setGenre2("");
    setSiblingLink("");
    setUniverse("");
    setValeur("");
    setOccasion("");
    setFormat("pdf");
    setEmail("");
    setNeuroEnabled(false);
    setProfils([]);
    setPrecisionsNeuro("");
    setErrors({});
  }, []);

  useEffect(() => {
    if (!open) return;
    resetForm();
  }, [open, resetForm]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!checkoutUrl) return;
    const t = setTimeout(() => {
      window.location.href = checkoutUrl;
    }, 2400);
    return () => clearTimeout(t);
  }, [checkoutUrl]);

  const validateStep1 = useCallback(() => {
    const e = {};
    if (!child1Name.trim()) e.child1Name = "Indique le prénom.";
    const a1 = parseInt(child1Age, 10);
    if (Number.isNaN(a1) || a1 < 2 || a1 > 12) {
      e.child1Age = "Âge entre 2 et 12 ans.";
    }
    if (!genre1) {
      e.genre1 = "Indique si l’enfant est une fille ou un garçon.";
    }
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
    childCount,
    child2Name,
    child2Age,
    genre2,
    siblingLink,
  ]);

  const validateStep2 = useCallback(() => {
    const e = {};
    if (!universe) e.universe = "Choisis un univers.";
    if (!valeur) e.valeur = "Choisis une valeur.";
    if (!occasion) e.occasion = "Choisis une occasion.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }, [universe, valeur, occasion]);

  const validateStep3 = useCallback(() => {
    const e = {};
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
    if (showSuccess) return;
    if (step > 1) setStep((s) => s - 1);
  };

  const universLabelForApi = useMemo(() => {
    const u = UNIVERSES.find((x) => x.id === universe);
    return u ? u.label : universe;
  }, [universe]);

  const hasNeuroProfile = useMemo(
    () => neuroEnabled && profils.some((p) => p !== "aucun"),
    [neuroEnabled, profils]
  );

  const profilsLabel = useMemo(() => {
    if (!hasNeuroProfile) return "";
    return PROFILS.filter((p) => p.id !== "aucun" && profils.includes(p.id))
      .map((p) => p.label)
      .join(", ");
  }, [hasNeuroProfile, profils]);

  const recapLines = useMemo(() => {
    const u = UNIVERSES.find((x) => x.id === universe);
    const fmt =
      format === "pdf"
        ? "PDF illustré — 3,90€"
        : "PDF + Audio — 7,90€";
    const g1 = genre1 ? genreLibelle(genre1) : "";
    const enfant1 = `${child1Name.trim()} (${child1Age} ans${g1 ? `, ${g1}` : ""})`;
    let enfants = enfant1;
    if (childCount === 2) {
      const g2 = genre2 ? genreLibelle(genre2) : "";
      enfants = `${enfant1} · ${child2Name.trim()} (${child2Age} ans${g2 ? `, ${g2}` : ""})`;
    }
    const lines = [
      {
        k: "Type",
        v: childCount === 1 ? "Solo (un enfant)" : "Fratrie (deux enfants)",
      },
      { k: "Enfant(s)", v: enfants },
    ];
    if (childCount === 2 && siblingLink) {
      const linkLabel =
        siblingLink === "soeurs"
          ? "Sœurs"
          : siblingLink === "freres"
            ? "Frères"
            : "Mixte";
      lines.push({ k: "Lien", v: linkLabel });
    }
    lines.push(
      { k: "Univers", v: u ? `${u.emoji} ${u.label}` : "—" },
      { k: "Valeur", v: valeur || "—" },
      { k: "Occasion", v: occasion || "—" }
    );
    if (hasNeuroProfile && profilsLabel) {
      lines.push({ k: "Neuroatypie", v: profilsLabel });
    }
    lines.push({ k: "Format", v: fmt });
    return lines;
  }, [
    childCount,
    child1Name,
    child1Age,
    genre1,
    child2Name,
    child2Age,
    genre2,
    siblingLink,
    universe,
    valeur,
    occasion,
    format,
    hasNeuroProfile,
    profilsLabel,
  ]);

  const displayName =
    childCount === 2
      ? `${child1Name.trim()} & ${child2Name.trim()}`
      : child1Name.trim();

  const handlePay = async (ev) => {
    ev.preventDefault();
    if (!validateStep3()) return;

    const montant = format === "pdf" ? 390 : 790;
    setCheckoutLoading(true);
    clearError("checkout");
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          montant,
          prenom1: child1Name.trim(),
          prenom2: childCount === 2 ? child2Name.trim() : "",
          univers: universLabelForApi,
          valeur,
          occasion,
          format,
          message: "",
          typeHistoire: childCount === 1 ? "solo" : "fratrie",
          genre1: genre1 ? genreLibelle(genre1) : "",
          genre2:
            childCount === 2 && genre2 ? genreLibelle(genre2) : "",
          age_enfant1: String(child1Age).trim(),
          age_enfant2: childCount === 2 ? String(child2Age).trim() : "",
          profils: hasNeuroProfile
            ? profils.filter((p) => p !== "aucun").join(",")
            : "",
          precisionsNeuro: hasNeuroProfile ? String(precisionsNeuro).trim() : "",
          embedded: canUseEmbeddedCheckout,
        }),
      });

      const data = await res.json();

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
        setCheckoutUrl(data.url);
        setShowSuccess(true);
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

  const progressPct = showSuccess ? 100 : (step / 3) * 100;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-start justify-center overflow-y-auto px-4 py-6 sm:px-6 sm:py-10"
      role="presentation"
    >
      <button
        type="button"
        className="absolute inset-0 z-0 cursor-default bg-[rgba(74,46,90,0.32)] backdrop-blur-[10px]"
        aria-label="Fermer"
        onClick={onClose}
      />
      <div
        className="modal-fade-up relative z-[1001] my-auto w-full max-w-[580px] max-h-[90vh] overflow-y-auto rounded-[28px] bg-white px-5 py-8 shadow-2xl sm:px-9 sm:py-10"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
      >
        <button
          type="button"
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full text-xl leading-none text-[var(--text-mid)] transition hover:bg-[var(--rose-pale)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve)]"
          onClick={onClose}
          aria-label="Fermer"
        >
          ✕
        </button>

        {showSuccess ? (
          <div className="pt-4 text-center">
            <div
              className="modal-moon-animate mb-6 inline-block text-6xl"
              role="img"
              aria-hidden
            >
              🌙
            </div>
            <p className="font-display text-2xl text-[var(--text-title)]">
              Barakallahu fik !
            </p>
            <p className="mt-4 text-lg text-[var(--text)]">
              L&apos;histoire de {displayName || "ton enfant"} est en
              préparation...
            </p>
            <p className="mt-6 text-sm text-[var(--text-mid)]">
              Redirection vers le paiement sécurisé…
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex flex-col items-center pt-2">
              <Image
                src="/logo-qissali.png"
                alt="Qissali"
                width={90}
                height={60}
                className="h-[60px] w-auto object-contain"
              />
              <div className="mt-6 w-full">
                <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--rose-light)]/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--mauve)] transition-all duration-500 ease-out"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <p
                  id="order-modal-title"
                  className="mt-3 text-center text-sm font-semibold text-[var(--text-mid)]"
                >
                  Étape {step} sur 3
                </p>
              </div>
            </div>

            {embeddedClientSecret ? (
              <div className="space-y-4">
                <h3 className="text-center text-xl font-bold text-[var(--text)]">
                  Paiement sécurisé
                </h3>
                <p className="text-center text-sm text-[var(--text-mid)]">
                  Carte, Apple Pay ou Google Pay — le formulaire Stripe s&apos;affiche
                  ci-dessous.
                </p>
                <StripeEmbeddedCheckout
                  clientSecret={embeddedClientSecret}
                  onError={(msg) =>
                    setErrors((prev) => ({ ...prev, checkout: msg }))
                  }
                />
                {errors.checkout && (
                  <p className="text-center text-sm text-red-600">
                    {errors.checkout}
                  </p>
                )}
                <div className="flex justify-center border-t border-[var(--rose-light)] pt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setEmbeddedClientSecret(null);
                      clearError("checkout");
                    }}
                    className="rounded-full border-2 border-[var(--mauve)]/35 px-6 py-3 text-sm font-semibold text-[var(--mauve-deep)]"
                  >
                    ← Modifier ma commande
                  </button>
                </div>
              </div>
            ) : (
            <form onSubmit={step === 3 ? handlePay : (e) => e.preventDefault()}>
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-center text-xl font-bold text-[var(--text)]">
                    👧 L&apos;enfant
                  </h3>
                  <div>
                    <p className="mb-3 text-sm font-medium text-[var(--text)]">
                      Histoire solo ou fratrie ?
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <button
                        type="button"
                        onClick={() => {
                          setChildCount(1);
                          setChild2Name("");
                          setChild2Age("");
                          setGenre2("");
                          setSiblingLink("");
                          clearError("siblingLink");
                          clearError("genre2");
                        }}
                        className={`${chipBase} flex-1 ${
                          childCount === 1
                            ? "border-[var(--mauve)] bg-[var(--rose-pale)] text-[var(--mauve-deep)]"
                            : "border-[var(--rose-light)] bg-white text-[var(--text-mid)] hover:border-[var(--mauve)]/50"
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
                        className={`${chipBase} flex-1 ${
                          childCount === 2
                            ? "border-[var(--mauve)] bg-[var(--rose-pale)] text-[var(--mauve-deep)]"
                            : "border-[var(--rose-light)] bg-white text-[var(--text-mid)] hover:border-[var(--mauve)]/50"
                        }`}
                      >
                        Deux enfants (fratrie)
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="m-c1-name"
                        className="mb-2 block text-sm font-medium text-[var(--text)]"
                      >
                        Prénom <span className="text-[var(--rose-deep)]">*</span>
                      </label>
                      <input
                        id="m-c1-name"
                        type="text"
                        autoComplete="given-name"
                        value={child1Name}
                        onChange={(e) => {
                          setChild1Name(e.target.value);
                          clearError("child1Name");
                        }}
                        className="w-full rounded-2xl border border-[var(--rose-light)] bg-[var(--white)] px-4 py-3 text-[var(--text)] outline-none ring-[var(--mauve)]/30 focus:border-[var(--mauve)] focus:ring-2"
                      />
                      {errors.child1Name && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.child1Name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="m-c1-age"
                        className="mb-2 block text-sm font-medium text-[var(--text)]"
                      >
                        Âge <span className="text-[var(--rose-deep)]">*</span>
                      </label>
                      <input
                        id="m-c1-age"
                        type="number"
                        min={2}
                        max={12}
                        inputMode="numeric"
                        value={child1Age}
                        onChange={(e) => {
                          setChild1Age(e.target.value);
                          clearError("child1Age");
                        }}
                        className="w-full rounded-2xl border border-[var(--rose-light)] bg-[var(--white)] px-4 py-3 outline-none focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/30"
                      />
                      {errors.child1Age && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.child1Age}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-[var(--text)]">
                      Genre <span className="text-[var(--rose-deep)]">*</span>
                    </p>
                    <div className="flex gap-3">
                      {["fille", "garcon"].map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() => {
                            setGenre1(g);
                            clearError("genre1");
                          }}
                          className={`${chipBase} flex-1 ${
                            genre1 === g
                              ? "border-[var(--mauve)] bg-[var(--rose-pale)] text-[var(--mauve-deep)]"
                              : "border-[var(--rose-light)] bg-white text-[var(--text-mid)] hover:border-[var(--mauve)]/50"
                          }`}
                        >
                          {g === "fille" ? "Fille" : "Garçon"}
                        </button>
                      ))}
                    </div>
                    {errors.genre1 && (
                      <p className="mt-2 text-sm text-red-600">{errors.genre1}</p>
                    )}
                  </div>

                  {childCount === 2 && (
                    <>
                      <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                          <label
                            htmlFor="m-c2-name"
                            className="mb-2 block text-sm font-medium"
                          >
                            Prénom 2 <span className="text-[var(--rose-deep)]">*</span>
                          </label>
                          <input
                            id="m-c2-name"
                            type="text"
                            value={child2Name}
                            onChange={(e) => {
                              setChild2Name(e.target.value);
                              clearError("child2Name");
                            }}
                            className="w-full rounded-2xl border border-[var(--rose-light)] px-4 py-3 outline-none focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/30"
                          />
                          {errors.child2Name && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.child2Name}
                            </p>
                          )}
                        </div>
                        <div>
                          <label
                            htmlFor="m-c2-age"
                            className="mb-2 block text-sm font-medium"
                          >
                            Âge 2 <span className="text-[var(--rose-deep)]">*</span>
                          </label>
                          <input
                            id="m-c2-age"
                            type="number"
                            min={2}
                            max={12}
                            value={child2Age}
                            onChange={(e) => {
                              setChild2Age(e.target.value);
                              clearError("child2Age");
                            }}
                            className="w-full rounded-2xl border border-[var(--rose-light)] px-4 py-3 outline-none focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/30"
                          />
                          {errors.child2Age && (
                            <p className="mt-1 text-sm text-red-600">
                              {errors.child2Age}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="mb-3 text-sm font-medium">
                          Genre enfant 2{" "}
                          <span className="text-[var(--rose-deep)]">*</span>
                        </p>
                        <div className="flex gap-3">
                          {["fille", "garcon"].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => {
                                setGenre2(g);
                                clearError("genre2");
                              }}
                              className={`${chipBase} flex-1 ${
                                genre2 === g
                                  ? "border-[var(--mauve)] bg-[var(--rose-pale)] text-[var(--mauve-deep)]"
                                  : "border-[var(--rose-light)] bg-white text-[var(--text-mid)] hover:border-[var(--mauve)]/50"
                              }`}
                            >
                              {g === "fille" ? "Fille" : "Garçon"}
                            </button>
                          ))}
                        </div>
                        {errors.genre2 && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.genre2}
                          </p>
                        )}
                      </div>
                      <div>
                        <p className="mb-3 text-sm font-medium">
                          Lien entre les enfants
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "soeurs", label: "Sœurs" },
                            { id: "freres", label: "Frères" },
                            { id: "mixte", label: "Mixte" },
                          ].map(({ id, label }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => {
                                setSiblingLink(id);
                                clearError("siblingLink");
                              }}
                              className={`${chipBase} flex-1 min-w-[88px] ${
                                siblingLink === id
                                  ? "border-[var(--mauve)] bg-[var(--rose-pale)] text-[var(--mauve-deep)]"
                                  : "border-[var(--rose-light)] bg-white text-[var(--text-mid)] hover:border-[var(--mauve)]/50"
                              }`}
                            >
                              {label}
                            </button>
                          ))}
                        </div>
                        {errors.siblingLink && (
                          <p className="mt-2 text-sm text-red-600">
                            {errors.siblingLink}
                          </p>
                        )}
                      </div>
                    </>
                  )}

                  <div>
                    <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-[var(--rose-light)] bg-[var(--cream)]/80 p-4 transition hover:border-[var(--mauve)]/40">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 shrink-0 rounded border-[var(--rose-light)] text-[var(--mauve-deep)] focus:ring-[var(--mauve)]"
                        checked={neuroEnabled}
                        onChange={(e) => {
                          const on = e.target.checked;
                          setNeuroEnabled(on);
                          if (!on) {
                            setProfils([]);
                            setPrecisionsNeuro("");
                          }
                        }}
                      />
                      <span className="text-sm leading-snug text-[var(--text)]">
                        <span className="font-semibold text-[var(--mauve-deep)]">
                          Adapter l&apos;histoire
                        </span>{" "}
                        à un profil neuroatypique ou à des besoins particuliers{" "}
                        <span className="text-[var(--text-mid)]">
                          (Dys, TDAH, TSA, HPI… — optionnel)
                        </span>
                      </span>
                    </label>

                    {neuroEnabled && (
                      <div className="mt-4 rounded-2xl border border-[var(--rose-light)] bg-[var(--rose-pale)]/50 p-4">
                        <p className="text-sm font-semibold text-[var(--mauve-deep)]">
                          Neuroatypie
                        </p>
                        <p className="mt-1 text-sm font-medium text-[var(--text)]">
                          Profil ou besoins particuliers ?
                          <span className="font-normal text-[var(--text-mid)]">
                            {" "}
                            (pour personnaliser l&apos;histoire)
                          </span>
                        </p>
                        <p className="mt-1 text-xs text-[var(--text-mid)]">
                          Ces informations restent privées et servent uniquement à adapter
                          l&apos;histoire.
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
                                className={`${chipBase} w-full text-left ${
                                  selected
                                    ? "border-[var(--mauve)] bg-[var(--rose-pale)] text-[var(--mauve-deep)]"
                                    : "border-[var(--rose-light)] bg-white text-[var(--text-mid)] hover:border-[var(--mauve)]/50"
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
                              htmlFor="m-precisions-neuro"
                              className="mb-2 block text-sm font-medium text-[var(--text)]"
                            >
                              Précisions (optionnel)
                            </label>
                            <textarea
                              id="m-precisions-neuro"
                              rows={3}
                              maxLength={200}
                              value={precisionsNeuro}
                              onChange={(e) => setPrecisionsNeuro(e.target.value)}
                              placeholder="Ex : dyslexie sévère, TDAH avec hyperactivité…"
                              className="w-full resize-y rounded-2xl border border-[var(--rose-light)] bg-white px-4 py-3 text-sm text-[var(--text)] outline-none focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/30"
                            />
                          </div>
                        )}
                        <p className="mt-3 text-xs text-[var(--text-mid)]">
                          🔒 Non stockées : utilisées seulement pour l&apos;histoire commandée.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-3 border-t border-[var(--rose-light)] pt-6 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={goNext}
                      className="rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--mauve)] px-8 py-3 text-sm font-bold text-white shadow-md shadow-[rgba(196,154,216,0.35)] transition hover:brightness-105"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-center text-xl font-bold text-[var(--text)]">
                    📖 L&apos;histoire
                  </h3>
                  <div>
                    <p className="mb-3 text-sm font-medium">Univers</p>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {UNIVERSES.map(({ id, emoji, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setUniverse(id);
                            clearError("universe");
                          }}
                          className={`${chipBase} flex flex-col gap-1 py-3 ${
                            universe === id
                              ? "border-[var(--mauve)] bg-[var(--rose-pale)] text-[var(--mauve-deep)]"
                              : "border-[var(--rose-light)] bg-white text-[var(--text-mid)]"
                          }`}
                        >
                          <span className="text-2xl" aria-hidden>
                            {emoji}
                          </span>
                          <span>{label}</span>
                        </button>
                      ))}
                    </div>
                    {errors.universe && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.universe}
                      </p>
                    )}
                    {hasNeuroProfile && (
                      <p className="mt-2 text-sm text-[var(--mauve-deep)]">
                        ✨ Nous adaptons l&apos;histoire à la neuroatypie indiquée (
                        {profilsLabel}). Ta sélection sera prise en compte.
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-medium">Valeur</p>
                    <div className="flex flex-col gap-2">
                      {VALEURS.map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => {
                            setValeur(v);
                            clearError("valeur");
                          }}
                          className={`${chipBase} w-full text-left ${
                            valeur === v
                              ? "border-[var(--mauve)] bg-[var(--rose-pale)] text-[var(--mauve-deep)]"
                              : "border-[var(--rose-light)] bg-white"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    {errors.valeur && (
                      <p className="mt-2 text-sm text-red-600">{errors.valeur}</p>
                    )}
                  </div>
                  <div>
                    <p className="mb-3 text-sm font-medium">Occasion</p>
                    <div className="flex flex-col gap-2">
                      {OCCASIONS.map((o) => (
                        <button
                          key={o}
                          type="button"
                          onClick={() => {
                            setOccasion(o);
                            clearError("occasion");
                          }}
                          className={`${chipBase} w-full text-left ${
                            occasion === o
                              ? "border-[var(--mauve)] bg-[var(--rose-pale)] text-[var(--mauve-deep)]"
                              : "border-[var(--rose-light)] bg-white"
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                    {errors.occasion && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.occasion}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-3 border-t border-[var(--rose-light)] pt-6 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="rounded-full border-2 border-[var(--mauve)]/35 px-6 py-3 text-sm font-semibold text-[var(--mauve-deep)]"
                    >
                      Précédent
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--mauve)] px-8 py-3 text-sm font-bold text-white shadow-md shadow-[rgba(196,154,216,0.35)]"
                    >
                      Suivant
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-center text-xl font-bold text-[var(--text)]">
                    💌 Livraison
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setFormat("pdf")}
                      className={`rounded-2xl border-2 p-5 text-left transition ${
                        format === "pdf"
                          ? "border-[var(--mauve)] bg-[var(--rose-pale)] shadow-md"
                          : "border-[var(--rose-light)] bg-white hover:border-[var(--mauve)]/40"
                      }`}
                    >
                      <span className="font-medium text-[var(--text)]">
                        PDF
                      </span>
                      <p
                        className="font-display mt-2 text-[18px] leading-none text-[var(--mauve-deep)]"
                        style={{ fontSize: "18px" }}
                      >
                        3,90€
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormat("pdf-audio")}
                      className={`rounded-2xl border-2 p-5 text-left transition ${
                        format === "pdf-audio"
                          ? "border-[var(--mauve)] bg-[var(--rose-pale)] shadow-md"
                          : "border-[var(--rose-light)] bg-white hover:border-[var(--mauve)]/40"
                      }`}
                    >
                      <span className="font-medium text-[var(--text)]">
                        PDF + Audio
                      </span>
                      <p
                        className="font-display mt-2 text-[18px] leading-none text-[var(--mauve-deep)]"
                        style={{ fontSize: "18px" }}
                      >
                        7,90€
                      </p>
                    </button>
                  </div>
                  <div>
                    <label
                      htmlFor="m-email"
                      className="mb-2 block text-sm font-medium"
                    >
                      Email <span className="text-[var(--rose-deep)]">*</span>
                    </label>
                    <input
                      id="m-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError("email");
                      }}
                      className="w-full rounded-2xl border border-[var(--rose-light)] px-4 py-3 outline-none focus:border-[var(--mauve)] focus:ring-2 focus:ring-[var(--mauve)]/30"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div className="rounded-2xl border border-[var(--rose-light)] bg-[var(--cream)] p-4">
                    <p className="mb-3 text-sm font-semibold text-[var(--mauve-deep)]">
                      Récapitulatif
                    </p>
                    <ul className="space-y-2 text-sm text-[var(--text)]">
                      {recapLines.map(({ k, v }) => (
                        <li key={k} className="flex justify-between gap-4">
                          <span className="text-[var(--text-mid)]">{k}</span>
                          <span className="text-right font-medium">{v}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {errors.checkout && (
                    <p className="text-center text-sm text-red-600">
                      {errors.checkout}
                    </p>
                  )}
                  <p className="text-center text-sm text-[var(--text-mid)]">
                    {canUseEmbeddedCheckout
                      ? "Le paiement Stripe s’ouvre sur cette page (carte, Apple Pay, Google Pay…)."
                      : "Tu seras redirigé·e vers Stripe : carte, Apple Pay ou Google Pay selon l’appareil."}
                  </p>
                  <div className="flex flex-col gap-3 border-t border-[var(--rose-light)] pt-6 sm:flex-row sm:justify-between">
                    <button
                      type="button"
                      onClick={goBack}
                      className="rounded-full border-2 border-[var(--mauve)]/35 px-6 py-3 text-sm font-semibold text-[var(--mauve-deep)]"
                    >
                      Précédent
                    </button>
                    <button
                      type="submit"
                      disabled={checkoutLoading}
                      className="rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--mauve)] px-8 py-3 text-sm font-bold text-white shadow-lg shadow-[rgba(196,154,216,0.35)] transition hover:brightness-105 disabled:opacity-60"
                    >
                      {checkoutLoading
                        ? canUseEmbeddedCheckout
                          ? "Préparation du paiement…"
                          : "Patienter…"
                        : canUseEmbeddedCheckout
                          ? "Continuer vers le paiement"
                          : "Commander 🌙"}
                    </button>
                  </div>
                </div>
              )}
            </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
