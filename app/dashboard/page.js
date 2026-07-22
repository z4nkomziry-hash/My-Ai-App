'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, History, Settings, CreditCard, LogOut, Menu, X,
  Sparkles, Copy, RefreshCw, Trash2, ChevronDown, Languages,
  Zap, TrendingUp, Clock, Star, AlertCircle
} from 'lucide-react';
import { supabase, getUser, getProfile, checkAndResetDailyCredits, saveToHistory, getHistory } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

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

const tasks = [
  { id: 'generate', label: 'Generate', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'rewrite', label: 'Rewrite', icon: <RefreshCw className="w-4 h-4" /> },
  { id: 'grammar', label: 'Grammar', icon: <AlertCircle className="w-4 h-4" /> },
  { id: 'translate', label: 'Translate', icon: <Languages className="w-4 h-4" /> },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [selectedTask, setSelectedTask] = useState('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [creditsRemaining, setCreditsRemaining] = useState(null);
  const [isPro, setIsPro] = useState(false);
  const responseRef = useRef(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await getUser();
      if (!currentUser) {
        router.push('/');
        return;
      }
      setUser(currentUser);
      
      const userProfile = await checkAndResetDailyCredits(currentUser.id);
      setProfile(userProfile);
      setIsPro(userProfile.subscription_status === 'pro');
      
      // Load credits
      const creditsResponse = await fetch('/api/generate');
      const creditsData = await creditsResponse.json();
      setCreditsRemaining(creditsData.creditsRemaining);
      
      // Load history
      const userHistory = await getHistory(currentUser.id);
      setHistory(userHistory);
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    if (prompt.length > 2000) {
      toast.error('Prompt too long. Maximum 2000 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          language: selectedLanguage,
          task: selectedTask,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.dailyLimit) {
          toast.error('Daily limit reached. Upgrade to Pro for unlimited generations!');
        } else {
          throw new Error(data.error || 'Generation failed');
        }
        return;
      }

      setResponse(data.text);
      setCreditsRemaining(data.creditsRemaining);
      
      // Reload history
      const userHistory = await getHistory(user.id);
      setHistory(userHistory);
      
      toast.success('Generated successfully!');
      
      // Scroll to response
      if (responseRef.current) {
        responseRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error.message || 'Failed to generate content');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    toast.success('Copied to clipboard!');
  };

  const handleClear = () => {
    setPrompt('');
    setResponse('');
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const loadHistoryItem = (item) => {
    setPrompt(item.prompt);
    setResponse(item.response);
    setSelectedLanguage(item.language);
    setSelectedTask(item.task || 'generate');
    setShowHistory(false);
  };

  const charCount = prompt.length;
  const maxChars = 2000;

  return (
    <div className="min-h-screen bg-[#090D16] text-white">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-[#090D16]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden p-2 hover:bg-gray-800 rounded-lg"
              >
                {showSidebar ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <Sparkles className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  AIVision
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Credit Meter */}
              {!isPro && (
                <div className="hidden sm:flex items-center space-x-2 bg-gray-800 px-3 py-1.5 rounded-lg">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">
                    <span className="font-bold">{creditsRemaining || 5}</span>/5
                  </span>
                </div>
              )}

              {isPro && (
                <div className="hidden sm:flex items-center space-x-2 bg-purple-900/30 px-3 py-1.5 rounded-lg border border-purple-500/30">
                  <Star className="w-4 h-4 text-purple-400" />
                  <span className="text-sm text-purple-400">Pro</span>
                </div>
              )}

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

              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-gray-800 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {showSidebar && (
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed lg:static inset-y-0 left-0 z-30 w-64 bg-[#0B1120] border-r border-gray-800 pt-16 lg:pt-0"
            >
              <div className="p-4">
                {!isPro && (
                  <div className="mb-6 p-4 bg-gray-800 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-400">Daily Credits</span>
                      <span className="text-sm font-bold">{creditsRemaining}/5</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-500 to-cyan-400 h-2 rounded-full transition-all"
                        style={{ width: `${((5 - creditsRemaining) / 5) * 100}%` }}
                      />
                    </div>
                    <button
                      onClick={() => router.push('/checkout')}
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg text-sm font-medium"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase">Tasks</h3>
                  {tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => setSelectedTask(task.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-all ${
                        selectedTask === task.id
                          ? 'bg-purple-600 text-white'
                          : 'hover:bg-gray-800 text-gray-400'
                      }`}
                    >
                      {task.icon}
                      <span>{task.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Language & Task Selector */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 pr-10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none" />
              </div>

              <div className="flex gap-2">
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
                    <span className="hidden sm:inline">{task.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="bg-[#111827] rounded-2xl border border-gray-800 p-6 mb-6">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Enter your text for ${tasks.find(t => t.id === selectedTask)?.label.toLowerCase()}...`}
                className="w-full h-40 bg-gray-800 rounded-lg p-4 text-white placeholder-gray-500 border border-gray-700 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 resize-none"
                dir={languages.find(l => l.code === selectedLanguage)?.direction}
              />
              
              <div className="flex items-center justify-between mt-4">
                <span className={`text-sm ${charCount > maxChars ? 'text-red-400' : 'text-gray-500'}`}>
                  {charCount}/{maxChars}
                </span>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handleClear}
                    className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Clear</span>
                  </button>
                  
                  <button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isLoading}
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Generate</span>
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
                    <h3 className="text-lg font-semibold">Response</h3>
                    <button
                      onClick={handleCopy}
                      className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div 
                    className="prose prose-invert max-w-none"
                    dir={languages.find(l => l.code === selectedLanguage)?.direction}
                  >
                    {response}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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
                  <h3 className="text-lg font-semibold">History</h3>
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
                    <p>No history yet</p>
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
                            {new Date(item.created_at).toLocaleDateString()}
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
