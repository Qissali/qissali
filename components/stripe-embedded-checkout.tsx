"use client";

import { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

type Props = {
  clientSecret: string;
  onError?: (message: string) => void;
};

export function StripeEmbeddedCheckout({ clientSecret, onError }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const onErrorRef = useRef(onError);
  onErrorRef.current = onError;
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (!pk) {
      const msg = "Clé publique Stripe manquante (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY).";
      setLocalError(msg);
      onErrorRef.current?.(msg);
      return;
    }

    let cancelled = false;
    let embedded: { destroy: () => void } | null = null;

    (async () => {
      try {
        const stripe = await loadStripe(pk);
        if (!stripe || cancelled) return;

        const instance = await stripe.initEmbeddedCheckout({ clientSecret });
        if (cancelled) {
          instance.destroy();
          return;
        }
        embedded = instance;
        const el = hostRef.current;
        if (el) instance.mount(el);
      } catch (e) {
        const msg =
          e instanceof Error ? e.message : "Impossible d’afficher le paiement sécurisé.";
        if (!cancelled) {
          setLocalError(msg);
          onErrorRef.current?.(msg);
        }
      }
    })();

    return () => {
      cancelled = true;
      embedded?.destroy();
    };
  }, [clientSecret]);

  return (
    <div className="w-full">
      {(localError || null) && (
        <p className="mb-3 text-sm text-red-600" role="alert">
          {localError}
        </p>
      )}
      <div
        ref={hostRef}
        className="min-h-[480px] w-full rounded-xl border border-qissali-rose-light bg-white"
      />
    </div>
  );
}
