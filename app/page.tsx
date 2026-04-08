import { CommanderModalTrigger } from "@/components/Modal";
import { PdfPreview } from "@/components/PdfPreview";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

const howToSteps = [
  {
    emoji: "📝",
    step: 1,
    title: "Tu remplis le formulaire",
    description:
      "Prénom, âge, univers préféré, valeur à transmettre, occasion. Tu peux aussi indiquer un profil neuroatypique (Dys, TDAH, TSA, HPI…) pour adapter le récit. 2 minutes chrono.",
  },
  {
    emoji: "🌙",
    step: 2,
    title: "On crée l\u2019histoire",
    description:
      "Une histoire unique avec le prénom de ton enfant, son univers, et un hadith intégré naturellement.",
  },
  {
    emoji: "💌",
    step: 3,
    title: "Tu reçois ton PDF",
    description:
      "Un beau livre illustré à lire ensemble, imprimer, offrir. Livré par email en moins de 5 minutes.",
  },
] as const;

const universeCards = [
  {
    id: "princesse",
    emoji: "👑",
    title: "Princesse",
    description:
      "Royaumes enchantés, robes à étoiles et leçons de cœur.",
    gradient: "linear-gradient(160deg, #FFF0F7 0%, #FFE0EF 100%)",
    hoverBorder: "hover:border-[#E8A0C0]",
  },
  {
    id: "licorne",
    emoji: "🦄",
    title: "Licorne & Magie",
    description: "Crins arc-en-ciel, magie douce et merveilles du cœur.",
    gradient: "linear-gradient(160deg, #F5F0FF 0%, #EDE0FF 100%)",
    hoverBorder: "hover:border-[var(--mauve)]",
  },
  {
    id: "super-heros",
    emoji: "🦸",
    title: "Super-Héros",
    description: "Cape, courage et la vraie force des grands cœurs.",
    gradient: "linear-gradient(160deg, #F0F4FF 0%, #E0ECFF 100%)",
    hoverBorder: "hover:border-[var(--bleu)]",
  },
  {
    id: "animaux",
    emoji: "🐾",
    title: "Animaux Parlants",
    description: "Renards sages, lapins curieux et secrets de la forêt.",
    gradient: "linear-gradient(160deg, #F0FFF5 0%, #E0FFEC 100%)",
    hoverBorder: "hover:border-[#90E0A0]",
  },
] as const;

const storyPreviewFeatures = [
  {
    icon: "📖",
    title: "Une vraie histoire complète",
    body: "Une vraie histoire riche et immersive, avec des descriptions, des dialogues et des émotions. Pas juste quelques phrases.",
  },
  {
    icon: "🕌",
    title: "Un hadith intégré naturellement",
    body: "La sagesse islamique arrive au moment du doute, dans la voix d'un personnage aimé. Jamais sous forme de leçon.",
  },
  {
    icon: "💬",
    title: "Débat et défi de la semaine",
    body: "Chaque histoire se termine par des questions ouvertes et un défi concret pour ancrer la valeur dans le quotidien.",
  },
  {
    icon: "👭",
    title: "Version fratrie disponible",
    body: "Deux sœurs, deux frères, frère et sœur : les deux héros de l'histoire, ensemble.",
  },
  {
    icon: "🧠",
    title: "Pensé pour la neuroatypie",
    body: "À la commande, indique si tu le souhaites un profil (Dys, TDAH, autisme/TSA, haut potentiel…) : l'histoire pourra être adaptée au rythme et au vécu de ton enfant, toujours dans le respect de la foi.",
  },
  {
    icon: "🎁",
    title: "Le cadeau parfait",
    body: "Aïd, anniversaire, naissance, première prière : une histoire personnalisée fait le cadeau le plus mémorable.",
  },
] as const;

