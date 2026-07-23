'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Lock, Eye, EyeOff, ArrowRight, RefreshCw, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError(updateError.message);
        toast.error(updateError.message);
      } else {
        setSuccess(true);
        toast.success('Password updated successfully!');
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
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
        </div>

        {/* Card */}
        <div className="card p-8">
          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Password Updated!</h2>
              <p className="text-gray-400 text-sm mb-6">
                Your password has been successfully reset. Redirecting you to sign in...
              </p>
              <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Reset Your Password</h2>
                <p className="text-gray-400 text-sm">
                  Enter your new password below.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input-field pl-11 pr-12 force-ltr"
                      placeholder="••••••••"
                      dir="ltr"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary flex items-center justify-center mt-6"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Updating...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-5 h-5 mr-2" /> Reset Password
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/auth" className="text-sm text-gray-500 hover:text-gray-300 transition-colors">
            ← Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
