'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ExternalLink } from 'lucide-react';

const socialLinks = {
  whatsapp: 'https://wa.me/9647506045491',
  telegram: 'https://t.me/z_14x'
};

export default function SupportModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full flex items-center justify-center shadow-glow-purple hover:shadow-glow-cyan transition-all duration-300 hover:scale-110 active:scale-95 animate-float"
        aria-label="Open support chat"
      >
        <MessageCircle className="w-6 h-6 text-white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#090D16] animate-pulse" />
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 card-glass"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Need Help?</h3>
                    <p className="text-xs text-gray-400">We typically reply within minutes</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Message */}
              <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-300">
                  Hi! 👋 How can we help you today? Choose your preferred way to reach us:
                </p>
              </div>

              {/* Contact Options */}
              <div className="space-y-3">
                <a
                  href={socialLinks.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">WhatsApp</p>
                      <p className="text-xs text-gray-400">+964 750 604 5491</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-green-400 transition-colors" />
                </a>

                <a
                  href={socialLinks.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Send className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm">Telegram</p>
                      <p className="text-xs text-gray-400">@z_14x</p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                </a>
              </div>

              {/* Footer */}
              <p className="text-center text-xs text-gray-500 mt-6">
                We respect your privacy. Your conversations are secure.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
