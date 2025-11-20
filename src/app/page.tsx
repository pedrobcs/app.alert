'use client';

import { Navbar } from '@/components/Navbar';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Shield, TrendingUp, Lock, Zap, BarChart3, CheckCircle } from 'lucide-react';

export default function HomePage() {
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && isConnected && address) {
      // Authenticate user and redirect to dashboard
      authenticateUser(address);
    }
  }, [isConnected, address, mounted]);

  const authenticateUser = async (walletAddress: string) => {
    try {
      // Get nonce
      const nonceRes = await fetch('/api/auth/nonce', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress }),
      });
      
      if (!nonceRes.ok) throw new Error('Failed to get nonce');
      
      const { nonce } = await nonceRes.json();
      
      // For now, redirect to dashboard
      // In production, you'd sign the nonce with the wallet
      router.push('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Powered by Arbitrum
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Invest USDC into
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Automated Trading
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Put your USDC to work with our proven BTC trading bot on Arbitrum.
              Transparent, secure, and designed for consistent returns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl"
                  >
                    Connect Wallet to Start
                  </button>
                )}
              </ConnectButton.Custom>
              <a
                href="#how-it-works"
                className="btn btn-outline text-lg px-8 py-4"
              >
                Learn How It Works
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto">
              <div className="card text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">$2.5M+</div>
                <div className="text-gray-600">Assets Under Management</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">+24.3%</div>
                <div className="text-gray-600">YTD Returns</div>
              </div>
              <div className="card text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">500+</div>
                <div className="text-gray-600">Active Investors</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose ArbiBot?
            </h2>
            <p className="text-xl text-gray-600">
              Professional-grade trading, accessible to everyone
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Secure & Transparent
              </h3>
              <p className="text-gray-600">
                All deposits are on-chain and verifiable. Your funds go directly to
                the operator wallet with full transparency.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Proven Strategy
              </h3>
              <p className="text-gray-600">
                Our algorithmic trading bot has consistently outperformed the market
                with systematic BTC strategies.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Non-Custodial
              </h3>
              <p className="text-gray-600">
                You control your wallet. Deposits are tracked on-chain and credited
                to your account automatically.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Arbitrum Speed
              </h3>
              <p className="text-gray-600">
                Low fees and fast confirmations on Arbitrum L2. Your deposits are
                confirmed in minutes.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Real-time Dashboard
              </h3>
              <p className="text-gray-600">
                Track your investments, view transaction history, and monitor
                performance in real-time.
              </p>
            </div>

            <div className="card hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Simple Process
              </h3>
              <p className="text-gray-600">
                Connect wallet, send USDC, and start earning. No complex procedures
                or paperwork required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start investing in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Connect Wallet
              </h3>
              <p className="text-gray-600">
                Connect your MetaMask or WalletConnect wallet. Make sure you're on
                Arbitrum network.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Send USDC
              </h3>
              <p className="text-gray-600">
                Transfer USDC to the operator wallet address. Minimum deposit $100.
                Your transaction is verified on-chain.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-pink-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Track Returns
              </h3>
              <p className="text-gray-600">
                Monitor your investment in the dashboard. View real-time performance
                and transaction history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Is my investment safe?
              </h3>
              <p className="text-gray-600">
                Your funds are sent to a secure operator wallet on Arbitrum. All
                transactions are verifiable on-chain. However, trading involves risk,
                and past performance doesn't guarantee future results.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                What's the minimum deposit?
              </h3>
              <p className="text-gray-600">
                The minimum deposit is $100 USDC. This ensures cost-effective
                processing and meaningful participation in the trading strategy.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                How do I withdraw my funds?
              </h3>
              <p className="text-gray-600">
                Withdrawals can be requested through your dashboard. Withdrawals are
                processed manually and may take 3-5 business days depending on market
                conditions.
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Which USDC token should I use?
              </h3>
              <p className="text-gray-600">
                We support both Arbitrum Bridged USDC (USDC.e) and Arbitrum Native
                USDC. Check the dashboard for the currently accepted token address.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of investors already earning with ArbiBot
          </p>
          <ConnectButton.Custom>
            {({ openConnectModal }) => (
              <button
                onClick={openConnectModal}
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-xl"
              >
                Connect Wallet Now
              </button>
            )}
          </ConnectButton.Custom>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AB</span>
                </div>
                <span className="font-bold text-xl">ArbiBot</span>
              </div>
              <p className="text-gray-400">
                Automated USDC trading on Arbitrum
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Risk Disclosure
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="mailto:support@arbibot.com" className="hover:text-white transition-colors">
                    support@arbibot.com
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ArbiBot. All rights reserved.</p>
            <p className="mt-2 text-sm">
              <strong>Disclaimer:</strong> Trading cryptocurrencies involves risk.
              You may lose some or all of your investment. Only invest what you can
              afford to lose.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
