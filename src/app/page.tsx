'use client';

import { Hero } from '@/components/premium/Hero';
import { Navbar } from '@/components/premium/Navbar';
import { Footer } from '@/components/premium/Footer';
import { InstallPWAButton } from '@/components/premium/InstallPWAButton';
import { motion } from 'framer-motion';
import { Shield, Zap, TrendingUp, ArrowRight, Globe, Smartphone } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Navbar />
      
      <Hero
        title="Investimentos Inteligentes"
        subtitle="Plataforma premium de investimentos em criptomoedas. Maximize seus retornos com IA e tecnologia multi-chain (Arbitrum + Solana)."
        cta1Text="Começar Agora"
        cta2Text="Saiba Mais"
      />

      {/* Features Section */}
      <section className="relative py-32 px-6 bg-black">
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-[0.015]">
          <div 
            className="w-full h-full" 
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Por que escolher <span className="text-orange">ArbiBot</span>?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Tecnologia de ponta para investidores inteligentes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: 'Segurança Premium',
                description: 'Smart contracts auditados e proteção em múltiplas camadas',
              },
              {
                icon: Globe,
                title: 'Multi-Chain',
                description: 'Suporte completo para Arbitrum (EVM) e Solana',
              },
              {
                icon: TrendingUp,
                title: 'IA Avançada',
                description: 'Algoritmos de IA analisando o mercado 24/7',
              },
              {
                icon: Zap,
                title: 'Ultra Rápido',
                description: 'Execução instantânea de transações',
              },
              {
                icon: Smartphone,
                title: 'Mobile First',
                description: 'Design otimizado para dispositivos móveis',
              },
              {
                icon: ArrowRight,
                title: 'PWA Completo',
                description: 'Instale como app nativo no seu dispositivo',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group"
              >
                <div className="relative bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl rounded-2xl p-8 border border-white/10 overflow-hidden h-full">
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10">
                    <div className="inline-flex p-3 bg-orange/10 rounded-xl mb-4">
                      <feature.icon className="w-6 h-6 text-orange" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>

                  {/* Bottom Glow Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-6 bg-black">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange/5 to-transparent" />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-12 md:p-16 border border-white/20 overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange/20 via-transparent to-transparent" />
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Pronto para começar?
              </h2>
              <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
                Junte-se a investidores inteligentes e comece a crescer seu patrimônio hoje
              </p>
              
              <Link href="/dashboard">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 0 50px rgba(227, 84, 4, 0.6)' }}
                  whileTap={{ scale: 0.95 }}
                  className="group px-10 py-5 bg-orange hover:bg-orange-light text-white text-lg font-bold rounded-full transition-all duration-300 shadow-orange inline-flex items-center space-x-2"
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
