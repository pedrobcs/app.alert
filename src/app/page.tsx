'use client';

import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Lock, Zap, BarChart3, CheckCircle, ArrowRight, Sparkles, Star, DollarSign, Users, Smartphone, Layers } from 'lucide-react';

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 bg-white rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="spinner"></div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-3">Authenticating...</h2>
          <p className="text-gray-600 text-lg">Please sign the message in your wallet</p>
        </motion.div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section - Apple Style */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            {/* Premium Badge */}
            <motion.div 
              variants={itemVariants} 
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-blue-700 text-sm font-bold mb-8 shadow-lg backdrop-blur-sm"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              <span>Multi-Chain • Arbitrum & Solana</span>
              <Sparkles className="w-5 h-5 ml-2" />
            </motion.div>

            {/* Hero Headline - Apple Typography */}
            <motion.h1
              variants={itemVariants}
              className="text-hero font-bold mb-6 leading-tight"
            >
              Invest <span className="text-gradient">USDC</span><br />
              <span className="text-gradient">Anywhere</span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              Premium automated trading on Arbitrum & Solana.
              <br />
              <span className="font-semibold text-gray-800">Transparent. Secure. Mobile-first.</span>
            </motion.p>

            {/* CTA Buttons - Apple Style */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <motion.button
                    onClick={openConnectModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-primary text-lg px-12 py-5 shadow-2xl hover:shadow-blue-500/50 flex items-center space-x-3 group w-full sm:w-auto"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                )}
              </ConnectButton.Custom>

              <motion.a
                href="#how-it-works"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="btn btn-outline text-lg px-12 py-5 flex items-center space-x-3 group w-full sm:w-auto"
              >
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
            </motion.div>

            {/* Stats Grid - Glass Morphism Cards */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl mx-auto"
            >
              {[
                { value: '$2.5M+', label: 'Assets Under Management', icon: DollarSign, color: 'from-blue-500 to-blue-600' },
                { value: '+24.3%', label: 'YTD Returns', icon: TrendingUp, color: 'from-green-500 to-green-600' },
                { value: '500+', label: 'Active Investors', icon: Users, color: 'from-purple-500 to-purple-600' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="card-glass text-center group cursor-pointer"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl group-hover:shadow-2xl transition-shadow group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Mobile-First Grid */}
      <section id="features" className="py-20 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-display font-bold text-gray-900 mb-6">
              Why Choose <span className="text-gradient">ArbiBot</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Professional-grade trading, accessible to everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Layers,
                title: 'Multi-Chain Support',
                description: 'Deposit USDC from Arbitrum or Solana. Flexible, fast, and convenient for all users.',
                color: 'from-blue-500 to-purple-500',
              },
              {
                icon: Smartphone,
                title: 'Mobile-First Design',
                description: 'Beautifully crafted for mobile. Enjoy a premium Apple-inspired experience on any device.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: Shield,
                title: 'Secure & Transparent',
                description: 'All deposits verified on-chain. Your funds go directly to the operator wallet with full transparency.',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: TrendingUp,
                title: 'Proven Strategy',
                description: 'Algorithmic trading bot with consistent market outperformance and systematic BTC strategies.',
                color: 'from-emerald-500 to-teal-500',
              },
              {
                icon: Lock,
                title: 'Non-Custodial',
                description: 'You control your wallet. Deposits tracked on-chain and credited automatically.',
                color: 'from-pink-500 to-rose-500',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Low fees and fast confirmations on Arbitrum and Solana. Deposits confirmed in minutes.',
                color: 'from-orange-500 to-red-500',
              },
              {
                icon: BarChart3,
                title: 'Real-time Dashboard',
                description: 'Track investments, view transaction history, and monitor performance in real-time.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: CheckCircle,
                title: 'Simple Process',
                description: 'Connect wallet, send USDC, start earning. No complex procedures required.',
                color: 'from-indigo-500 to-purple-500',
              },
              {
                icon: Sparkles,
                title: 'Premium Experience',
                description: 'Crafted with attention to detail. Smooth animations and delightful interactions.',
                color: 'from-yellow-500 to-orange-500',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="card-premium group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-2xl transition-shadow`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Mobile Optimized */}
      <section id="how-it-works" className="py-20 md:py-32 relative z-10 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-display font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start investing in 3 simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { step: '1', title: 'Connect Wallet', description: 'Connect your MetaMask, Phantom, or any wallet. Choose between Arbitrum or Solana.' },
              { step: '2', title: 'Send USDC', description: 'Transfer USDC from your preferred chain. Minimum $100. Verified on-chain instantly.' },
              { step: '3', title: 'Track Returns', description: 'Monitor your investment in real-time. View performance and transaction history anytime.' },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center text-3xl md:text-4xl font-bold mx-auto mb-6 shadow-2xl group-hover:shadow-blue-500/50"
                >
                  {step.step}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Apple Card Style */}
      <section className="py-20 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-premium p-8 md:p-16 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-pink-600/10"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-6">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      rotate: [0, 360],
                      y: [0, -10, 0]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                  >
                    <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                  </motion.div>
                ))}
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
                Ready to Start Earning?
              </h2>
              <p className="text-xl text-gray-600 mb-10">
                Join hundreds of investors already earning with ArbiBot
              </p>
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <motion.button
                    onClick={openConnectModal}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn btn-primary text-lg px-12 py-5 shadow-2xl hover:shadow-blue-500/50"
                  >
                    Connect Wallet Now
                  </motion.button>
                )}
              </ConnectButton.Custom>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Modern & Clean */}
      <footer className="bg-gray-900 text-white py-12 md:py-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <span className="text-white font-bold text-xl">AB</span>
                </div>
                <span className="font-bold text-2xl">ArbiBot</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Premium automated USDC trading on Arbitrum & Solana
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-lg">Legal</h4>
              <ul className="space-y-3 text-gray-400">
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
              <h4 className="font-bold mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="mailto:support@arbibot.com" className="hover:text-white transition-colors">
                    support@arbibot.com
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 md:mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ArbiBot. All rights reserved.</p>
            <p className="mt-3 text-sm max-w-3xl mx-auto">
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
