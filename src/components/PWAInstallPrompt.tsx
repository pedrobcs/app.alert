'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Apple } from 'lucide-react';
import { useHaptics } from '@/lib/haptics';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const haptics = useHaptics();

  useEffect(() => {
    // Check if already installed
    const isInStandaloneMode = () => {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone ||
        document.referrer.includes('android-app://')
      );
    };

    setIsStandalone(isInStandaloneMode());

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Check if prompt was dismissed before
    const promptDismissed = localStorage.getItem('pwa-prompt-dismissed');
    const dismissedDate = promptDismissed ? new Date(promptDismissed) : null;
    const daysSinceDismissed = dismissedDate 
      ? Math.floor((Date.now() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    // Show prompt if not standalone and not recently dismissed
    if (!isInStandaloneMode() && daysSinceDismissed > 7) {
      if (iOS) {
        // Show iOS install instructions after 3 seconds
        setTimeout(() => setShowPrompt(true), 3000);
      }
    }

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show prompt after 3 seconds
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed
    window.addEventListener('appinstalled', () => {
      console.log('PWA was installed');
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    haptics.impact('medium');
    
    if (deferredPrompt) {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      }
      
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    haptics.impact('light');
    setShowPrompt(false);
    localStorage.setItem('pwa-prompt-dismissed', new Date().toISOString());
  };

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 safe-bottom"
        >
          <div className="mx-4 mb-4">
            <div className="card-premium p-6 shadow-2xl border-2 border-blue-200">
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                    className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl"
                  >
                    {isIOS ? (
                      <Apple className="w-8 h-8 text-white" />
                    ) : (
                      <Smartphone className="w-8 h-8 text-white" />
                    )}
                  </motion.div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Install ArbiBot App
                  </h3>
                  
                  {isIOS ? (
                    <div className="text-sm text-gray-600 space-y-2">
                      <p>Add to your Home Screen for the best experience:</p>
                      <ol className="list-decimal list-inside space-y-1 text-xs">
                        <li>Tap the Share button <span className="inline-block">📤</span></li>
                        <li>Scroll down and tap "Add to Home Screen"</li>
                        <li>Tap "Add" in the top right</li>
                      </ol>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Install our app for faster access, offline support, and a native experience.
                    </p>
                  )}

                  {/* Buttons */}
                  <div className="flex items-center space-x-3 mt-4">
                    {!isIOS && deferredPrompt && (
                      <motion.button
                        onClick={handleInstallClick}
                        whileTap={{ scale: 0.95 }}
                        className="btn btn-primary text-sm px-4 py-2 flex items-center space-x-2"
                      >
                        <Download className="w-4 h-4" />
                        <span>Install Now</span>
                      </motion.button>
                    )}
                    
                    <motion.button
                      onClick={handleDismiss}
                      whileTap={{ scale: 0.95 }}
                      className="text-sm text-gray-600 hover:text-gray-900 font-semibold px-4 py-2"
                    >
                      Maybe Later
                    </motion.button>
                  </div>
                </div>

                {/* Close button */}
                <motion.button
                  onClick={handleDismiss}
                  whileTap={{ scale: 0.9 }}
                  className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
