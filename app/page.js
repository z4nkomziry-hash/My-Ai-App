'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Zap, Globe, Shield, Languages, MessageSquare,
  ArrowRight, Check, Star, Users, ChevronDown, Menu, X,
  Copy, RefreshCw, Send, TrendingUp, Phone, Mail, ExternalLink,
  Camera, MessageCircle, Instagram, User, Code, Briefcase,
} from 'lucide-react';
import Link from 'next/link';
import { getTranslation, languageMeta, getDirection, isRTL, formatPhoneLTR } from '@/lib/i18n';

// Language list for selector
const languages = Object.entries(languageMeta).map(([code, meta]) => ({
  code,
  ...meta,
}));

// Owner/Founder information
const ownerInfo = {
  name: "Zanko Al-Mzuri",
  avatar: "/images/owner-avatar.jpg", // Replace with actual avatar path
  whatsapp: "+9647506045491",
  telegram: "https://t.me/z_14x",
  email: "z.14x@outlook.com",
  instagram: "https://www.instagram.com/z44nko?igsh=MWtldmkwYWN2NW5udw%3D%3D&utm_source=qr",
  snapchat: "https://www.snapchat.com/add/al-mzurii?share_id=tK6JgW5VRZq2giNjAVOeuw&locale=en_US",
};

