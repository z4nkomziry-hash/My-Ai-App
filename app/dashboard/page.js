'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Send, RefreshCw, Trash2, History, X, Copy, Check, Zap, Star, LogOut, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { getTranslation, languageMeta, getDirection } from '@/lib/i18n';

const languages = Object.entries(languageMeta).map(([code, meta]) => ({ code, ...meta }));
const tasks = [{ id: 'generate', icon: <Sparkles className="w-4 h-4" /> }, { id: 'rewrite', icon: <RefreshCw className="w-4 h-4" /> }, { id: 'grammar', icon: <Zap className="w-4 h-4" /> }, { id: 'translate', icon: <Globe className="w-4 h-4" /> }];

export default function Dashboard() {
  const [lang, setLang] = useState('EN');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [task, setTask] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [credits, setCredits] = useState(5);
  const [isPro, setIsPro] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef(null);
  const dir = getDirection(lang);
  const t = (k) => getTranslation(lang, k);

  useEffect(() => { document.documentElement.dir = dir; }, [dir]);

  const generate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, language: lang, task }) });
      const data = await res.json();
      if (data.success) {
        setResponse(data.text);
        if (!isPro) setCredits(c => Math.max(0, c - 1));
        setHistory(h => [{ id: Date.now(), prompt, response: data.text, language: lang, task, createdAt: new Date().toISOString() }, ...h]);
        ref.current?.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white" dir={dir}>
      <nav className="sticky top-0 z-40 bg-[#090D16]/80 backdrop-blur-xl border-b border-gray-800 h-16 flex items-center justify-between px-4"><Link href="/" className="flex items-center space-x-2"><Sparkles className="w-6 h-6 text-purple-400" /><span className="text-xl font-bold gradient-text hidden sm:inline">AIVision</span></Link>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-lg">{isPro ? <><Star className="w-4 h-4 text-purple-400" /><span className="text-sm text-purple-400">{t('dashboard.unlimited')}</span></> : <><Zap className="w-4 h-4 text-yellow-400" /><span className="text-sm force-ltr font-bold">{credits}/5</span></>}</div>
          <select value={lang} onChange={e => setLang(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">{languages.map(l => <option key={l.code} value={l.code}>{l.flag} {l.name}</option>)}</select>
          <button onClick={() => setShowHistory(!showHistory)} className="p-2 hover:bg-gray-800 rounded-lg relative"><History className="w-5 h-5" />{history.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center">{history.length}</span>}</button>
          <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg"><LogOut className="w-5 h-5" /></Link>
        </div>
      </nav>
      <div className="flex">
        <div className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">{tasks.map(tk => <button key={tk.id} onClick={() => setTask(tk.id)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${task===tk.id?'bg-purple-600':'bg-gray-800 text-gray-400'}`}>{tk.icon}<span>{t(`demo.tabs.${tk.id}`)}</span></button>)}</div>
          <div className="card mb-6"><textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={t('dashboard.placeholder')} className="w-full h-40 bg-gray-800 rounded-lg p-4 text-white placeholder-gray-500 border border-gray-700 resize-none" />
            <div className="flex items-center justify-between mt-4"><span className={`text-sm force-ltr ${prompt.length>2000?'text-red-400':'text-gray-500'}`}>{prompt.length}/2000</span>
              <div className="flex space-x-3"><button onClick={() => { setPrompt(''); setResponse(''); }} className="px-4 py-2 bg-gray-800 rounded-lg flex items-center space-x-2"><Trash2 className="w-4 h-4" /><span>{t('dashboard.clear')}</span></button><button onClick={generate} disabled={!prompt.trim()||loading} className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium disabled:opacity-50 flex items-center space-x-2">{loading?<><RefreshCw className="w-4 h-4 animate-spin" />{t('demo.generating')}</>:<><Send className="w-4 h-4" />{t('dashboard.send')}</>}</button></div>
            </div>
          </div>
          <AnimatePresence>{response && <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card"><div className="flex justify-between mb-4"><h3 className="text-lg font-semibold">{t('demo.result')}</h3><button onClick={() => { navigator.clipboard.writeText(response); setCopied(true); setTimeout(()=>setCopied(false),2000); }} className="p-2 hover:bg-gray-800 rounded">{copied?<Check className="w-4 h-4 text-green-400"/>:<Copy className="w-4 h-4"/>}</button></div><div className="whitespace-pre-wrap">{response}</div></motion.div>}</AnimatePresence>
        </div>
        <AnimatePresence>{showHistory && <motion.aside initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} className="fixed lg:static right-0 top-0 z-30 w-80 h-full bg-[#0B1120] border-l border-gray-800 pt-16 overflow-y-auto"><div className="p-4"><div className="flex justify-between mb-6"><h3 className="text-lg font-semibold">{t('dashboard.history')}</h3><button onClick={()=>setShowHistory(false)}><X className="w-5 h-5" /></button></div>{history.length===0?<div className="text-center text-gray-500 py-8"><History className="w-12 h-12 mx-auto mb-3 opacity-50" /><p>{t('dashboard.noHistory')}</p></div>:<div className="space-y-3">{history.map(h => <button key={h.id} onClick={() => { setPrompt(h.prompt); setResponse(h.response); setTask(h.task); setShowHistory(false); }} className="w-full text-left p-4 bg-gray-800 rounded-xl hover:bg-gray-700"><div className="flex items-center space-x-2 mb-2"><span className="text-xs px-2 py-1 bg-gray-700 rounded-full">{languages.find(l=>l.code===h.language)?.flag} {h.language}</span><span className="text-xs text-gray-500">{new Date(h.createdAt).toLocaleDateString()}</span></div><p className="text-sm text-gray-300 truncate">{h.prompt}</p></button>)}</div>}</div></motion.aside>}</AnimatePresence>
      </div>
    </div>
  );
}
