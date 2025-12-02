'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import {
  Shield,
  Zap,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Star,
  Gauge,
  Radar,
  NotebookPen,
  Brain,
  Layers3,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLaunchWorkspace = () => {
    router.push('/dashboard');
  };

  const handleScrollToCapabilities = () => {
    const el = document.getElementById('capabilities');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!mounted) {
    return null;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-[#fef9f4] to-[#f8efe7] relative overflow-hidden">
      <AnimatedBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700 text-sm font-bold mb-8 shadow-lg">
              <Zap className="w-5 h-5 mr-2 animate-pulse text-orange-500" />
              <span>Purpose-built for discretionary futures teams</span>
              <Sparkles className="w-5 h-5 ml-2 text-orange-500" />
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6"
            >
              Command crypto futures
              <br />
              <span className="text-gradient block mt-2">
                with a copilot
              </span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
            >
              FuturesPilot pairs contextual research, funding analytics, and reusable playbooks so you can move from thesis to execution without juggling spreadsheets or screenshots.
              <br />
              <span className="font-semibold text-gray-800">No wallets, no deposits—just clarity, structure, and better decisions.</span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
              <motion.button
                onClick={handleLaunchWorkspace}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-primary text-lg px-10 py-5 shadow-2xl hover:shadow-orange-500/50 flex items-center space-x-2 group"
              >
                <span>Launch Workspace</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              <motion.button
                onClick={handleScrollToCapabilities}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn btn-outline text-lg px-10 py-5 flex items-center space-x-2 group"
              >
                <span>See the capabilities</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto"
            >
              {[
                { value: '54', label: 'Perp markets tracked live', icon: Radar, color: 'blue' },
                { value: '18 hrs', label: 'Funding horizon simulated', icon: Gauge, color: 'green' },
                { value: '92%', label: 'Playbooks with guardrails', icon: Shield, color: 'purple' },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  variants={itemVariants}
                  whileHover={{ y: -10 }}
                  className="card-premium text-center group border border-[#f3dfcd]"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${
                    stat.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    stat.color === 'green' ? 'from-green-500 to-green-600' :
                    'from-purple-500 to-purple-600'
                  } rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-2xl transition-shadow`}>
                    <stat.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 mb-2 number-counter">
                    {stat.value}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="capabilities" className="py-24 bg-white/50 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why futures teams choose <span className="text-gradient">FuturesPilot</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Replace screenshots and chat threads with a structured workflow that keeps research, risk, and execution aligned.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: NotebookPen,
                title: 'Strategy Playbooks',
                description: 'Codify directional or market-neutral ideas with entry math, invalidation, liquidity plan, and kill-switch conditions.',
                color: 'blue',
              },
              {
                icon: Gauge,
                title: 'Funding Radar',
                description: 'Live premium curves, per-exchange funding, and basis alerts surfaced as narratives instead of raw numbers.',
                color: 'green',
              },
              {
                icon: Brain,
                title: 'Context Co-Pilot',
                description: 'LLM summaries that merge funding data, positioning, and your own notes to highlight what changed in the last session.',
                color: 'purple',
              },
              {
                icon: Layers3,
                title: 'Scenario Matrix',
                description: 'Stress-test plays with instant best/base/worst case PnL and required capital by venue.',
                color: 'orange',
              },
              {
                icon: BarChart3,
                title: 'Desk Telemetry',
                description: 'Understand total notional, margin at risk, and upcoming unlocks across the entire team.',
                color: 'pink',
              },
              {
                icon: CheckCircle,
                title: 'Execution Guardrails',
                description: 'A pre-trade checklist that enforces risk, liquidity, and narrative alignment before anything goes live.',
                color: 'indigo',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="card-premium group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-br ${
                    feature.color === 'blue' ? 'from-blue-500 to-blue-600' :
                    feature.color === 'green' ? 'from-green-500 to-green-600' :
                    feature.color === 'purple' ? 'from-purple-500 to-purple-600' :
                    feature.color === 'orange' ? 'from-orange-500 to-orange-600' :
                    feature.color === 'pink' ? 'from-pink-500 to-pink-600' :
                    'from-indigo-500 to-indigo-600'
                  } rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-2xl transition-shadow`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Move from hunch to green-lit play without leaving the workspace.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: '1', title: 'Create your cockpit', description: 'Launch the workspace and tailor telemetry modules to the markets you trade most.' },
              { step: '2', title: 'Build the playbook', description: 'Document the trade idea with entry plan, invalidation, liquidity venues, and risk budget.' },
              { step: '3', title: 'Monitor the signals', description: 'Let Funding Radar, Desk Telemetry, and scenario alerts nudge you when the setup is ripe or needs to be shelved.' },
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-8 shadow-2xl group-hover:shadow-blue-500/50"
                >
                  {step.step}
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="card-premium p-12"
          >
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                >
                  <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                </motion.div>
              ))}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gradient">
              Spin up your futures cockpit
            </h2>
            <p className="text-xl text-gray-600 mb-10">
              Align research, risk, and execution in one view—without running live capital through the platform.
            </p>
            <motion.button
              onClick={handleLaunchWorkspace}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn btn-primary text-lg px-12 py-5 shadow-2xl hover:shadow-blue-500/50"
            >
              Launch FuturesPilot
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">FP</span>
                </div>
                <span className="font-bold text-xl">FuturesPilot</span>
              </div>
              <p className="text-gray-400">
                Intelligence and workflow OS for crypto futures teams.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Risk Disclosure
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="mailto:hello@futurespilot.app" className="hover:text-white transition-colors">
                    hello@futurespilot.app
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} FuturesPilot — Research workspace for traders.</p>
            <p className="mt-2 text-sm text-gray-400">
              FuturesPilot is a planning tool only. It never places trades or moves funds. Always verify information before acting in live markets.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