export default function LandingPage() {
  const [currentLang, setCurrentLang] = useState('EN');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [demoText, setDemoText] = useState('');
  const [demoResult, setDemoResult] = useState('');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [copied, setCopied] = useState('');

  // Get current language metadata
  const currentLangMeta = languageMeta[currentLang];
  const dir = getDirection(currentLang);

  // Helper to get translations
  const t = (key) => getTranslation(currentLang, key);

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang, dir]);

  // Demo tabs
  const tabs = ['generate', 'rewrite', 'grammar', 'translate'];

  const runDemo = async () => {
    if (!demoText.trim()) return;
    setIsDemoLoading(true);
    
    // Simulate AI generation for demo
    setTimeout(() => {
      const demoResponses = {
        EN: "This is an AI-generated response showcasing our advanced language capabilities. Our system understands context, nuance, and delivers precise results tailored to your needs.",
        'KU-BD': "Ev bersiveke AI-çêkirî ye ku şiyanên me yên pêşketî yên ziman nîşan dide. Pergala me konteksê, nuansê fêm dike û encamên rastîn li gor pêdiviyên we pêşkêş dike.",
        'KU-SO': "ئەمە وەڵامێکی دروستکراوی AI یە کە توانا پێشکەوتووەکانی زمانی ئێمە پیشان دەدات. سیستەمەکەمان چوارچێوە و وردەکاری تێدەگات و ئەنجامی وردی گونجاو پێشکەش دەکات.",
        AR: "هذا رد تم إنشاؤه بواسطة الذكاء الاصطناعي يعرض قدراتنا اللغوية المتقدمة. يفهم نظامنا السياق والفروق الدقيقة ويقدم نتائج دقيقة مصممة حسب احتياجاتك.",
        TR: "Bu, gelişmiş dil yeteneklerimizi sergileyen yapay zeka tarafından oluşturulmuş bir yanıttır. Sistemimiz bağlamı, nüansı anlar ve ihtiyaçlarınıza göre uyarlanmış hassas sonuçlar sunar.",
      };
      setDemoResult(demoResponses[currentLang] || demoResponses.EN);
      setIsDemoLoading(false);
    }, 1500);
  };

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(''), 2000);
  };

  const paymentMethods = [
    {
      id: 'FIB',
      name: 'First Iraqi Bank (FIB)',
      phone: '+9647506045491',
      type: 'bank',
    },
    {
      id: 'FastPay',
      name: 'FastPay Wallet',
      phone: '+9647506045491',
      type: 'wallet',
    },
    {
      id: 'USDT',
      name: 'USDT (TRC20)',
      address: 'TKUfVwnjyT2KUa9xnBreT32YLLJEwACHpc',
      type: 'crypto',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-white" dir={dir}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#090D16]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AIVision</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm">
                {t('nav.features')}
              </a>
              <a href="#languages" className="text-gray-300 hover:text-white transition-colors text-sm">
                {t('nav.languages')}
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm">
                {t('nav.pricing')}
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                {t('nav.contact')}
              </a>
              
              {/* Language Selector */}
              <div className="relative">
                <button
                  onClick={() => setIsLangOpen(!isLangOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  <span>{currentLangMeta.flag}</span>
                  <span>{currentLangMeta.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {isLangOpen && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50 max-h-80 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setIsLangOpen(false);
                        }}
                        className="w-full px-4 py-2.5 text-left hover:bg-gray-800 flex items-center space-x-3 transition-colors"
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span className="flex-1">{lang.name}</span>
                        {lang.code === currentLang && <Check className="w-4 h-4 text-purple-400" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                {t('nav.tryFree')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#090D16] border-b border-gray-800"
            >
              <div className="px-4 py-4 space-y-3">
                <a href="#features" className="block text-gray-300 hover:text-white">{t('nav.features')}</a>
                <a href="#languages" className="block text-gray-300 hover:text-white">{t('nav.languages')}</a>
                <a href="#pricing" className="block text-gray-300 hover:text-white">{t('nav.pricing')}</a>
                <a href="#contact" className="block text-gray-300 hover:text-white">{t('nav.contact')}</a>
                
                {/* Mobile Language Selector */}
                <div className="grid grid-cols-3 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang.code);
                        setIsMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-sm ${
                        lang.code === currentLang ? 'bg-purple-600' : 'bg-gray-800'
                      }`}
                    >
                      {lang.flag} {lang.name}
                    </button>
                  ))}
                </div>
                
                <Link href="/dashboard" className="block w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-center">
                  {t('nav.tryFree')}
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="gradient-text">{t('hero.title')}</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                {t('hero.subtitle')}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard" className="btn-primary inline-flex items-center justify-center">
                  {t('hero.cta1')}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
                <a href="#demo" className="btn-secondary">
                  {t('hero.cta2')}
                </a>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16"
            >
              {[
                { value: '12+', label: t('hero.stats.languages') },
                { value: '99.9%', label: t('hero.stats.accuracy') },
                { value: '<1s', label: t('hero.stats.speed') },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{stat.value}</div>
                  <div className="text-gray-500 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-20 bg-[#0B1120]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">{t('demo.title')}</h2>
            <p className="text-gray-400">{t('demo.subtitle')}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111827] rounded-2xl border border-gray-800 p-6"
          >
            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {t(`demo.tabs.${tab}`)}
                </button>
              ))}
            </div>

            {/* Text Input */}
            <textarea
              value={demoText}
              onChange={(e) => setDemoText(e.target.value)}
              placeholder={t('demo.placeholder')}
              className="w-full h-32 bg-gray-800 rounded-lg p-4 text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none mb-4"
            />

            {/* Action Buttons */}
            <div className="flex space-x-3 mb-6">
              <button
                onClick={runDemo}
                disabled={!demoText.trim() || isDemoLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center"
              >
                {isDemoLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    {t('demo.generating')}
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    {t('demo.generate')}
                  </>
                )}
              </button>
              <button
                onClick={() => setDemoText('')}
                className="px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                {t('demo.clear')}
              </button>
            </div>

            {/* Result */}
            <AnimatePresence>
              {demoResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-gray-800 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-gray-400">{t('demo.result')}:</span>
                    <button
                      onClick={() => handleCopy(demoResult)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copied === demoResult ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-white whitespace-pre-wrap">{demoResult}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-gray-400 text-lg">{t('features.subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {t('features.items').map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card card-hover group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {index === 0 && <Sparkles className="w-6 h-6" />}
                  {index === 1 && <Languages className="w-6 h-6" />}
                  {index === 2 && <Shield className="w-6 h-6" />}
                  {index === 3 && <Zap className="w-6 h-6" />}
                  {index === 4 && <Globe className="w-6 h-6" />}
                  {index === 5 && <MessageSquare className="w-6 h-6" />}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Owner/Founder Profile Section */}
      <section className="py-20 bg-[#0B1120]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glow Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-purple-600/20 rounded-3xl blur-3xl" />
            
            <div className="relative bg-[#111827] rounded-3xl border border-gray-800 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar with glow */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur-xl opacity-50" />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 p-1">
                    <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center overflow-hidden">
                      <User className="w-16 h-16 text-gray-400" />
                      {/* Replace with actual image: <img src={ownerInfo.avatar} alt={ownerInfo.name} className="w-full h-full object-cover" /> */}
                    </div>
                  </div>
                  {/* Status indicator */}
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-[#111827]" />
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-purple-400 font-medium">{t('owner.skills')}</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-3">{t('owner.title')}</h2>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    {t('owner.description')}
                  </p>
                  
                  {/* CTA Button */}
                  <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                    <a
                      href={`https://wa.me/${ownerInfo.whatsapp.replace(/\+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center justify-center"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      {t('owner.cta')}
                    </a>
                    <a
                      href={ownerInfo.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary inline-flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Telegram
                    </a>
                  </div>

                  {/* Social Links */}
                  <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                    <a
                      href={`https://wa.me/${ownerInfo.whatsapp.replace(/\+/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-5 h-5 text-green-400" />
                    </a>
                    <a
                      href={ownerInfo.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      title="Telegram"
                    >
                      <Send className="w-5 h-5 text-blue-400" />
                    </a>
                    <a
                      href={`mailto:${ownerInfo.email}`}
                      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      title="Email"
                    >
                      <Mail className="w-5 h-5 text-red-400" />
                    </a>
                    <a
                      href={ownerInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      title="Instagram"
                    >
                      <Instagram className="w-5 h-5 text-pink-400" />
                    </a>
                    <a
                      href={ownerInfo.snapchat}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                      title="Snapchat"
                    >
                      <Camera className="w-5 h-5 text-yellow-400" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Languages Showcase */}
      <section id="languages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('languages.title')}</h2>
            <p className="text-gray-400 text-lg">{t('languages.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {languages.map((lang, index) => (
              <motion.div
                key={lang.code}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className={`bg-[#111827] rounded-xl p-4 text-center border border-gray-800 hover:border-purple-500/50 transition-all ${
                  lang.code.startsWith('KU') ? 'ring-2 ring-purple-500/30' : ''
                }`}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className="font-medium text-sm">{lang.name}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {lang.direction === 'rtl' ? t('languages.rtl') : t('languages.ltr')}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-[#0B1120]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">{t('pricing.title')}</h2>
            <p className="text-gray-400 text-lg">{t('pricing.subtitle')}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card border-gray-800"
            >
              <h3 className="text-2xl font-bold mb-2">{t('pricing.free.name')}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{t('pricing.free.price')}</span>
                <span className="text-gray-400">{t('pricing.free.period')}</span>
              </div>
              <p className="text-gray-400 mb-6">{t('pricing.free.description')}</p>
              <ul className="space-y-3 mb-8">
                {t('pricing.free.features').map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className="block w-full py-3 border border-gray-700 rounded-xl text-center font-medium hover:border-purple-500 transition-all">
                {t('pricing.free.cta')}
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative card border-purple-500"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full text-sm font-medium">
                {t('pricing.pro.badge')}
              </div>
              <h3 className="text-2xl font-bold mb-2 mt-2">{t('pricing.pro.name')}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{t('pricing.pro.price')}</span>
                <span className="text-gray-400">{t('pricing.pro.period')}</span>
              </div>
              <p className="text-gray-400 mb-6">{t('pricing.pro.description')}</p>
              <ul className="space-y-3 mb-8">
                {t('pricing.pro.features').map((feature, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/checkout" className="block w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl text-center font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                {t('pricing.pro.cta')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">{t('contact.title')}</h2>
            <p className="text-gray-400 text-lg">{t('contact.subtitle')}</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${ownerInfo.whatsapp.replace(/\+/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover text-center group"
            >
              <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-7 h-7 text-green-400" />
              </div>
              <span className="text-sm font-medium">{t('contact.whatsapp')}</span>
            </a>

            {/* Telegram */}
            <a
              href={ownerInfo.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover text-center group"
            >
              <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Send className="w-7 h-7 text-blue-400" />
              </div>
              <span className="text-sm font-medium">{t('contact.telegram')}</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${ownerInfo.email}`}
              className="card card-hover text-center group"
            >
              <div className="w-14 h-14 bg-red-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Mail className="w-7 h-7 text-red-400" />
              </div>
              <span className="text-sm font-medium">{t('contact.email')}</span>
            </a>

            {/* Instagram */}
            <a
              href={ownerInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover text-center group"
            >
              <div className="w-14 h-14 bg-pink-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Instagram className="w-7 h-7 text-pink-400" />
              </div>
              <span className="text-sm font-medium">{t('contact.instagram')}</span>
            </a>

            {/* Snapchat */}
            <a
              href={ownerInfo.snapchat}
              target="_blank"
              rel="noopener noreferrer"
              className="card card-hover text-center group"
            >
              <div className="w-14 h-14 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                <Camera className="w-7 h-7 text-yellow-400" />
              </div>
              <span className="text-sm font-medium">{t('contact.snapchat')}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1120] border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">AIVision</span>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href={`https://wa.me/${ownerInfo.whatsapp.replace(/\+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href={ownerInfo.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <Send className="w-5 h-5" />
              </a>
              <a
                href={`mailto:${ownerInfo.email}`}
                className="text-gray-400 hover:text-red-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>

            <p className="text-gray-500 text-sm">
              {t('footer.copyright')} • {t('footer.tagline')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
