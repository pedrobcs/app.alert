'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Target, 
  PieChart, 
  Wallet, 
  History, 
  Settings,
  Menu,
  X,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Markets', href: '/markets', icon: TrendingUp },
  { name: 'Signals', href: '/signals', icon: Target },
  { name: 'Portfolio', href: '/portfolio', icon: PieChart },
  { name: 'Wallet', href: '/wallet', icon: Wallet },
  { name: 'History', href: '/history', icon: History },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <motion.button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-6 left-6 z-50 w-12 h-12 rounded-2xl bg-black/80 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white"
        whileTap={{ scale: 0.95 }}
      >
        {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
      </motion.button>

      {/* Sidebar */}
      <AnimatePresence>
        <motion.aside
          initial={{ x: -300 }}
          animate={{ x: isCollapsed ? -300 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed left-0 top-0 h-full w-72 bg-gradient-to-b from-black via-gray-950 to-black border-r border-white/5 z-40 flex flex-col"
        >
          {/* Logo */}
          <div className="p-8 border-b border-white/5">
            <Link href="/dashboard" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange via-orange-light to-orange-dark flex items-center justify-center shadow-lg shadow-orange/30"
              >
                <Zap className="w-6 h-6 text-black" strokeWidth={2.5} />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">
                  ArbiBot
                </h1>
                <p className="text-xs text-gray-500 font-medium">Trading Platform</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative px-4 py-3.5 rounded-2xl flex items-center space-x-3
                        transition-all duration-300 cursor-pointer
                        ${isActive 
                          ? 'bg-gradient-to-r from-orange/10 to-orange-light/5 border border-orange/20 shadow-lg shadow-orange/5' 
                          : 'hover:bg-white/5 border border-transparent'
                        }
                      `}
                    >
                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-orange to-orange-light rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      <Icon 
                        className={`w-5 h-5 ${isActive ? 'text-orange' : 'text-gray-400 group-hover:text-white'} transition-colors`}
                        strokeWidth={2}
                      />
                      <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`}>
                        {item.name}
                      </span>

                      {/* Hover Glow */}
                      {!isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl"
                        />
                      )}
                    </motion.div>
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Card - Account Status */}
          <div className="p-4 border-t border-white/5">
            <motion.div
              whileHover={{ y: -2 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange/10 via-black to-black border border-orange/20 p-4"
            >
              {/* Animated Glow */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-0 right-0 w-20 h-20 bg-orange/30 rounded-full blur-2xl"
              />

              <div className="relative z-10">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </div>
                  <span className="text-xs font-bold text-emerald-500">PRO ACCOUNT</span>
                </div>
                <p className="text-sm text-white font-semibold mb-1">Trading Active</p>
                <p className="text-xs text-gray-500">All systems operational</p>
              </div>
            </motion.div>
          </div>
        </motion.aside>
      </AnimatePresence>

      {/* Overlay Mobile */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCollapsed(true)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(227, 84, 4, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(227, 84, 4, 0.5);
        }
      `}</style>
    </>
  );
}
