import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 text-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center justify-between gap-4">
          <div className="text-lg font-semibold tracking-tight">
            Construction Master Web
          </div>
          <div className="text-sm text-neutral-300">
            pt/en (i18n) • Next.js • TypeScript • Tailwind
          </div>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl">
              Calculadora de obra no navegador
            </h1>
            <p className="mt-4 text-neutral-200">
              Clone e expansão da calculadora estilo “Construction Master”: pitch,
              rise/run/diag, conversões e escadas (primeira entrega).
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/calculator"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-neutral-950 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              >
                Abrir Calculadora
              </Link>
              <a
                href="#scope"
                className="inline-flex items-center justify-center rounded-xl bg-neutral-800 px-6 py-3 font-semibold text-neutral-50 hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                Ver escopo
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="rounded-xl border border-neutral-700 bg-neutral-800 p-5">
              <div className="text-right text-5xl font-black tabular-nums">
                0<span className="opacity-60">.</span>
              </div>
              <div className="mt-2 text-right text-sm text-neutral-300">
                Entrada • Resultado • Frações 1/16"
              </div>
            </div>
            <div className="mt-6 grid grid-cols-5 gap-3">
              {["Pitch", "Rise", "Run", "Diag", "Hip/V"].map((k) => (
                <div
                  key={k}
                  className="rounded-2xl bg-neutral-950 px-3 py-4 text-center font-bold italic text-neutral-100 shadow-[inset_0_2px_0_rgba(255,255,255,0.12)]"
                >
                  {k}
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-neutral-400">
              UI inspirada na imagem enviada (teclado grande, botões em “capsule”).
            </div>
          </div>
        </div>

        <section id="scope" className="mt-16 border-t border-neutral-800 pt-10">
          <h2 className="text-xl font-bold">Entrega inicial</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-200">
            <li>Landing com CTA “Abrir Calculadora”.</li>
            <li>Calculadora: display + keypad chamando API interna.</li>
            <li>
              Funções completas: pitch, rise, run, diag, conversões e stair.
            </li>
            <li>i18n pt/en (base) e testes unitários (vitest).</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
