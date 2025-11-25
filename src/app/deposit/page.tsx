'use client';

import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { DepositModalMultiChain } from '@/components/DepositModalMultiChain';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export default function DepositPage() {
  const { isConnected } = useAccount();
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    fetchSettings();
  }, [isConnected]);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (!res.ok) throw new Error('Failed to fetch settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <AnimatedBackground />
        <Navbar />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />
      {settings && (
        <DepositModalMultiChain
          isOpen={true}
          onClose={() => router.push('/dashboard')}
          operatorWallet={settings.operatorWallet}
          solanaWallet={settings.solanaWalletAddress}
          tokenSymbol={settings.tokenSymbol}
          minimumDeposit={settings.minimumDeposit}
        />
      )}
    </div>
  );
}
