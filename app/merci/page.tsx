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

function MerciShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <Image
        src="/logo-qissali.png"
        alt="Qissali"
        width={200}
        height={100}
        className="mb-4 h-auto w-[min(200px,55vw)]"
      />
      <h1 className="mt-4 font-display text-2xl text-qissali-mauve md:text-3xl">{title}</h1>
      <div className="mt-6 text-lg leading-relaxed text-slate-600">{children}</div>
    </div>
  );
}

export default async function MerciPage({ searchParams }: Props) {
  const sessionId = getSessionId(searchParams);
  if (!sessionId) {
    redirect("/commander");
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return (
      <MerciShell title="Configuration incomplète">
        <p>
          Le serveur n’a pas accès à la clé Stripe. En production, vérifie que{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">STRIPE_SECRET_KEY</code> est
          bien définie (Vercel → Environment Variables).
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve px-8 py-3 text-sm font-semibold text-white shadow-md shadow-qissali-mauve/20 transition hover:brightness-105"
        >
          Retour à l&apos;accueil
        </Link>
      </MerciShell>
    );
  }

  const stripe = new Stripe(secret);

  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch {
    return (
      <MerciShell title="Commande introuvable">
        <p>
          Ce lien de confirmation n’est pas valide ou a expiré. Si tu viens de payer, ouvre le
          récapitulatif depuis l’email envoyé par Stripe ou{" "}
          <Link href="/commander" className="font-medium text-qissali-mauve underline">
            repasse par la commande
          </Link>
          .
        </p>
        <p className="mt-4 text-sm text-slate-500">
          En test : une session créée avec des clés <strong>test</strong> ne peut pas être lue avec
          des clés <strong>live</strong> (et inversement).
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex rounded-full border-2 border-qissali-mauve/30 px-8 py-3 text-sm font-semibold text-qissali-mauve transition hover:bg-qissali-mauve/5"
        >
          Retour à l&apos;accueil
        </Link>
      </MerciShell>
    );
  }

  if (session.payment_status !== "paid") {
    return (
      <MerciShell title="Paiement en attente">
        <p>
          Le paiement n’est pas encore confirmé (statut :{" "}
          <span className="font-mono text-sm">{session.payment_status}</span>). Réessaie dans une
          minute ou vérifie ton application bancaire. Tu peux aussi consulter tes emails : si le
          paiement est passé, l’histoire part automatiquement.
        </p>
        <Link
          href="/"
          className="mt-10 inline-flex rounded-full bg-gradient-to-r from-qissali-rose to-qissali-mauve px-8 py-3 text-sm font-semibold text-white shadow-md shadow-qissali-mauve/20 transition hover:brightness-105"
        >
          Retour à l&apos;accueil
        </Link>
      </MerciShell>
    );
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
