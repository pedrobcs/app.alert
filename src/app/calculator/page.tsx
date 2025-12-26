import { CalculatorApp } from '@/components/CalculatorApp';

export default function CalculatorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-5xl px-4 py-8">
        <CalculatorApp />
      </div>
    </main>
  );
}
