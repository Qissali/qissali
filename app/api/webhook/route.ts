import { NextResponse } from "next/server";
import Stripe from "stripe";
import { fulfillOrderFromSession } from "@/lib/fulfill-order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!webhookSecret || !secretKey) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET ou STRIPE_SECRET_KEY manquant." },
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

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true, ignored: "payment not paid" });
    }

    const result = await fulfillOrderFromSession(session);
    if (!result.ok) {
      console.error("fulfillOrderFromSession:", result.reason);
      return NextResponse.json({ error: result.reason }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
