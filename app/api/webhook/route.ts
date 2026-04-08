import { NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillOrderFromSession } from "@/lib/fulfill-order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!webhookSecret) {
    return NextResponse.json(
      {
        error:
          "STRIPE_WEBHOOK_SECRET manquant. Crée un endpoint vers /api/webhook dans Stripe (Developers → Webhooks) et copie le secret whsec_… dans .env.local ou Vercel.",
      },
      { status: 500 }
    );
  }
  if (!secretKey) {
    return NextResponse.json(
      {
        error:
          "STRIPE_SECRET_KEY manquant. Ajoute la clé secrète Stripe (sk_test_… / sk_live_…) dans .env.local ou les variables d’environnement du déploiement.",
      },
      { status: 500 }
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json(
      { error: "En-tête stripe-signature manquant." },
      { status: 400 }
    );
  }

  const stripe = new Stripe(secretKey);

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook Stripe : signature invalide", err);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = (session.metadata ?? {}) as Record<string, string>;
    const profils = metadata.profils || "";
    const precisionsNeuro = metadata.precisionsNeuro || "";

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true, ignored: "payment not paid" });
    }

    // fulfillOrderFromSession : PDF + emails ; si getStory() est null → emails admin/client
    // « histoire en préparation » (pas de remboursement automatique, livraison manuelle).
    const result = await fulfillOrderFromSession(session, {
      profils,
      precisionsNeuro,
    });
    if (!result.ok) {
      console.error("fulfillOrderFromSession:", result.reason);
      return NextResponse.json({ error: result.reason }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
