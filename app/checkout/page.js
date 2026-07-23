'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Phone, Bitcoin, Copy, Check, Upload, AlertCircle,
  ArrowLeft, Sparkles, ExternalLink, QrCode, RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/AuthProvider';
import { getTranslation, languageMeta, getDirection } from '@/lib/i18n';
import { submitPaymentRequest, uploadReceipt } from '@/lib/supabase';

var methods = [
  { id: 'FIB', name: 'First Iraqi Bank (FIB)', icon: <Building2 className="w-6 h-6" />, value: '+964 750 604 5491', link: 'tel:+9647506045491', label: 'Phone Number', color: 'from-blue-600 to-blue-400' },
  { id: 'FastPay', name: 'FastPay Wallet', icon: <Phone className="w-6 h-6" />, value: '+964 750 604 5491', link: 'tel:+9647506045491', label: 'Phone Number', color: 'from-green-600 to-green-400' },
  { id: 'USDT', name: 'USDT (TRC20)', icon: <Bitcoin className="w-6 h-6" />, value: 'TKUfVwnjyT2KUa9xnBreT32YLLJEwACHpc', link: null, label: 'Wallet Address', color: 'from-orange-600 to-yellow-400', warning: 'Send only USDT on TRC20 network' }
];

var languageEntries = Object.entries(languageMeta || {});
var languagesList = languageEntries.map(function(entry) {
  return { code: entry[0], name: entry[1]?.name, flag: entry[1]?.flag, direction: entry[1]?.direction };
});

function ensureArray(val) {
  return Array.isArray(val) ? val : [];
}

