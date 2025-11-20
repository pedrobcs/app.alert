'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: 'How does the investment work?',
    answer: 'You send USDC on Arbitrum directly to our operator wallet. Your deposit is verified on-chain and credited to your account. Our trading bot uses these funds to execute trades, and you earn returns based on performance.',
  },
  {
    question: 'Is my investment safe?',
    answer: 'All transactions are on-chain and verifiable. However, trading involves risk, and past performance doesn\'t guarantee future returns. Only invest what you can afford to lose. Funds are sent directly to the operator wallet.',
  },
  {
    question: 'What are the fees?',
    answer: 'We charge a performance-based fee (typically 20% on profits) and a small management fee (typically 2% annually). No deposit or withdrawal fees. Exact fees are displayed in your dashboard.',
  },
  {
    question: 'Can I withdraw my funds?',
    answer: 'Withdrawal policies depend on the fund terms. Check your dashboard for withdrawal options and any applicable lock-up periods. Withdrawals are processed manually by the operator.',
  },
  {
    question: 'What is the minimum investment?',
    answer: 'The minimum deposit is typically $100 USDC, but this can be configured by the operator. Check the deposit modal for current requirements.',
  },
  {
    question: 'Do I need KYC verification?',
    answer: 'KYC requirements depend on your jurisdiction and fund configuration. Some funds may require identity verification before accepting deposits. Check the platform notice for current requirements.',
  },
  {
    question: 'Which USDC token should I use?',
    answer: 'We accept USDC on Arbitrum. Make sure you\'re using the correct token address shown in the deposit modal. Both bridged USDC.e and native USDC are typically supported.',
  },
  {
    question: 'How are returns calculated?',
    answer: 'Returns are based on the Net Asset Value (NAV) of the fund. Your share of the fund appreciates/depreciates based on trading performance. Performance is tracked in real-time on your dashboard.',
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-400">
            Everything you need to know about investing
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="glass rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-white/5 transition-colors"
              >
                <span className="font-semibold text-lg pr-8">{faq.question}</span>
                <span className="text-2xl text-arbitrum flex-shrink-0">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6 text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
