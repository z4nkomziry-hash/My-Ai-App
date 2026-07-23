'use client';
import { motion } from 'framer-motion';
import { Sparkles, AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Error({ error, reset }) {
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="mb-8">
          {!logoError ? (
            <Image src="/logo.png" alt="AIVision" width={80} height={80} className="rounded-xl mx-auto" onError={() => setLogoError(true)} />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-orange-400 rounded-xl flex items-center justify-center mx-auto animate-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4">Something Went Wrong</h1>
          <p className="text-gray-400 mb-8 leading-relaxed">
            {error?.message || 'An unexpected error occurred. Our team has been notified.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={reset} className="btn-primary inline-flex items-center justify-center">
              <RefreshCw className="w-5 h-5 mr-2" />
              Try Again
            </button>
            <Link href="/" className="btn-secondary inline-flex items-center justify-center">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-4 bg-red-500/5 border border-red-500/20 rounded-xl"
        >
          <p className="text-xs text-gray-500 font-mono">
            Error Reference: {Date.now().toString(36).toUpperCase()}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
