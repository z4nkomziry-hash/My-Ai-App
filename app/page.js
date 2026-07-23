'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Zap, Globe, Shield, Languages, MessageSquare,
  ArrowRight, Check, ChevronDown, Menu, X, Copy,
  RefreshCw, Send, User, Briefcase, MessageCircle, Mail,
  Camera, Instagram, LogOut
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/AuthProvider';
import { getTranslation, languageMeta, getDirection } from '@/lib/i18n';

var languageEntries = Object.entries(languageMeta || {});
var languagesList = languageEntries.map(function(entry) {
  return { code: entry[0], name: entry[1]?.name, flag: entry[1]?.flag, direction: entry[1]?.direction };
});

var socialLinks = {
  whatsapp: 'https://wa.me/9647506045491',
  telegram: 'https://t.me/z_14x',
  email: 'mailto:z.14x@outlook.com',
  instagram: 'https://www.instagram.com/z44nko?igsh=MWtldmkwYWN2NW5udw==',
  snapchat: 'https://www.snapchat.com/add/al-mzurii?share_id=tK6JgW5VRZq2giNjAVOeuw&locale=en_US'
};

var demoResponses = {
  EN: 'AI Response: This demonstrates AIVision\'s powerful multilingual AI capabilities.\n\nOur platform supports 12 languages with specialized Kurdish dialect expertise for Badini and Sorani.',
  'KU-BD': 'وەڵامی AI: ئەمە توانا بەهێزەکانی AIVision نیشان دەدات.\n\nپلاتفۆرمەکەمان 12 زمان پشتگیری دەکات لەگەڵ شارەزایی تایبەتی شێوەزاری کوردی.',
  'KU-SO': 'وەڵام: ئەمە تواناکانی AIVision پیشان دەدات.\n\nپلاتفۆرمەکەمان پشتگیری 12 زمان دەکات.',
  AR: 'رد AI: هذا يوضح قدرات AIVision القوية في الذكاء الاصطناعي متعدد اللغات.\n\nمنصتنا تدعم 12 لغة مع خبرة متخصصة في اللهجات الكردية.',
  TR: 'AI Yanıt: Bu, AIVision\'ın güçlü çok dilli yapay zeka yeteneklerini gösterir.\n\nPlatformumuz, Kürt lehçelerinde özel uzmanlıkla 12 dili destekler.'
};

// Safe Array Helper Function
function ensureArray(val) {
  return Array.isArray(val) ? val : [];
}

