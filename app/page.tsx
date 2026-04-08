import { CommanderModalTrigger } from "@/components/Modal";
import DecoBackground from "@/components/DecoBackground";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

const commentSteps = [
  {
    num: "01",
    titre: "Tu remplis le formulaire",
    texte: "Prénom, univers, valeur, occasion. 2 minutes.",
  },
  {
    num: "02",
    titre: "On crée l'histoire",
    texte: "Une histoire unique avec un hadith intégré naturellement.",
  },
  {
    num: "03",
    titre: "Tu reçois ton PDF",
    texte: "Un beau livre à lire, imprimer, offrir. En moins de 5 min.",
  },
] as const;

const universItems = [
  {
    emoji: "👑",
    titre: "Princesse",
    texte: "Royaumes enchantés, robes étoilées et leçons de cœur.",
    bg: "linear-gradient(135deg, #FDE8F4, #F5D0E4)",
  },
  {
    emoji: "🦄",
    titre: "Licorne & Magie",
    texte: "Crins arc-en-ciel, magie douce et merveilles.",
    bg: "linear-gradient(135deg, #E8D8F5, #D4B8E8)",
  },
  {
    emoji: "🦸",
    titre: "Super-Héros",
    texte: "Cape, courage et la vraie force des grands cœurs.",
    bg: "linear-gradient(135deg, #D8E8F5, #B8D4E8)",
  },
  {
    emoji: "🐾",
    titre: "Animaux Parlants",
    texte: "Renards sages, lapins curieux, secrets de forêt.",
    bg: "linear-gradient(135deg, #D8F5E8, #B8E8D4)",
  },
] as const;

const pdfOfferBullets = [
  "Histoire complète personnalisée",
  "Prénom partout dans le texte",
  "Hadith intégré naturellement",
  "PDF illustré 6 pages",
  "Livraison email en moins de 5 min",
] as const;

