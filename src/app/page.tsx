'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n/I18nProvider';

export default function HomePage() {
  const { dict, locale, toggleLocale } = useI18n();

  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <header className="mx-auto max-w-5xl px-4 py-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm" />
          <div className="font-semibold tracking-tight">{dict.appName}</div>
        </div>
        <button
          type="button"
          onClick={toggleLocale}
          className="rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
          aria-label="Toggle language"
        >
          {locale.toUpperCase()}
        </button>
      </header>

      <section className="mx-auto max-w-5xl px-4 pt-10 pb-16">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/40 p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{dict.appName}</h1>
          <p className="mt-4 max-w-2xl text-zinc-300">{dict.tagline}</p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-b from-amber-400 to-orange-500 px-6 py-4 font-semibold text-zinc-950 shadow-sm hover:from-amber-300 hover:to-orange-400"
            >
              {dict.openCalculator}
            </Link>
            <a
              href="#mvp"
              className="inline-flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 px-6 py-4 font-semibold text-zinc-100 hover:bg-zinc-800"
            >
              MVP allowing pitch/diag/conv/stairs
            </a>
          </div>
        </div>

        <div id="mvp" className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Pitch / Rise / Run', desc: 'Compute pitch index and derive rise/run.' },
            { title: 'Diagonal', desc: 'Right-triangle diagonal from rise and run.' },
            { title: 'Conversions', desc: 'Fast conversions between common units.' },
            { title: 'Stairs', desc: 'Step count and actual riser/tread from total rise.' },
          ].map((x) => (
            <div key={x.title} className="rounded-3xl border border-zinc-800 bg-zinc-950/40 p-6">
              <div className="text-lg font-semibold">{x.title}</div>
              <div className="mt-2 text-zinc-300">{x.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-5xl px-4 pb-10 text-sm text-zinc-500">
        Built with Next.js + TypeScript + Tailwind. MVP focused, modular math API.
      </footer>
    </main>
  );
}
