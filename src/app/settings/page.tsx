'use client';

import { TradingLayout } from '@/components/trading/TradingLayout';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  const settingsSections = [
    {
      title: 'Profile',
      icon: User,
      color: '#E35404',
      items: [
        { label: 'Display Name', value: 'Pro Trader', type: 'input' },
        { label: 'Email', value: 'trader@arbibot.com', type: 'input' },
        { label: 'Avatar', value: 'Change', type: 'button' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      color: '#10B981',
      items: [
        { label: 'Trading Signals', value: true, type: 'toggle' },
        { label: 'Price Alerts', value: true, type: 'toggle' },
        { label: 'Email Reports', value: false, type: 'toggle' },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      color: '#3B82F6',
      items: [
        { label: 'Two-Factor Auth', value: 'Enabled', type: 'badge' },
        { label: 'Change Password', value: 'Update', type: 'button' },
        { label: 'Session Timeout', value: '30 minutes', type: 'select' },
      ],
    },
    {
      title: 'Appearance',
      icon: Palette,
      color: '#A855F7',
      items: [
        { label: 'Theme', value: 'Dark', type: 'select' },
        { label: 'Accent Color', value: 'Orange', type: 'select' },
        { label: 'Chart Style', value: 'Candlestick', type: 'select' },
      ],
    },
    {
      title: 'Region',
      icon: Globe,
      color: '#F59E0B',
      items: [
        { label: 'Language', value: 'English', type: 'select' },
        { label: 'Currency', value: 'USD', type: 'select' },
        { label: 'Timezone', value: 'UTC-3', type: 'select' },
      ],
    },
  ];

  return (
    <TradingLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Settings
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-sm text-gray-500"
          >
            Customize your trading experience
          </motion.p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settingsSections.map((section, index) => {
            const Icon = section.icon;

            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-950 via-black to-gray-950 border border-white/10 p-6"
              >
                {/* Header */}
                <div className="flex items-center space-x-3 mb-6 pb-4 border-b border-white/5">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${section.color}15`,
                      border: `1px solid ${section.color}30`,
                    }}
                  >
                    <Icon className="w-5 h-5" style={{ color: section.color }} strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{section.title}</h3>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">{item.label}</span>

                      {item.type === 'input' && (
                        <input
                          type="text"
                          defaultValue={item.value}
                          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange/30 transition-colors"
                        />
                      )}

                      {item.type === 'button' && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-white transition-colors"
                        >
                          {item.value}
                        </motion.button>
                      )}

                      {item.type === 'toggle' && (
                        <button
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            item.value ? 'bg-orange' : 'bg-white/10'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      )}

                      {item.type === 'select' && (
                        <select className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-orange/30 transition-colors">
                          <option>{item.value}</option>
                        </select>
                      )}

                      {item.type === 'badge' && (
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 text-xs font-bold">
                          {item.value}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 rounded-2xl bg-gradient-to-r from-orange to-orange-light hover:shadow-lg hover:shadow-orange/30 text-white font-bold text-sm transition-all"
          >
            Save Changes
          </motion.button>
        </div>
      </div>
    </TradingLayout>
  );
}