export default function CheckoutPage() {
  var auth = useAuth();
  var user = auth ? auth.user : null;

  var [lang, setLang] = useState('EN');
  var [method, setMethod] = useState('FIB');
  var [showQR, setShowQR] = useState(false);
  var [receipt, setReceipt] = useState(null);
  var [form, setForm] = useState({ name: '', email: '', txId: '' });
  var [submitting, setSubmitting] = useState(false);
  var [copied, setCopied] = useState('');
  var [logoError, setLogoError] = useState(false);
  var dir = getDirection(lang);
  var t = function(key) { return getTranslation(lang, key); };
  var current = ensureArray(methods).find(function(m) { return m.id === method; }) || methods[0];

  useEffect(function() {
    document.documentElement.dir = dir;
  }, [dir]);

  function handleCopy(text) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(text);
    toast.success(t('checkout.copied'));
    setTimeout(function() { setCopied(''); }, 2000);
  }

  async function sendTelegramNotification(paymentData) {
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'new_payment',
          payment: paymentData
        })
      });
    } catch (e) {
      console.error('Telegram notification failed:', e);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!receipt || !form.name || !form.email || !form.txId) {
      toast.error('Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      var receiptUrl = '';
      if (user && receipt) {
        receiptUrl = await uploadReceipt(receipt, user.id) || '';
      }
      var paymentData = {
        user_id: (user && user.id) ? user.id : 'guest',
        method: method,
        transaction_id: form.txId,
        receipt_url: receiptUrl,
        full_name: form.name,
        email: form.email,
        status: 'pending'
      };
      if (user) {
        await submitPaymentRequest(paymentData);
      }
      await sendTelegramNotification(paymentData);
      toast.success(t('checkout.success'));
      setForm({ name: '', email: '', txId: '' });
      setReceipt(null);
    } catch (e) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  var checkoutNotes = ensureArray(t('checkout.notes'));

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
            {ensureArray(languagesList).map(function(l) {
              return <option key={l.code} value={l.code}>{l.flag} {l.name}</option>;
            })}
          </select>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>{t('checkout.back')}</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold mb-2">{t('checkout.title')}</h1>
            <p className="text-gray-400 mb-8">{t('checkout.subtitle')}</p>
            <div className="space-y-4">
              {ensureArray(methods).map(function(m) {
                return (
                  <motion.button
                    key={m.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={function() { setMethod(m.id); setShowQR(false); }}
                    className={'w-full p-6 rounded-xl border-2 transition-all ' + (method === m.id ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/10' : 'border-gray-800 bg-[#111827] hover:border-gray-700')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={'p-3 rounded-lg bg-gradient-to-r ' + m.color + ' bg-opacity-20'}>
                        {m.icon}
                      </div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold">{m.name}</h3>
                        <p className="text-sm text-gray-400">{m.label}</p>
                      </div>
                      {method === m.id && <Check className="w-5 h-5 text-purple-400" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={method}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card"
              >
                <h2 className="text-xl font-bold mb-6">{t('checkout.paymentDetails')}</h2>

                <div className="bg-gray-800 rounded-xl p-4 mb-6">
                  <label className="text-sm text-gray-400 mb-2 block">{current?.label}</label>
                  <div className="flex items-center justify-between gap-2">
                    <p className={'font-mono text-sm break-all flex-1 wallet-ltr ' + (method === 'USDT' ? 'text-xs' : '')}>
                      {current?.value}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={function() { handleCopy(current?.value); }}
                        className={'p-2 rounded-lg transition-colors ' + (copied === current?.value ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 hover:bg-gray-600')}
                      >
                        {copied === current?.value ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                      {current?.link && (
                        <a href={current.link} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  {current?.warning && (
                    <div className="flex items-center space-x-2 mt-3 text-yellow-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs">{current.warning}</span>
                    </div>
                  )}
                </div>

                <div className="text-center mb-6">
                  <button
                    onClick={function() { setShowQR(!showQR); }}
                    className="flex items-center space-x-2 mx-auto text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>{showQR ? t('checkout.hideQR') : t('checkout.showQR')}</span>
                  </button>
                  <AnimatePresence>
                    {showQR && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4"
                      >
                        <div className="bg-white p-6 rounded-xl inline-block">
                          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <QrCode className="w-32 h-32 text-gray-800" />
                          </div>
                          <p className="text-gray-800 text-sm mt-3 font-mono">Pay $9.99 via {current?.name}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-xl p-4 mb-6 border border-purple-500/30">
                  <div className="flex justify-between">
                    <span>{t('checkout.amount')}</span>
                    <span className="text-2xl font-bold force-ltr">$9.99</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{t('checkout.monthly')}</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg font-semibold mb-4">{t('checkout.submitProof')}</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('checkout.fullName')} *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={function(e) { setForm({ name: e.target.value, email: form.email, txId: form.txId }); }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:border-purple-500 transition-all"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('checkout.email')} *</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={function(e) { setForm({ name: form.name, email: e.target.value, txId: form.txId }); }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 force-ltr focus:border-purple-500 transition-all"
                        placeholder="your@email.com"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('checkout.transactionId')} *</label>
                      <input
                        type="text"
                        required
                        value={form.txId}
                        onChange={function(e) { setForm({ name: form.name, email: form.email, txId: e.target.value }); }}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 font-mono force-ltr focus:border-purple-500 transition-all"
                        placeholder="Transaction ID/Hash"
                        dir="ltr"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('checkout.uploadReceipt')} *</label>
                      <div
                        className={'border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ' + (receipt ? 'border-green-500 bg-green-500/10' : 'border-gray-700 hover:border-purple-500 hover:bg-purple-500/5')}
                        onClick={function() { document.getElementById('file').click(); }}
                      >
                        <input
                          id="file"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={function(e) {
                            var f = e.target.files ? e.target.files[0] : null;
                            if (f && f.size <= 5242880) {
                              setReceipt(f);
                            }
                          }}
                          className="hidden"
                        />
                        {receipt ? (
                          <div>
                            <Check className="w-10 h-10 text-green-400 mx-auto mb-2" />
                            <p className="text-sm text-green-400">{receipt.name}</p>
                            <button
                              type="button"
                              onClick={function(e) { e.stopPropagation(); setReceipt(null); }}
                              className="mt-2 text-xs text-red-400 hover:text-red-300"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <div>
                            <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-400">{t('checkout.dragDrop')}</p>
                            <p className="text-xs text-gray-500 mt-1">{t('checkout.fileTypes')}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={submitting || !receipt}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl font-medium disabled:opacity-50 flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                    >
                      {submitting ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin mr-2" />
                          {t('checkout.submitting')}
                        </>
                      ) : (
                        t('checkout.submit')
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-gray-800 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white mb-2 text-sm">{t('checkout.important')}</p>
                      <ul className="space-y-1">
                        {checkoutNotes.map(function(n, i) {
                          return (
                            <li key={i} className="text-xs text-gray-400">• {n}</li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
