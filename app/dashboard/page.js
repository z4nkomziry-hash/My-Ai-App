'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Send, RefreshCw, Trash2, History, X, Copy, Check,
  Zap, Star, LogOut, Search, Clock, ChevronDown, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/AuthProvider';
import { getTranslation, languageMeta, getDirection } from '@/lib/i18n';
import supabase, {
  checkAndResetDailyCredits,
  getGenerations,
  deleteGeneration
} from '@/lib/supabase';

const languagesList = Object.entries(languageMeta).map(function(entry) {
  return { code: entry[0], name: entry[1].name, flag: entry[1].flag, direction: entry[1].direction };
});

const tasks = [
  { id: 'generate', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'rewrite', icon: <RefreshCw className="w-4 h-4" /> },
  { id: 'grammar', icon: <Zap className="w-4 h-4" /> },
  { id: 'translate', icon: <Sparkles className="w-4 h-4" /> }
];

export default function Dashboard() {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const profile = auth ? auth.profile : null;
  const signOutFn = auth ? auth.signOut : function() {};
  const authLoading = auth ? auth.loading : true;

  const router = useRouter();
  const [lang, setLang] = useState('EN');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [task, setTask] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [credits, setCredits] = useState(5);
  const [isPro, setIsPro] = useState(false);
  const [copied, setCopied] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const responseRef = useRef(null);
  const dir = getDirection(lang);
  const t = function(key) { return getTranslation(lang, key); };

  useEffect(function() {
    document.documentElement.dir = dir;
  }, [dir]);

  useEffect(function() {
    if (!authLoading && !user) {
      router.push('/auth');
    }
  }, [user, authLoading, router]);

  useEffect(function() {
    if (user && profile) {
      setIsPro(profile.subscription_status === 'pro');
      checkAndResetDailyCredits(user.id).then(function(p) {
        if (p) {
          setCredits(5 - p.daily_generations_count);
          setIsPro(p.subscription_status === 'pro');
        }
      });
      loadHistory();
    }
  }, [user, profile]);

  function loadHistory() {
    if (user) {
      getGenerations(user.id, 100, searchTerm).then(function(h) {
        setHistory(h || []);
      });
    }
  }

  useEffect(function() {
    var timer = setTimeout(function() {
      loadHistory();
    }, 300);
    return function() {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  async function generate() {
    if (!prompt.trim() || loading) return;
    if (!isPro && credits <= 0) {
      toast.error(t('dashboard.dailyLimit'));
      return;
    }
    setLoading(true);
    try {
      var res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt, language: lang, task: task })
      });
      var data = await res.json();
      if (data.success) {
        setResponse(data.text);
        if (!isPro) {
          setCredits(function(c) { return Math.max(0, c - 1); });
        }
        loadHistory();
        if (responseRef.current) {
          responseRef.current.scrollIntoView({ behavior: 'smooth' });
        }
        toast.success('Generated successfully!');
      } else if (data.dailyLimit) {
        toast.error(t('dashboard.dailyLimit'));
      }
    } catch (e) {
      toast.error('Generation failed');
    } finally {
      setLoading(false);
    }
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    setCopied(text);
    toast.success(t('demo.copied'));
    setTimeout(function() { setCopied(''); }, 2000);
  }

  async function handleDelete(id) {
    await deleteGeneration(id);
    loadHistory();
    toast.success('Deleted');
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
        <RefreshCw className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
        <div className="text-center card p-8 animate-slide-up">
          <h2 className="text-xl font-bold mb-4">{t('dashboard.signInRequired')}</h2>
          <Link href="/auth" className="btn-primary inline-flex items-center">
            {t('nav.signIn')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-white" dir={dir}>
      <nav className="sticky top-0 z-40 bg-[#090D16]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            {!logoError ? (
              <Image src="/logo.png" alt="AIVision" width={32} height={32} className="rounded-lg" onError={function() { setLogoError(true); }} />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            )}
            <span className="text-xl font-bold gradient-text hidden sm:inline">AIVision</span>
          </Link>
          <div className="flex items-center space-x-3">
            {!isPro && (
              <div className="flex items-center space-x-2">
                <div className="w-24 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="progress-bar" style={{ width: ((5 - credits) / 5) * 100 + '%' }} />
                </div>
                <span className="text-xs text-gray-400 force-ltr">{credits}/5</span>
              </div>
            )}
            {isPro && (
              <span className="text-xs text-purple-400 font-medium flex items-center">
                <Star className="w-3 h-3 mr-1" />
                {t('dashboard.unlimited')}
              </span>
            )}
            <select value={lang} onChange={function(e) { setLang(e.target.value); }} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
              {(languagesList || []).map(function(l) {
                return <option key={l.code} value={l.code}>{l.flag} {l.name}</option>;
              })}
            </select>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center text-sm font-bold">
              {(profile && profile.full_name ? profile.full_name.charAt(0) : (user.email ? user.email.charAt(0) : 'U')).toUpperCase()}
            </div>
            <button onClick={function() { setShowHistory(!showHistory); }} className="p-2 hover:bg-gray-800 rounded-lg relative">
              <History className="w-5 h-5" />
              {(history || []).length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>
            <button onClick={function() { signOutFn(); router.push('/'); }} className="p-2 hover:bg-gray-800 rounded-lg">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex">
        <div className="flex-1 p-4 lg:p-8 max-w-4xl mx-auto">
          <div className="flex flex-wrap gap-2 mb-6">
            {(tasks || []).map(function(tk) {
              return (
                <button
                  key={tk.id}
                  onClick={function() { setTask(tk.id); }}
                  className={'px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all ' + (task === tk.id ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-800 text-gray-400 hover:bg-gray-700')}
                >
                  {tk.icon}
                  <span>{t('demo.tabs.' + tk.id)}</span>
                </button>
              );
            })}
          </div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card mb-6">
            <textarea
              value={prompt}
              onChange={function(e) { setPrompt(e.target.value); }}
              placeholder={t('dashboard.placeholder')}
              className="w-full h-40 bg-gray-800 rounded-lg p-4 text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none transition-all"
            />
            <div className="flex items-center justify-between mt-4">
              <span className={'text-sm force-ltr ' + (prompt.length > 2000 ? 'text-red-400' : 'text-gray-500')}>
                {prompt.length}/2000
              </span>
              <div className="flex space-x-3">
                <button
                  onClick={function() { setPrompt(''); setResponse(''); }}
                  className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t('dashboard.clear')}</span>
                </button>
                <button
                  onClick={generate}
                  disabled={!prompt.trim() || loading || (!isPro && credits <= 0)}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium disabled:opacity-50 flex items-center space-x-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      {t('demo.generating')}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('dashboard.send')}
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {response && (
              <motion.div
                ref={responseRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-semibold">{t('demo.result')}</h3>
                  <button onClick={function() { handleCopy(response); }} className="p-2 hover:bg-gray-800 rounded transition-colors">
                    {copied === response ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <div className="whitespace-pre-wrap">{response}</div>
              </motion.div>
            )}
          </AnimatePresence>

          {!isPro && credits <= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-2xl border border-purple-500/30 p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold">
                  {credits === 0 ? t('dashboard.dailyLimit') : credits + ' ' + t('dashboard.remaining')}
                </h3>
                <p className="text-gray-400 text-sm">{t('pricing.pro.description')}</p>
              </div>
              <Link href="/checkout" className="btn-primary">
                {t('dashboard.upgrade')}
              </Link>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {showHistory && (
            <motion.aside
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed lg:static right-0 top-0 z-30 w-80 h-full bg-[#0B1120] border-l border-gray-800 pt-16 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">{t('dashboard.history')}</h3>
                  <button onClick={function() { setShowHistory(false); }} className="p-1 hover:bg-gray-800 rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={function(e) { setSearchTerm(e.target.value); }}
                    placeholder={t('dashboard.searchHistory')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:border-purple-500 transition-all"
                  />
                </div>
                {(history || []).length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{t('dashboard.noHistory')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {(history || []).map(function(h) {
                      var langInfo = (languagesList || []).find(function(l) { return l.code === h.language; });
                      return (
                        <motion.div
                          key={h.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-gray-800 rounded-xl p-4 hover:bg-gray-700 transition-colors group relative"
                        >
                          <button
                            onClick={function() {
                              setPrompt(h.prompt);
                              setResponse(h.response);
                              setTask(h.task || 'generate');
                              setShowHistory(false);
                            }}
                            className="w-full text-left"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
                                {langInfo ? langInfo.flag : '🌐'} {h.language} • {h.task || 'generate'}
                              </span>
                              <span className="text-xs text-gray-500">
                                {new Date(h.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-300 truncate mb-1">{h.prompt}</p>
                            <p className="text-xs text-gray-500 truncate">{(h.response || '').substring(0, 100)}...</p>
                          </button>
                          <button
                            onClick={function() { handleDelete(h.id); }}
                            className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition-all"
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
