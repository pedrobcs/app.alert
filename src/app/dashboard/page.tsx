'use client';

import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { InstitutionalSidebar } from '@/components/dashboard/InstitutionalSidebar';
import { Header } from '@/components/dashboard/Header';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { ProfessionalChart } from '@/components/dashboard/ProfessionalChart';
import { SwapWidget } from '@/components/dashboard/SwapWidget';
import { CryptoAssetsTable } from '@/components/dashboard/CryptoAssetsTable';
import { AIInsightsSection } from '@/components/dashboard/AIInsightsSection';
import { useWalletBalance } from '@/hooks/useWalletBalance';

export default function DashboardPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const { balance, loading } = useWalletBalance();

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }
  }, [isConnected, router]);

  if (loading || !balance) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-orange border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.02, 0.04, 0.02],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-1/4 w-96 h-96 bg-orange rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.01, 0.03, 0.01],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-dark rounded-full blur-3xl"
        />
      </div>

      {/* Grid Pattern */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(227, 84, 4, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(227, 84, 4, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Sidebar */}
      <InstitutionalSidebar />

      {/* Main Content */}
      <div className="lg:ml-72 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-8"
          >
            {/* Balance Card */}
            <BalanceCard
              balance={balance.total}
              change24h={parseFloat(balance.change24h)}
            />

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chart - 2 columns */}
              <div className="lg:col-span-2">
                <ProfessionalChart />
              </div>

              {/* Swap Widget - 1 column */}
              <div>
                <SwapWidget />
              </div>
            </div>

            {/* AI Insights */}
            <AIInsightsSection />

            {/* Assets Table */}
            <CryptoAssetsTable />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
