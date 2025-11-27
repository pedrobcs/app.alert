'use client';

import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingUp,
  Lock,
  Zap,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Star,
  DollarSign,
  Users,
  Wallet,
} from 'lucide-react';

export default function HomePage() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const { authenticate, isAuthenticating } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected && address) {
      handleAuthentication();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, mounted]);

  const handleAuthentication = async () => {
    const success = await authenticate();
    if (success) {
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    }
  };

  if (!mounted) {
    return null;
  }

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full border-4 border-white/10 border-b-[#ff9a3c] animate-spin" />
          <h2 className="text-2xl font-semibold">Authenticating...</h2>
          <p className="text-[var(--muted)]">Please sign the message in your wallet</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      <main className="relative z-10 px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="mx-auto max-w-6xl pt-24 pb-24 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-xs uppercase tracking-[0.6em] text-[var(--muted)]">
              <Sparkles className="h-4 w-4 text-[#ff9a3c]" />
              Arbitrum Layer 2 Desk
            </div>
            <h1 className="mt-8 text-4xl font-semibold leading-tight text-[var(--foreground)] sm:text-5xl md:text-6xl">
              Easier, smarter USDC deployment into
              <span className="block text-gradient">automated trading intelligence</span>
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg text-[var(--muted)]">
              Connect, fund, and monitor a premium BTC trading bot that mirrors the same aesthetic and data discipline you see across the ArbiBot dashboard.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button onClick={openConnectModal} className="cta-button text-base">
                    Connect wallet to start
                    <span className="cta-button-icon">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </button>
                )}
              </ConnectButton.Custom>
              <a href="#features" className="btn-ghost text-sm">
                Explore capabilities
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-16 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {[
                { value: '$2.5M+', label: 'Assets under automation', icon: DollarSign },
                { value: '+24.3%', label: 'Year-to-date P/L', icon: TrendingUp },
                { value: '500+', label: 'Active investors', icon: Users },
              ].map((stat) => (
                <div key={stat.label} className="glow-card text-left p-6">
                  <div className="flex items-center gap-3 text-[var(--muted)]">
                    <stat.icon className="h-5 w-5" />
                    {stat.label}
                  </div>
                  <p className="mt-3 text-3xl font-semibold">{stat.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl py-20">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--muted)]">Why ArbiBot</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Enterprise precision, investor accessibility</h2>
            <p className="mt-3 text-[var(--muted)]">Every element of the platform mirrors the CRM dashboard you saw—glass, glow, and actionable data.</p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              { icon: Shield, title: 'Secure & transparent', description: 'On-chain deposits with live tracking and notarized vault balances.' },
              { icon: Zap, title: 'Arbitrum velocity', description: 'Ultra-low fees and instant confirmations keep capital nimble.' },
              { icon: BarChart3, title: 'Live CRM dashboard', description: 'Same premium dashboard theme with KPIs, charts, and tables.' },
              { icon: Lock, title: 'Non-custodial oversight', description: 'You retain control while ArbiBot automates execution.' },
              { icon: TrendingUp, title: 'Quant playbooks', description: 'Adaptive strategies with momentum, carry, and hedging layers.' },
              { icon: CheckCircle, title: 'Frictionless flow', description: 'Connect, deposit, and monitor—all inside one polished surface.' },
            ].map((feature) => (
              <div key={feature.title} className="glass-panel p-6">
                <feature.icon className="h-6 w-6 text-[#ff9a3c]" />
                <h3 className="mt-4 text-2xl font-semibold">{feature.title}</h3>
                <p className="mt-2 text-[var(--muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="mx-auto max-w-6xl py-20">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.5em] text-[var(--muted)]">Workflow</p>
            <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Three curated steps</h2>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { step: '01', title: 'Connect wallet', description: 'Switch to Arbitrum and prepare USDC for automated deployment.' },
              { step: '02', title: 'Send capital', description: 'Transfer USDC to the operator wallet—instant ledger updates inside the CRM.' },
              { step: '03', title: 'Monitor & adjust', description: 'Review KPIs, withdraw, or add more liquidity from the same dashboard.' },
            ].map((item) => (
              <div key={item.step} className="glow-card p-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-lg font-semibold">
                  {item.step}
                </div>
                <h3 className="mt-4 text-2xl font-semibold">{item.title}</h3>
                <p className="mt-2 text-[var(--muted)]">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Wallet snippet */}
        <section className="mx-auto max-w-6xl pb-20">
          <div className="glass-panel grid items-center gap-10 p-8 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.5em] text-[var(--muted)]">Operator wallet</p>
              <h2 className="mt-3 text-3xl font-semibold">USDC desk overview</h2>
              <p className="mt-3 text-[var(--muted)]">
                Deposits settle to a multi-sig wallet. Credits appear instantly in your CRM dashboard with the same neon aesthetic.
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm text-[var(--muted)]">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-[#ff9a3c]" />
                  0x91c...4af
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                  NAV synced hourly
                </div>
              </div>
            </div>
            <div className="glow-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[var(--muted)]">Available balance</p>
                  <h3 className="mt-2 text-3xl font-semibold">$1,120,450</h3>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                  <Zap className="h-5 w-5 text-[#ff9a3c]" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                {[
                  { label: 'Deposits', value: '$2.45M', tone: 'text-emerald-400' },
                  { label: 'Withdrawals', value: '$645K', tone: 'text-rose-400' },
                  { label: 'Pending', value: '$24.5K', tone: 'text-[#ff9a3c]' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-black/5 bg-white/90 p-3 text-[var(--muted)] dark:border-white/10 dark:bg-white/5">
                    <p>{item.label}</p>
                    <p className={`mt-1 text-lg font-semibold ${item.tone}`}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl pb-24">
          <div className="glass-panel p-10 text-center">
            <div className="flex justify-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-[#ff9a3c]" />
              ))}
            </div>
            <h2 className="mt-6 text-3xl font-semibold">Bring your USDC into the same experience</h2>
            <p className="mt-3 text-[var(--muted)]">
              The home, onboarding, and dashboard surfaces now share one neon CRM aesthetic—connect once and operate with confidence.
            </p>
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button onClick={openConnectModal} className="cta-button mt-8">
                  Connect wallet now
                  <span className="cta-button-icon">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </button>
              )}
            </ConnectButton.Custom>
          </div>
        </section>
      </main>

      <footer className="bg-black/90 text-white/70">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-sm">ArbiBot • Automated trading intelligence on Arbitrum.</p>
            </div>
            <div>
              <p className="text-sm">support@arbibot.com</p>
            </div>
            <div className="text-sm">
              <p>© {new Date().getFullYear()} ArbiBot. Trading crypto involves risk.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
