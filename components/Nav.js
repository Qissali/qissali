"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useOrderModal } from "@/components/Modal";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { openModal } = useOrderModal();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 min-h-[80px] border-b border-[var(--rose-light)] bg-white/75 backdrop-blur-md transition-shadow duration-300 ease-out ${
        scrolled
          ? "scrolled shadow-lg shadow-[#9B6EC8]/25"
          : "shadow-none"
      }`}
    >
      <div className="mx-auto flex min-h-[80px] max-w-6xl items-center justify-between gap-3 px-3 py-2.5 sm:gap-6 sm:px-6 sm:py-3.5">
        <Link
          href="/"
          className="shrink-0 transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve-deep)]"
        >
          <Image
            src="/logo-qissali.png"
            alt="Qissali — Mon histoire islamique personnalisée"
            width={180}
            height={90}
            priority
            className="h-[56px] w-auto max-w-[min(180px,55vw)] object-contain sm:h-[64px] lg:h-[70px]"
          />
        </Link>
        <button
          type="button"
          onClick={openModal}
          className="shrink-0 rounded-[50px] bg-gradient-to-r from-[var(--rose)] to-[var(--mauve)] px-4 py-2.5 text-center text-sm font-bold text-white shadow-md shadow-[#9B6EC8]/45 transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--mauve-deep)] active:scale-[0.98] sm:px-6 sm:py-3 sm:text-base"
        >
          Commander mon histoire 🌙
        </button>
      </div>
    </header>
  );
}