const packOffers = [
  {
    pack: "solo",
    icon: "📖",
    title: "Solo",
    price: "3,90€",
    subPrice: "1 histoire",
    badge: null as string | null,
    bullets: [
      "1 histoire personnalisée",
      "1 enfant ou fratrie",
      "PDF illustré 6 pages",
      "Livré par email",
    ],
    featured: false,
  },
  {
    pack: "duo",
    icon: "📚",
    title: "Duo",
    price: "6,90€",
    subPrice: "2 histoires · 3,45€ chacune",
    badge: "-11%",
    bullets: [
      "2 histoires personnalisées",
      "Prénoms différents possibles",
      "2 PDFs illustrés 6 pages",
      "Livrés ensemble par email",
    ],
    featured: false,
  },
  {
    pack: "trio",
    icon: "🌟",
    title: "Trio",
    price: "8,90€",
    subPrice: "3 histoires · 2,97€ chacune",
    badge: "Le plus choisi ✦",
    bullets: [
      "3 histoires personnalisées",
      "Prénoms différents possibles",
      "3 PDFs illustrés 6 pages",
      "Livrés ensemble par email",
    ],
    featured: true,
  },
  {
    pack: "famille",
    icon: "👨‍👩‍👧‍👦",
    title: "Famille",
    price: "12,90€",
    subPrice: "5 histoires · 2,58€ chacune",
    badge: "-34%",
    bullets: [
      "5 histoires personnalisées",
      "Prénoms différents possibles",
      "5 PDFs illustrés 6 pages",
      "Livrés ensemble par email",
    ],
    featured: false,
  },
] as const;

const packPriceTable = [
  { pack: "Solo", stories: "1", total: "3,90€", unit: "3,90€" },
  { pack: "Duo", stories: "2", total: "6,90€", unit: "3,45€" },
  { pack: "Trio", stories: "3", total: "8,90€", unit: "2,97€" },
  { pack: "Famille", stories: "5", total: "12,90€", unit: "2,58€" },
] as const;

