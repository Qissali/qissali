import { NextResponse } from "next/server";
import Stripe from "stripe";
import { buildPdfFromCheckoutSession } from "@/lib/fulfill-order";
import { verifyOrderPdfToken } from "@/lib/order-pdf-token";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");
  if (!token?.trim()) {
    return NextResponse.json({ error: "Lien incomplet." }, { status: 400 });
  }

  const sessionId = verifyOrderPdfToken(token);
  if (!sessionId) {
    return NextResponse.json(
      { error: "Lien invalide ou expiré. Utilise la pièce jointe de l’email ou contacte Qissali." },
      { status: 403 }
    );
  }

  const secret = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secret) {
    return NextResponse.json({ error: "Configuration serveur." }, { status: 500 });
  }

  const stripe = new Stripe(secret);
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return NextResponse.json({ error: "Commande introuvable." }, { status: 404 });
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json({ error: "Paiement non confirmé." }, { status: 403 });
  }

  const built = buildPdfFromCheckoutSession(session);
  if (!built.ok) {
    return NextResponse.json({ error: built.reason }, { status: 400 });
  }

  const buf = Buffer.from(built.base64, "base64");
  return new NextResponse(buf, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${encodeURIComponent(built.filename)}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
