import { CommanderModalTrigger } from "@/components/Modal";
import UniversTile from "@/components/UniversTile";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

const commentSteps = [
  { num: "1", titre: "Tu remplis le formulaire" },
  { num: "2", titre: "On crée l'histoire" },
  { num: "3", titre: "Tu reçois ton PDF" },
] as const;

const packs = [
  {
    titre: "Solo",
    slug: "solo",
    nb: 1,
    prix: "3,90€",
    unitaire: "3,90€ / histoire",
    badge: null as string | null,
    highlight: false,
  },
  {
    titre: "Duo",
    slug: "duo",
    nb: 2,
    prix: "6,90€",
    unitaire: "3,45€ / histoire",
    badge: "-11%",
    highlight: false,
  },
  {
    titre: "Trio",
    slug: "trio",
    nb: 3,
    prix: "8,90€",
    unitaire: "2,97€ / histoire",
    badge: "Le plus choisi",
    highlight: true,
  },
  {
    titre: "Famille",
    slug: "famille",
    nb: 5,
    prix: "12,90€",
    unitaire: "2,58€ / histoire",
    badge: "-34%",
    highlight: false,
  },
] as const;

const neuroProfiles = [
  { label: "Dys", sub: "Dyslexie, dyscalculie, dyspraxie" },
  { label: "TDAH", sub: "Énergie vive et créativité débordante" },
  { label: "TSA", sub: "Autisme, sensibilité intense du monde" },
  { label: "HPI", sub: "Haut potentiel, tête qui va très loin" },
] as const;

