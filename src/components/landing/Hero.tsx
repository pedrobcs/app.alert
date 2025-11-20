'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-transparent" />
      
      {/* Animated background circles */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-arbitrum/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow delay-1000" />
      
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Invest <span className="gradient-text">USDC</span> in
            <br />
            Automated Trading
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Earn passive returns by investing USDC on Arbitrum into our 
            professional trading bot. Transparent, secure, and efficient.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button
                  onClick={openConnectModal}
                  className="px-8 py-4 bg-arbitrum hover:bg-arbitrum-dark rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-arbitrum/50"
                >
                  Connect Wallet to Start
                </button>
              )}
            </ConnectButton.Custom>
            
            <a
              href="#features"
              className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-lg font-semibold text-lg transition-all border border-white/10"
            >
              Learn More
            </a>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-16">
            <div className="glass rounded-lg p-6">
              <div className="text-3xl font-bold text-arbitrum mb-2">24/7</div>
              <div className="text-gray-400">Automated Trading</div>
            </div>
            <div className="glass rounded-lg p-6">
              <div className="text-3xl font-bold text-arbitrum mb-2">$0</div>
              <div className="text-gray-400">Management Fees*</div>
            </div>
            <div className="glass rounded-lg p-6">
              <div className="text-3xl font-bold text-arbitrum mb-2">Secure</div>
              <div className="text-gray-400">On-Chain Verified</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
