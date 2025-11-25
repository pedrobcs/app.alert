'use client';

import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Brain, 
  TrendingUp, 
  Compass,
  User,
  BookOpen,
  PieChart,
  Bot,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Analytics', href: '/ai-analytics', icon: Brain },
  { name: 'Trading', href: '/trading', icon: TrendingUp },
  { name: 'Market Explorer', href: '/market-explorer', icon: Compass },
  { name: 'Accounts', href: '/accounts', icon: User },
  { name: 'Learning Hub', href: '/learning', icon: BookOpen },
  { name: 'Portfolio', href: '/portfolio', icon: PieChart },
  { name: 'Bots', href: '/bots', icon: Bot },
];

export function InstitutionalSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="fixed left-0 top-0 h-full w-20 bg-black border-r border-white/[0.08] flex flex-col items-center py-6 z-50"
    >
      {/* Logo */}
      <Link href="/dashboard">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange via-orange-light to-orange-dark flex items-center justify-center mb-8 shadow-lg shadow-orange/20"
        >
          <Zap className="w-6 h-6 text-black" strokeWidth={2.5} />
        </motion.div>
      </Link>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col items-center space-y-2 w-full px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href} className="w-full">
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                <div
                  className={`
                    w-full h-14 rounded-xl flex items-center justify-center
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-orange/10 border border-orange/20' 
                      : 'hover:bg-white/[0.03] border border-transparent'
                    }
                  `}
                >
                  <Icon 
                    className={`w-5 h-5 ${isActive ? 'text-orange' : 'text-gray-500 group-hover:text-white'} transition-colors`}
                    strokeWidth={2}
                  />
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange rounded-r-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Tooltip */}
                <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap">
                  <span className="text-xs font-semibold text-white">{item.name}</span>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User Avatar */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 border border-white/10 flex items-center justify-center cursor-pointer"
      >
        <User className="w-5 h-5 text-gray-400" strokeWidth={2} />
      </motion.div>
    </motion.aside>
  );
}
