import { NextResponse } from "next/server";
import Stripe from "stripe";

type Body = {
  email?: string;
  montant?: number;
  prenom1?: string;
  prenom2?: string;
  univers?: string;
  valeur?: string;
  occasion?: string;
  format?: string;
  message?: string;
  /** "solo" | "fratrie" */
  typeHistoire?: string;
  /** "Fille" | "Garçon" */
  genre1?: string;
  genre2?: string;
};

function str(v: unknown) {
  return typeof v === "string" ? v : "";
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Configuration Stripe manquante (STRIPE_SECRET_KEY)." },
      { status: 500 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "") || "";
  if (!baseUrl) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_URL doit être défini (ex. http://localhost:3000)." },
      { status: 500 }
    );
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Corps JSON invalide." }, { status: 400 });
  }

  const email = str(body.email).trim();
  const montant = body.montant;
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

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }
  if (montant !== 390 && montant !== 790) {
    return NextResponse.json(
      { error: "Montant invalide (attendu : 390 ou 790 centimes)." },
      { status: 400 }
    );
  }
  if (!prenom1) {
    return NextResponse.json({ error: "Prénom requis." }, { status: 400 });
  }

  const prenomsLabel = prenom2 ? `${prenom1} & ${prenom2}` : prenom1;
  const productName = `Histoire Qissali — ${prenomsLabel}`;

  const stripe = new Stripe(secret);

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
  };

  try {
    // Carte, portefeuilles (Apple Pay, Google Pay) : gérés par Stripe sur la page Checkout.
    // Activer Apple Pay dans le Dashboard Stripe et enregistrer le domaine de prod :
    // https://dashboard.stripe.com/settings/payment_method_domains
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
            },
            unit_amount: montant,
          },
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/commander`,
      metadata,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Session Stripe sans URL de redirection." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Erreur Stripe inconnue.";
    console.error("create-checkout-session", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
