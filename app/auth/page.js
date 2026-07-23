'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Mail, Lock, User, ArrowRight, Check, AlertCircle,
  RefreshCw, Eye, EyeOff, Shield, KeyRound, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/AuthProvider';
import { getTranslation, languageMeta, getDirection } from '@/lib/i18n';
import {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signInWithApple,
  verifyEmailOTP,
  resendEmailOTP,
  createProfile
} from '@/lib/supabase';

const languagesList = Object.entries(languageMeta).map(([code, meta]) => ({
  code, flag: meta.flag, name: meta.name, direction: meta.direction
}));

export default function AuthPage() {
  const { user, refreshProfile } = useAuth();
  const router = useRouter();
  const [lang, setLang] = useState('EN');
  const [mode, setMode] = useState('signin');
  const [step, setStep] = useState('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [logoError, setLogoError] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const otpInputRefs = useRef([]);

  const dir = getDirection(lang);
  const t = (key) => {
    const val = getTranslation(lang, key);
    return typeof val === 'string' ? val : String(val || key);
  };

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [lang, dir]);

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Auto-focus OTP inputs
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0 && otpInputRefs.current[index - 1]) {
      otpInputRefs.current[index - 1].focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password || !fullName) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const result = await signUpWithEmail(email, password, fullName);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        setStep('otp');
        setOtpTimer(60);
        toast.success('Verification code sent to your email!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        toast.success('Signed in successfully!');
        await refreshProfile();
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }
    setLoading(true);
    try {
      const result = await verifyEmailOTP(email, otpCode);
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else if (result.user) {
        await createProfile(result.user.id, email, fullName);
        toast.success('Email verified! Account created successfully.');
        await refreshProfile();
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    setLoading(true);
    try {
      const result = await resendEmailOTP(email);
      if (result.error) {
        setError(result.error);
      } else {
        setOtpTimer(60);
        setOtp(['', '', '', '', '', '']);
        toast.success('New verification code sent!');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithGoogle();
      if (result.error) setError(result.error);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithApple();
      if (result.error) setError(result.error);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center" dir={dir}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <RefreshCw className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">{t('auth.redirecting')}</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex items-center justify-center py-12 px-4" dir={dir}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo & Language Selector */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            {!logoError ? (
              <Image
                src="/assets/logo/logo.png"
                alt="AIVision"
                width={44}
                height={44}
                className="rounded-xl"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="w-11 h-11 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-xl flex items-center justify-center animate-glow">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            )}
            <span className="text-2xl font-bold gradient-text">AIVision</span>
          </Link>
          <select
            value={lang}
            onChange={e => setLang(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"
          >
            {languagesList.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
            ))}
          </select>
        </div>

        {/* Auth Card */}
        <div className="card p-8">
          <AnimatePresence mode="wait">
            {step === 'otp' ? (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
              >
                {/* OTP Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8 text-purple-400" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">{t('auth.otpTitle')}</h2>
                  <p className="text-gray-400 text-sm">
                    {t('auth.otpDescription')}{' '}
                    <span className="text-purple-400 font-medium force-ltr">{email}</span>
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* OTP Inputs */}
                <form onSubmit={handleVerifyOTP}>
                  <div className="flex justify-center gap-2 mb-6" onPaste={handleOtpPaste}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={el => (otpInputRefs.current[index] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={e => handleOtpChange(index, e.target.value)}
                        onKeyDown={e => handleOtpKeyDown(index, e)}
                        className="w-12 h-14 bg-gray-800 border border-gray-700 rounded-xl text-center text-xl font-bold text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all force-ltr"
                        dir="ltr"
                        autoFocus={index === 0}
                      />
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.join('').length !== 6}
                    className="w-full btn-primary flex items-center justify-center mb-4"
                  >
                    {loading ? (
                      <><RefreshCw className="w-5 h-5 animate-spin mr-2" /> Verifying...</>
                    ) : (
                      <><Shield className="w-5 h-5 mr-2" />{t('auth.verifyOTP')}</>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={otpTimer > 0 || loading}
                    className="w-full text-sm text-gray-400 hover:text-purple-400 transition-colors py-2"
                  >
                    {otpTimer > 0 ? `Resend code in ${otpTimer}s` : t('auth.resendOTP')}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setStep('form'); setError(''); setOtp(['', '', '', '', '', '']); }}
                    className="w-full text-center text-sm text-gray-500 hover:text-gray-300 mt-2 transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
              >
                {/* Tabs */}
                <div className="flex mb-8 bg-gray-800 rounded-xl p-1.5">
                  <button
                    onClick={() => { setMode('signin'); setError(''); }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      mode === 'signin' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t('auth.signIn')}
                  </button>
                  <button
                    onClick={() => { setMode('signup'); setError(''); }}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      mode === 'signup' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {t('auth.signUp')}
                  </button>
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold mb-1">
                    {mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {mode === 'signin' ? 'Welcome back! Sign in to continue.' : 'Create your free account to get started.'}
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                  {mode === 'signup' && (
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-300">{t('auth.fullName')}</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="input-field pl-11"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">{t('auth.email')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="input-field pl-11 force-ltr"
                        placeholder="you@example.com"
                        dir="ltr"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">{t('auth.password')}</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="input-field pl-11 pr-12 force-ltr"
                        placeholder="••••••••"
                        dir="ltr"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center mt-6"
                  >
                    {loading ? (
                      <><RefreshCw className="w-5 h-5 animate-spin mr-2" /> Please wait...</>
                    ) : (
                      <><ArrowRight className="w-5 h-5 mr-2" />{mode === 'signin' ? t('auth.signInBtn') : t('auth.signUpBtn')}</>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-[#111827] text-gray-500">{t('auth.orContinue')}</span>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-3 border border-gray-700 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-800 transition-all text-sm font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    <span>{t('auth.googleSignIn')}</span>
                  </button>
                  <button
                    onClick={handleAppleSignIn}
                    disabled={loading}
                    className="w-full py-3 border border-gray-700 rounded-xl flex items-center justify-center space-x-3 hover:bg-gray-800 transition-all text-sm font-medium"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    <span>{t('auth.appleSignIn')}</span>
                  </button>
                </div>

                {/* Toggle */}
                <p className="text-center text-sm text-gray-500 mt-6">
                  {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
                  <button
                    onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
                    className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                  >
                    {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
