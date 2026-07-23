'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Zap, Globe, Shield, Languages, MessageSquare,
  ArrowRight, Check, ChevronDown, Menu, X, Copy,
  RefreshCw, Send, Briefcase, MessageCircle, Mail,
  Camera, Instagram, LogOut, Heart
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/AuthProvider';
import { getTranslation, languageMeta, getDirection } from '@/lib/i18n';

// ============================================================
// STATIC DATA
// ============================================================

const languagesList = Object.entries(languageMeta).map(([code, meta]) => ({
  code,
  flag: meta.flag,
  name: meta.name,
  direction: meta.direction
}));

const socialLinks = {
  whatsapp: 'https://wa.me/9647506045491',
  telegram: 'https://t.me/z_14x',
  email: 'mailto:z.14x@outlook.com',
  instagram: 'https://www.instagram.com/z44nko?igsh=MWtldmkwYWN2NW5udw==',
  snapchat: 'https://www.snapchat.com/add/al-mzurii?share_id=tK6JgW5VRZq2giNjAVOeuw&locale=en_US'
};

const demoResponses = {
  EN: "✨ AI Response: This demonstrates AIVision's powerful multilingual AI capabilities.\n\nOur platform supports 12 languages with specialized Kurdish dialect expertise for Badini and Sorani — a feature unmatched by any competitor.",
  'KU-BD': "✨ وەڵامی AI: ئەمە توانا بەهێزەکانی AIVision نیشان دەدات.\n\nپلاتفۆرمەکەمان 12 زمان پشتگیری دەکات لەگەڵ شارەزایی تایبەتی شێوەزاری کوردی بادینی و سۆرانی.",
  'KU-SO': "✨ وەڵام: ئەمە تواناکانی AIVision پیشان دەدات.\n\nپلاتفۆرمەکەمان پشتگیری 12 زمان دەکات.",
  AR: "✨ رد AI: هذا يوضح قدرات AIVision القوية في الذكاء الاصطناعي متعدد اللغات.\n\nمنصتنا تدعم 12 لغة مع خبرة متخصصة في اللهجات الكردية.",
  TR: "✨ AI Yanıt: Bu, AIVision'ın güçlü çok dilli yapay zeka yeteneklerini gösterir.\n\nPlatformumuz, Kürt lehçelerinde özel uzmanlıkla 12 dili destekler."
};

const heroStatsData = [
  { v: '12+', labelKey: 'hero.stats.languages' },
  { v: '99.9%', labelKey: 'hero.stats.accuracy' },
  { v: '<1s', labelKey: 'hero.stats.speed' }
];

const featureIcons = [Sparkles, Languages, Shield, Zap, Globe, MessageSquare];

const contactItems = [
  { icon: 'whatsapp', label: 'whatsapp', href: socialLinks.whatsapp, bg: 'bg-green-500/10 border-green-500/20', color: 'text-green-400' },
  { icon: 'telegram', label: 'telegram', href: socialLinks.telegram, bg: 'bg-blue-500/10 border-blue-500/20', color: 'text-blue-400' },
  { icon: 'email', label: 'email', href: socialLinks.email, bg: 'bg-red-500/10 border-red-500/20', color: 'text-red-400' },
  { icon: 'instagram', label: 'instagram', href: socialLinks.instagram, bg: 'bg-pink-500/10 border-pink-500/20', color: 'text-pink-400' },
  { icon: 'snapchat', label: 'snapchat', href: socialLinks.snapchat, bg: 'bg-yellow-500/10 border-yellow-500/20', color: 'text-yellow-400' }
];

