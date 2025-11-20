'use client';

import { motion } from 'framer-motion';

const features = [
  {
    icon: '🔒',
    title: 'Secure & Transparent',
    description: 'All deposits are verified on-chain. Your USDC goes directly to the operator wallet on Arbitrum.',
  },
  {
    icon: '⚡',
    title: 'Low Fees',
    description: 'Leverage Arbitrum\'s low transaction costs. No hidden fees, just performance-based returns.',
  },
  {
    icon: '📊',
    title: 'Real-Time Dashboard',
    description: 'Track your investment, deposits, and returns in real-time through your personal dashboard.',
  },
  {
    icon: '🤖',
    title: 'Automated Trading',
    description: 'Professional trading algorithms work 24/7 to generate returns on your investment.',
  },
  {
    icon: '💰',
    title: 'USDC on Arbitrum',
    description: 'Use stable, trusted USDC on Arbitrum for fast, cost-effective transactions.',
  },
  {
    icon: '📈',
    title: 'Performance Tracking',
    description: 'View detailed charts and transaction history. Complete transparency on your investment.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Built with security, transparency, and performance in mind
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass rounded-xl p-8 card-hover"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
