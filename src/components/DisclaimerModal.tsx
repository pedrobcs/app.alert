'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function DisclaimerModal() {
  const [isOpen, setIsOpen] = useState(false);
  
  useEffect(() => {
    // Check if user has accepted disclaimer
    const hasAccepted = localStorage.getItem('disclaimer-accepted');
    if (!hasAccepted) {
      setIsOpen(true);
    }
  }, []);
  
  const handleAccept = () => {
    localStorage.setItem('disclaimer-accepted', 'true');
    setIsOpen(false);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-900 rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-yellow-500/30"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">⚠️</span>
              <h2 className="text-3xl font-bold text-yellow-400">
                Important Legal Disclaimer
              </h2>
            </div>
            
            <div className="space-y-4 text-gray-300 leading-relaxed mb-8">
              <section>
                <h3 className="font-bold text-white mb-2">Risk Warning</h3>
                <p>
                  Cryptocurrency trading and investment involves substantial risk of loss. 
                  The value of your investment can go up or down. Past performance is not 
                  indicative of future results. You may lose some or all of your initial investment.
                </p>
              </section>
              
              <section>
                <h3 className="font-bold text-white mb-2">Direct Wallet Transfer</h3>
                <p>
                  By using this platform, you acknowledge that deposits are sent <strong>directly 
                  to the operator's wallet address</strong>. This platform facilitates the transfer 
                  but does not custody your funds. Once transferred, funds are under the control 
                  of the operator.
                </p>
              </section>
              
              <section>
                <h3 className="font-bold text-white mb-2">No Investment Advice</h3>
                <p>
                  This platform does not provide investment, financial, tax, or legal advice. 
                  Any information provided is for informational purposes only. You should consult 
                  with qualified professionals before making investment decisions.
                </p>
              </section>
              
              <section>
                <h3 className="font-bold text-white mb-2">Regulatory Compliance</h3>
                <p>
                  You are responsible for ensuring that your use of this platform complies with 
                  applicable laws and regulations in your jurisdiction. This platform may require 
                  KYC/AML verification depending on your location and regulatory requirements.
                </p>
              </section>
              
              <section>
                <h3 className="font-bold text-white mb-2">Smart Contract Risk</h3>
                <p>
                  While deposits are verified on-chain, all blockchain transactions are irreversible. 
                  Ensure you are sending funds to the correct address. Double-check all transaction 
                  details before confirming.
                </p>
              </section>
              
              <section>
                <h3 className="font-bold text-white mb-2">No Guarantee of Returns</h3>
                <p>
                  There is no guarantee of profit or returns on your investment. Trading strategies 
                  may underperform or result in losses. The operator's trading performance may vary 
                  significantly over time.
                </p>
              </section>
              
              <section>
                <h3 className="font-bold text-white mb-2">Withdrawal Terms</h3>
                <p>
                  Withdrawal requests are subject to the fund's terms and conditions. There may be 
                  lock-up periods, notice requirements, or withdrawal fees. Check the specific terms 
                  before depositing.
                </p>
              </section>
              
              <section>
                <h3 className="font-bold text-white mb-2">Your Responsibility</h3>
                <p>
                  By accepting this disclaimer, you acknowledge that:
                </p>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>You understand and accept all risks involved</li>
                  <li>You are only investing funds you can afford to lose</li>
                  <li>You have read and understood the platform terms</li>
                  <li>You are of legal age and capacity to enter into this agreement</li>
                  <li>You will not hold the platform liable for any losses</li>
                </ul>
              </section>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm font-semibold">
                ONLY INVEST WHAT YOU CAN AFFORD TO LOSE
              </p>
            </div>
            
            <button
              onClick={handleAccept}
              className="w-full px-8 py-4 bg-arbitrum hover:bg-arbitrum-dark rounded-lg font-semibold text-lg transition-colors"
            >
              I Understand and Accept the Risks
            </button>
            
            <p className="text-xs text-gray-500 text-center mt-4">
              By clicking above, you confirm that you have read, understood, and agree to these terms.
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