const socialButtons = [
  { icon: 'whatsapp-social', href: socialLinks.whatsapp, bg: 'bg-green-500/10 hover:bg-green-500/20 border border-green-500/20' },
  { icon: 'telegram-social', href: socialLinks.telegram, bg: 'bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20' },
  { icon: 'email-social', href: socialLinks.email, bg: 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/20' },
  { icon: 'instagram-social', href: socialLinks.instagram, bg: 'bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/20' },
  { icon: 'snapchat-social', href: socialLinks.snapchat, bg: 'bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20' }
];

const demoTabs = ['generate', 'rewrite', 'grammar', 'translate'];

// ============================================================
// ICON RENDERER
// ============================================================

function ContactIcon({ type, className }) {
  const classes = className || 'w-7 h-7';
  switch (type) {
    case 'whatsapp':
    case 'whatsapp-social':
      return <MessageCircle className={`${classes} text-green-400`} />;
    case 'telegram':
    case 'telegram-social':
      return <Send className={`${classes} text-blue-400`} />;
    case 'email':
    case 'email-social':
      return <Mail className={`${classes} text-red-400`} />;
    case 'instagram':
    case 'instagram-social':
      return <Instagram className={`${classes} text-pink-400`} />;
    case 'snapchat':
    case 'snapchat-social':
      return <Camera className={`${classes} text-yellow-400`} />;
    default:
      return <Sparkles className={classes} />;
  }
}

// ============================================================
// SAFE IMAGE COMPONENT
// ============================================================

function SafeImage({ src, fallbackSrc, alt, type, width, height, className }) {
  const [imgError, setImgError] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  const imageSrc = imgError && fallbackSrc ? fallbackSrc : src;
  const hasError = imgError && (!fallbackSrc || fallbackError);

  if (hasError) {
    if (type === 'logo') {
      return (
        <div
          className="bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center animate-glow"
          style={{ width, height }}
        >
          <Sparkles className="text-white" style={{ width: width * 0.45, height: height * 0.45 }} />
        </div>
      );
    }
    if (type === 'developer') {
      return (
        <div
          className="bg-gradient-to-r from-purple-600 via-cyan-500 to-green-400 rounded-full flex items-center justify-center w-full h-full"
        >
          <span className="text-3xl font-bold text-white">ZA</span>
        </div>
      );
    }
    return (
      <div className="bg-gray-800 rounded-lg flex items-center justify-center" style={{ width, height }}>
        <Sparkles className="text-gray-600" style={{ width: width * 0.4, height: height * 0.4 }} />
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      unoptimized={true}
      onError={() => {
        if (!imgError) {
          setImgError(true);
        } else {
          setFallbackError(true);
        }
      }}
    />
  );
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getFeaturesArray(lang) {
  const val = getTranslation(lang, 'features.items');
  if (Array.isArray(val)) return val;
  const enVal = getTranslation('EN', 'features.items');
  if (Array.isArray(enVal)) return enVal;
  return [
    { title: "AI Text Generation", description: "Create high-quality content in 12 languages." },
    { title: "Precise Translation", description: "Industry-leading translation with Kurdish expertise." },
    { title: "Grammar Perfection", description: "Advanced grammar correction across all languages." },
    { title: "Lightning Fast", description: "Powered by Google Gemini 1.5 Flash." },
    { title: "RTL Support", description: "Full right-to-left support for Arabic, Kurdish, Persian." },
    { title: "Smart Rewriting", description: "Intelligent text rewriting that improves clarity." }
  ];
}

function getPricingFreeFeatures(lang) {
  const val = getTranslation(lang, 'pricing.free.features');
  if (Array.isArray(val)) return val;
  const enVal = getTranslation('EN', 'pricing.free.features');
  if (Array.isArray(enVal)) return enVal;
  return ["5 AI generations per day", "12 language support", "Basic grammar correction", "Standard translation", "Community support"];
}

function getPricingProFeatures(lang) {
  const val = getTranslation(lang, 'pricing.pro.features');
  if (Array.isArray(val)) return val;
  const enVal = getTranslation('EN', 'pricing.pro.features');
  if (Array.isArray(enVal)) return enVal;
  return ["Unlimited AI generations", "Advanced Kurdish dialect tuning", "Extended context window", "Priority processing speed", "Advanced grammar correction", "Priority support", "Early access to new features"];
}

// ============================================================
// MAIN LANDING PAGE COMPONENT
// ============================================================

export default function LandingPage() {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const profile = auth ? auth.profile : null;
  const signOutFn = auth ? auth.signOut : function () { };

  const [lang, setLang] = useState('EN');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [demoText, setDemoText] = useState('');
  const [demoResult, setDemoResult] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [copied, setCopied] = useState('');

  const dir = getDirection(lang);

  const t = function (key) {
    const val = getTranslation(lang, key);
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val;
    const enVal = getTranslation('EN', key);
    if (typeof enVal === 'string') return enVal;
    return String(val || key);
  };

  const features = getFeaturesArray(lang);
  const pricingFreeFeatures = getPricingFreeFeatures(lang);
  const pricingProFeatures = getPricingProFeatures(lang);

  useEffect(function () {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  function runDemo() {
    if (!demoText.trim()) return;
    setDemoLoading(true);
    setTimeout(function () {
      setDemoResult(demoResponses[lang] || demoResponses['EN']);
      setDemoLoading(false);
    }, 1200);
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    toast.success(t('demo.copied') || 'Copied!');
    setTimeout(function () { setCopied(''); }, 2000);
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-screen bg-[#090D16] text-white" dir={dir}>
      {/* ========================================== */}
      {/* NAVIGATION                                  */}
      {/* ========================================== */}
      <nav className="fixed top-0 w-full z-50 bg-[#090D16]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <SafeImage
              src="/assets/logo/logo.png"
              fallbackSrc="/icon.png"
              alt="AIVision Logo"
              type="logo"
              width={36}
              height={36}
              className="rounded-lg group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-xl font-bold gradient-text hidden sm:inline">AIVision</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.features')}</a>
            <a href="#languages" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.languages')}</a>
            <a href="#pricing" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.pricing')}</a>
            <a href="#contact" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.contact')}</a>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={function () { setLangOpen(!langOpen); }}
                className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors"
              >
                <span>{languageMeta[lang] ? languageMeta[lang].flag : '🌐'}</span>
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
                    {languagesList.map(function (l) {
                      return (
                        <button
                          key={l.code}
                          onClick={function () { setLang(l.code); setLangOpen(false); }}
                          className="w-full px-4 py-2.5 text-left hover:bg-gray-800 flex items-center space-x-2 transition-colors"
                        >
                          <span>{l.flag}</span>
                          <span className="text-sm">{l.name}</span>
                          {l.code === lang && <Check className="w-4 h-4 text-purple-400 ml-auto" />}
                        </button>
                      );
                    })}
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
                <button onClick={signOutFn} className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center">
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

          {/* Mobile Menu Toggle */}
          <button onClick={function () { setMenuOpen(!menuOpen); }} className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#090D16] border-b border-gray-800 px-4 py-4 space-y-3"
            >
              <a href="#features" className="block text-gray-300 py-1">{t('nav.features')}</a>
              <a href="#languages" className="block text-gray-300 py-1">{t('nav.languages')}</a>
              <a href="#pricing" className="block text-gray-300 py-1">{t('nav.pricing')}</a>
              <a href="#contact" className="block text-gray-300 py-1">{t('nav.contact')}</a>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {languagesList.map(function (l) {
                  return (
                    <button
                      key={l.code}
                      onClick={function () { setLang(l.code); setMenuOpen(false); }}
                      className={'px-2 py-2 rounded-lg text-xs transition-colors ' + (l.code === lang ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-300')}
                    >
                      {l.flag} {l.name}
                    </button>
                  );
                })}
              </div>
              {user ? (
                <div className="space-y-2 pt-2">
                  <Link href="/dashboard" className="block w-full text-center py-2.5 bg-purple-600 rounded-lg text-sm font-medium">{t('nav.dashboard')}</Link>
                  <button onClick={signOutFn} className="block w-full text-center py-2.5 text-red-400 text-sm">{t('nav.signOut')}</button>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <Link href="/auth" className="block w-full text-center py-2.5 border border-gray-700 rounded-lg text-sm">{t('nav.signIn')}</Link>
                  <Link href="/dashboard" className="block w-full text-center py-2.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-sm font-medium">{t('nav.tryFree')}</Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ========================================== */}
      {/* HERO SECTION                                */}
      {/* ========================================== */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 leading-tight">
              <span className="gradient-text">{t('hero.title')}</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary text-base px-8 py-3.5">
                {t('hero.cta1')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a href="#demo" className="btn-secondary text-base px-8 py-3.5">
                {t('hero.cta2')}
              </a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto mt-16"
          >
            {heroStatsData.map(function (s, i) {
              return (
                <div key={i} className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-purple-400">{s.v}</div>
                  <div className="text-gray-500 text-xs sm:text-sm mt-1">{t(s.labelKey)}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* INTERACTIVE DEMO SECTION                    */}
      {/* ========================================== */}
      <section id="demo" className="py-20 bg-[#0B1120]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('demo.title')}</h2>
            <p className="text-gray-400 text-lg">{t('demo.subtitle')}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card p-6 sm:p-8"
          >
            <div className="flex flex-wrap gap-2 mb-6">
              {demoTabs.map(function (tab) {
                return (
                  <button
                    key={tab}
                    onClick={function () { setActiveTab(tab); }}
                    className={'px-4 py-2 rounded-lg text-sm font-medium transition-all ' + (activeTab === tab ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white')}
                  >
                    {t('demo.tabs.' + tab)}
                  </button>
                );
              })}
            </div>
            <textarea
              value={demoText}
              onChange={function (e) { setDemoText(e.target.value); }}
              placeholder={t('demo.placeholder')}
              className="w-full h-36 bg-gray-800/80 rounded-xl p-4 text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none mb-4 transition-all"
            />
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={runDemo}
                disabled={!demoText.trim() || demoLoading}
                className="flex-1 btn-primary flex items-center justify-center"
              >
                {demoLoading ? (
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
                onClick={function () { setDemoText(''); setDemoResult(''); }}
                className="px-4 py-3 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors text-sm"
              >
                {t('demo.clear')}
              </button>
            </div>
            <AnimatePresence>
              {demoResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gray-800/80 rounded-xl p-5 border border-gray-700"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-purple-400">{t('demo.result')}</span>
                    <button
                      onClick={function () { handleCopy(demoResult); }}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copied === demoResult ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap text-gray-300 leading-relaxed">{demoResult}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FEATURES SECTION                            */}
      {/* ========================================== */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-gray-400 text-lg">{t('features.subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(function (feature, i) {
              const IconComponent = featureIcons[i] || Sparkles;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card card-hover group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* DEVELOPER PROFILE SECTION                   */}
      {/* ========================================== */}
      <section className="py-20 bg-[#0B1120]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-green-400/20 rounded-3xl blur-3xl" />
            <div className="relative card p-8 sm:p-10 lg:p-12 border-purple-500/30">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Developer Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-500 to-green-400 rounded-full blur-xl opacity-60 animate-pulse" />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 via-cyan-500 to-green-400 p-[3px] animate-glow flex items-center justify-center">
                    <SafeImage
                      src="/assets/developer/zaniyar.jpeg"
                      fallbackSrc="/assets/developer/zaniyar.jpg"
                      alt="Zaniyar Al-Mzurii - Full-Stack Developer"
                      type="developer"
                      width={128}
                      height={128}
                      className="w-full h-full rounded-full object-cover bg-[#111827]"
                    />
                  </div>
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 rounded-full border-3 border-[#111827] animate-pulse" />
                </div>

                {/* Developer Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-purple-400 font-medium">{t('owner.skills')}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold mb-1">{t('owner.subtitle')}</h2>
                  <p className="text-gray-400 text-sm mb-4">{t('owner.title')}</p>
                  <div className="bg-gray-800/50 rounded-xl p-5 mb-6 border border-gray-700/50">
                    <p className="text-gray-300 leading-relaxed italic text-sm sm:text-base">
                      &ldquo;{t('owner.description')}&rdquo;
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                    <a
                      href={socialLinks.whatsapp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary inline-flex items-center text-sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {t('owner.cta')}
                    </a>
                    <a
                      href={socialLinks.telegram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary inline-flex items-center text-sm"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Telegram
                    </a>
                  </div>
                  <div className="flex justify-center md:justify-start gap-2">
                    {socialButtons.map(function (s, i) {
                      return (
                        <a
                          key={i}
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={'p-2.5 rounded-xl transition-all duration-200 ' + s.bg}
                          title={s.icon.replace('-social', '')}
                        >
                          <ContactIcon type={s.icon} className="w-5 h-5" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========================================== */}
      {/* LANGUAGES SECTION                           */}
      {/* ========================================== */}
      <section id="languages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('languages.title')}</h2>
            <p className="text-gray-400 text-lg">{t('languages.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {languagesList.map(function (l, i) {
              return (
                <motion.div
                  key={l.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={'bg-[#111827] rounded-xl p-4 text-center border border-gray-800 hover:border-purple-500/50 transition-all duration-300 ' + (l.code.startsWith('KU') ? 'ring-2 ring-purple-500/30' : '')}
                >
                  <div className="text-3xl mb-2">{l.flag}</div>
                  <div className="font-medium text-sm">{l.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {l.direction === 'rtl' ? t('languages.rtl') : t('languages.ltr')}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* PRICING SECTION                             */}
      {/* ========================================== */}
      <section id="pricing" className="py-20 bg-[#0B1120]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('pricing.title')}</h2>
            <p className="text-gray-400 text-lg">{t('pricing.subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <h3 className="text-2xl font-bold mb-2">{t('pricing.free.name')}</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold">{t('pricing.free.price')}</span>
                <span className="text-gray-400 text-lg">{t('pricing.free.period')}</span>
              </div>
              <p className="text-gray-400 mb-6">{t('pricing.free.description')}</p>
              <ul className="space-y-3 mb-8">
                {pricingFreeFeatures.map(function (f, i) {
                  return (
                    <li key={i} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{f}</span>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/auth"
                className="block w-full py-3.5 border border-gray-700 rounded-xl text-center font-medium hover:border-purple-500 transition-all"
              >
                {t('pricing.free.cta')}
              </Link>
            </motion.div>

            {/* Pro Plan */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative card border-purple-500"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full text-sm font-semibold shadow-glow-purple">
                {t('pricing.pro.badge')}
              </div>
              <h3 className="text-2xl font-bold mb-2 mt-2">{t('pricing.pro.name')}</h3>
              <div className="mb-4">
                <span className="text-5xl font-bold">{t('pricing.pro.price')}</span>
                <span className="text-gray-400 text-lg">{t('pricing.pro.period')}</span>
              </div>
              <p className="text-gray-400 mb-6">{t('pricing.pro.description')}</p>
              <ul className="space-y-3 mb-8">
                {pricingProFeatures.map(function (f, i) {
                  return (
                    <li key={i} className="flex items-center space-x-3">
                      <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      <span className="text-gray-300 text-sm">{f}</span>
                    </li>
                  );
                })}
              </ul>
              <Link
                href="/checkout"
                className="block w-full py-3.5 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl text-center font-semibold hover:shadow-glow-purple transition-all"
              >
                {t('pricing.pro.cta')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* CONTACT SECTION                             */}
      {/* ========================================== */}
      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t('contact.title')}</h2>
            <p className="text-gray-400 text-lg">{t('contact.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {contactItems.map(function (c, i) {
              return (
                <a
                  key={i}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-hover text-center group py-6"
                >
                  <div className={'w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300 ' + c.bg}>
                    <ContactIcon type={c.icon} />
                  </div>
                  <span className="text-sm font-medium">{t('contact.' + c.label)}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* FOOTER                                      */}
      {/* ========================================== */}
      <footer className="bg-[#0B1120] border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center space-x-3">
              <SafeImage
                src="/assets/logo/logo.png"
                fallbackSrc="/icon.png"
                alt="AIVision Logo"
                type="logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-xl font-bold gradient-text">AIVision</span>
            </div>
            <div className="flex items-center gap-4">
              <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors p-2">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors p-2">
                <Send className="w-5 h-5" />
              </a>
              <a href={socialLinks.email} className="text-gray-400 hover:text-red-400 transition-colors p-2">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-sm">{t('footer.copyright')}</p>
              <p className="text-gray-600 text-xs mt-1 flex items-center justify-center md:justify-end">
                {t('footer.tagline')}
                <Heart className="w-3 h-3 text-red-400 mx-1 inline" />
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
