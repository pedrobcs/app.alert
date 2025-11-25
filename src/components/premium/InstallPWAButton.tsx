'use client';

import { motion } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      
      // Check if user has dismissed the prompt before
      const hasPrompted = localStorage.getItem('pwa-prompt-dismissed');
      if (!hasPrompted) {
        setTimeout(() => setShowPrompt(true), 3000); // Show after 3 seconds
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-50"
    >
      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl">
        {/* Glow */}
        <div className="absolute inset-0 bg-orange/10 rounded-2xl blur-xl" />

        <div className="relative z-10">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>

          {/* Icon */}
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-orange rounded-xl">
              <Download className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1">
              <h3 className="text-white font-semibold mb-1">
                Instalar ArbiBot
              </h3>
              <p className="text-sm text-gray-400 mb-4">
                Adicione à tela inicial para acesso rápido e experiência completa
              </p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInstall}
                className="w-full px-4 py-2.5 bg-orange hover:bg-orange-light text-white font-semibold rounded-xl transition-colors shadow-orange"
              >
                Instalar agora
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
