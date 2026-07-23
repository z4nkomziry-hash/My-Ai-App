'use client';
import { motion } from 'framer-motion';
import { Sparkles, Home, Search, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function NotFound() {
  const [logoError, setLogoError] = useState(false);

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
            <Image src="/logo.png" alt="AIVision" width={80} height={80} className="rounded-xl mx-auto animate-float" onError={() => setLogoError(true)} />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-xl flex items-center justify-center mx-auto animate-glow">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-8xl font-bold gradient-text mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary inline-flex items-center justify-center">
              <Home className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <Link href="/dashboard" className="btn-secondary inline-flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go to Dashboard
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 p-6 card"
        >
          <div className="flex items-center justify-center space-x-2 text-gray-500">
            <Search className="w-4 h-4" />
            <span className="text-sm">Error Code: 404 • Lost in Translation</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
