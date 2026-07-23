'use client';
import { Sparkles, MessageCircle, Send, Mail, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { getTranslation } from '@/lib/i18n';

const socialLinks = {
  whatsapp: 'https://wa.me/9647506045491',
  telegram: 'https://t.me/z_14x',
  email: 'mailto:z.14x@outlook.com'
};

export default function Footer({ lang = 'EN' }) {
  const [logoError, setLogoError] = useState(false);
  const t = (key) => getTranslation(lang, key);

  return (
    <footer className="bg-[#0B1120] border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              {!logoError ? (
                <Image
                  src="/assets/logo/logo.png"
                  alt="AIVision"
                  width={36}
                  height={36}
                  className="rounded-lg"
                  onError={() => setLogoError(true)}
                />
              ) : (
                <div className="w-9 h-9 bg-gradient-to-r from-purple-600 to-cyan-400 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="text-xl font-bold gradient-text">AIVision</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/dashboard" className="block text-gray-400 hover:text-white text-sm transition-colors">Dashboard</Link>
              <Link href="/checkout" className="block text-gray-400 hover:text-white text-sm transition-colors">Upgrade to Pro</Link>
              <Link href="/auth" className="block text-gray-400 hover:text-white text-sm transition-colors">Sign In</Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-white mb-4">Connect</h4>
            <div className="flex space-x-3">
              <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-all">
                <MessageCircle className="w-5 h-5 text-green-400" />
              </a>
              <a href={socialLinks.telegram} target="_blank" rel="noopener noreferrer" className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all">
                <Send className="w-5 h-5 text-blue-400" />
              </a>
              <a href={socialLinks.email} className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/20 transition-all">
                <Mail className="w-5 h-5 text-red-400" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            {t('footer.copyright')}
          </p>
          <p className="text-gray-600 text-xs flex items-center">
            {t('footer.builtWith')}
            <Heart className="w-3 h-3 text-red-400 mx-1 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}
