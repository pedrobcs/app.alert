'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Brain, 
  TrendingUp, 
  Compass, 
  Briefcase, 
  GraduationCap, 
  PieChart,
  Bot,
  Zap,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Analytics', href: '/ai-analytics', icon: Brain },
  { name: 'Trading', href: '/trading', icon: TrendingUp },
  { name: 'Market Explorer', href: '/market-explorer', icon: Compass },
  { name: 'Accounts', href: '/accounts', icon: Briefcase },
  { name: 'Learning Hub', href: '/learning', icon: GraduationCap },
  { name: 'Portfolio', href: '/portfolio', icon: PieChart },
  { name: 'Bots', href: '/bots', icon: Bot },
];

export function InstitutionalSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full w-72 bg-black border-r border-white/5 z-40 flex flex-col"
    >
      {/* Logo */}
      <div className="p-8 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.6 }}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange via-orange-light to-orange-dark flex items-center justify-center shadow-lg shadow-orange/30"
          >
            <Zap className="w-5 h-5 text-black" strokeWidth={2.5} />
          </motion.div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">ArbiBot</h1>
            <p className="text-xs text-gray-600 font-medium">Institutional</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
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
                    relative px-4 py-3 rounded-xl flex items-center justify-between
                    transition-all duration-300 cursor-pointer
                    ${isActive 
                      ? 'bg-gradient-to-r from-orange/10 to-transparent border border-orange/20' 
                      : 'hover:bg-white/5 border border-transparent'
                    }
                  `}
                >
                  <div className="flex items-center space-x-3">
                    <Icon 
                      className={`w-5 h-5 ${isActive ? 'text-orange' : 'text-gray-400 group-hover:text-white'} transition-colors`}
                      strokeWidth={2}
                    />
                    <span className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'} transition-colors`}>
                      {item.name}
                    </span>
                  </div>

                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-orange" strokeWidth={2} />
                  )}

                  {/* Active Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-orange to-orange-light rounded-r-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom - AI Status */}
      <div className="p-4 border-t border-white/5">
        <motion.div
          whileHover={{ y: -2 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange/10 via-black to-black border border-orange/20 p-4"
        >
          <motion.div
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="absolute top-0 right-0 w-16 h-16 bg-orange/30 rounded-full blur-xl"
          />

          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-4 h-4 text-orange" strokeWidth={2} />
              <span className="text-xs font-bold text-orange">AI ACTIVE</span>
            </div>
            <p className="text-xs text-gray-400">Analyzing 5,234 assets</p>
            <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: ['0%', '100%'] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-full bg-gradient-to-r from-orange to-orange-light rounded-full"
              />
            </div>
          </div>
        </motion.div>
      </div>

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
    </motion.aside>
  );
}
