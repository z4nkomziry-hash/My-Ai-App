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
  var val = entry[1];
  return { code: entry[0], name: typeof val === 'object' ? val?.name : val, flag: typeof val === 'object' ? val?.flag : '🌐', direction: typeof val === 'object' ? val?.direction : 'ltr' };
});

function safeArray(val) {
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
  
  var t = function(key) { 
    var res = getTranslation(lang, key); 
    return res;
  };
  
  var current = methods.find(function(m) { return m.id === method; }) || methods[0];

  useEffect(function() {
    document.documentElement.dir = dir;
  }, [dir]);

  function handleCopy(text) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(text);
    toast.success('Copied!');
    setTimeout(function() { setCopied(''); }, 2000);
  }

  async function sendTelegramNotification(paymentData) {
    try {
      await fetch('/api/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'new_payment', payment: paymentData })
      });
    } catch (e) {
      console.error(e);
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
      toast.success('Submitted successfully!');
      setForm({ name: '', email: '', txId: '' });
      setReceipt(null);
    } catch (e) {
      toast.error('Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  var rawNotes = t('checkout.notes');
  var checkoutNotes = safeArray(rawNotes);

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-3xl font-bold mb-2">Checkout</h1>
            <p className="text-gray-400 mb-8">Select a payment method</p>
            <div className="space-y-4">
              {methods.map(function(m) {
                return (
                  <button
                    key={m.id}
                    onClick={function() { setMethod(m.id); setShowQR(false); }}
                    className={'w-full p-6 rounded-xl border-2 transition-all ' + (method === m.id ? 'border-purple-500 bg-purple-500/10' : 'border-gray-800 bg-[#111827]')}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={'p-3 rounded-lg bg-gradient-to-r ' + m.color}>{m.icon}</div>
                      <div className="text-left flex-1">
                        <h3 className="font-semibold">{m.name}</h3>
                        <p className="text-sm text-gray-400">{m.label}</p>
                      </div>
                      {method === m.id && <Check className="w-5 h-5 text-purple-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="card bg-[#111827] p-6 rounded-xl border border-gray-800">
              <h2 className="text-xl font-bold mb-6">Payment Details</h2>
              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <label className="text-sm text-gray-400 mb-2 block">{current.label}</label>
                <div className="flex items-center justify-between gap-2">
                  <p className="font-mono text-sm break-all flex-1">{current.value}</p>
                  <button onClick={function() { handleCopy(current.value); }} className="p-2 bg-gray-700 rounded-lg">
                    {copied === current.value ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Full Name *</label>
                  <input type="text" required value={form.name} onChange={function(e) { setForm({ ...form, name: e.target.value }); }} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email *</label>
                  <input type="email" required value={form.email} onChange={function(e) { setForm({ ...form, email: e.target.value }); }} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Transaction ID *</label>
                  <input type="text" required value={form.txId} onChange={function(e) { setForm({ ...form, txId: e.target.value }); }} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Upload Receipt *</label>
                  <input type="file" accept="image/*,.pdf" onChange={function(e) { if (e.target.files[0]) setReceipt(e.target.files[0]); }} className="w-full bg-gray-800 border border-gray-700 rounded-lg p-2 text-white" />
                </div>
                <button type="submit" disabled={submitting || !receipt} className="w-full py-3 bg-purple-600 rounded-xl font-medium disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Payment'}
                </button>
              </form>

              {checkoutNotes.length > 0 && (
                <div className="mt-6 p-4 bg-gray-800/50 rounded-xl">
                  <ul className="space-y-1">
                    {checkoutNotes.map(function(n, i) {
                      return <li key={i} className="text-xs text-gray-400">• {n}</li>;
                    })}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