/** Placeholders honnêtes en attendant des avis vérifiés */
const avis = [
  {
    texte:
      "Espace réservé aux premiers témoignages de familles — merci de votre patience pendant le lancement.",
    nom: "—",
    ville: "",
  },
  {
    texte: "Vous pourrez partager votre expérience ici lorsque la collecte d’avis sera ouverte.",
    nom: "À venir",
    ville: "",
  },
  {
    texte: "Merci aux parents qui nous font confiance pour des histoires alignées avec leurs valeurs.",
    nom: "L’équipe Qissali",
    ville: "",
  },
] as const;

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 1. Hero / header */}
      <section
        style={{
          background: "var(--violet-deep)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "80px 24px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          style={{ position: "absolute", right: "6%", top: "8%", opacity: 0.12 }}
          width="140"
          height="140"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <path
            d="M70 50c0 22-18 40-40 40C13 90 2 74 2 57c13 8 28 8 40 0 12-8 20-22 20-38 5 8 8 19 8 31z"
            fill="#E0D0F0"
          />
        </svg>

        <svg
          style={{ position: "absolute", right: "3%", bottom: "15%", opacity: 0.1 }}
          width="50"
          height="70"
          viewBox="0 0 60 80"
          aria-hidden
        >
          <line x1="30" y1="0" x2="30" y2="10" stroke="#E0D0F0" strokeWidth="2" />
          <ellipse cx="30" cy="12" rx="8" ry="4" fill="none" stroke="#E0D0F0" strokeWidth="1.5" />
          <path
            d="M15 20 Q10 45 15 60 L45 60 Q50 45 45 20 Z"
            fill="none"
            stroke="#E0D0F0"
            strokeWidth="1.5"
          />
          <line x1="30" y1="20" x2="30" y2="60" stroke="#E0D0F0" strokeWidth="0.8" opacity="0.6" />
          <path d="M12 60 L15 68 L45 68 L48 60 Z" fill="none" stroke="#E0D0F0" strokeWidth="1.5" />
          <ellipse cx="30" cy="42" rx="6" ry="8" fill="#E0D0F0" opacity="0.2" />
        </svg>

        <svg
          style={{
            position: "absolute",
            left: "3%",
            top: "20%",
            opacity: 0.08,
            transform: "scale(0.75)",
          }}
          width="50"
          height="70"
          viewBox="0 0 60 80"
          aria-hidden
        >
          <line x1="30" y1="0" x2="30" y2="10" stroke="#D0B8E8" strokeWidth="2" />
          <ellipse cx="30" cy="12" rx="8" ry="4" fill="none" stroke="#D0B8E8" strokeWidth="1.5" />
          <path
            d="M15 20 Q10 45 15 60 L45 60 Q50 45 45 20 Z"
            fill="none"
            stroke="#D0B8E8"
            strokeWidth="1.5"
          />
          <path d="M12 60 L15 68 L45 68 L48 60 Z" fill="none" stroke="#D0B8E8" strokeWidth="1.5" />
        </svg>

        {[
          { x: "12%", y: "20%", s: 5 },
          { x: "88%", y: "15%", s: 4 },
          { x: "20%", y: "75%", s: 6 },
          { x: "78%", y: "70%", s: 3 },
          { x: "50%", y: "10%", s: 4 },
          { x: "35%", y: "85%", s: 5 },
          { x: "65%", y: "88%", s: 3 },
          { x: "8%", y: "50%", s: 4 },
        ].map((s, i) => (
          <svg
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y,
              opacity: 0.2,
            }}
            width={s.s * 2}
            height={s.s * 2}
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"
              fill="#E0D0F0"
            />
          </svg>
        ))}

        <div style={{ position: "relative", zIndex: 1 }}>
          <Image
            src="/logo-qissali.png"
            alt="Qissali — Mon histoire islamique personnalisée"
            width={420}
            height={210}
            priority
            style={{
              height: "clamp(120px, 20vw, 200px)",
              width: "auto",
              marginBottom: "32px",
            }}
          />

          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(28px, 5vw, 52px)",
              color: "#FFFFFF",
              lineHeight: 1.2,
              maxWidth: "680px",
              margin: "0 auto 16px",
            }}
          >
            Offre-lui une histoire
            <br />
            <em style={{ color: "var(--lila)" }}>qu&apos;il n&apos;oubliera jamais</em>
          </h1>

          <p
            style={{
              color: "rgba(240,234,248,0.75)",
              fontSize: "clamp(15px, 2vw, 18px)",
              marginBottom: "40px",
              maxWidth: "480px",
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Son prénom. Son univers. Ses valeurs. Une histoire rien que pour lui, prête en moins de 5 minutes.
          </p>

          <CommanderModalTrigger className="btn-primary" style={{ fontSize: "17px", padding: "16px 48px" }}>
            ✨ Créer l&apos;histoire de mon enfant
          </CommanderModalTrigger>

          <p style={{ color: "rgba(240,234,248,0.4)", fontSize: "13px", marginTop: "16px" }}>
            à partir de 3,90€ · PDF livré par email
          </p>
        </div>
      </section>

      {/* 2. Notre histoire */}
      <section className="story-two-col">
        <div
          style={{
            background: "var(--violet-deep)",
            padding: "64px 48px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <svg
            style={{ position: "absolute", right: "-10px", top: "20px", opacity: 0.08 }}
            width="100"
            height="100"
            viewBox="0 0 100 100"
            aria-hidden
          >
            <path
              d="M70 50c0 22-18 40-40 40C13 90 2 74 2 57c13 8 28 8 40 0 12-8 20-22 20-38 5 8 8 19 8 31z"
              fill="var(--lila)"
            />
          </svg>

          <div style={{ position: "relative", zIndex: 1 }}>
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "var(--violet-soft)",
                marginBottom: "20px",
              }}
            >
              Notre histoire
            </p>

            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(20px, 2.5vw, 30px)",
                color: "white",
                lineHeight: 1.35,
                marginBottom: "20px",
              }}
            >
              Qissali, c&apos;est
              <em style={{ color: "var(--lila)" }}> mon histoire </em>
              en arabe
            </h2>

            <p style={{ fontSize: "14px", color: "rgba(240,234,248,0.65)", lineHeight: 1.8 }}>
              Qissali vient de l&apos;arabe{" "}
              <span dir="rtl" lang="ar" className="inline-block">
                قصتي
              </span>{" "}
              — qui signifie &quot;mon histoire&quot;. Parce que chaque enfant mérite une histoire rien que pour lui.
            </p>
          </div>

          <div
            style={{
              borderLeft: "2px solid var(--violet-soft)",
              paddingLeft: "20px",
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: "italic",
                color: "var(--lila-med)",
                fontSize: "15px",
                lineHeight: 1.6,
                marginBottom: "8px",
              }}
            >
              &ldquo;Le plus grand trésor d&apos;une princesse, ma chérie, ce n&apos;est pas sa couronne. C&apos;est son
              cœur.&rdquo;
            </p>
            <p style={{ fontSize: "11px", color: "rgba(240,234,248,0.35)", letterSpacing: "1px" }}>
              Extrait d&apos;une histoire Qissali
            </p>
          </div>
        </div>

        <div style={{ background: "var(--lila)", padding: "64px 56px" }}>
          <div style={{ fontSize: "15px", color: "var(--violet)", lineHeight: 1.9 }}>
            <p style={{ marginBottom: "20px" }}>
              <strong style={{ color: "var(--violet-deep)" }}>Un soir, ma fille m&apos;a demandé une histoire.</strong>{" "}
              Pas n&apos;importe laquelle. Une histoire avec elle dedans. Avec son prénom, ses héros, son univers à elle.
            </p>
            <p style={{ marginBottom: "20px" }}>
              J&apos;ai cherché. Longtemps. Des livres trop difficiles, trop lointains, trop génériques. Rien qui lui
              ressemble vraiment. Rien qui parle d&apos;elle tout en parlant de notre foi.
            </p>
            <p style={{ marginBottom: "20px" }}>
              Je voulais lui transmettre l&apos;islam comme je l&apos;ai reçu, moi — dans des histoires. Pas des leçons.
              Pas des obligations. Des récits qui restent toute une vie, ceux qu&apos;on raconte à ses propres enfants
              des décennies plus tard.
            </p>
            <p>Alors j&apos;ai créé Qissali. Pour mes filles. Et pour toutes les vôtres.</p>
          </div>
        </div>
      </section>

      {/* 3. Comment ça marche */}
      <section id="decouvrir" style={{ background: "var(--lila-med)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--violet-deep)",
              fontSize: "clamp(22px, 3vw, 36px)",
              marginBottom: "56px",
            }}
          >
            Comment ça marche
          </h2>

          <div className="steps-flex-home">
            {commentSteps.map((step, i) => (
              <Fragment key={step.num}>
                <div style={{ textAlign: "center", flex: "1 1 180px", maxWidth: "220px" }}>
                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      borderRadius: "50%",
                      background: "var(--violet)",
                      color: "var(--lila)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 16px",
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 700,
                      fontSize: "22px",
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    style={{
                      color: "var(--violet-deep)",
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                      fontSize: "16px",
                    }}
                  >
                    {step.titre}
                  </h3>
                </div>
                {i < 2 ? (
                  <div
                    style={{
                      color: "var(--violet-soft)",
                      fontSize: "22px",
                      opacity: 0.5,
                      flexShrink: 0,
                    }}
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

      {/* 4. Les univers */}
      <section style={{ background: "var(--lila)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
              color: "var(--violet-deep)",
              fontSize: "clamp(22px, 3vw, 36px)",
              marginBottom: "48px",
            }}
          >
            Les univers
          </h2>

          <div className="univers-grid-page">
            <UniversTile emoji="👑" titre="Princesse" />
            <UniversTile emoji="🦄" titre="Licorne & Magie" />
            <UniversTile emoji="🦸" titre="Super-Héros" />
            <UniversTile emoji="🐾" titre="Animaux" />
          </div>
        </div>
      </section>

      {/* 5. Neuroatypie */}
      <section style={{ background: "var(--lila-med)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--violet-deep)",
              fontSize: "clamp(22px, 3vw, 36px)",
              marginBottom: "16px",
            }}
          >
            Des histoires pour tous les enfants
          </h2>

          <p
            style={{
              color: "var(--violet-soft)",
              fontSize: "15px",
              lineHeight: 1.8,
              maxWidth: "580px",
              margin: "0 auto 48px",
            }}
          >
            Chaque enfant mérite une histoire qui lui ressemble vraiment. C&apos;est pourquoi nos histoires peuvent être
            adaptées aux profils neuroatypiques.
          </p>

          <div className="neuro-grid-page" style={{ marginBottom: "40px" }}>
            {neuroProfiles.map((p) => (
              <div
                key={p.label}
                style={{
                  background: "var(--lila)",
                  border: "1px solid var(--lila-dark)",
                  borderRadius: "16px",
                  padding: "24px 16px",
                  textAlign: "center",
                }}
              >
                <p
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "20px",
                    color: "var(--violet-deep)",
                    marginBottom: "8px",
                  }}
                >
                  {p.label}
                </p>
                <p style={{ fontSize: "12px", color: "var(--violet-soft)", lineHeight: 1.5 }}>{p.sub}</p>
              </div>
            ))}
          </div>

          <p style={{ fontSize: "13px", color: "var(--violet-soft)", fontStyle: "italic" }}>
            Option disponible dans le formulaire de commande. Informations confidentielles, utilisées uniquement pour
            adapter l&apos;histoire.
          </p>
        </div>
      </section>

      {/* 6. Les packs */}
      <section style={{ background: "var(--lila)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
              color: "var(--violet-deep)",
              fontSize: "clamp(22px, 3vw, 36px)",
              marginBottom: "12px",
            }}
          >
            Choisissez votre pack
          </h2>
          <p
            style={{
              textAlign: "center",
              color: "var(--violet-soft)",
              fontSize: "14px",
              marginBottom: "48px",
            }}
          >
            Plus vous commandez, plus vous économisez.
          </p>

          <div className="packs-grid-page">
            {packs.map((pack) => (
              <div
                key={pack.slug}
                style={{
                  background: pack.highlight ? "var(--violet)" : "var(--lila-med)",
                  border: pack.highlight ? "none" : "1px solid var(--lila-dark)",
                  borderRadius: "24px",
                  padding: "32px 20px",
                  textAlign: "center",
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {pack.badge ? (
                  <div
                    style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: pack.highlight ? "var(--lila)" : "var(--violet)",
                      color: pack.highlight ? "var(--violet)" : "var(--lila)",
                      borderRadius: "50px",
                      padding: "4px 16px",
                      fontSize: "11px",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {pack.badge}
                  </div>
                ) : null}

                <h3
                  style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "22px",
                    color: pack.highlight ? "white" : "var(--violet-deep)",
                    marginBottom: "4px",
                  }}
                >
                  {pack.titre}
                </h3>

                <p
                  style={{
                    fontSize: "13px",
                    color: pack.highlight ? "rgba(240,234,248,0.7)" : "var(--violet-soft)",
                    marginBottom: "20px",
                  }}
                >
                  {pack.nb} histoire{pack.nb > 1 ? "s" : ""}
                </p>

                <div
                  style={{
                    fontSize: "36px",
                    fontWeight: 800,
                    fontFamily: "'Playfair Display', serif",
                    color: pack.highlight ? "white" : "var(--violet-deep)",
                    marginBottom: "4px",
                  }}
                >
                  {pack.prix}
                </div>

                <p
                  style={{
                    fontSize: "12px",
                    color: pack.highlight ? "rgba(240,234,248,0.6)" : "var(--violet-soft)",
                    marginBottom: "28px",
                  }}
                >
                  {pack.unitaire}
                </p>

                {pack.highlight ? (
                  <Link
                    href={`/commander?pack=${pack.slug}`}
                    className="inline-block text-center no-underline"
                    style={{
                      background: "var(--lila)",
                      color: "var(--violet)",
                      border: "none",
                      borderRadius: "50px",
                      padding: "12px 24px",
                      fontWeight: 700,
                      fontSize: "15px",
                      cursor: "pointer",
                      marginTop: "auto",
                    }}
                  >
                    Commander →
                  </Link>
                ) : (
                  <Link
                    href={`/commander?pack=${pack.slug}`}
                    className="btn-secondary mt-auto inline-block text-center no-underline"
                  >
                    Commander →
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div
            style={{
              textAlign: "center",
              marginTop: "32px",
              fontSize: "13px",
              color: "var(--violet-soft)",
              display: "flex",
              justifyContent: "center",
              gap: "32px",
              flexWrap: "wrap",
            }}
          >
            <span>🔒 Paiement sécurisé Stripe</span>
            <span>🛡️ Satisfait ou remboursé 48h</span>
            <span>💌 Email en moins de 5 min</span>
          </div>
        </div>
      </section>

      {/* 7. Exemple d'histoire */}
      <section style={{ background: "var(--lila-med)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "24px",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {["Qissali", "👑 Princesse", "🌙 Aïd"].map((b) => (
              <span
                key={b}
                style={{
                  background: "var(--violet)",
                  color: "var(--lila)",
                  borderRadius: "50px",
                  padding: "4px 14px",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              >
                {b}
              </span>
            ))}
          </div>

          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              color: "var(--violet-deep)",
              fontSize: "clamp(20px, 3vw, 28px)",
              textAlign: "center",
              marginBottom: "32px",
              lineHeight: 1.3,
            }}
          >
            L&apos;histoire de Nour et le plus grand trésor du royaume
          </h2>

          <div
            style={{
              background: "var(--lila)",
              borderRadius: "20px",
              padding: "36px 40px",
              fontSize: "15px",
              color: "var(--violet)",
              lineHeight: 1.9,
              border: "1px solid var(--lila-dark)",
            }}
          >
            <p style={{ marginBottom: "16px" }}>
              Il était une fois, dans un royaume où les jardins sentaient toujours le jasmin et le miel, une petite
              princesse prénommée Nour.
            </p>
            <p style={{ marginBottom: "16px" }}>
              Ce matin-là, c&apos;était l&apos;Aïd. Papa lui tendit une petite bourse en velours violet. À l&apos;intérieur
              : dix pièces dorées, rien que pour elle.
            </p>
            <p style={{ marginBottom: "16px" }}>
              C&apos;est là qu&apos;elle vit Lina, seule sous l&apos;oranger, les yeux rouges...
            </p>
            <p style={{ marginBottom: "24px" }}>
              Alors, dans sa tête, la voix de sa grand-mère s&apos;éleva doucement.
            </p>

            <div style={{ borderLeft: "3px solid var(--violet-soft)", paddingLeft: "20px", fontStyle: "italic" }}>
              <p
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: "var(--violet-deep)",
                  fontSize: "16px",
                  marginBottom: "8px",
                  lineHeight: 1.6,
                }}
              >
                &ldquo;Le Prophète ﷺ nous a enseigné que jamais une aumône n&apos;a appauvri son donneur.
                Jamais.&rdquo;
              </p>
              <p style={{ fontSize: "12px", color: "var(--violet-soft)", fontStyle: "normal" }}>Source : At-Tirmidhi</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Avis */}
      <section style={{ background: "var(--lila)", padding: "80px 24px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "'Playfair Display', serif",
              color: "var(--violet-deep)",
              fontSize: "clamp(22px, 3vw, 36px)",
              marginBottom: "48px",
            }}
          >
            Elles ont adoré
          </h2>

          <div className="avis-grid-page">
            {avis.map((a, i) => (
              <div
                key={i}
                style={{
                  background: "var(--lila-med)",
                  border: "1px solid var(--lila-dark)",
                  borderRadius: "20px",
                  padding: "28px 24px",
                }}
              >
                <div style={{ color: "var(--violet)", fontSize: "18px", marginBottom: "12px" }} aria-hidden>
                  ★★★★★
                </div>
                <p style={{ fontStyle: "italic", fontSize: "14px", color: "var(--violet)", lineHeight: 1.7, marginBottom: "16px" }}>
                  &ldquo;{a.texte}&rdquo;
                </p>
                <p style={{ fontWeight: 700, fontSize: "13px", color: "var(--violet-deep)" }}>{a.nom}</p>
                {a.ville ? <p style={{ fontSize: "12px", color: "var(--violet-soft)" }}>{a.ville}</p> : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          background: "var(--violet-deep)",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <Image
          src="/logo-qissali.png"
          alt="Qissali"
          width={160}
          height={80}
          style={{ height: "60px", width: "auto", marginBottom: "20px", opacity: 0.9 }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "24px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          {(
            [
              ["À propos", "/a-propos"],
              ["Contact", "/contact"],
              ["CGV", "/cgv"],
              ["Mentions légales", "/mentions-legales"],
            ] as const
          ).map(([label, href]) => (
            <Link
              key={href}
              href={href}
              style={{
                color: "rgba(240,234,248,0.6)",
                fontSize: "13px",
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
        <p style={{ color: "rgba(240,234,248,0.35)", fontSize: "12px" }}>
          © 2025 Qissali · qissali.fr · Fait avec ❤️ pour nos enfants
        </p>
      </footer>
    </main>
  );
}
