import { NextResponse } from "next/server";
import Stripe from "stripe";
import { histoiresToStripeMetadata } from "@/lib/checkout-histoires";

/** Packs homepage / commander (prix en centimes) */
const PACKS = {
  solo: { label: "Solo", prix: 390, nbHistoires: 1 },
  duo: { label: "Duo", prix: 690, nbHistoires: 2 },
  trio: { label: "Trio", prix: 890, nbHistoires: 3 },
  famille: { label: "Famille", prix: 1290, nbHistoires: 5 },
} as const;

type PackId = keyof typeof PACKS;

type Body = {
  email?: string;
  /** Centimes — flux pack (prioritaire si fourni avec `prix`) */
  prix?: number;
  montant?: number;
  pack?: string;
  histoires?: unknown[];
  prenom1?: string;
  prenom2?: string;
  univers?: string;
  valeur?: string;
  occasion?: string;
  format?: string;
  message?: string;
  typeHistoire?: string;
  genre1?: string;
  genre2?: string;
  age_enfant1?: string;
  age_enfant2?: string;
  profils?: string;
  precisionsNeuro?: string;
  embedded?: boolean;
};

function str(v: unknown) {
  return typeof v === "string" ? v : "";
}

function normalizePack(p: string): PackId {
  return p in PACKS ? (p as PackId) : "solo";
}

