'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Twitter, Github, Mail, ExternalLink } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const links = {
    product: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Investimentos', href: '/deposits' },
      { label: 'Performance', href: '/performance' },
    ],
    company: [
      { label: 'Sobre', href: '#' },
      { label: 'Carreiras', href: '#' },
      { label: 'Blog', href: '#' },
    ],
    legal: [
      { label: 'Termos de Uso', href: '#' },
      { label: 'Privacidade', href: '#' },
      { label: 'Segurança', href: '#' },
    ],
  };

  const socials = [
    { icon: Twitter, href: '#', label: 'Twitter', color: '#1DA1F2' },
    { icon: Github, href: '#', label: 'GitHub', color: '#fff' },
    { icon: Mail, href: '#', label: 'Email', color: '#EA4335' },
  ];

  return (
    <footer className="relative bg-black border-t border-white/5">
      {/* Decorative Gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center space-x-3 group mb-6">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange to-orange-dark flex items-center justify-center shadow-orange"
              >
                <Zap className="w-6 h-6 text-white" strokeWidth={2.5} fill="currentColor" />
              </motion.div>
              <span className="text-2xl font-bold text-white">ArbiBot</span>
            </Link>
            <p className="text-gray-400 leading-relaxed mb-6 max-w-sm">
              Plataforma premium de investimentos em criptomoedas com IA.
              Maximize seus retornos com tecnologia de ponta.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center space-x-3">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-11 h-11 glass-card rounded-xl flex items-center justify-center group hover:border-white/20 transition-all"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" strokeWidth={2} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Product */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">
                Produto
              </h3>
              <ul className="space-y-3">
                {links.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-orange transition-colors inline-flex items-center group"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">
                Empresa
              </h3>
              <ul className="space-y-3">
                {links.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-orange transition-colors inline-flex items-center group"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">
                Legal
              </h3>
              <ul className="space-y-3">
                {links.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-orange transition-colors inline-flex items-center group"
                    >
                      <span>{link.label}</span>
                      <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-white/5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              © {currentYear} ArbiBot. Todos os direitos reservados.
            </p>
            <div className="flex items-center space-x-2">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-sm text-gray-500">
                Todos os sistemas operacionais
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" />
    </footer>
  );
}
