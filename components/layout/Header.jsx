'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Check, ChevronDown, Menu, X, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/app/AuthProvider';
import { getTranslation, languageMeta } from '@/lib/i18n';
import { LogoImage } from '@/components/ui/SafeImage';

const languagesList = Object.entries(languageMeta).map(([code, meta]) => ({
  code, flag: meta.flag, name: meta.name, direction: meta.direction
}));

export default function Header() {
  const { user, profile, signOut } = useAuth();
  const [lang, setLang] = useState('EN');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const t = (key) => {
    const val = getTranslation(lang, key);
    return typeof val === 'string' ? val : String(val || key);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2.5 group">
          <LogoImage width={36} height={36} className="group-hover:scale-105 transition-transform duration-300" />
          <span className="text-xl font-bold gradient-text hidden sm:inline">AIVision</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <a href="#features" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.features')}</a>
          <a href="#languages" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.languages')}</a>
          <a href="#pricing" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.pricing')}</a>
          <a href="#contact" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.contact')}</a>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors"
            >
              <span>{languageMeta[lang]?.flag || '🌐'}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50"
                >
                  {languagesList.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-800 flex items-center space-x-2 transition-colors"
                    >
                      <span>{l.flag}</span>
                      <span>{l.name}</span>
                      {l.code === lang && <Check className="w-4 h-4 text-purple-400 ml-auto" />}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Auth Buttons */}
          {user ? (
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">{t('nav.dashboard')}</Link>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center text-sm font-bold">
                {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
              </div>
              <button onClick={signOut} className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center">
                <LogOut className="w-4 h-4 mr-1" />{t('nav.signOut')}
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/auth" className="text-sm text-gray-300 hover:text-white transition-colors">{t('nav.signIn')}</Link>
              <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-sm font-medium hover:shadow-glow-purple transition-all">{t('nav.tryFree')}</Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
}
