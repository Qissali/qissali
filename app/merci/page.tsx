import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe";

export const metadata: Metadata = {
  title: "Merci — Qissali",
  description: "Ta commande est confirmée.",
};

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

function getSessionId(searchParams: Props["searchParams"]): string | undefined {
  const raw = searchParams.session_id;
  if (typeof raw === "string") return raw;
  if (Array.isArray(raw) && raw[0]) return raw[0];
  return undefined;
}

export default async function MerciPage({ searchParams }: Props) {
  const sessionId = getSessionId(searchParams);
  if (!sessionId) {
    redirect("/commander");
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    redirect("/commander");
  }

  const stripe = new Stripe(secret);

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    redirect("/commander");
  }

  if (session.payment_status !== "paid") {
    redirect("/commander");
  }

  const email =
    session.customer_email ||
    session.customer_details?.email ||
    session.metadata?.email ||
    "";

  const prenom1 = session.metadata?.prenom1?.trim() || "";
  const prenom2 = session.metadata?.prenom2?.trim() || "";
  const prenom =
    prenom1 && prenom2
      ? `${prenom1} et ${prenom2}`
      : prenom1 || prenom2 || "ton enfant";

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <Image
        src="/logo-qissali.png"
        alt="Qissali"
        width={200}
        height={100}
        className="mb-4 h-auto w-[min(200px,55vw)]"
      />
      <p className="text-7xl md:text-8xl" aria-hidden>
        🌙
      </p>
      <h1 className="mt-8 font-display text-3xl text-qissali-mauve md:text-4xl">
        Barakallahu fik !
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-slate-600">
        L&apos;histoire de {prenom} est en préparation. Tu la recevras dans quelques minutes sur{" "}
        {email ? (
          <span className="font-medium text-qissali-mauve">{email}</span>
        ) : (
          <span className="text-slate-500">ton adresse email</span>
        )}
        .
      </p>
      <Link
        href="/"
        className="mt-12 inline-flex rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve px-8 py-3 text-sm font-semibold text-white shadow-md shadow-qissali-mauve/20 transition hover:brightness-105"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
