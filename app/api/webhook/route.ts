import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStory } from "@/lib/stories";
import { fulfillOrderFromSession } from "@/lib/fulfill-order";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;

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
    const profilPrincipal = profils.split(",")[0]?.trim() || "";
    let histoire: any = null;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true, ignored: "payment not paid" });
    }

    // Si profil neuro sélectionné, tente une adaptation via l'API dédiée
    if (profilPrincipal) {
      const profilMap: Record<string, string> = {
        "Dys (dyslexie, dyscalculie, dyspraxie...)": "dys",
        TDAH: "tdah",
        "Autisme / TSA": "tsa",
        "Haut potentiel (HPI/HQI)": "hpi",
        dys: "dys",
        tdah: "tdah",
        tsa: "tsa",
        hpi: "hpi",
      };
      const profilKey = profilMap[profilPrincipal] || profilMap[profilPrincipal.toLowerCase()];

      if (profilKey) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_URL?.replace(/\/$/, "");
          if (!baseUrl) throw new Error("NEXT_PUBLIC_URL manquant");
          const nbEnfants = parseInt(
            metadata.nbEnfants || (metadata.prenom2?.trim() ? "2" : "1"),
            10
          );

          const neuroResponse = await fetch(`${baseUrl}/api/generate-neuro-story`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              univers: metadata.univers,
              valeur: metadata.valeur,
              occasion: metadata.occasion,
              nbEnfants: Number.isFinite(nbEnfants) ? nbEnfants : 1,
              prenom1: metadata.prenom1,
              prenom2: metadata.prenom2 || "",
              profil: profilKey,
              precisions: precisionsNeuro,
            }),
          });

          const neuroData = await neuroResponse.json();
          if (neuroData?.success && neuroData?.story) {
            histoire = neuroData.story;
            console.log("✅ Histoire neuro générée pour:", profilKey);
          } else {
            throw new Error("Génération neuro échouée");
          }
        } catch (error) {
          console.error("❌ Fallback vers histoire standard:", error);
          histoire = getStory(
            metadata.univers,
            metadata.valeur,
            metadata.occasion,
            parseInt(metadata.nbEnfants || (metadata.prenom2?.trim() ? "2" : "1"), 10) || 1,
            metadata.prenom1,
            metadata.prenom2 || "",
            profils,
            precisionsNeuro
          );
        }
      }
    } else {
      histoire = getStory(
        metadata.univers,
        metadata.valeur,
        metadata.occasion,
        parseInt(metadata.nbEnfants || (metadata.prenom2?.trim() ? "2" : "1"), 10) || 1,
        metadata.prenom1,
        metadata.prenom2 || "",
        profils,
        precisionsNeuro
      );
    }

    // fulfillOrderFromSession : PDF + emails ; si getStory() est null → emails admin/client
    // « histoire en préparation » (pas de remboursement automatique, livraison manuelle).
    const result = await fulfillOrderFromSession(session, {
      profils,
      precisionsNeuro,
      storyOverride: histoire,
    });
    if (!result.ok) {
      console.error("fulfillOrderFromSession:", result.reason);
      return NextResponse.json({ error: result.reason }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
