import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CommanderForm } from "./commander-form";

export const metadata: Metadata = {
  title: "Commander — Qissali",
  description:
    "Personnalise l’histoire de ton enfant : univers, valeurs, neuroatypie optionnelle (Dys, TDAH, TSA, HPI…) et livraison par email.",
};

export default function CommanderPage() {
  return (
    <div className="min-h-screen bg-qissali-cream px-4 pb-12 pt-8 sm:px-6">
      <header className="mx-auto mb-6 flex max-w-2xl items-center justify-center">
        <Link
          href="/"
          className="block transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-qissali-mauve"
        >
          <Image
            src="/logo-qissali.png"
            alt="Qissali — Retour à l’accueil"
            width={220}
            height={110}
            className="h-auto w-[min(220px,70vw)]"
          />
        </Link>
      </header>
      <CommanderForm />
    </div>
  );
}
