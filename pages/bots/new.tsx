/**
 * Create New Bot Page
 * 
 * Form to create and configure a new trading bot
 */

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { WalletConnectButton } from '@/components/WalletConnector';
import { BotConfigForm, BotFormData } from '@/components/BotConfigForm';
import Link from 'next/link';

export default function NewBot() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: BotFormData) => {
    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsCreating(true);
      setError(null);

      const response = await fetch('/api/bots/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          ...formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create bot');
      }

      const data = await response.json();
      console.log('Bot created:', data);

      // Redirect to home page
      router.push('/');
    } catch (err: any) {
      console.error('Error creating bot:', err);
      setError(err.message || 'Failed to create bot');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-3xl">📈</div>
              <div>
                <h1 className="text-2xl font-bold text-white">Hyperliquid Trading Bot</h1>
                <p className="text-sm text-gray-400">Create New Bot</p>
              </div>
            </Link>
            <WalletConnectButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-6 text-sm text-gray-400">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">Create New Bot</span>
          </div>

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Create Trading Bot</h1>
            <p className="text-gray-400">
              Configure your automated Wyckoff trading bot for Hyperliquid
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-500 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <span className="text-xl">❌</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-red-400 mb-1">Error</h4>
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-6 bg-blue-900/30 border border-blue-500 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">ℹ️</span>
              <div className="flex-1 text-sm text-blue-300">
                <strong>Quick Start:</strong> Start with default settings to create a basic bot. 
                You can adjust Wyckoff parameters later after observing the bot&apos;s behavior. 
                Always test on testnet first!
              </div>
            </div>
          </div>

          {/* Form */}
          <BotConfigForm onSubmit={handleSubmit} isLoading={isCreating} />

          {/* Reference Links */}
          <div className="mt-6 bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Learn More</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <a
                href="https://hyperliquid.gitbook.io/hyperliquid-docs"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-primary transition-colors"
              >
                📚 Hyperliquid Documentation →
              </a>
              <a
                href="https://school.stockcharts.com/doku.php?id=market_analysis:the_wyckoff_method"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-primary transition-colors"
              >
                📖 Wyckoff Method Guide →
              </a>
              <a
                href="https://github.com/nktkas/hyperliquid"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-primary transition-colors"
              >
                💻 Hyperliquid SDK Examples →
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
