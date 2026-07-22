'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Zap, Globe, Shield, Languages, MessageSquare, 
  ArrowRight, Check, Star, Users, ChevronDown, Menu, X,
  Moon, Sun, Copy, RefreshCw, Send, TrendingUp
} from 'lucide-react';
import Link from 'next/link';

// Language configuration
const languages = [
  { code: 'EN', name: 'English', flag: '🇬🇧', direction: 'ltr' },
  { code: 'KU-BD', name: 'Kurdish Badini', flag: '🏴', direction: 'rtl' },
  { code: 'KU-SO', name: 'Kurdish Sorani', flag: '🏴', direction: 'rtl' },
  { code: 'AR', name: 'Arabic', flag: '🇸🇦', direction: 'rtl' },
  { code: 'TR', name: 'Turkish', flag: '🇹🇷', direction: 'ltr' },
  { code: 'FA', name: 'Persian', flag: '🇮🇷', direction: 'rtl' },
  { code: 'DE', name: 'German', flag: '🇩🇪', direction: 'ltr' },
  { code: 'FR', name: 'French', flag: '🇫🇷', direction: 'ltr' },
  { code: 'ES', name: 'Spanish', flag: '🇪🇸', direction: 'ltr' },
  { code: 'RU', name: 'Russian', flag: '🇷🇺', direction: 'ltr' },
  { code: 'ZH', name: 'Chinese', flag: '🇨🇳', direction: 'ltr' },
  { code: 'HI', name: 'Hindi', flag: '🇮🇳', direction: 'ltr' },
];

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI Text Generation",
    description: "Create high-quality content in 12 languages with advanced AI models trained for accuracy and cultural nuance."
  },
  {
    icon: <Languages className="w-6 h-6" />,
    title: "Precise Translation",
    description: "Industry-leading translation with special expertise in Kurdish dialects - both Badini and Sorani."
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Grammar Perfection",
    description: "Advanced grammar correction that understands linguistic nuances across all supported languages."
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Lightning Fast",
    description: "Powered by Google's Gemini 1.5 Flash for instant responses with maximum efficiency."
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "RTL Support",
    description: "Full right-to-left support for Arabic, Kurdish, Persian with proper text flow and layout."
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Smart Rewriting",
    description: "Intelligent text rewriting that improves clarity while preserving your unique voice and style."
  }
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "5 AI generations per day",
      "12 language support",
      "Basic grammar correction",
      "Standard translation",
      "Community support"
    ],
    cta: "Get Started Free",
    popular: false
  },
  {
    name: "Pro",
    price: "$9.99",
    period: "/month",
    description: "For power users and professionals",
    features: [
      "Unlimited AI generations",
      "Advanced Kurdish dialect tuning",
      "Extended context window",
      "Priority processing speed",
      "Advanced grammar correction",
      "Priority support",
      "Early access to new features"
    ],
    cta: "Upgrade to Pro",
    popular: true
  }
];

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [demoText, setDemoText] = useState('');
  const [demoResult, setDemoResult] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const runDemo = async () => {
    if (!demoText.trim()) return;
    
    setIsDemoLoading(true);
    // Simulate AI generation for demo
    setTimeout(() => {
      const demos = {
        EN: "This is an AI-generated response demonstrating our advanced language capabilities. The system understands context, nuance, and delivers precise results.",
        'KU-BD': "Ev bersiveke AI-çêkirî ye ku şiyanên me yên pêşketî yên ziman nîşan dide. Pergal konteksê, nuansê fêm dike û encamên rastîn pêşkêş dike.",
        'KU-SO': "ئەمە وەڵامێکی دروستکراوی ژیری دەستکردە کە توانا پێشکەوتووەکانی زمانی ئێمە پیشان دەدات. سیستەمەکە چوارچێوە و وردەکاری تێدەگات و ئەنجامی ورد پێشکەش دەکات.",
        AR: "هذا رد تم إنشاؤه بواسطة الذكاء الاصطناعي يوضح قدراتنا اللغوية المتقدمة. يفهم النظام السياق والفروق الدقيقة ويقدم نتائج دقيقة."
      };
      setDemoResult(demos[selectedLanguage] || demos.EN);
      setIsDemoLoading(false);
    }, 1500);
  };

  const tabs = [
    { id: 'generate', label: 'Generate' },
    { id: 'rewrite', label: 'Rewrite' },
    { id: 'grammar', label: 'Grammar' },
    { id: 'translate', label: 'Translate' }
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#090D16]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AIVision
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </a>
              <a href="#languages" className="text-gray-300 hover:text-white transition-colors">
                Languages
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </a>
              <Link 
                href="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                Try Free
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
                <a href="#features" className="block text-gray-300 hover:text-white">Features</a>
                <a href="#languages" className="block text-gray-300 hover:text-white">Languages</a>
                <a href="#pricing" className="block text-gray-300 hover:text-white">Pricing</a>
                <Link href="/dashboard" className="block px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-center">
                  Try Free
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-16">
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent"
        />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  AI-Powered Language
                </span>
                <br />
                <span className="text-white">Intelligence Platform</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
                Advanced AI text generation, translation, and grammar correction across 12 languages 
                with specialized Kurdish dialect support for Badini and Sorani.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/dashboard"
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/30 transition-all transform hover:scale-105"
                >
                  Start Generating Free
                  <ArrowRight className="inline ml-2 w-5 h-5" />
                </Link>
                <a
                  href="#demo"
                  className="px-8 py-4 border border-gray-700 rounded-xl font-semibold text-lg hover:border-purple-500 transition-all"
                >
                  Try Demo
                </a>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mb-16"
          >
            {[
              { value: '12+', label: 'Languages' },
              { value: '99.9%', label: 'Accuracy' },
              { value: '<1s', label: 'Response Time' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-purple-400">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
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
            <h2 className="text-4xl font-bold mb-4">Experience the Power</h2>
            <p className="text-gray-400">Try our AI with a quick interactive demo</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111827] rounded-2xl border border-gray-800 p-6"
          >
            {/* Tabs */}
            <div className="flex space-x-2 mb-6 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Language Selector */}
            <div className="relative mb-4">
              <button
                onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
                className="w-full md:w-auto px-4 py-2 bg-gray-800 rounded-lg flex items-center justify-between space-x-2 hover:bg-gray-700 transition-colors"
              >
                <span>{languages.find(l => l.code === selectedLanguage)?.flag}</span>
                <span>{languages.find(l => l.code === selectedLanguage)?.name}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <AnimatePresence>
                {isLanguageDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full mt-2 w-64 bg-gray-800 rounded-lg border border-gray-700 shadow-xl z-10 max-h-64 overflow-y-auto"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setSelectedLanguage(lang.code);
                          setIsLanguageDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2"
                      >
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                        {lang.code === selectedLanguage && (
                          <Check className="w-4 h-4 text-purple-400 ml-auto" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Text Input */}
            <textarea
              value={demoText}
              onChange={(e) => setDemoText(e.target.value)}
              placeholder={`Enter your text for ${activeTab}...`}
              className="w-full h-32 bg-gray-800 rounded-lg p-4 text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none mb-4"
              dir={languages.find(l => l.code === selectedLanguage)?.direction}
            />

            {/* Action Buttons */}
            <div className="flex space-x-3 mb-6">
              <button
                onClick={runDemo}
                disabled={!demoText.trim() || isDemoLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all"
              >
                {isDemoLoading ? (
                  <span className="flex items-center justify-center">
                    <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Generate
                  </span>
                )}
              </button>
              <button
                onClick={() => setDemoText('')}
                className="px-4 py-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear
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
                    <span className="text-sm text-gray-400">Result:</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(demoResult)}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-white" dir={languages.find(l => l.code === selectedLanguage)?.direction}>
                    {demoResult}
                  </p>
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
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need for multilingual AI content creation</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#111827] rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Language Showcase */}
      <section id="languages" className="py-20 bg-[#0B1120]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">12 Languages Supported</h2>
            <p className="text-gray-400 text-lg">Including specialized Kurdish dialect support</p>
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
                <div className="font-medium">{lang.name}</div>
                <div className="text-xs text-gray-500">
                  {lang.direction === 'rtl' ? 'RTL' : 'LTR'}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-400 text-lg">Start free, upgrade when you need more power</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative bg-[#111827] rounded-2xl p-8 border ${
                  plan.popular ? 'border-purple-500' : 'border-gray-800'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-2">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={plan.popular ? "/checkout" : "/dashboard"}
                  className={`block w-full py-3 rounded-xl text-center font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/25'
                      : 'border border-gray-700 hover:border-purple-500'
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B1120] border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                AIVision
              </span>
            </div>
            <p className="text-gray-500">© 2024 AIVision. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