const testimonials = [
  {
    quote:
      "Ma fille a demandé à réentendre l'histoire tous les soirs pendant une semaine. Le fait qu'elle s'appelle Inès dans l'histoire, c'est magique pour elle.",
    avatar: "👩",
    name: "Fatima R.",
    city: "Lyon",
  },
  {
    quote:
      "J'ai offert l'histoire de l'Aïd el-Adha à mes deux fils. La version fratrie, c'est exactement ce que je cherchais. Ils se sont reconnus dans chaque réplique.",
    avatar: "👩‍🦱",
    name: "Samira K.",
    city: "Paris",
  },
  {
    quote:
      "Le débat à la fin de l'histoire, c'est génial. Ma fille de 6 ans m'a expliqué pendant 20 minutes pourquoi la princesse avait bien fait. Je n'aurais pas pu lui enseigner ça autrement.",
    avatar: "🧕",
    name: "Nadia M.",
    city: "Bruxelles",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative flex min-h-[calc(100vh-120px)] flex-col overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 75% 55% at 50% 0%, rgba(232, 160, 192, 0.42) 0%, transparent 58%),
              radial-gradient(ellipse 55% 70% at 100% 35%, rgba(196, 154, 216, 0.38) 0%, transparent 52%),
              radial-gradient(ellipse 80% 55% at 50% 100%, rgba(160, 196, 232, 0.4) 0%, transparent 55%)
            `,
          }}
        />
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 pb-8 pt-4 text-center sm:px-6">
          <h1 className="sr-only">Qissali — Histoires islamiques personnalisées</h1>
          <Image
            src="/logo-qissali.png"
            alt="Qissali"
            width={400}
            height={200}
            priority
            className="hero-fade-up hero-delay-1 h-[120px] w-auto max-w-full object-contain drop-shadow-sm sm:h-[140px] lg:h-[160px]"
          />
          <p
            className="hero-fade-up hero-delay-2 mx-auto mt-8 max-w-[560px] text-lg leading-[1.8] text-[var(--text)] sm:text-xl"
          >
            Offre à ton enfant une histoire rien que pour lui, avec son prénom, son univers
            préféré et les valeurs de l&apos;islam, transmises avec douceur.
          </p>
          <CommanderModalTrigger
            className="hero-fade-up hero-delay-3 mt-10 inline-flex items-center justify-center rounded-[50px] bg-gradient-to-r from-[var(--rose-deep)] to-[var(--mauve-deep)] px-12 py-[18px] text-base font-bold text-white shadow-lg shadow-[#9B6EC8]/45 transition hover:-translate-y-[3px] hover:shadow-xl hover:shadow-[#9B6EC8]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve-deep)] active:translate-y-0"
          >
            ✨ Créer l&apos;histoire de mon enfant
          </CommanderModalTrigger>
          <p className="hero-fade-up hero-delay-4 mt-5 text-[13px] text-[var(--text-light)]">
            Livraison par email en moins de 5 minutes · à partir de 3,90€
          </p>
        </div>
      </section>

      {/* Notre histoire — fond violet + récit (paysage) */}
      <section
        className="storytelling-section border-b border-[rgba(196,154,216,0.35)]"
        aria-labelledby="notre-histoire-titre"
      >
        <div className="storytelling-left">
          <div>
            <p className="storytelling-label">Notre histoire</p>
            <h2 id="notre-histoire-titre" className="storytelling-title">
              Qissali, c&apos;est mon histoire en arabe
            </h2>
            <p className="storytelling-subtitle">
              Qissali vient de l&apos;arabe{" "}
              <span dir="rtl" lang="ar" className="inline-block">
                قصتي
              </span>{" "}
              — qui signifie tout simplement mon histoire. Parce que chaque enfant mérite une histoire
              rien que pour lui.
            </p>
          </div>
          <blockquote className="storytelling-quote">
            <p>
              &ldquo;Le plus grand trésor d&apos;une princesse, ma chérie, ce n&apos;est pas sa couronne.
              C&apos;est son cœur.&rdquo;
            </p>
            <cite className="storytelling-quote-source">Extrait d&apos;une histoire Qissali</cite>
          </blockquote>
        </div>
        <div className="storytelling-right">
          <div className="storytelling-text">
            <p>
              Un soir, ma fille m&apos;a demandé une histoire. Pas n&apos;importe laquelle. Une histoire
              avec elle dedans. Avec son prénom, son univers, ses héros préférés.
            </p>
            <p>
              J&apos;ai cherché. Longtemps. Des livres en arabe trop difficiles pour elle. Des histoires
              islamiques en anglais qu&apos;elle ne comprenait pas. Du contenu générique, sans âme, sans
              personnalisation, sans cette petite étincelle qui fait qu&apos;un enfant écoute avec les
              yeux grands ouverts.
            </p>
            <p>
              Et pourtant, j&apos;avais tellement envie de lui transmettre notre foi d&apos;une façon qui
              lui ressemble. Pas des leçons. Pas des récitations. Des histoires. Celles qui restent,
              celles qu&apos;on raconte à ses propres enfants des années plus tard.
            </p>
            <p>
              Alors j&apos;ai créé Qissali. Pour que mes filles entendent une histoire où elles sont les
              héroïnes. Où leur prénom résonne à chaque page. Où la générosité, le courage, la confiance
              en Allah arrivent naturellement, dans la bouche d&apos;un personnage qu&apos;elles aiment,
              au moment où ça compte vraiment.
            </p>
          </div>
          <p className="storytelling-tags">
            Conçu pour transmettre · Unique pour chaque enfant · Un moment partagé
          </p>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="decouvrir" className="bg-[var(--white)]">
        <div className="mx-auto max-w-[1100px] px-8 py-[100px]">
          <header className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-[4px] text-[var(--mauve)]">
              Comment ça marche
            </p>
            <h2 className="mt-4 font-display text-[28px] font-normal leading-tight text-[var(--text)] sm:text-3xl md:text-4xl">
              Simple comme une histoire du{" "}
              <span className="italic text-[var(--rose-deep)]">soir</span>
            </h2>
          </header>
          <div className="mt-14 flex flex-col items-start gap-6 md:flex-row md:items-start md:gap-6">
            {howToSteps.map((item, index) => (
              <Fragment key={item.step}>
                <article className="flex min-w-0 w-full flex-1 flex-col items-center rounded-[24px] border border-[rgba(232,160,192,0.2)] bg-[var(--rose-pale)] px-6 py-9 text-center transition duration-300 hover:-translate-y-[6px] hover:shadow-lg hover:shadow-[#9B6EC8]/20 md:w-auto">
                  <span className="text-4xl sm:text-5xl" role="img" aria-hidden>
                    {item.emoji}
                  </span>
                  <div
                    className="mt-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--mauve)] text-sm font-bold text-white shadow-sm"
                    aria-hidden
                  >
                    {item.step}
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[var(--text)]">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-mid)]">
                    {item.description}
                  </p>
                </article>
                {index < howToSteps.length - 1 ? (
                  <div
                    className="hidden shrink-0 self-center px-1 text-2xl font-light leading-none text-[var(--mauve)]/45 md:flex md:items-center md:pt-10"
                    aria-hidden
                  >
                    →
                  </div>
                ) : null}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Les univers */}
      <section className="bg-gradient-to-b from-[var(--cream)] to-[var(--rose-pale)]">
        <div className="mx-auto max-w-[1100px] px-8 py-[100px]">
          <header className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-[4px] text-[var(--mauve)]">
              Les univers
            </p>
            <h2 className="mt-4 font-display text-[28px] font-normal leading-tight text-[var(--text)] sm:text-3xl md:text-4xl">
              Chaque enfant a son monde{" "}
              <span className="italic text-[var(--rose-deep)]">magique</span>
            </h2>
          </header>
          <ul className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-4">
            {universeCards.map((card) => (
              <li key={card.id} className="min-w-0">
                <CommanderModalTrigger
                  aria-label={`Commander une histoire — ${card.title}`}
                  className={`flex h-full w-full flex-col items-center rounded-2xl border-2 border-transparent p-8 text-center shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-md hover:shadow-[#9B6EC8]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve-deep)] ${card.hoverBorder}`}
                  style={{ background: card.gradient }}
                >
                  <span className="text-5xl sm:text-6xl" role="img" aria-hidden>
                    {card.emoji}
                  </span>
                  <h3 className="mt-5 text-lg font-bold text-[var(--text)]">{card.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--text-mid)]">
                    {card.description}
                  </p>
                </CommanderModalTrigger>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Neuroatypie */}
      <section className="border-y border-[rgba(196,154,216,0.25)] bg-gradient-to-br from-[var(--mauve-light)]/35 via-[var(--rose-pale)] to-[var(--cream)]">
        <div className="mx-auto max-w-[1100px] px-8 py-[72px]">
          <div className="mx-auto max-w-[720px] text-center">
            <p className="text-[13px] font-medium uppercase tracking-[4px] text-[var(--mauve)]">
              Neuroatypie
            </p>
            <h2 className="mt-4 font-display text-[26px] font-normal leading-tight text-[var(--text)] sm:text-3xl md:text-[2rem]">
              Une histoire qui peut suivre{" "}
              <span className="italic text-[var(--rose-deep)]">ton enfant</span>, pas l&apos;inverse
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed text-[var(--text-mid)]">
              Chaque enfant apprend à son rythme. Si le tien est Dys, TDAH, autiste (TSA), à haut potentiel ou
              a d&apos;autres besoins particuliers, tu peux le dire au moment de la commande : nous adaptons le
              texte pour qu&apos;il reste lisible, rassurant et en lien avec l&apos;islam — sans étiqueter,
              sans juger.
            </p>
            <Link
              href="/commander"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--rose-deep)] to-[var(--mauve-deep)] px-8 py-3.5 text-sm font-semibold text-white shadow-md shadow-[#9B6EC8]/35 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve-deep)]"
            >
              Commander avec profil neuroatypique
            </Link>
          </div>
        </div>
      </section>

      {/* À quoi ressemble une histoire Qissali */}
      <section className="bg-[var(--white)]">
        <div className="mx-auto max-w-[1100px] px-8 py-[100px]">
          <header className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-[4px] text-[var(--mauve)]">
              Un exemple concret
            </p>
            <h2 className="mt-4 font-display text-[28px] font-normal leading-tight text-[var(--text)] sm:text-3xl md:text-[2.25rem]">
              À quoi ressemble une histoire{" "}
              <span className="italic text-[var(--rose-deep)]">Qissali</span>
            </h2>
          </header>
          <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Livre */}
            <div
              className="rounded-[24px] border border-[var(--rose-light)] bg-[var(--rose-pale)] p-10 text-left"
              style={{ boxShadow: "8px 8px 0 0 var(--rose-light)" }}
            >
              <div className="flex flex-wrap items-center gap-2 border-b border-[var(--rose-light)]/60 pb-4">
                <span className="font-display text-xl italic text-[var(--rose-deep)]">Qissali</span>
                <span className="rounded-full bg-[var(--mauve-light)] px-3 py-1 text-xs font-medium text-[var(--mauve-deep)]">
                  👑 Princesse
                </span>
                <span className="rounded-full bg-[var(--mauve-light)] px-3 py-1 text-xs font-medium text-[var(--mauve-deep)]">
                  🌙 Aïd
                </span>
              </div>
              <h3 className="mt-6 font-display text-[22px] font-normal leading-snug text-[var(--text)] sm:text-2xl">
                L&apos;histoire de Nour et le plus grand trésor du royaume
              </h3>
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-[var(--text-mid)]">
                <p>
                  Il était une fois, dans un royaume où les jardins sentaient toujours le jasmin et le miel, une petite
                  princesse prénommée Nour.
                </p>
                <p>
                  Ce matin-là, c&apos;était l&apos;Aïd. Papa lui tendit une petite bourse en velours violet. À
                  l&apos;intérieur : dix pièces dorées, rien que pour elle.
                </p>
                <p>C&apos;est là qu&apos;elle vit Lina, seule sous l&apos;oranger, les yeux rouges...</p>
                <p>
                  Alors, dans sa tête, la voix de sa grand-mère s&apos;éleva doucement.
                </p>
              </div>
              <blockquote className="mt-8 border-l-[3px] border-[var(--mauve)] bg-[var(--mauve-light)]/80 px-4 py-4">
                <p className="font-display text-[15px] italic leading-relaxed text-[var(--text)]">
                  &quot;Le Prophète ﷺ nous a enseigné que jamais une aumône n&apos;a appauvri son donneur.
                  Jamais.&quot;
                </p>
                <p className="mt-3 text-xs font-medium text-[var(--text-mid)]">Source : At-Tirmidhi</p>
              </blockquote>
            </div>
            {/* Features */}
            <ul className="flex flex-col divide-y divide-[var(--rose-light)]/50">
              {storyPreviewFeatures.map(({ icon, title, body }) => (
                <li key={title} className="flex gap-4 py-6 first:pt-0 last:pb-0">
                  <span className="shrink-0 text-2xl" aria-hidden>
                    {icon}
                  </span>
                  <div>
                    <p className="font-bold text-[var(--text)]">{title}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--text-mid)]">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PdfPreview />

      {/* Témoignages */}
      <section className="bg-[var(--rose-pale)]">
        <div className="mx-auto max-w-[1100px] px-8 py-[100px]">
          <header className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-[4px] text-[var(--mauve)]">
              Elles ont adoré
            </p>
            <h2 className="mt-4 font-display text-[28px] font-normal leading-tight text-[var(--text)] sm:text-3xl md:text-4xl">
              Ce que disent les premières{" "}
              <span className="italic text-[var(--rose-deep)]">mamans</span>
            </h2>
          </header>
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map(({ quote, avatar, name, city }) => (
              <li key={name}>
                <article className="flex h-full flex-col rounded-[20px] border border-[var(--rose-light)]/60 bg-[var(--white)] p-[28px] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <p className="text-lg text-[var(--or)]" aria-label="5 sur 5 étoiles">
                    ★★★★★
                  </p>
                  <blockquote className="mt-4 flex-1 font-display text-[17px] italic leading-relaxed text-[var(--text)]">
                    &quot;{quote}&quot;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--rose)] to-[var(--mauve)] text-2xl shadow-inner"
                      aria-hidden
                    >
                      {avatar}
                    </div>
                    <div>
                      <p className="font-bold text-[var(--text)]">{name}</p>
                      <p className="text-sm text-[var(--text-mid)]">{city}</p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Packs */}
      <section className="border-t border-[rgba(232,160,192,0.35)] bg-[var(--white)]">
        <div className="mx-auto max-w-[1100px] px-8 py-[100px]">
          <header className="text-center">
            <h2 className="font-display text-[28px] font-normal leading-tight text-[var(--text)] sm:text-3xl md:text-4xl">
              Choisissez votre pack
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[var(--text-mid)]">
              Plus vous commandez, plus vous économisez.
            </p>
          </header>

          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {packOffers.map((p) => (
              <li key={p.pack} className="flex min-w-0">
                <article
                  className={`flex h-full w-full flex-col rounded-[24px] bg-white p-7 ${
                    p.featured
                      ? "border-2 border-[var(--rose)] shadow-lg shadow-[#9B6EC8]/30 ring-1 ring-[rgba(232,160,192,0.35)]"
                      : "border border-[rgba(232,160,192,0.45)] shadow-sm"
                  }`}
                >
                  {p.badge ? (
                    <div className="mb-3 flex min-h-[28px] justify-center">
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ${
                          p.featured
                            ? "bg-gradient-to-r from-[var(--rose)] to-[var(--mauve)] text-xs uppercase text-white shadow-md"
                            : "bg-[var(--mauve-light)]/90 text-[var(--mauve-deep)]"
                        }`}
                      >
                        {p.badge}
                      </span>
                    </div>
                  ) : (
                    <div className="mb-3 min-h-[28px]" aria-hidden />
                  )}
                  <span className="text-4xl" aria-hidden>
                    {p.icon}
                  </span>
                  <h3 className="mt-3 text-xl font-bold text-[var(--text)]">{p.title}</h3>
                  <p className="font-display mt-3 text-[40px] font-bold leading-none text-[var(--or)] sm:text-[44px]">
                    {p.price}
                  </p>
                  <p className="mt-2 text-sm text-[var(--text-mid)]">{p.subPrice}</p>
                  <ul className="mt-5 flex flex-1 flex-col gap-2.5 text-left text-[13px] leading-snug text-[var(--text-mid)]">
                    {p.bullets.map((line) => (
                      <li key={line} className="flex gap-2">
                        <span className="text-[var(--rose-deep)]" aria-hidden>
                          ·
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/commander?pack=${p.pack}`}
                    className="mt-8 inline-flex w-full items-center justify-center rounded-full border-2 border-[var(--mauve)]/35 bg-gradient-to-r from-[var(--rose)] to-[var(--mauve)] py-3.5 text-sm font-bold text-white shadow-md shadow-[#9B6EC8]/25 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve-deep)]"
                  >
                    Commander →
                  </Link>
                </article>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-14 max-w-[640px] overflow-hidden rounded-2xl" style={{ background: "#FDF0F7" }}>
            <table className="w-full border-collapse text-left text-[12px] text-[var(--text-mid)] sm:text-[13px]">
              <thead>
                <tr className="border-b border-[rgba(232,160,192,0.35)] text-[var(--text)]">
                  <th className="px-4 py-3 font-semibold sm:px-5">Pack</th>
                  <th className="px-2 py-3 font-semibold sm:px-3">Histoires</th>
                  <th className="px-2 py-3 font-semibold sm:px-3">Prix total</th>
                  <th className="px-4 py-3 font-semibold sm:px-5">Prix unitaire</th>
                </tr>
              </thead>
              <tbody>
                {packPriceTable.map((row) => (
                  <tr
                    key={row.pack}
                    className="border-b border-[rgba(232,160,192,0.2)] last:border-0"
                  >
                    <td className="px-4 py-2.5 sm:px-5">{row.pack}</td>
                    <td className="px-2 py-2.5 sm:px-3">{row.stories}</td>
                    <td className="px-2 py-2.5 sm:px-3">{row.total}</td>
                    <td className="px-4 py-2.5 sm:px-5">{row.unit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mx-auto mt-10 flex max-w-[720px] flex-col gap-3 text-center text-[13px] text-[var(--text-mid)] sm:text-[14px] md:flex-row md:flex-wrap md:justify-center md:gap-x-8 md:gap-y-2">
            <li className="flex items-center justify-center gap-2">
              <span aria-hidden>🛡️</span>
              <span>Satisfait ou remboursé 48h</span>
            </li>
            <li className="flex items-center justify-center gap-2">
              <span aria-hidden>🔒</span>
              <span>Paiement sécurisé Stripe</span>
            </li>
            <li className="flex items-center justify-center gap-2">
              <span aria-hidden>💌</span>
              <span>Livraison par email en moins de 5 minutes</span>
            </li>
          </ul>
        </div>
      </section>

      {/* CTA final */}
      <section
        className="relative overflow-hidden px-8 py-[120px] text-center"
        style={{
          background: "linear-gradient(135deg, var(--rose-deep), var(--mauve-deep))",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.45]"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at center, rgba(255,255,255,0.22) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p
            className="font-display text-[48px] text-[rgba(255,255,255,0.2)]"
            dir="rtl"
            style={{ letterSpacing: "8px" }}
          >
            بسم الله
          </p>
          <h2 className="mt-8 font-display text-[32px] font-normal leading-tight text-white sm:text-[42px] lg:text-[52px]">
            Offre-lui une histoire{" "}
            <span className="italic text-[var(--or)]">qu&apos;il n&apos;oubliera jamais</span>
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[rgba(255,255,255,0.75)]">
            Son prénom. Son univers. Ses valeurs. Une histoire rien que pour lui, livrée par email en
            moins de 5 minutes.
          </p>
          <CommanderModalTrigger
            className="mt-10 inline-flex items-center justify-center rounded-[50px] bg-white px-14 py-5 text-[17px] font-extrabold text-[var(--rose-deep)] transition hover:-translate-y-1 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-0 active:scale-100"
            style={{ boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}
          >
            Créer l&apos;histoire de mon enfant ✨
          </CommanderModalTrigger>
          <p className="mt-6 text-sm leading-relaxed text-[rgba(255,255,255,0.5)]">
            PDF livré par email · à partir de 3,90€ · Cadeau parfait pour l&apos;Aïd, un anniversaire
            ou juste comme ça 🌙
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--dark)] px-8 py-12 text-center">
        <Image
          src="/logo-qissali.png"
          alt="Qissali"
          width={160}
          height={80}
          className="mx-auto h-[50px] w-auto object-contain opacity-90 sm:h-14 lg:h-[60px]"
        />
        <nav className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm text-[rgba(255,255,255,0.4)]">
          <Link href="/a-propos" className="transition hover:text-[var(--rose-light)]">
            À propos
          </Link>
          <span aria-hidden className="text-[rgba(255,255,255,0.25)]">
            ·
          </span>
          <Link href="/contact" className="transition hover:text-[var(--rose-light)]">
            Contact
          </Link>
          <span aria-hidden className="text-[rgba(255,255,255,0.25)]">
            ·
          </span>
          <Link href="/cgv" className="transition hover:text-[var(--rose-light)]">
            CGV
          </Link>
          <span aria-hidden className="text-[rgba(255,255,255,0.25)]">
            ·
          </span>
          <Link href="/mentions-legales" className="transition hover:text-[var(--rose-light)]">
            Mentions légales
          </Link>
        </nav>
        <p className="mt-10 text-xs text-[rgba(255,255,255,0.2)]">
          © 2025 Qissali · qissali.fr · Fait avec ❤️ pour nos enfants
        </p>
      </footer>
    </main>
  );
}
