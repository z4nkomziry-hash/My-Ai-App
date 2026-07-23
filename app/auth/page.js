'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, Mail, Lock, User, ArrowLeft, RefreshCw, Eye, EyeOff
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/AuthProvider';
import { getTranslation, languageMeta, getDirection } from '@/lib/i18n';
import {
  isSupabaseConfigured,
  signInWithEmail,
  signUpWithEmail,
  signInWithGoogle,
  signInWithApple,
  verifyOTP,
  resendOTP
} from '@/lib/supabase';

const languagesList = Object.entries(languageMeta).map(function(entry) {
  return { code: entry[0], name: entry[1].name, flag: entry[1].flag };
});

export default function AuthPage() {
  const auth = useAuth();
  const user = auth ? auth.user : null;
  const authLoading = auth ? auth.loading : true;
  const router = useRouter();

  const [lang, setLang] = useState('EN');
  const [mode, setMode] = useState('signin');
  const [step, setStep] = useState('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const dir = getDirection(lang);
  const t = function(key) { return getTranslation(lang, key); };

  useEffect(function() {
    document.documentElement.dir = dir;
  }, [dir]);

  useEffect(function() {
    if (typeof window !== 'undefined' && window.location.search.includes('verified=true')) {
      toast.success('Email verified! You can sign in now.');
    }
  }, []);

  useEffect(function() {
    if (!authLoading && user) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  async function handleSignIn(e) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t('auth.redirecting'));
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleSignUp(e) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const result = await signUpWithEmail(email, password, fullName);
      if (result.error) {
        toast.error(result.error);
      } else if (result.session) {
        toast.success(t('auth.redirecting'));
        router.push('/dashboard');
      } else {
        setStep('otp');
        toast.success(t('auth.otpSent'));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    if (!otp || otp.length < 6) return;
    setLoading(true);
    try {
      const result = await verifyOTP(email, otp);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t('auth.redirecting'));
        router.push('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    setLoading(true);
    try {
      const result = await resendOTP(email);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(t('auth.otpSent'));
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) toast.error(result.error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAppleSignIn() {
    setLoading(true);
    try {
      const result = await signInWithApple();
      if (result.error) toast.error(result.error);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
        <RefreshCw className="w-12 h-12 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-[#090D16] text-white flex items-center justify-center p-4">
        <div className="card max-w-md text-center">
          <h1 className="text-xl font-bold mb-4">Supabase Not Configured</h1>
          <p className="text-gray-400 mb-6">
            Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.
          </p>
          <Link href="/" className="btn-secondary inline-flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
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
            <span className="text-xl font-bold gradient-text">AIVision</span>
          </Link>
          <select value={lang} onChange={function(e) { setLang(e.target.value); }} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm">
            {languagesList.map(function(l) {
              return <option key={l.code} value={l.code}>{l.flag} {l.name}</option>;
            })}
          </select>
        </div>
      </nav>

      <div className="max-w-md mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>{t('checkout.back')}</span>
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
          {step === 'otp' ? (
            <>
              <h1 className="text-2xl font-bold mb-2">{t('auth.otpTitle')}</h1>
              <p className="text-gray-400 text-sm mb-6">
                {t('auth.otpDescription')} <span className="text-purple-400 force-ltr">{email}</span>
              </p>
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={function(e) { setOtp(e.target.value.replace(/\D/g, '')); }}
                    placeholder={t('auth.otpPlaceholder')}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-2xl tracking-widest font-mono force-ltr focus:border-purple-500 transition-all"
                    dir="ltr"
                  />
                </div>
                <button type="submit" disabled={loading || otp.length < 6} className="w-full btn-primary flex items-center justify-center">
                  {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : t('auth.verifyOTP')}
                </button>
                <button type="button" onClick={handleResendOtp} disabled={loading} className="w-full text-sm text-purple-400 hover:text-purple-300">
                  {t('auth.resendOTP')}
                </button>
                <button type="button" onClick={function() { setStep('form'); setOtp(''); }} className="w-full text-sm text-gray-400 hover:text-white">
                  Back
                </button>
              </form>
            </>
          ) : (
            <>
              <div className="flex mb-6 bg-gray-800 rounded-lg p-1">
                <button
                  type="button"
                  onClick={function() { setMode('signin'); }}
                  className={'flex-1 py-2 rounded-md text-sm font-medium transition-all ' + (mode === 'signin' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white')}
                >
                  {t('auth.signIn')}
                </button>
                <button
                  type="button"
                  onClick={function() { setMode('signup'); }}
                  className={'flex-1 py-2 rounded-md text-sm font-medium transition-all ' + (mode === 'signup' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white')}
                >
                  {t('auth.signUp')}
                </button>
              </div>

              <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                {mode === 'signup' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">{t('auth.fullName')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={function(e) { setFullName(e.target.value); }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:border-purple-500 transition-all"
                        placeholder={t('auth.fullName')}
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={function(e) { setEmail(e.target.value); }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 force-ltr focus:border-purple-500 transition-all"
                      placeholder="you@email.com"
                      dir="ltr"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">{t('auth.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={function(e) { setPassword(e.target.value); }}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-10 py-2.5 text-white placeholder-gray-500 force-ltr focus:border-purple-500 transition-all"
                      placeholder="••••••••"
                      dir="ltr"
                    />
                    <button
                      type="button"
                      onClick={function() { setShowPassword(!showPassword); }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center">
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    mode === 'signin' ? t('auth.signInBtn') : t('auth.signUpBtn')
                  )}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-[#111827] text-gray-400">{t('auth.orContinue')}</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-2.5 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium"
                >
                  {t('auth.googleSignIn')}
                </button>
                <button
                  type="button"
                  onClick={handleAppleSignIn}
                  disabled={loading}
                  className="w-full py-2.5 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-all text-sm font-medium"
                >
                  {t('auth.appleSignIn')}
                </button>
              </div>

              <p className="text-center text-sm text-gray-400 mt-6">
                {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
                <button
                  type="button"
                  onClick={function() { setMode(mode === 'signin' ? 'signup' : 'signin'); }}
                  className="text-purple-400 hover:text-purple-300"
                >
                  {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
                </button>
              </p>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
