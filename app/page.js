'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Globe, Shield, Languages, MessageSquare, ArrowRight, Check, ChevronDown, Menu, X, Copy, RefreshCw, Send, User, Briefcase, MessageCircle, Mail, Camera, Instagram, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getTranslation, languageMeta, getDirection } from '@/lib/i18n';

const languages = Object.entries(languageMeta).map(([code, meta]) => ({ code, ...meta }));
const socialLinks = {
  whatsapp: 'https://wa.me/9647506045491',
  telegram: 'https://t.me/z_14x',
  email: 'mailto:z.14x@outlook.com',
  instagram: 'https://www.instagram.com/z44nko?igsh=MWtldmkwYWN2NW5udw==',
  snapchat: 'https://www.snapchat.com/add/al-mzurii?share_id=tK6JgW5VRZq2giNjAVOeuw&locale=en_US'
};
const paymentInfo = { fib: { phone: '+964 750 604 5491', link: 'tel:+9647506045491' }, fastpay: { phone: '+964 750 604 5491', link: 'tel:+9647506045491' }, usdt: { address: 'TKUfVwnjyT2KUa9xnBreT32YLLJEwACHpc' } };

export default function LandingPage() {
  const [lang, setLang] = useState('EN');
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [demoText, setDemoText] = useState('');
  const [demoResult, setDemoResult] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [copied, setCopied] = useState('');
  const dir = getDirection(lang);
  const t = (k) => getTranslation(lang, k);

  useEffect(() => { document.documentElement.dir = dir; document.documentElement.lang = lang; }, [lang, dir]);

  const runDemo = () => {
    if (!demoText.trim()) return;
    setDemoLoading(true);
    setTimeout(() => {
      const resp = { EN: `AI Response: ${demoText}`, 'KU-BD': `وەڵامی AI: ${demoText}`, 'KU-SO': `وەڵام: ${demoText}`, AR: `رد AI: ${demoText}`, TR: `AI Yanıt: ${demoText}` };
      setDemoResult(resp[lang] || resp.EN);
      setDemoLoading(false);
    }, 1200);
  };

  const handleCopy = (text) => { navigator.clipboard.writeText(text); setCopied(text); setTimeout(() => setCopied(''), 2000); };

  return (
    <div className="min-h-screen bg-[#090D16] text-white" dir={dir}>
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-[#090D16]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2"><Sparkles className="w-6 h-6 text-purple-400" /><span className="text-xl font-bold gradient-text">AIVision</span></Link>
          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white text-sm">{t('nav.features')}</a>
            <a href="#languages" className="text-gray-300 hover:text-white text-sm">{t('nav.languages')}</a>
            <a href="#pricing" className="text-gray-300 hover:text-white text-sm">{t('nav.pricing')}</a>
            <a href="#contact" className="text-gray-300 hover:text-white text-sm">{t('nav.contact')}</a>
            <div className="relative">
              <button onClick={() => setLangOpen(!langOpen)} className="flex items-center space-x-1 px-3 py-1.5 bg-gray-800 rounded-lg text-sm"><span>{languageMeta[lang]?.flag}</span><ChevronDown className="w-4 h-4" /></button>
              {langOpen && <div className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-xl shadow-xl max-h-72 overflow-y-auto z-50"> {languages.map((l) => <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false); }} className="w-full px-4 py-2 text-left hover:bg-gray-800 flex items-center space-x-2"><span>{l.flag}</span><span>{l.name}</span>{l.code === lang && <Check className="w-4 h-4 text-purple-400 ml-auto" />}</button>)} </div>}
            </div>
            <Link href="/dashboard" className="px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-sm font-medium">{t('nav.tryFree')}</Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">{menuOpen ? <X /> : <Menu />}</button>
        </div>
        <AnimatePresence>{menuOpen && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-[#090D16] border-b border-gray-800 px-4 py-4 space-y-3">
          <a href="#features" className="block text-gray-300">{t('nav.features')}</a><a href="#languages" className="block text-gray-300">{t('nav.languages')}</a><a href="#pricing" className="block text-gray-300">{t('nav.pricing')}</a><a href="#contact" className="block text-gray-300">{t('nav.contact')}</a>
          <div className="grid grid-cols-3 gap-2">{languages.map((l) => <button key={l.code} onClick={() => { setLang(l.code); setMenuOpen(false); }} className={`px-2 py-1.5 rounded text-xs ${l.code === lang ? 'bg-purple-600' : 'bg-gray-800'}`}>{l.flag} {l.name}</button>)}</div>
          <Link href="/dashboard" className="block w-full text-center py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg">{t('nav.tryFree')}</Link>
        </motion.div>}</AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6"><span className="gradient-text">{t('hero.title')}</span></h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">{t('hero.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary inline-flex items-center">{t('hero.cta1')}<ArrowRight className="ml-2 w-5 h-5" /></Link>
              <a href="#demo" className="btn-secondary">{t('hero.cta2')}</a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            {[{ v: '12+', l: t('hero.stats.languages') }, { v: '99.9%', l: t('hero.stats.accuracy') }, { v: '<1s', l: t('hero.stats.speed') }].map((s, i) => <div key={i} className="text-center"><div className="text-3xl font-bold text-purple-400">{s.v}</div><div className="text-gray-500 text-sm">{s.l}</div></div>)}
          </motion.div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="py-20 bg-[#0B1120]"><div className="max-w-4xl mx-auto px-4"><motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12"><h2 className="text-4xl font-bold mb-4">{t('demo.title')}</h2><p className="text-gray-400">{t('demo.subtitle')}</p></motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="card p-6">
          <div className="flex flex-wrap gap-2 mb-6">{['generate','rewrite','grammar','translate'].map(tab => <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab===tab?'bg-purple-600 text-white':'bg-gray-800 text-gray-400'}`}>{t(`demo.tabs.${tab}`)}</button>)}</div>
          <textarea value={demoText} onChange={e => setDemoText(e.target.value)} placeholder={t('demo.placeholder')} className="w-full h-32 bg-gray-800 rounded-lg p-4 text-white placeholder-gray-500 border border-gray-700 resize-none mb-4" />
          <div className="flex space-x-3 mb-6"><button onClick={runDemo} disabled={!demoText.trim()||demoLoading} className="flex-1 btn-primary flex items-center justify-center">{demoLoading?<><RefreshCw className="w-5 h-5 animate-spin mr-2"/>{t('demo.generating')}</>:<><Send className="w-5 h-5 mr-2"/>{t('demo.generate')}</>}</button><button onClick={()=>setDemoText('')} className="px-4 py-3 bg-gray-800 rounded-lg">{t('demo.clear')}</button></div>
          <AnimatePresence>{demoResult && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-gray-800 rounded-lg p-4"><div className="flex justify-between mb-2"><span className="text-sm text-gray-400">{t('demo.result')}:</span><button onClick={()=>handleCopy(demoResult)} className="p-1 hover:bg-gray-700 rounded">{copied===demoResult?<Check className="w-4 h-4 text-green-400"/>:<Copy className="w-4 h-4"/>}</button></div><p className="whitespace-pre-wrap">{demoResult}</p></motion.div>}</AnimatePresence>
        </motion.div></div></section>

      {/* FEATURES */}
      <section id="features" className="py-20"><div className="max-w-7xl mx-auto px-4"><motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">{t('features.title')}</h2><p className="text-gray-400 text-lg">{t('features.subtitle')}</p></motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{[<Sparkles />,<Languages />,<Shield />,<Zap />,<Globe />,<MessageSquare />].map((icon, i) => <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i*0.1 }} className="card card-hover group"><div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">{icon}</div><h3 className="text-xl font-semibold mb-2">{t(`features.items.${i}.title`)}</h3><p className="text-gray-400">{t(`features.items.${i}.description`)}</p></motion.div>)}</div></div></section>

      {/* OWNER PROFILE */}
      <section className="py-20 bg-[#0B1120]"><div className="max-w-4xl mx-auto px-4"><motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-500/20 to-purple-600/20 rounded-3xl blur-3xl" />
        <div className="relative card p-8 md:p-12 border-purple-500/30">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative"><div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full blur-xl opacity-50" /><div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 p-1"><div className="w-full h-full rounded-full bg-[#111827] flex items-center justify-center"><User className="w-16 h-16 text-gray-400" /></div></div><div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-[#111827]" /></div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2"><Briefcase className="w-5 h-5 text-purple-400" /><span className="text-sm text-purple-400">{t('owner.skills')}</span></div>
              <h2 className="text-3xl font-bold mb-1">{t('owner.subtitle')}</h2>
              <p className="text-gray-400 mb-1">{t('owner.title')}</p>
              <p className="text-gray-300 leading-relaxed mb-6">{t('owner.description')}</p>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
                <a href={socialLinks.whatsapp} target="_blank" className="btn-primary inline-flex items-center text-sm"><MessageCircle className="w-4 h-4 mr-2" />{t('owner.cta')}</a>
                <a href={socialLinks.telegram} target="_blank" className="btn-secondary inline-flex items-center text-sm"><Send className="w-4 h-4 mr-2" />Telegram</a>
              </div>
              <div className="flex justify-center md:justify-start gap-3">
                {[{icon:<MessageCircle className="w-5 h-5 text-green-400"/>,href:socialLinks.whatsapp},{icon:<Send className="w-5 h-5 text-blue-400"/>,href:socialLinks.telegram},{icon:<Mail className="w-5 h-5 text-red-400"/>,href:socialLinks.email},{icon:<Instagram className="w-5 h-5 text-pink-400"/>,href:socialLinks.instagram},{icon:<Camera className="w-5 h-5 text-yellow-400"/>,href:socialLinks.snapchat}].map((s,i)=> <a key={i} href={s.href} target="_blank" className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">{s.icon}</a>)}
              </div>
            </div>
          </div>
        </div>
      </motion.div></div></section>

      {/* LANGUAGES */}
      <section id="languages" className="py-20"><div className="max-w-7xl mx-auto px-4"><motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">{t('languages.title')}</h2><p className="text-gray-400 text-lg">{t('languages.subtitle')}</p></motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">{languages.map((l,i) => <motion.div key={l.code} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i*0.05 }} className={`bg-[#111827] rounded-xl p-4 text-center border border-gray-800 hover:border-purple-500/50 transition-all ${l.code.startsWith('KU')?'ring-2 ring-purple-500/30':''}`}><div className="text-3xl mb-2">{l.flag}</div><div className="font-medium text-sm">{l.name}</div><div className="text-xs text-gray-500">{l.direction==='rtl'?t('languages.rtl'):t('languages.ltr')}</div></motion.div>)}</div></div></section>

      {/* PRICING */}
      <section id="pricing" className="py-20 bg-[#0B1120]"><div className="max-w-5xl mx-auto px-4"><motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-16"><h2 className="text-4xl font-bold mb-4">{t('pricing.title')}</h2><p className="text-gray-400 text-lg">{t('pricing.subtitle')}</p></motion.div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} className="card"><h3 className="text-2xl font-bold mb-2">{t('pricing.free.name')}</h3><div className="mb-4"><span className="text-4xl font-bold">{t('pricing.free.price')}</span><span className="text-gray-400">{t('pricing.free.period')}</span></div><p className="text-gray-400 mb-6">{t('pricing.free.description')}</p><ul className="space-y-3 mb-8">{t('pricing.free.features').map((f,i)=><li key={i} className="flex items-center space-x-2"><Check className="w-5 h-5 text-green-400 flex-shrink-0" /><span className="text-gray-300">{f}</span></li>)}</ul><Link href="/dashboard" className="block w-full py-3 border border-gray-700 rounded-xl text-center">{t('pricing.free.cta')}</Link></motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} className="relative card border-purple-500"><div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full text-sm">{t('pricing.pro.badge')}</div><h3 className="text-2xl font-bold mb-2 mt-2">{t('pricing.pro.name')}</h3><div className="mb-4"><span className="text-4xl font-bold">{t('pricing.pro.price')}</span><span className="text-gray-400">{t('pricing.pro.period')}</span></div><p className="text-gray-400 mb-6">{t('pricing.pro.description')}</p><ul className="space-y-3 mb-8">{t('pricing.pro.features').map((f,i)=><li key={i} className="flex items-center space-x-2"><Check className="w-5 h-5 text-purple-400 flex-shrink-0" /><span className="text-gray-300">{f}</span></li>)}</ul><Link href="/checkout" className="block w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl text-center">{t('pricing.pro.cta')}</Link></motion.div>
        </div></div></section>

      {/* CONTACT */}
      <section id="contact" className="py-20"><div className="max-w-4xl mx-auto px-4"><motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-center mb-12"><h2 className="text-4xl font-bold mb-4">{t('contact.title')}</h2><p className="text-gray-400 text-lg">{t('contact.subtitle')}</p></motion.div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[{icon:<MessageCircle className="w-7 h-7 text-green-400" />,label:t('contact.whatsapp'),href:socialLinks.whatsapp,bg:'bg-green-500/20'},{icon:<Send className="w-7 h-7 text-blue-400" />,label:t('contact.telegram'),href:socialLinks.telegram,bg:'bg-blue-500/20'},{icon:<Mail className="w-7 h-7 text-red-400" />,label:t('contact.email'),href:socialLinks.email,bg:'bg-red-500/20'},{icon:<Instagram className="w-7 h-7 text-pink-400" />,label:t('contact.instagram'),href:socialLinks.instagram,bg:'bg-pink-500/20'},{icon:<Camera className="w-7 h-7 text-yellow-400" />,label:t('contact.snapchat'),href:socialLinks.snapchat,bg:'bg-yellow-500/20'}].map((c,i)=> <a key={i} href={c.href} target="_blank" className="card card-hover text-center group"><div className={`w-14 h-14 ${c.bg} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>{c.icon}</div><span className="text-sm font-medium">{c.label}</span></a>)}
        </div></div></section>

      {/* FOOTER */}
      <footer className="bg-[#0B1120] border-t border-gray-800 py-12"><div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4"><div className="flex items-center space-x-3"><Sparkles className="w-6 h-6 text-purple-400" /><span className="text-xl font-bold gradient-text">AIVision</span></div><p className="text-gray-500 text-sm">{t('footer.copyright')} • {t('footer.tagline')}</p></div></footer>
    </div>
  );
}