function firstHistoireRecord(h: unknown): Record<string, unknown> {
  return h && typeof h === "object" ? (h as Record<string, unknown>) : {};
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    return NextResponse.json(
      {
        error:
          "Configuration Stripe manquante : définis STRIPE_SECRET_KEY dans .env.local (local) ou dans les variables d’environnement du projet (ex. Vercel → Settings → Environment Variables). Clé : Dashboard Stripe → API keys (sk_test_… ou sk_live_…).",
      },
      { status: 500 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "") || "";
  if (!baseUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_URL doit être défini (ex. http://localhost:3000)." },
      { status: 400 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const email = str(body.email).trim();
  const embedded = body.embedded === true;
  const histoiresPayload = Array.isArray(body.histoires) ? body.histoires : null;
  const packParam = str(body.pack).trim();
  const isPackOrder =
    Boolean(histoiresPayload && histoiresPayload.length > 0 && packParam);

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  const stripe = new Stripe(secret);

  const sessionCommon = {
    mode: "payment" as const,
    customer_email: email,
    payment_method_types: ["card"] as Stripe.Checkout.SessionCreateParams["payment_method_types"],
  };

  /** ─── Flux pack (histoires[]) ─── */
  if (isPackOrder) {
    const packKey = normalizePack(packParam);
    const packInfo = PACKS[packKey];
    const prixClient =
      typeof body.prix === "number"
        ? body.prix
        : typeof body.montant === "number"
          ? body.montant
          : null;

    if (prixClient !== packInfo.prix) {
      return NextResponse.json(
        { error: `Prix incohérent avec le pack (attendu : ${packInfo.prix} centimes).` },
        { status: 400 }
      );
    }

    if (histoiresPayload!.length !== packInfo.nbHistoires) {
      return NextResponse.json(
        {
          error: `Nombre d’histoires invalide pour le pack ${packInfo.label} (attendu : ${packInfo.nbHistoires}).`,
        },
        { status: 400 }
      );
    }

    for (const item of histoiresPayload!) {
      const h = firstHistoireRecord(item);
      if (!str(h.prenom1).trim()) {
        return NextResponse.json({ error: "Chaque histoire doit avoir un prénom (prenom1)." }, { status: 400 });
      }
    }

    let chunkMeta: Record<string, string>;
    try {
      chunkMeta = histoiresToStripeMetadata(histoiresPayload);
      if (Object.keys(chunkMeta).length > 45) {
        return NextResponse.json(
          { error: "Trop de données pour la commande (réduire les messages)." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json({ error: "Données histoires invalides." }, { status: 400 });
    }

    const first = firstHistoireRecord(histoiresPayload![0]);
    const prenoms = histoiresPayload!.map((h) => str(firstHistoireRecord(h).prenom1).trim()).join(", ");
    const productName = `Qissali Pack ${packInfo.label} — ${prenoms}`;

    /** Stripe : max ~500 car. par valeur → JSON complet passé en chunks `hj_*` (voir lib/checkout-histoires). */
    const metadata: Record<string, string> = {
      pack: packKey,
      nbHistoires: String(histoiresPayload!.length),
      email,
      montant: String(packInfo.prix),
      format: str(body.format) || "pdf",
      prenom1: str(first.prenom1).trim(),
      prenom2: str(first.prenom2).trim(),
      univers: str(first.univers),
      valeur: str(first.valeur),
      occasion: str(first.occasion),
      message: str(first.message),
      type_histoire: str(first.type_histoire) || str(body.typeHistoire) || "",
      genre_enfant1: str(first.genre1) || str(body.genre1) || "",
      genre_enfant2: str(first.genre2) || str(body.genre2) || "",
      age_enfant1: str(first.age_enfant1) || str(body.age_enfant1) || "",
      age_enfant2: str(first.age_enfant2) || str(body.age_enfant2) || "",
      profils: str(first.profils) || str(body.profils) || "",
      precisionsNeuro: str(first.precisionsNeuro) || str(body.precisionsNeuro) || "",
      ...chunkMeta,
    };

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
      {
        price_data: {
          currency: "eur",
          product_data: { name: productName },
          unit_amount: packInfo.prix,
        },
        quantity: 1,
      },
    ];

    try {
      if (embedded) {
        const session = await stripe.checkout.sessions.create({
          ...sessionCommon,
          ui_mode: "embedded",
          line_items: lineItems,
          return_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
          metadata,
        });

        if (!session.client_secret) {
          return NextResponse.json(
            { error: "Session Stripe sans secret client (checkout intégré)." },
            { status: 500 }
          );
        }
        return NextResponse.json({ clientSecret: session.client_secret });
      }

      const session = await stripe.checkout.sessions.create({
        ...sessionCommon,
        line_items: lineItems,
        success_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/commander?pack=${encodeURIComponent(packKey)}`,
        metadata,
      });

      if (!session.url) {
        return NextResponse.json({ error: "Session Stripe sans URL de redirection." }, { status: 500 });
      }
      return NextResponse.json({ url: session.url });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erreur Stripe inconnue.";
      console.error("create-checkout-session (pack)", err);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  /** ─── Flux legacy (sans tableau histoires) ─── */
  const montant = typeof body.montant === "number" ? body.montant : null;
  const prenom1 = str(body.prenom1).trim();
  const prenom2 = str(body.prenom2).trim();
  const univers = str(body.univers);
  const valeur = str(body.valeur);
  const occasion = str(body.occasion);
  const format = str(body.format);
  const message = str(body.message);
  const typeHistoire = str(body.typeHistoire);
  const genre1 = str(body.genre1);
  const genre2 = str(body.genre2);
  const age_enfant1 = str(body.age_enfant1).trim();
  const age_enfant2 = str(body.age_enfant2).trim();
  const profils = str(body.profils).trim();
  const precisionsNeuro = str(body.precisionsNeuro).trim();
  const pack = str(body.pack).trim();

  const ALLOWED_MONTANTS = new Set([390, 690, 790, 890, 1090, 1290, 1690]);

  if (
    montant === null ||
    !Number.isInteger(montant) ||
    !ALLOWED_MONTANTS.has(montant)
  ) {
    return NextResponse.json({ error: "Montant invalide." }, { status: 400 });
  }
  if (!prenom1) {
    return NextResponse.json({ error: "Prénom requis." }, { status: 400 });
  }

  const prenomsLabel = prenom2 ? `${prenom1} & ${prenom2}` : prenom1;
  const productName = `Histoire Qissali — ${prenomsLabel}`;

  const metadata: Record<string, string> = {
    email,
    montant: String(montant),
    prenom1,
    prenom2: prenom2 || "",
    univers,
    valeur,
    occasion,
    format,
    message: message || "",
    type_histoire: typeHistoire || "",
    genre_enfant1: genre1 || "",
    genre_enfant2: genre2 || "",
    age_enfant1: age_enfant1 || "",
    age_enfant2: age_enfant2 || "",
    profils: profils || "",
    precisionsNeuro: precisionsNeuro || "",
    pack: pack || "",
  };

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price_data: {
        currency: "eur",
        product_data: { name: productName },
        unit_amount: montant,
      },
      quantity: 1,
    },
  ];

  try {
    if (embedded) {
      const session = await stripe.checkout.sessions.create({
        ui_mode: "embedded",
        mode: "payment",
        customer_email: email,
        payment_method_types: ["card"],
        line_items: lineItems,
        return_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
        metadata,
      });

      if (!session.client_secret) {
        return NextResponse.json(
          { error: "Session Stripe sans secret client (checkout intégré)." },
          { status: 500 }
        );
      }

      return NextResponse.json({ clientSecret: session.client_secret });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/commander`,
      metadata,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Session Stripe sans URL de redirection." }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur Stripe inconnue.";
    console.error("create-checkout-session", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
