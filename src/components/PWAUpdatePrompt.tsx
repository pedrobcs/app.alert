'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import { useHaptics } from '@/lib/haptics';

export function PWAUpdatePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const haptics = useHaptics();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Listen for service worker updates
      navigator.serviceWorker.ready.then((reg) => {
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New service worker available
                setRegistration(reg);
                setShowPrompt(true);
              }
            });
          }
        });
      });

      // Check for updates every hour
      setInterval(() => {
        navigator.serviceWorker.ready.then((reg) => {
          reg.update();
        });
      }, 60 * 60 * 1000);
    }
  }, []);

  const handleUpdate = () => {
    haptics.impact('medium');
    
    if (registration && registration.waiting) {
      // Tell the service worker to skip waiting
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    haptics.impact('light');
    setShowPrompt(false);
  };

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-0 left-0 right-0 z-50 safe-top"
        >
          <div className="mx-4 mt-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="card-premium p-4 shadow-2xl border-2 border-green-200 bg-gradient-to-r from-green-50 to-emerald-50"
            >
              <div className="flex items-center space-x-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg"
                >
                  <RefreshCw className="w-6 h-6 text-white" />
                </motion.div>

                <div className="flex-1">
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Update Available
                  </h3>
                  <p className="text-sm text-gray-600">
                    A new version is ready. Refresh to get the latest features.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={handleUpdate}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary text-sm px-4 py-2"
                  >
                    Update Now
                  </motion.button>
                  
                  <motion.button
                    onClick={handleDismiss}
                    whileTap={{ scale: 0.95 }}
                    className="text-sm text-gray-600 hover:text-gray-900 px-3"
                  >
                    Later
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
