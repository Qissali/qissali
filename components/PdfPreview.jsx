import { CommanderModalTrigger } from "@/components/Modal";

export function PdfPreview() {
  return (
    <section className="bg-[var(--white)]">
      <div className="mx-auto max-w-[1100px] px-8 py-[90px]">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div className="relative mx-auto h-[280px] w-[200px] sm:h-[320px] sm:w-[230px] lg:h-[360px] lg:w-[260px]">
            <div
              className="absolute h-full w-full overflow-hidden rounded-[12px] bg-[#fef1f7] shadow-[0_8px_32px_rgba(42,26,46,0.15)]"
              style={{ transform: "rotate(-3deg) translateY(8px)", zIndex: 1 }}
            >
              <div className="p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--mauve-deep)]/70">
                  Débat
                </p>
                <div className="mt-3 space-y-2">
                  <div className="h-2 w-[86%] rounded bg-[var(--rose)]/35" />
                  <div className="h-2 w-[78%] rounded bg-[var(--rose)]/30" />
                  <div className="h-2 w-[65%] rounded bg-[var(--rose)]/28" />
                </div>
              </div>
            </div>

            <div
              className="absolute h-full w-full overflow-hidden rounded-[12px] bg-white shadow-[0_8px_32px_rgba(42,26,46,0.15)]"
              style={{ transform: "rotate(1deg) translateY(4px)", zIndex: 2 }}
            >
              <div className="p-4">
                <p className="text-[11px] font-semibold text-[var(--text-mid)]">Qissali</p>
                <div className="mt-3 space-y-2.5">
                  <div className="h-2.5 w-[92%] rounded bg-slate-200" />
                  <div className="h-2.5 w-[88%] rounded bg-slate-200" />
                  <div className="h-2.5 w-[76%] rounded bg-slate-200" />
                  <div className="h-2.5 w-[83%] rounded bg-slate-200" />
                  <div className="h-2.5 w-[70%] rounded bg-slate-200" />
                </div>
              </div>
            </div>

            <div
              className="absolute h-full w-full overflow-hidden rounded-[12px] bg-[#2a1a2e] text-white shadow-[0_8px_32px_rgba(42,26,46,0.15)]"
              style={{ transform: "rotate(0deg)", zIndex: 3 }}
            >
              <div className="flex h-full flex-col p-5">
                <p className="text-xs font-semibold tracking-[0.18em] text-white/75">QISSALI</p>
                <div className="mt-5 flex flex-1 flex-col items-center justify-center text-center">
                  <span className="text-5xl" aria-hidden>
                    👑
                  </span>
                  <p className="mt-3 text-sm font-medium text-white/90">L&apos;histoire de Nour</p>
                  <p className="mt-2 text-sm italic text-white/80">et les lettres qui dansaient</p>
                </div>
                <div className="mt-auto flex flex-wrap justify-center gap-2">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px]">Aïd el-Fitr</span>
                  <span className="rounded-full bg-white/15 px-3 py-1 text-[11px]">Courage</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-[13px] font-medium uppercase tracking-[4px] text-[var(--mauve)]">
              ✦ Ce que tu reçois par email
            </p>
            <ul className="mt-6 space-y-3 text-[16px] leading-relaxed text-[var(--text)]">
              <li>✅ 6 pages illustrées</li>
              <li>✅ Histoire complète (~800 mots)</li>
              <li>✅ Prénom de ton enfant partout</li>
              <li>✅ Hadith intégré naturellement</li>
              <li>✅ Débat + défi de la semaine</li>
              <li>✅ PDF haute qualité à imprimer</li>
            </ul>
            <CommanderModalTrigger className="mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--rose)] to-[var(--mauve)] px-8 py-3 text-sm font-bold text-white shadow-md shadow-[#9B6EC8]/30 transition hover:brightness-105">
              Créer l&apos;histoire de mon enfant →
            </CommanderModalTrigger>
          </div>
        </div>
      </div>
    </section>
  );
}

