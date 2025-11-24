'use client';

import { motion } from 'framer-motion';
import { Network } from 'lucide-react';

export type Chain = 'arbitrum' | 'solana';

interface ChainSelectorProps {
  selectedChain: Chain;
  onSelectChain: (chain: Chain) => void;
}

export function ChainSelector({ selectedChain, onSelectChain }: ChainSelectorProps) {
  const chains = [
    {
      id: 'arbitrum' as Chain,
      name: 'Arbitrum',
      icon: '⚡',
      color: 'from-blue-500 to-blue-600',
      description: 'Ethereum L2',
    },
    {
      id: 'solana' as Chain,
      name: 'Solana',
      icon: '🌊',
      color: 'from-purple-500 to-pink-600',
      description: 'High-speed blockchain',
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm font-bold text-gray-700">
        <Network className="w-4 h-4" />
        <span>Select Network</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {chains.map((chain) => (
          <motion.button
            key={chain.id}
            onClick={() => onSelectChain(chain.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative overflow-hidden rounded-xl p-4 transition-all ${
              selectedChain === chain.id
                ? 'ring-2 ring-offset-2 ring-blue-500 shadow-lg'
                : 'ring-1 ring-gray-200 hover:ring-gray-300'
            }`}
          >
            {/* Background gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${chain.color} opacity-${
                selectedChain === chain.id ? '20' : '5'
              } transition-opacity`}
            />
            
            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{chain.icon}</span>
                {selectedChain === chain.id && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </motion.div>
                )}
              </div>
              <div className="text-left">
                <div className="font-bold text-gray-900 mb-1">{chain.name}</div>
                <div className="text-xs text-gray-600">{chain.description}</div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
