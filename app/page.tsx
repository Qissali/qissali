import { CommanderModalTrigger } from "@/components/Modal";
import Image from "next/image";
import Link from "next/link";

function IconForm() {
  return (
    <svg
      className="h-10 w-10 text-qissali-mauve"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
      />
    </svg>
  );
}

function IconBook() {
  return (
    <svg
      className="h-10 w-10 text-qissali-rose"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg
      className="h-10 w-10 text-qissali-mauve"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

const steps = [
  {
    title: "Tu remplis le formulaire",
    icon: IconForm,
  },
  {
    title: "On crée ton histoire",
    icon: IconBook,
  },
  {
    title: "Tu reçois ton PDF par email",
    icon: IconMail,
  },
] as const;

const univers = [
  { emoji: "👑", label: "Princesse" },
  { emoji: "🦄", label: "Licorne" },
  { emoji: "🦸", label: "Super-héros" },
  { emoji: "🐾", label: "Animaux" },
] as const;

const tarifs = [
  { name: "PDF illustré", price: "3,90€", hint: "Histoire personnalisée, prête à imprimer" },
  { name: "PDF + Audio", price: "7,90€", hint: "L’histoire + la narration pour s’endormir" },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-6 sm:px-6 sm:pb-28 sm:pt-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -20%, #C49AD8 0%, transparent 55%), radial-gradient(ellipse 60% 40% at 100% 50%, #E8A0C0 0%, transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="mb-6 font-display text-sm uppercase tracking-[0.2em] text-qissali-mauve/90">
            Bienvenue
          </p>
          <h1 className="sr-only">Qissali — Mon histoire islamique personnalisée</h1>
          <Image
            src="/logo-qissali.png"
            alt="Qissali, mon histoire personnalisée"
            width={560}
            height={280}
            className="mx-auto h-auto w-full max-w-lg drop-shadow-sm"
            priority
          />
          <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-slate-600 sm:text-xl">
            Mon histoire islamique personnalisée
          </p>
          <div className="mt-10">
            <CommanderModalTrigger className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve px-8 py-4 text-base font-medium text-white shadow-lg shadow-qissali-mauve/25 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qissali-mauve active:scale-[0.98]">
              Créer l&apos;histoire de mon enfant
            </CommanderModalTrigger>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-t border-qissali-rose/20 bg-white/40 px-4 py-16 backdrop-blur-sm sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl font-normal text-qissali-mauve md:text-4xl">
            Comment ça marche
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Trois étapes simples pour offrir une histoire unique.
          </p>
          <ul className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {steps.map(({ title, icon: Icon }) => (
              <li
                key={title}
                className="flex flex-col items-center rounded-2xl border border-white/80 bg-gradient-to-b from-white/90 to-qissali-cream/80 p-8 text-center shadow-md shadow-qissali-mauve/10"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-qissali-cream">
                  <Icon />
                </div>
                <p className="text-lg font-medium leading-snug text-slate-800">{title}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Les univers */}
      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center font-display text-3xl font-normal text-qissali-mauve md:text-4xl">
            Les univers
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Choisis l&apos;ambiance qui fera rêver ton enfant.
          </p>
          <ul className="mt-12 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {univers.map(({ emoji, label }) => (
              <li
                key={label}
                className="flex flex-col items-center justify-center rounded-2xl border border-qissali-rose/30 bg-white/70 p-8 text-center shadow-sm transition hover:border-qissali-mauve/40 hover:shadow-md"
              >
                <span className="text-5xl sm:text-6xl" role="img" aria-hidden>
                  {emoji}
                </span>
                <span className="mt-4 font-medium text-slate-800">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Tarifs */}
      <section className="border-t border-qissali-rose/20 bg-white/30 px-4 py-16 backdrop-blur-sm sm:px-6">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center font-display text-3xl font-normal text-qissali-mauve md:text-4xl">
            Tarifs
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
            Une offre claire pour chaque envie.
          </p>
          <ul className="mt-12 grid gap-6 md:grid-cols-2">
            {tarifs.map(({ name, price, hint }) => (
              <li
                key={name}
                className="flex flex-col rounded-2xl border border-qissali-mauve/25 bg-gradient-to-br from-white to-qissali-cream/90 p-8 shadow-lg shadow-qissali-rose/15"
              >
                <span className="font-display text-xl text-qissali-mauve">{name}</span>
                <span className="mt-4 font-display text-4xl italic text-qissali-rose">{price}</span>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-600">{hint}</p>
                <CommanderModalTrigger className="mt-8 inline-flex w-full items-center justify-center rounded-full border-2 border-qissali-mauve/40 bg-white/80 py-3 text-center text-sm font-semibold text-qissali-mauve transition hover:bg-qissali-mauve/10">
                  Choisir
                </CommanderModalTrigger>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-qissali-mauve/15 px-4 py-10 sm:px-6">
        <p className="text-center text-sm text-slate-500">
          Qissali © 2025 — qissali.fr
        </p>
      </footer>
    </main>
  );
}