const audioOfferBullets = [
  "Tout le contenu PDF inclus",
  "Histoire audio ~10 min",
  "Voix douce et naturelle",
  "Format MP3",
  "Parfait pour le soir",
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
      <section
        style={{
          position: "relative",
          background: "var(--gradient-hero)",
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px",
          overflow: "hidden",
        }}
      >
        <DecoBackground variant="hero" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <h1 className="sr-only" style={{ color: "#fff" }}>
            Qissali — Histoires islamiques personnalisées
          </h1>
          <Image
            src="/logo-qissali.png"
            alt="Qissali"
            width={400}
            height={200}
            priority
            style={{
              height: "160px",
              width: "auto",
              maxWidth: "min(400px, 92vw)",
              marginBottom: "24px",
              objectFit: "contain",
            }}
          />
          <p
            style={{
              fontFamily: "'Nunito', sans-serif",
              fontSize: "clamp(16px, 2.5vw, 20px)",
              color: "rgba(255,255,255,0.85)",
              maxWidth: "540px",
              margin: "0 auto 16px",
              lineHeight: 1.7,
            }}
          >
            Une histoire avec son prénom, son univers, les valeurs de l&apos;islam — transmises avec
            douceur.
          </p>
          <CommanderModalTrigger
            className="btn-primary"
            style={{ fontSize: "17px", padding: "16px 40px", marginTop: "8px" }}
          >
            ✨ Créer l&apos;histoire de mon enfant
          </CommanderModalTrigger>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "16px" }}>
            Livré par email · à partir de 3,90€
          </p>
          <div
            style={{
              marginTop: "48px",
              color: "rgba(255,255,255,0.3)",
              fontSize: "12px",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            ↓ Découvrir
          </div>
        </div>
      </section>

      {/* Storytelling paysage */}
      <section
        className="storytelling-grid border-b border-[rgba(196,154,216,0.35)]"
        aria-labelledby="notre-histoire-titre"
      >
        <div
          style={{
            background: "linear-gradient(160deg, #2A1A3E 0%, #4A2A70 100%)",
            padding: "64px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <DecoBackground variant="dark" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "var(--mauve)",
                marginBottom: "20px",
              }}
            >
              Notre histoire
            </p>
            <h2
              id="notre-histoire-titre"
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(22px, 3vw, 32px)",
                color: "#ffffff",
                lineHeight: 1.3,
                marginBottom: "20px",
              }}
            >
              Qissali, c&apos;est
              <em style={{ color: "var(--rose-light)" }}> mon histoire </em>
              en arabe
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
              Qissali vient de l&apos;arabe{" "}
              <span dir="rtl" lang="ar" className="inline-block">
                قصتي
              </span>{" "}
              — qui signifie simplement &quot;mon histoire&quot;. Parce que chaque enfant mérite une histoire
              rien que pour lui.
            </p>
          </div>
          <div
            style={{
              position: "relative",
              zIndex: 1,
              borderLeft: "2px solid var(--mauve)",
              paddingLeft: "20px",
              marginTop: "auto",
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                color: "var(--rose-light)",
                fontSize: "15px",
                lineHeight: 1.6,
                marginBottom: "8px",
              }}
            >
              &ldquo;Le plus grand trésor d&apos;une princesse, ma chérie, ce n&apos;est pas sa couronne.
              C&apos;est son cœur.&rdquo;
            </p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "1px" }}>
              Extrait d&apos;une histoire Qissali
            </p>
          </div>
        </div>

        <div
          style={{
            background: "var(--bg-cream)",
            padding: "64px 56px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <DecoBackground variant="light" />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div
              style={{
                fontSize: "15px",
                color: "var(--text-mid)",
                lineHeight: 1.9,
                fontFamily: "'Nunito', sans-serif",
              }}
            >
              <p style={{ marginBottom: "20px" }}>
                <strong style={{ color: "var(--text-dark)" }}>Un soir, ma fille m&apos;a demandé une histoire.</strong>{" "}
                Pas n&apos;importe laquelle. Une histoire avec elle dedans. Avec son prénom, ses héros, son univers à
                elle.
              </p>
              <p style={{ marginBottom: "20px" }}>
                J&apos;ai cherché. Longtemps. Des livres trop difficiles, trop lointains, trop génériques. Rien qui lui
                ressemble vraiment. Rien qui parle d&apos;elle tout en parlant de notre foi.
              </p>
              <p style={{ marginBottom: "20px" }}>
                Je voulais lui transmettre l&apos;islam comme je l&apos;ai reçu, moi — dans des histoires. Pas des
                leçons. Pas des obligations. Des récits qui restent toute une vie. Ceux qu&apos;on raconte à ses propres
                enfants des décennies plus tard.
              </p>
              <p style={{ marginBottom: "32px" }}>
                Alors j&apos;ai créé Qissali. Pour mes filles. Et pour toutes les vôtres.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                gap: "0",
                borderTop: "1px solid var(--rose-light)",
                paddingTop: "24px",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "Conçue pour transmettre", sub: "Hadith au bon moment" },
                { label: "Unique pour chaque enfant", sub: "Son prénom partout" },
                { label: "Un moment à partager", sub: "Débat + défi semaine" },
              ].map((item, i) => (
                <div
                  key={item.label}
                  style={{
                    flex: "1 1 160px",
                    paddingRight: i < 2 ? "24px" : "0",
                    borderRight: i < 2 ? "1px solid var(--rose-light)" : "none",
                    paddingLeft: i > 0 ? "24px" : "0",
                    marginBottom: "16px",
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: "13px", color: "var(--text-dark)", marginBottom: "4px" }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: "12px", color: "var(--text-soft)" }}>{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section
        id="decouvrir"
        style={{
          background: "var(--bg-darkmed)",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DecoBackground variant="dark" />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "900px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--mauve)",
              marginBottom: "12px",
            }}
          >
            Comment ça marche
          </p>
          <h2
            style={{
              textAlign: "center",
              color: "#ffffff",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              marginBottom: "56px",
            }}
          >
            Simple comme une histoire du soir
          </h2>

          <div className="steps-row">
            {commentSteps.map((step, i) => (
              <Fragment key={step.num}>
                <div style={{ flex: "1 1 200px", textAlign: "center", maxWidth: "280px" }}>
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "50%",
                      background: "var(--gradient-cta)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: "18px",
                      color: "white",
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    style={{
                      color: "#ffffff",
                      fontSize: "16px",
                      marginBottom: "8px",
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {step.titre}
                  </h3>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", lineHeight: 1.6 }}>{step.texte}</p>
                </div>
                {i < 2 ? <div className="steps-arrow hidden md:block">→</div> : null}
              </Fragment>
            ))}
          </div>
        </div>
      </section>

      {/* Les univers */}
      <section
        style={{
          background: "var(--bg-cream)",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DecoBackground variant="light" />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "1000px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--mauve)",
              marginBottom: "12px",
            }}
          >
            Les univers
          </p>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              color: "var(--text-dark)",
              marginBottom: "48px",
            }}
          >
            Chaque enfant a son monde magique
          </h2>

          <div className="univers-grid">
            {universItems.map((u) => (
              <CommanderModalTrigger
                key={u.titre}
                aria-label={`Commander une histoire — ${u.titre}`}
                className="rounded-[20px] border-2 border-transparent p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_32px_rgba(196,154,216,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve-deep)]"
                style={{ background: u.bg, cursor: "pointer" }}
              >
                <div style={{ fontSize: "44px", marginBottom: "16px" }} aria-hidden>
                  {u.emoji}
                </div>
                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "17px",
                    color: "var(--text-dark)",
                    marginBottom: "10px",
                  }}
                >
                  {u.titre}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--text-mid)", lineHeight: 1.6 }}>{u.texte}</p>
              </CommanderModalTrigger>
            ))}
          </div>
        </div>
      </section>

      {/* Neuroatypie */}
      <section
        className="border-y border-[rgba(196,154,216,0.25)]"
        style={{
          background: "linear-gradient(135deg, var(--mauve-light) 0%, var(--rose-pale) 50%, var(--bg-cream) 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DecoBackground variant="light" />
        <div className="relative z-[1] mx-auto max-w-[720px] px-8 py-[72px] text-center">
          <p className="text-[13px] font-medium uppercase tracking-[4px] text-[var(--mauve)]">Neuroatypie</p>
          <h2 className="mt-4 font-display text-[26px] font-normal leading-tight text-[var(--text-dark)] sm:text-3xl md:text-[2rem]">
            Une histoire qui peut suivre <span className="italic text-[var(--rose-deep)]">ton enfant</span>, pas
            l&apos;inverse
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-[var(--text-mid)]">
            Chaque enfant apprend à son rythme. Si le tien est Dys, TDAH, autiste (TSA), à haut potentiel ou a
            d&apos;autres besoins particuliers, tu peux le dire au moment de la commande : nous adaptons le texte pour
            qu&apos;il reste lisible, rassurant et en lien avec l&apos;islam — sans étiqueter, sans juger.
          </p>
          <Link href="/commander" className="btn-primary mt-8 inline-flex no-underline">
            Commander avec profil neuroatypique
          </Link>
        </div>
      </section>

      {/* Offres PDF + Audio bientôt */}
      <section
        style={{
          background: "var(--bg-darkmed)",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DecoBackground variant="dark" />
        <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto" }}>
          <p
            style={{
              textAlign: "center",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--mauve)",
              marginBottom: "12px",
            }}
          >
            Nos offres
          </p>
          <h2
            style={{
              textAlign: "center",
              color: "white",
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(24px, 3vw, 36px)",
              marginBottom: "12px",
            }}
          >
            Simple et transparent
          </h2>
          <p style={{ textAlign: "center", color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "48px" }}>
            Pas d&apos;abonnement. Tu paies, tu reçois.
          </p>

          <div className="offres-row">
            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(232,160,192,0.3)",
                borderRadius: "24px",
                padding: "40px 32px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "36px", marginBottom: "16px" }} aria-hidden>
                📖
              </div>
              <h3
                style={{
                  color: "white",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px",
                  marginBottom: "8px",
                }}
              >
                PDF Illustré
              </h3>
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: 800,
                  color: "var(--rose)",
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: "4px",
                }}
              >
                3,90€
              </div>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginBottom: "32px" }}>par histoire</p>
              <div style={{ textAlign: "left", marginBottom: "32px" }}>
                {pdfOfferBullets.map((item) => (
                  <p
                    key={item}
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      fontSize: "14px",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ color: "var(--rose)" }} aria-hidden>
                      ✦
                    </span>
                    {item}
                  </p>
                ))}
              </div>
              <Link href="/commander" className="btn-primary inline-flex w-full justify-center no-underline">
                Commander →
              </Link>
            </div>

            <div
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.03)",
                border: "1px dashed rgba(196,154,216,0.25)",
                borderRadius: "24px",
                padding: "40px 32px",
                textAlign: "center",
                opacity: 0.7,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  background: "rgba(196,154,216,0.2)",
                  border: "1px solid rgba(196,154,216,0.4)",
                  borderRadius: "50px",
                  padding: "4px 14px",
                  fontSize: "11px",
                  color: "var(--mauve)",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                Bientôt
              </div>
              <div style={{ fontSize: "36px", marginBottom: "16px" }} aria-hidden>
                🎧
              </div>
              <h3
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "22px",
                  marginBottom: "8px",
                }}
              >
                PDF + Audio
              </h3>
              <div
                style={{
                  fontSize: "44px",
                  fontWeight: 800,
                  color: "rgba(232,160,192,0.4)",
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: "4px",
                  textDecoration: "line-through",
                }}
              >
                7,90€
              </div>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px", marginBottom: "32px" }}>par histoire</p>
              <div style={{ textAlign: "left", marginBottom: "32px" }}>
                {audioOfferBullets.map((item) => (
                  <p
                    key={item}
                    style={{
                      color: "rgba(255,255,255,0.35)",
                      fontSize: "14px",
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ color: "rgba(196,154,216,0.3)" }} aria-hidden>
                      ✦
                    </span>
                    {item}
                  </p>
                ))}
              </div>
              <button
                type="button"
                disabled
                style={{
                  width: "100%",
                  padding: "14px",
                  border: "1px solid rgba(196,154,216,0.25)",
                  borderRadius: "50px",
                  background: "transparent",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "15px",
                  cursor: "not-allowed",
                }}
              >
                Bientôt disponible
              </button>
            </div>
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "32px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "13px",
              display: "flex",
              justifyContent: "center",
              gap: "24px",
              flexWrap: "wrap",
            }}
          >
            <span>🔒 Paiement sécurisé Stripe</span>
            <span>🛡️ Satisfait ou remboursé 48h</span>
            <span>💌 Email en moins de 5 min</span>
          </div>
        </div>
      </section>

      {/* Extrait */}
      <section className="bg-[var(--text-white)]">
        <div className="mx-auto max-w-[640px] px-8 py-[100px]">
          <div
            className="rounded-[24px] border border-[var(--rose-light)] bg-[var(--rose-pale)] p-10 text-left"
            style={{ boxShadow: "8px 8px 0 0 var(--rose-light)" }}
          >
            <div className="flex flex-wrap items-center gap-2 border-b border-[var(--rose-light)]/60 pb-4">
              <span className="font-display text-xl italic text-[var(--rose-deep)]">Qissali</span>
              <span className="rounded-full bg-[var(--mauve-light)] px-3 py-1 text-xs font-medium text-[var(--mauve-deep)]">
                Princesse
              </span>
              <span className="rounded-full bg-[var(--mauve-light)] px-3 py-1 text-xs font-medium text-[var(--mauve-deep)]">
                Aïd
              </span>
            </div>
            <h3 className="mt-6 font-display text-[22px] font-normal leading-snug text-[var(--text-dark)] sm:text-2xl">
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
              <p>Alors, dans sa tête, la voix de sa grand-mère s&apos;éleva doucement.</p>
            </div>
            <blockquote className="mt-8 border-l-[3px] border-[var(--mauve)] bg-[var(--mauve-light)]/80 px-4 py-4">
              <p className="font-display text-[15px] italic leading-relaxed text-[var(--text-dark)]">
                &quot;Le Prophète ﷺ nous a enseigné que jamais une aumône n&apos;a appauvri son donneur.
                Jamais.&quot;
              </p>
              <p className="mt-3 text-xs font-medium text-[var(--text-mid)]">Source : At-Tirmidhi</p>
            </blockquote>
          </div>
        </div>
      </section>

      {/* Témoignages */}
      <section className="bg-[var(--rose-pale)]">
        <div className="mx-auto max-w-[1100px] px-8 py-[100px]">
          <header className="text-center">
            <p className="text-[13px] font-medium uppercase tracking-[4px] text-[var(--mauve)]">Elles ont adoré</p>
            <h2 className="mt-4 font-display text-[28px] font-normal leading-tight text-[var(--text-dark)] sm:text-3xl md:text-4xl">
              Ce que disent les premières <span className="italic text-[var(--rose-deep)]">mamans</span>
            </h2>
          </header>
          <ul className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map(({ quote, avatar, name, city }) => (
              <li key={name}>
                <article className="flex h-full flex-col rounded-[20px] border border-[var(--rose-light)]/60 bg-[var(--text-white)] p-[28px] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md">
                  <p className="text-lg text-[var(--or)]" aria-label="5 sur 5 étoiles">
                    ★★★★★
                  </p>
                  <blockquote className="mt-4 flex-1 font-display text-[17px] italic leading-relaxed text-[var(--text-dark)]">
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
                      <p className="font-bold text-[var(--text-dark)]">{name}</p>
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
        style={{
          background: "var(--gradient-hero)",
          padding: "100px 24px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <DecoBackground variant="hero" />
        <div style={{ position: "relative", zIndex: 1 }}>
          <p
            className="script"
            style={{
              fontSize: "22px",
              color: "var(--rose-light)",
              marginBottom: "16px",
            }}
            dir="rtl"
          >
            بسم الله
          </p>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "white",
              marginBottom: "16px",
              lineHeight: 1.2,
            }}
          >
            Offre-lui une histoire
            <br />
            <em style={{ color: "var(--rose)" }}>qu&apos;il n&apos;oubliera jamais</em>
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", marginBottom: "40px" }}>
            Son prénom. Son univers. Ses valeurs. Une histoire rien que pour lui.
          </p>
          <CommanderModalTrigger className="btn-primary" style={{ fontSize: "18px", padding: "18px 48px" }}>
            ✨ Créer l&apos;histoire de mon enfant
          </CommanderModalTrigger>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", marginTop: "20px" }}>
            à partir de 3,90€ · PDF livré par email
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--bg-dark)] px-8 py-12 text-center">
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
