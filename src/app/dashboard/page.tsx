'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAuth } from '@/hooks/useAuth';
import { BalanceCard } from '@/components/dashboard/BalanceCard';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { TransactionHistory } from '@/components/dashboard/TransactionHistory';
import { DepositsList } from '@/components/dashboard/DepositsList';
import { DepositModal } from '@/components/dashboard/DepositModal';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { user, loading, isAuthenticating, isAuthenticated, authenticate, logout, refetch } = useAuth();
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  useEffect(() => {
    if (!loading && !isAuthenticating) {
      if (!isConnected) {
        toast.error('Please connect your wallet');
        router.push('/');
      } else if (isConnected && !isAuthenticated) {
        // Auto-authenticate
        authenticate();
      }
    }
  }, [loading, isAuthenticating, isConnected, isAuthenticated]);
  
  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };
  
  const handleDepositSuccess = () => {
    refetch();
  };
  
  if (loading || isAuthenticating || !isConnected || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-400">
            {!isConnected ? 'Waiting for wallet connection...' : 'Authenticating...'}
          </p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Unable to load user data</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-arbitrum rounded-lg hover:bg-arbitrum-dark transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-white/10 sticky top-0 bg-background/80 backdrop-blur-lg z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold gradient-text">Investment Dashboard</h1>
            <p className="text-sm text-gray-400 mt-1">
              {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <ConnectButton />
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* KYC Warning */}
        {settings?.kycRequired && !user.kycVerified && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-yellow-400">
              ⚠️ <strong>KYC Required:</strong> Please complete identity verification before making deposits.
            </p>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setDepositModalOpen(true)}
            className="px-6 py-3 bg-arbitrum hover:bg-arbitrum-dark rounded-lg font-semibold transition-colors flex items-center gap-2"
          >
            <span>💰</span>
            Deposit {settings?.tokenSymbol || 'USDC'}
          </button>
          
          {settings?.withdrawalsEnabled && (
            <button
              className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-lg font-semibold transition-colors border border-white/10"
            >
              Request Withdrawal
            </button>
          )}
        </div>
        
        {/* Dashboard Grid */}
        <div className="space-y-6">
          {/* Balance */}
          <BalanceCard user={user} nav={settings?.currentNav || '1.0'} />
          
          {/* Performance Chart */}
          <PerformanceChart />
          
          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DepositsList />
            <TransactionHistory />
          </div>
        </div>
      </main>
      
      {/* Deposit Modal */}
      <DepositModal
        isOpen={depositModalOpen}
        onClose={() => setDepositModalOpen(false)}
        onSuccess={handleDepositSuccess}
      />
    </div>
  );
}
