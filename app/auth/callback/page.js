'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import supabase from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Callback error:', error.message);
          toast.error('Authentication failed. Please try again.');
          router.push('/auth');
          return;
        }

        if (session) {
          toast.success('Signed in successfully! Welcome to AIVision.');
          router.push('/dashboard');
        } else {
          router.push('/auth');
        }
      } catch (err) {
        console.error('Callback error:', err);
        router.push('/auth');
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#090D16] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-glow"
        >
          <Sparkles className="w-10 h-10 text-white" />
        </motion.div>
        <h2 className="text-xl font-bold gradient-text mb-2">Completing Sign In</h2>
        <p className="text-gray-400 text-sm mb-4">Please wait while we set up your account...</p>
        <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
      </motion.div>
    </div>
  );
}
