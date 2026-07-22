'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, History, CreditCard, LogOut, Menu, X,
  Sparkles, Copy, RefreshCw, Trash2, ChevronDown, Languages,
  Zap, TrendingUp, Clock, Star, AlertCircle, ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { getTranslation, languageMeta, getDirection, isRTL } from '@/lib/i18n';

// Language list
const languages = Object.entries(languageMeta).map(([code, meta]) => ({
  code,
  ...meta,
}));

const tasks = [
  { id: 'generate', label: 'Generate', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'rewrite', label: 'Rewrite', icon: <RefreshCw className="w-4 h-4" /> },
  { id: 'grammar', label: 'Grammar', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 'translate', label: 'Translate', icon: <Languages className="w-4 h-4" /> },
];

export default function Dashboard() {
  const [currentLang, setCurrentLang] = useState('EN');
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [selectedTask, setSelectedTask] = useState('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState(5);
  const [isPro, setIsPro] = useState(false);
  const [copied, setCopied] = useState(false);
  const responseRef = useRef(null);

  const dir = getDirection(currentLang);
  const t = (key) => getTranslation(currentLang, key);

  // Update document direction
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = currentLang;
  }, [currentLang, dir]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (prompt.length > 2000) {
      alert('Prompt too long. Maximum 2000 characters.');
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call for demo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const demoResponse = {
        EN: `This is an AI-generated response to: "${prompt}". Our advanced language model provides accurate and context-aware results tailored to your needs.`,
        'KU-BD': `Ev bersiveke AI-çêkirî ye ji bo: "${prompt}". مۆدێلی زمانی پێشکەوتوی ئێمە ئەنجامە ورد و هۆشیارەکانی کۆنتێکست پێشکەش دەکات کە بەپێی پێداویستییەکانت ڕێکدەخرێت.`,
      };
      
      setResponse(demoResponse[currentLang] || demoResponse.EN);
      
      // Update credits
      if (!isPro) {
        setCreditsRemaining(prev => Math.max(0, prev - 1));
      }
      
      // Add to history
      setHistory(prev => [{
        id: Date.now(),
        prompt,
        response: demoResponse[currentLang] || demoResponse.EN,
        language: currentLang,
        task: selectedTask,
        createdAt: new Date().toISOString(),
      }, ...prev]);
      
      if (responseRef.current) {
        responseRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setPrompt('');
    setResponse('');
  };

  const loadHistoryItem = (item) => {
    setPrompt(item.prompt);
    setResponse(item.response);
    setSelectedTask(item.task);
    setShowHistory(false);
  };

  const charCount = prompt.length;
  const maxChars = 2000;

  return (
    <div className="min-h-screen bg-[#090D16] text-white" dir={dir}>
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-[#090D16]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold gradient-text hidden sm:inline">AIVision</span>
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              {/* Credit Meter */}
              <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-lg">
                {isPro ? (
                  <>
                    <Star className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-400">{t('dashboard.unlimited')}</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm ltr-force">
                      <span className="font-bold">{creditsRemaining}</span>/5
                    </span>
                  </>
                )}
              </div>

              {/* Language Selector */}
              <select
                value={currentLang}
                onChange={(e) => setCurrentLang(e.target.value)}
                className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:border-purple-500"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="p-2 hover:bg-gray-800 rounded-lg relative"
              >
                <History className="w-5 h-5" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center">
                    {history.length}
                  </span>
                )}
              </button>

              <Link href="/" className="p-2 hover:bg-gray-800 rounded-lg">
                <LogOut className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Task Selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {tasks.map((task) => (
                <button
                  key={task.id}
                  onClick={() => setSelectedTask(task.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2 ${
                    selectedTask === task.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {task.icon}
                  <span>{t(`demo.tabs.${task.id}`)}</span>
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 mb-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={t('demo.placeholder')}
                className="w-full h-40 bg-gray-800 rounded-lg p-4 text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
              />
              
              <div className="flex items-center justify-between mt-4">
                <span className={`text-sm ltr-force ${charCount > maxChars ? 'text-red-400' : 'text-gray-500'}`}>
                  {charCount}/{maxChars}
                </span>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>{t('demo.clear')}</span>
                  </button>
                  
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{t('demo.generating')}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{t('demo.generate')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Response Area */}
            <AnimatePresence>
              {response && (
                <motion.div
                  ref={responseRef}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-[#111827] rounded-2xl border border-gray-800 p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{t('demo.result')}</h3>
                    <button
                      onClick={() => handleCopy(response)}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <div className="whitespace-pre-wrap">{response}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Upgrade Banner for Free Users */}
            {!isPro && creditsRemaining <= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-2xl border border-purple-500/30 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {creditsRemaining === 0 ? t('dashboard.dailyLimit') : `${creditsRemaining} ${t('dashboard.remaining')}`}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {t('pricing.pro.description')}
                    </p>
                  </div>
                  <Link
                    href="/checkout"
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all whitespace-nowrap"
                  >
                    {t('dashboard.upgrade')}
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* History Panel */}
        <AnimatePresence>
          {showHistory && (
            <motion.aside
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="fixed lg:static right-0 top-0 z-30 w-80 h-full bg-[#0B1120] border-l border-gray-800 pt-16 lg:pt-0 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">{t('dashboard.history')}</h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-1 hover:bg-gray-800 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {history.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>{t('dashboard.noHistory')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {history.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => loadHistoryItem(item)}
                        className="w-full text-left p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-xs px-2 py-1 bg-gray-700 rounded-full">
                            {languages.find(l => l.code === item.language)?.flag} {item.language}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 truncate">{item.prompt}</p>
                      </button>
                    ))}
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
