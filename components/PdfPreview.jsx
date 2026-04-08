import { CommanderModalTrigger } from "@/components/Modal";

export function PdfPreview() {
  return (
    <section className="bg-[var(--white)]">
      <div className="mx-auto max-w-[1100px] px-8 py-[90px]">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
          <div className="pdf-stack">
            <div className="pdf-card pdf-card-back-rose">
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

            <div className="pdf-card pdf-card-middle-white">
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

            <div className="pdf-card pdf-card-front-dark text-white">
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

      <style jsx>{`
        .pdf-stack {
          position: relative;
          width: 200px;
          height: 280px;
          margin: 0 auto;
        }
        .pdf-card {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(42, 26, 46, 0.15);
          overflow: hidden;
        }
        .pdf-card-back-rose {
          transform: rotate(-3deg) translateY(8px);
          z-index: 1;
          background: #fef1f7;
        }
        .pdf-card-middle-white {
          transform: rotate(1deg) translateY(4px);
          z-index: 2;
          background: white;
        }
        .pdf-card-front-dark {
          transform: rotate(0deg);
          z-index: 3;
          background: #2a1a2e;
        }
        @media (min-width: 640px) {
          .pdf-stack {
            width: 230px;
            height: 320px;
          }
        }
        @media (min-width: 1024px) {
          .pdf-stack {
            width: 260px;
            height: 360px;
          }
        }
      `}</style>
    </section>
  );
}

