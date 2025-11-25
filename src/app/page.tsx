'use client';

import { Hero } from '@/components/premium/Hero';
import { Navbar } from '@/components/premium/Navbar';
import { Footer } from '@/components/premium/Footer';
import { InstallPWAButton } from '@/components/premium/InstallPWAButton';
import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, ArrowRight, Globe, Smartphone, Lock, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const features = [
    {
      icon: Shield,
      title: 'Segurança Premium',
      description: 'Smart contracts auditados e proteção multi-camadas para seus ativos',
      gradient: ['#10B981', '#059669'],
    },
    {
      icon: Globe,
      title: 'Multi-Chain',
      description: 'Suporte completo para Arbitrum (EVM) e Solana em uma única plataforma',
      gradient: ['#3B82F6', '#2563EB'],
    },
    {
      icon: TrendingUp,
      title: 'IA Avançada',
      description: 'Algoritmos de IA analisando milhares de ativos 24/7 em tempo real',
      gradient: ['#E35404', '#C44803'],
    },
    {
      icon: Zap,
      title: 'Ultra Rápido',
      description: 'Execução instantânea com as taxas mais baixas do mercado',
      gradient: ['#F59E0B', '#D97706'],
    },
    {
      icon: Smartphone,
      title: 'Mobile First',
      description: 'Design otimizado para dispositivos móveis com experiência nativa',
      gradient: ['#8B5CF6', '#7C3AED'],
    },
    {
      icon: Lock,
      title: 'Non-Custodial',
      description: 'Você mantém o controle total de suas chaves e ativos sempre',
      gradient: ['#EC4899', '#DB2777'],
    },
  ];

  return (
    <>
      <Navbar />
      
      <Hero
        title="Investimentos Inteligentes"
        subtitle="Plataforma premium de investimentos em criptomoedas com IA. Maximize seus retornos com tecnologia multi-chain (Arbitrum + Solana)."
        cta1Text="Começar Agora"
        cta2Text="Saiba Mais"
      />

      {/* Features Section */}
      <section id="features" className="relative py-32 bg-black overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 grid-background opacity-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center space-x-2 glass-card px-6 py-3 rounded-full mb-6">
              <BarChart3 className="w-4 h-4 text-orange" />
              <span className="text-sm font-bold text-orange tracking-wide">RECURSOS PREMIUM</span>
            </div>
            <h2 className="text-title-1 text-white mb-6">
              Por que escolher <span className="gradient-text-orange">ArbiBot</span>?
            </h2>
            <p className="text-body-1 text-gray-400 max-w-2xl mx-auto">
              Tecnologia de ponta para investidores que buscam excelência
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -6 }}
                  className="group h-full"
                >
                  <div className="glass-card rounded-2xl p-8 h-full overflow-hidden relative">
                    {/* Animated Glow */}
                    <motion.div
                      animate={{
                        opacity: [0.1, 0.2, 0.1],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2,
                      }}
                      className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl"
                      style={{
                        background: `radial-gradient(circle, ${feature.gradient[0]}40 0%, transparent 70%)`,
                      }}
                    />

                    <div className="relative z-10 space-y-4">
                      {/* Icon */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ type: "spring", stiffness: 200 }}
                        className="w-14 h-14 rounded-2xl flex items-center justify-center"
                        style={{
                          background: `linear-gradient(135deg, ${feature.gradient[0]}15, ${feature.gradient[1]}15)`,
                          border: `1px solid ${feature.gradient[0]}30`,
                        }}
                      >
                        <Icon 
                          className="w-7 h-7" 
                          style={{ color: feature.gradient[0] }}
                          strokeWidth={2}
                        />
                      </motion.div>

                      {/* Content */}
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-gray-400 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Glow */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-0 left-0 right-0 h-1 origin-left"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${feature.gradient[0]}, transparent)`,
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 bg-black overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange/5 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8"
        >
          <div className="glass-card rounded-3xl p-12 lg:p-16 text-center overflow-hidden relative">
            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange/5 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 space-y-8">
              <div>
                <h2 className="text-title-1 text-white mb-4">
                  Pronto para começar?
                </h2>
                <p className="text-body-1 text-gray-400 max-w-2xl mx-auto">
                  Junte-se a investidores inteligentes e comece a crescer seu patrimônio hoje
                </p>
              </div>
              
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group btn-primary inline-flex items-center space-x-2 text-lg gradient-shine"
                >
                  <span>Acessar Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
      <InstallPWAButton />
    </>
  );
}