export default function LandingPage() {
  var auth = useAuth();
  var user = auth ? auth.user : null;
  var profile = auth ? auth.profile : null;
  var signOut = auth ? auth.signOut : function() {};

  var [lang, setLang] = useState('EN');
  var [menuOpen, setMenuOpen] = useState(false);
  var [langOpen, setLangOpen] = useState(false);
  var [demoText, setDemoText] = useState('');
  var [demoResult, setDemoResult] = useState('');
  var [demoLoading, setDemoLoading] = useState(false);
  var [activeTab, setActiveTab] = useState('generate');
  var [copied, setCopied] = useState('');
  var [logoError, setLogoError] = useState(false);
  var [avatarError, setAvatarError] = useState(false);
  var dir = getDirection(lang);
  var t = function(key) { return getTranslation(lang, key); };

  useEffect(function() {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  function runDemo() {
    if (!demoText.trim()) return;
    setDemoLoading(true);
    setTimeout(function() {
      var resp = demoResponses[lang] || demoResponses['EN'];
      setDemoResult(resp);
      setDemoLoading(false);
    }, 1200);
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    toast.success(t('demo.copied'));
    setTimeout(function() { setCopied(''); }, 2000);
  }

  var features = ensureArray(t('features.items'));
  var featureIcons = [
    <Sparkles key="s" />, <Languages key="l" />, <Shield key="sh" />,
    <Zap key="z" />, <Globe key="g" />, <MessageSquare key="m" />
  ];

  var heroStats = [
    { v: '12+', l: t('hero.stats.languages') },
    { v: '99.9%', l: t('hero.stats.accuracy') },
    { v: '<1s', l: t('hero.stats.speed') }
  ];

  var pricingFreeFeatures = ensureArray(t('pricing.free.features'));
  var pricingProFeatures = ensureArray(t('pricing.pro.features'));

  var contactItems = [
    { icon: <MessageCircle className="w-7 h-7 text-green-400" />, label: t('contact.whatsapp'), href: socialLinks.whatsapp, bg: 'bg-green-500/20' },
    { icon: <Send className="w-7 h-7 text-blue-400" />, label: t('contact.telegram'), href: socialLinks.telegram, bg: 'bg-blue-500/20' },
    { icon: <Mail className="w-7 h-7 text-red-400" />, label: t('contact.email'), href: socialLinks.email, bg: 'bg-red-500/20' },
    { icon: <Instagram className="w-7 h-7 text-pink-400" />, label: t('contact.instagram'), href: socialLinks.instagram, bg: 'bg-pink-500/20' },
    { icon: <Camera className="w-7 h-7 text-yellow-400" />, label: t('contact.snapchat'), href: socialLinks.snapchat, bg: 'bg-yellow-500/20' }
  ];

  var socialButtons = [
    { icon: <MessageCircle className="w-5 h-5 text-green-400" />, href: socialLinks.whatsapp, bg: 'bg-green-500/20' },
    { icon: <Send className="w-5 h-5 text-blue-400" />, href: socialLinks.telegram, bg: 'bg-blue-500/20' },
    { icon: <Mail className="w-5 h-5 text-red-400" />, href: socialLinks.email, bg: 'bg-red-500/20' },
    { icon: <Instagram className="w-5 h-5 text-pink-400" />, href: socialLinks.instagram, bg: 'bg-pink-500/20' },
    { icon: <Camera className="w-5 h-5 text-yellow-400" />, href: socialLinks.snapchat, bg: 'bg-yellow-500/20' }
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-white" dir={dir}>
      <nav className="fixed top-0 w-full z-50 bg-[#090D16]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            {!logoError ? (
              <Image src="/logo.png" alt="AIVision" width={32} height={32} className="rounded-lg" onError={function() { setLogoError(true); }} />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center animate-glow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="text-xl font-bold gradient-text">AIVision</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.features')}</a>
            <a href="#languages" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.languages')}</a>
            <a href="#pricing" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.pricing')}</a>
            <a href="#contact" className="text-gray-300 hover:text-white text-sm transition-colors">{t('nav.contact')}</a>

            <div className="relative">
              <button onClick={function() { setLangOpen(!langOpen); }} className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm hover:bg-gray-700 transition-colors">
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
                    {ensureArray(languagesList).map(function(l) {
                      return (
                        <button
                          key={l.code}
                          onClick={function() { setLang(l.code); setLangOpen(false); }}
                          className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2 transition-colors"
                        >
                          <span>{l.flag}</span>
                          <span>{l.name}</span>
                          {l.code === lang && <Check className="w-4 h-4 text-purple-400 ml-auto" />}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {user ? (
              <div className="flex items-center space-x-3">
                <Link href="/dashboard" className="text-sm text-gray-300 hover:text-white transition-colors">{t('nav.dashboard')}</Link>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center text-sm font-bold">
                  {(profile && profile.full_name ? profile.full_name.charAt(0) : (user.email ? user.email.charAt(0) : 'U')).toUpperCase()}
                </div>
                <button onClick={signOut} className="text-sm text-gray-400 hover:text-red-400 transition-colors flex items-center">
                  <LogOut className="w-4 h-4 mr-1" />{t('nav.signOut')}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth" className="text-sm text-gray-300 hover:text-white transition-colors">{t('nav.signIn')}</Link>
                <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">{t('nav.tryFree')}</Link>
              </div>
            )}
          </div>

          <button onClick={function() { setMenuOpen(!menuOpen); }} className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors">
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#090D16] border-b border-gray-800 px-4 py-4 space-y-3"
            >
              <a href="#features" className="block text-gray-300">{t('nav.features')}</a>
              <a href="#languages" className="block text-gray-300">{t('nav.languages')}</a>
              <a href="#pricing" className="block text-gray-300">{t('nav.pricing')}</a>
              <a href="#contact" className="block text-gray-300">{t('nav.contact')}</a>
              <div className="grid grid-cols-3 gap-2">
                {ensureArray(languagesList).map(function(l) {
                  return (
                    <button
                      key={l.code}
                      onClick={function() { setLang(l.code); setMenuOpen(false); }}
                      className={'px-2 py-1.5 rounded text-xs transition-colors ' + (l.code === lang ? 'bg-purple-600' : 'bg-gray-800')}
                    >
                      {l.flag} {l.name}
                    </button>
                  );
                })}
              </div>
              {user ? (
                <>
                  <Link href="/dashboard" className="block w-full text-center py-2 bg-purple-600 rounded-lg">{t('nav.dashboard')}</Link>
                  <button onClick={signOut} className="block w-full text-center py-2 text-red-400">{t('nav.signOut')}</button>
                </>
              ) : (
                <>
                  <Link href="/auth" className="block w-full text-center py-2 border border-gray-700 rounded-lg">{t('nav.signIn')}</Link>
                  <Link href="/dashboard" className="block w-full text-center py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg">{t('nav.tryFree')}</Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">{t('hero.title')}</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">{t('hero.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary inline-flex items-center">
                {t('hero.cta1')}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a href="#demo" className="btn-secondary">{t('hero.cta2')}</a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            {ensureArray(heroStats).map(function(s, i) {
              return (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{s.v}</div>
                  <div className="text-gray-500 text-sm">{s.l}</div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section id="demo" className="py-20 bg-[#0B1120]">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('demo.title')}</h2>
            <p className="text-gray-400">{t('demo.subtitle')}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="card p-6">
            <div className="flex flex-wrap gap-2 mb-6">
              {['generate', 'rewrite', 'grammar', 'translate'].map(function(tab) {
                return (
                  <button
                    key={tab}
                    onClick={function() { setActiveTab(tab); }}
                    className={'px-4 py-2 rounded-lg text-sm font-medium transition-all ' + (activeTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')}
                  >
                    {t('demo.tabs.' + tab)}
                  </button>
                );
              })}
            </div>
            <textarea
              value={demoText}
              onChange={function(e) { setDemoText(e.target.value); }}
              placeholder={t('demo.placeholder')}
              className="w-full h-32 bg-gray-800 rounded-lg p-4 text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none mb-4 transition-all"
            />
            <div className="flex space-x-3 mb-6">
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
              <button onClick={function() { setDemoText(''); }} className="px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                {t('demo.clear')}
              </button>
            </div>
            <AnimatePresence>
              {demoResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-gray-800 rounded-lg p-4"
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-400">{t('demo.result')}:</span>
                    <button onClick={function() { handleCopy(demoResult); }} className="p-1 hover:bg-gray-700 rounded transition-colors">
                      {copied === demoResult ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="whitespace-pre-wrap">{demoResult}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('features.title')}</h2>
            <p className="text-gray-400 text-lg">{t('features.subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(function(feature, i) {
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card card-hover group"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    {featureIcons[i] || <Sparkles />}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature?.title}</h3>
                  <p className="text-gray-400">{feature?.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#0B1120]">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-green-400/20 rounded-3xl blur-3xl" />
            <div className="relative card p-8 md:p-12 border-purple-500/30">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative flex-shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-cyan-500 to-green-400 rounded-full blur-xl opacity-60 animate-pulse" />
                  <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 via-cyan-500 to-green-400 p-[3px] animate-glow">
                    {!avatarError ? (
                      <Image src="/developer.jpg" alt="Taha Sardar" width={128} height={128} className="w-full h-full rounded-full object-cover bg-[#111827]" onError={function() { setAvatarError(true); }} />
                    ) : (
                      <div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center">
                        <span className="text-4xl font-bold gradient-text">TS</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-400 rounded-full border-3 border-[#111827] animate-pulse" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-purple-400 font-medium">{t('owner.skills')}</span>
                  </div>
                  <h2 className="text-3xl font-bold mb-1">{t('owner.subtitle')}</h2>
                  <p className="text-gray-400 mb-1">{t('owner.title')}</p>
                  <div className="bg-gray-800/50 rounded-xl p-4 mb-6 border border-gray-700">
                    <p className="text-gray-300 leading-relaxed italic">"{t('owner.description')}"</p>
                  </div>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                    <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex items-center text-sm">
                      <MessageCircle className="w-4 h-4 mr-2" />{t('owner.cta')}
                    </a>
                    <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="btn-secondary inline-flex items-center text-sm">
                      <Send className="w-4 h-4 mr-2" />Telegram
                    </a>
                  </div>
                  <div className="flex justify-center md:justify-start gap-3">
                    {ensureArray(socialButtons).map(function(s, i) {
                      return (
                        <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className={'p-2.5 ' + s.bg + ' rounded-xl hover:opacity-80 transition-all'}>
                          {s.icon}
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

      <section id="languages" className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('languages.title')}</h2>
            <p className="text-gray-400 text-lg">{t('languages.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {ensureArray(languagesList).map(function(l, i) {
              return (
                <motion.div
                  key={l.code}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={'bg-[#111827] rounded-xl p-4 text-center border border-gray-800 hover:border-purple-500/50 transition-all duration-300 ' + (l.code.startsWith('KU') ? 'ring-2 ring-purple-500/30' : '')}
                >
                  <div className="text-3xl mb-2">{l.flag}</div>
                  <div className="font-medium text-sm">{l.name}</div>
                  <div className="text-xs text-gray-500">{l.direction === 'rtl' ? t('languages.rtl') : t('languages.ltr')}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 bg-[#0B1120]">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">{t('pricing.title')}</h2>
            <p className="text-gray-400 text-lg">{t('pricing.subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="card">
              <h3 className="text-2xl font-bold mb-2">{t('pricing.free.name')}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{t('pricing.free.price')}</span>
                <span className="text-gray-400">{t('pricing.free.period')}</span>
              </div>
              <p className="text-gray-400 mb-6">{t('pricing.free.description')}</p>
              <ul className="space-y-3 mb-8">
                {pricingFreeFeatures.map(function(f, i) {
                  return (
                    <li key={i} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  );
                })}
              </ul>
              <Link href="/auth" className="block w-full py-3 border border-gray-700 rounded-xl text-center hover:border-purple-500 transition-all">
                {t('pricing.free.cta')}
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative card border-purple-500">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full text-sm font-medium">
                {t('pricing.pro.badge')}
              </div>
              <h3 className="text-2xl font-bold mb-2 mt-2">{t('pricing.pro.name')}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold">{t('pricing.pro.price')}</span>
                <span className="text-gray-400">{t('pricing.pro.period')}</span>
              </div>
              <p className="text-gray-400 mb-6">{t('pricing.pro.description')}</p>
              <ul className="space-y-3 mb-8">
                {pricingProFeatures.map(function(f, i) {
                  return (
                    <li key={i} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-purple-400 flex-shrink-0" />
                      <span className="text-gray-300">{f}</span>
                    </li>
                  );
                })}
              </ul>
              <Link href="/checkout" className="block w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl text-center font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all">
                {t('pricing.pro.cta')}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">{t('contact.title')}</h2>
            <p className="text-gray-400 text-lg">{t('contact.subtitle')}</p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {ensureArray(contactItems).map(function(c, i) {
              return (
                <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="card card-hover text-center group">
                  <div className={'w-14 h-14 ' + c.bg + ' rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300'}>
                    {c.icon}
                  </div>
                  <span className="text-sm font-medium">{c.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-[#0B1120] border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-3">
            {!logoError ? (
              <Image src="/logo.png" alt="AIVision" width={32} height={32} className="rounded-lg" onError={function() { setLogoError(true); }} />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="text-xl font-bold gradient-text">AIVision</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
              <Send className="w-5 h-5" />
            </a>
            <a href={socialLinks.email} className="text-gray-400 hover:text-red-400 transition-colors">
              <Mail className="w-5 h-5" />
            </a>
          </div>
          <p className="text-gray-500 text-sm">{t('footer.copyright')} • {t('footer.tagline')}</p>
        </div>
      </footer>
    </div>
  );
}
