import { CommanderModalTrigger } from "@/components/Modal";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

const howToSteps = [
  {
    emoji: "📝",
    step: 1,
    title: "Tu remplis le formulaire",
    description:
      "Prénom, âge, univers préféré, valeur à transmettre, occasion. 2 minutes chrono.",
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
      "Un beau livre illustré à lire ensemble, imprimer, offrir. Livré par email en quelques minutes.",
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
    icon: "🎁",
    title: "Le cadeau parfait",
    body: "Aïd, anniversaire, naissance, première prière : une histoire personnalisée fait le cadeau le plus mémorable.",
  },
] as const;

const pdfPlanBullets = [
  "Histoire complète personnalisée",
  "Prénom partout dans le texte",
  "Hadith intégré naturellement",
  "Débat et défi de la semaine",
  "PDF illustré 4 pages",
  "Livraison par email",
] as const;

const audioPlanBullets = [
  "Tout le contenu PDF inclus",
  "Histoire audio environ 10 min",
  "Voix douce et naturelle",
  "Format MP3 téléchargeable",
  "Parfait pour l'endormissement",
  "Livraison par email",
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
            src="/logo.png"
            alt="Qissali"
            width={440}
            height={220}
            priority
            className="hero-fade-up hero-delay-1 h-[220px] w-auto max-w-[min(440px,92vw)] object-contain drop-shadow-sm"
          />
          <p
            className="hero-fade-up hero-delay-2 mt-8 text-[13px] font-medium uppercase tracking-[4px] text-[var(--mauve)]"
          >
            ✦ Histoires islamiques personnalisées ✦
          </p>
          <p
            className="hero-fade-up hero-delay-3 mx-auto mt-6 max-w-[560px] text-lg leading-[1.8] text-[var(--text)] sm:text-xl"
          >
            Offre à ton enfant une histoire rien que pour lui, avec son prénom, son univers
            préféré et les valeurs de l&apos;islam, transmises avec douceur.
          </p>
          <CommanderModalTrigger
            className="hero-fade-up hero-delay-4 mt-10 inline-flex items-center justify-center rounded-[50px] bg-gradient-to-r from-[var(--rose-deep)] to-[var(--mauve-deep)] px-12 py-[18px] text-base font-bold text-white shadow-lg shadow-[#9B6EC8]/45 transition hover:-translate-y-[3px] hover:shadow-xl hover:shadow-[#9B6EC8]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve-deep)] active:translate-y-0"
          >
            ✨ Créer l&apos;histoire de mon enfant
          </CommanderModalTrigger>
          <p className="hero-fade-up hero-delay-5 mt-5 text-[13px] text-[var(--text-light)]">
            Livraison par email en quelques minutes · à partir de 3,90€
          </p>
        </div>
        <div className="relative z-10 flex flex-col items-center pb-10">
          <div className="hero-fade-up hero-delay-6">
            <a
              href="#decouvrir"
              className="flex animate-bounce flex-col items-center gap-2 text-[var(--text-mid)] transition hover:text-[var(--mauve-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve)]"
            >
              <span
                className="block h-12 w-px rounded-full bg-gradient-to-b from-[var(--mauve)] via-[var(--mauve)]/50 to-transparent"
                aria-hidden
              />
              <span className="text-xs font-medium uppercase tracking-widest">
                Découvrir
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="relative overflow-hidden bg-[var(--dark)]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background: `
              radial-gradient(ellipse 60% 50% at 15% 20%, rgba(232, 160, 192, 0.12) 0%, transparent 55%),
              radial-gradient(ellipse 55% 45% at 85% 75%, rgba(196, 154, 216, 0.14) 0%, transparent 50%),
              radial-gradient(ellipse 45% 40% at 50% 50%, rgba(232, 160, 192, 0.06) 0%, transparent 60%)
            `,
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1100px] px-8 py-[100px]">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-[80px]">
            <div>
              <p className="text-[13px] font-medium uppercase tracking-[4px] text-[var(--rose-light)]">
                Notre histoire
              </p>
              <h2 className="mt-4 font-display text-[32px] font-normal leading-tight text-[var(--white)] sm:text-[38px] lg:text-[44px]">
                Qissali, c&apos;est{" "}
                <span className="italic text-[var(--rose-deep)]">mon histoire</span> en arabe
              </h2>
              <div className="mt-8 space-y-6 text-[17px] leading-relaxed text-[rgba(255,255,255,0.65)]">
                <p>
                  Qissali vient de l&apos;arabe قصتي — qui signifie tout simplement &quot;mon histoire&quot;.
                  Parce que chaque enfant mérite une histoire rien que pour lui.
                </p>
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
              <blockquote className="mt-10 border-l-[3px] border-[var(--rose)] bg-[rgba(255,255,255,0.05)] py-5 pl-6 pr-4">
                <p className="font-display text-lg italic leading-relaxed text-[var(--rose-light)] sm:text-xl">
                  &quot;Le plus grand trésor d&apos;une princesse, ma chérie, ce n&apos;est pas sa couronne.
                  C&apos;est son cœur.&quot;
                </p>
                <p className="mt-4 text-[12px] font-medium uppercase tracking-wider text-[var(--mauve)]">
                  Extrait d&apos;une histoire Qissali
                </p>
              </blockquote>
            </div>
            <div className="flex flex-col gap-6">
              <article
                className="rounded-[20px] border border-[rgba(232,160,192,0.15)] bg-[rgba(255,255,255,0.06)] p-6 transition-transform duration-300 hover:translate-x-[6px] sm:p-7"
              >
                <h3 className="text-lg font-bold text-[var(--white)]">
                  <span className="mr-2" aria-hidden>
                    🌙
                  </span>
                  Conçu pour transmettre
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[rgba(255,255,255,0.65)]">
                  Chaque histoire intègre un hadith ou un verset au moment clé, naturellement, dans la bouche
                  d&apos;un personnage aimé.
                </p>
              </article>
              <article
                className="rounded-[20px] border border-[rgba(232,160,192,0.15)] bg-[rgba(255,255,255,0.06)] p-6 transition-transform duration-300 hover:translate-x-[6px] sm:p-7"
              >
                <h3 className="text-lg font-bold text-[var(--white)]">
                  <span className="mr-2" aria-hidden>
                    ✨
                  </span>
                  Unique pour chaque enfant
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[rgba(255,255,255,0.65)]">
                  Le prénom de ton enfant est partout dans l&apos;histoire. Il n&apos;écoute plus une histoire,
                  il vit la sienne.
                </p>
              </article>
              <article
                className="rounded-[20px] border border-[rgba(232,160,192,0.15)] bg-[rgba(255,255,255,0.06)] p-6 transition-transform duration-300 hover:translate-x-[6px] sm:p-7"
              >
                <h3 className="text-lg font-bold text-[var(--white)]">
                  <span className="mr-2" aria-hidden>
                    💬
                  </span>
                  Un moment partagé
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-[rgba(255,255,255,0.65)]">
                  Chaque histoire se termine par un débat ouvert avec l&apos;enfant et un défi de la semaine
                  pour ancrer les valeurs dans le réel.
                </p>
              </article>
            </div>
          </div>
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
          <div className="mt-14 flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-0">
            {howToSteps.map((item, index) => (
              <Fragment key={item.step}>
                <article className="flex min-w-0 flex-1 flex-col items-center rounded-[24px] border border-[rgba(232,160,192,0.2)] bg-[var(--rose-pale)] px-6 py-9 text-center transition duration-300 hover:-translate-y-[6px] hover:shadow-lg hover:shadow-[#9B6EC8]/20">
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
                    className="hidden shrink-0 self-center px-3 text-2xl font-light leading-none text-[var(--mauve)]/45 lg:flex lg:items-center"
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
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
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

      {/* Tarifs */}
      <section className="relative bg-[var(--dark)]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(196, 154, 216, 0.14) 0%, transparent 62%)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-[1100px] px-8 py-[100px]">
          <header className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-[4px] text-[var(--or)]">Nos offres</p>
            <h2 className="mt-4 font-display text-[28px] font-normal leading-tight text-[var(--white)] sm:text-3xl md:text-4xl">
              Simple et{" "}
              <span className="italic text-[var(--rose)]">transparent</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[rgba(255,255,255,0.6)]">
              Pas d&apos;abonnement. Tu paies, tu reçois ton histoire. C&apos;est tout.
            </p>
          </header>
          <div className="mx-auto mt-14 grid max-w-[720px] grid-cols-1 gap-8 md:grid-cols-2 md:gap-8">
            {/* PDF Illustré */}
            <article className="flex flex-col rounded-[24px] border border-[rgba(232,160,192,0.15)] bg-[rgba(255,255,255,0.04)] p-8">
              <span className="text-4xl" aria-hidden>
                📄
              </span>
              <h3 className="mt-4 text-xl font-bold text-[var(--white)]">PDF Illustré</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[rgba(255,255,255,0.65)]">
                Un beau livre à lire ensemble, à imprimer ou à conserver précieusement.
              </p>
              <p className="font-display text-[48px] font-bold leading-none text-[var(--or)]">3,90€</p>
              <p className="mt-1 text-sm text-[rgba(255,255,255,0.45)]">par histoire</p>
              <ul className="mt-6 flex flex-col gap-3 text-left text-[14px] leading-snug text-[rgba(255,255,255,0.75)]">
                {pdfPlanBullets.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-[var(--rose-light)]" aria-hidden>
                      ·
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <CommanderModalTrigger
                aria-label="Commander — PDF illustré"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full border-2 border-[var(--rose)] bg-transparent py-3.5 text-sm font-bold text-[var(--rose-light)] transition hover:bg-[rgba(232,160,192,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--rose)]"
              >
                Commander →
              </CommanderModalTrigger>
            </article>
            {/* PDF + Audio */}
            <article className="relative flex flex-col rounded-[24px] border border-[var(--rose)]/35 bg-[rgba(232,160,192,0.15)] p-8">
              <div className="-mt-2 mb-2 flex justify-center">
                <span className="rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--mauve)] px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                  ✦ Le plus choisi
                </span>
              </div>
              <span className="text-4xl" aria-hidden>
                ✨
              </span>
              <h3 className="mt-4 text-xl font-bold text-[var(--white)]">PDF + Audio</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[rgba(255,255,255,0.75)]">
                L&apos;histoire racontée par une voix chaleureuse, parfaite pour les histoires du soir.
              </p>
              <p className="font-display text-[48px] font-bold leading-none text-[var(--or)]">7,90€</p>
              <p className="mt-1 text-sm text-[rgba(255,255,255,0.45)]">par histoire</p>
              <ul className="mt-6 flex flex-col gap-3 text-left text-[14px] leading-snug text-[rgba(255,255,255,0.85)]">
                {audioPlanBullets.map((line) => (
                  <li key={line} className="flex gap-2">
                    <span className="text-[var(--rose-light)]" aria-hidden>
                      ·
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <CommanderModalTrigger
                aria-label="Commander — PDF + Audio"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--mauve)] py-3.5 text-sm font-bold text-white shadow-md shadow-[#9B6EC8]/35 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve-light)]"
              >
                Commander →
              </CommanderModalTrigger>
            </article>
          </div>
        </div>
      </section>

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
            Son prénom. Son univers. Ses valeurs. Une histoire rien que pour lui, prête en quelques
            minutes.
          </p>
          <CommanderModalTrigger
            className="mt-10 inline-flex items-center justify-center rounded-[50px] bg-white px-14 py-5 text-[17px] font-extrabold text-[var(--rose-deep)] transition hover:-translate-y-1 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white active:translate-y-0 active:scale-100"
            style={{ boxShadow: "0 8px 28px rgba(0,0,0,0.2)" }}
          >
            Créer l&apos;histoire de mon enfant ✨
          </CommanderModalTrigger>
          <p className="mt-6 text-sm leading-relaxed text-[rgba(255,255,255,0.5)]">
            PDF livré par email · à partir de 3,90€ · Aïd el-Adha bientôt 🐑
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--dark)] px-8 py-12 text-center">
        <Image
          src="/logo.png"
          alt="Qissali"
          width={200}
          height={64}
          className="mx-auto h-16 w-auto object-contain opacity-[0.85]"
        />
        <p className="mt-4 text-[11px] font-medium uppercase tracking-[3px] text-[rgba(255,255,255,0.3)]">
          Mon histoire islamique personnalisée
        </p>
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
