'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Wallet, Bitcoin, Upload, Check, Copy,
  ArrowLeft, Building2, Phone, QrCode, AlertCircle,
  ExternalLink, X, Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { getTranslation, languageMeta, getDirection } from '@/lib/i18n';

// Payment methods configuration
const paymentMethods = [
  {
    id: 'FIB',
    name: 'First Iraqi Bank (FIB)',
    icon: <Building2 className="w-6 h-6" />,
    value: '+9647506045491',
    label: 'Phone Number',
    link: 'tel:+9647506045491',
    qrValue: 'FIB|AIVision|+9647506045491|USD|9.99',
    color: 'from-blue-600 to-blue-400',
  },
  {
    id: 'FastPay',
    name: 'FastPay Wallet',
    icon: <Phone className="w-6 h-6" />,
    value: '+9647506045491',
    label: 'Phone Number',
    link: 'tel:+9647506045491',
    qrValue: 'FASTPAY|+9647506045491|AIVision|USD|9.99',
    color: 'from-green-600 to-green-400',
  },
  {
    id: 'USDT',
    name: 'USDT (TRC20)',
    icon: <Bitcoin className="w-6 h-6" />,
    value: 'TKUfVwnjyT2KUa9xnBreT32YLLJEwACHpc',
    label: 'Wallet Address',
    link: null,
    qrValue: 'TKUfVwnjyT2KUa9xnBreT32YLLJEwACHpc',
    color: 'from-orange-600 to-yellow-400',
    warning: 'Send only USDT on TRC20 network',
  },
];

const languages = Object.entries(languageMeta).map(([code, meta]) => ({
  code,
  ...meta,
}));

export default function CheckoutPage() {
  const [currentLang, setCurrentLang] = useState('EN');
  const [selectedMethod, setSelectedMethod] = useState('FIB');
  const [showQR, setShowQR] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    transactionId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedValue, setCopiedValue] = useState('');

  const dir = getDirection(currentLang);
  const t = (key) => getTranslation(currentLang, key);
  const currentMethod = paymentMethods.find(m => m.id === selectedMethod);

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedValue(text);
      setTimeout(() => setCopiedValue(''), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedValue(text);
      setTimeout(() => setCopiedValue(''), 2000);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File too large. Maximum 5MB allowed.');
        return;
      }
      setReceipt(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!receipt) {
      alert('Please upload payment receipt');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.transactionId) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form
      setFormData({ fullName: '', email: '', transactionId: '' });
      setReceipt(null);
      setSelectedMethod('FIB');
      
      alert(t('checkout.success'));
    } catch (error) {
      console.error('Submission error:', error);
      alert('Failed to submit payment proof. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white" dir={dir}>
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-[#090D16]/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              <span className="text-xl font-bold gradient-text">AIVision</span>
            </Link>

            <select
              value={currentLang}
              onChange={(e) => setCurrentLang(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:border-purple-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>{t('checkout.back')}</span>
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Methods Selection */}
          <div>
            <h1 className="text-3xl font-bold mb-2">{t('checkout.title')}</h1>
            <p className="text-gray-400 mb-8">{t('checkout.subtitle')}</p>

            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <motion.button
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelectedMethod(method.id);
                    setShowQR(false);
                  }}
                  className={`w-full p-6 rounded-xl border-2 transition-all ${
                    selectedMethod === method.id
                      ? 'border-purple-500 bg-purple-500/10'
                      : 'border-gray-800 bg-[#111827] hover:border-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${method.color} bg-opacity-20`}>
                      {method.icon}
                    </div>
                    <div className="text-left flex-1">
                      <h3 className="font-semibold">{method.name}</h3>
                      <p className="text-sm text-gray-400">{method.label}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <Check className="w-5 h-5 text-purple-400" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMethod}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#111827] rounded-2xl border border-gray-800 p-6"
              >
                <h2 className="text-xl font-bold mb-6">{t('checkout.paymentDetails')}</h2>

                {/* Payment Value Display */}
                <div className="bg-gray-800 rounded-xl p-4 mb-6">
                  <label className="text-sm text-gray-400 mb-2 block">
                    {currentMethod.label}
                  </label>
                  <div className="flex items-center justify-between gap-2">
                    <p className={`font-mono text-sm break-all flex-1 phone-number ${
                      currentMethod.id === 'USDT' ? 'text-xs' : ''
                    }`}>
                      {currentMethod.value}
                    </p>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleCopy(currentMethod.value)}
                        className={`p-2 rounded-lg transition-colors ${
                          copiedValue === currentMethod.value
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                        title={t('checkout.copyAddress')}
                      >
                        {copiedValue === currentMethod.value ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                      {currentMethod.link && (
                        <a
                          href={currentMethod.link}
                          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                          title="Open in app"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  {currentMethod.warning && (
                    <div className="flex items-center space-x-2 mt-3 text-yellow-400">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs">{currentMethod.warning}</span>
                    </div>
                  )}
                </div>

                {/* QR Code Toggle */}
                <div className="text-center mb-6">
                  <button
                    onClick={() => setShowQR(!showQR)}
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
                          {/* QR Code Placeholder */}
                          <div className="w-48 h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                            <QrCode className="w-32 h-32 text-gray-800" />
                          </div>
                          <p className="text-gray-800 text-sm mt-3 font-mono">
                            {currentMethod.id === 'USDT' ? currentMethod.value : `Pay $9.99 via ${currentMethod.name}`}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Amount Display */}
                <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-xl p-4 mb-6 border border-purple-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">{t('checkout.amount')}</span>
                    <span className="text-2xl font-bold ltr-force">$9.99</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{t('checkout.monthly')}</p>
                </div>

                {/* Payment Proof Form */}
                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg font-semibold mb-4">{t('checkout.submitProof')}</h3>
                  
                  <div className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.fullName')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500"
                        placeholder="John Doe"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.email')} *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500 ltr-force"
                        placeholder="your@email.com"
                        dir="ltr"
                      />
                    </div>

                    {/* Transaction ID */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.transactionId')} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-white placeholder-gray-500 font-mono ltr-force"
                        placeholder={selectedMethod === 'USDT' ? 'Transaction Hash' : 'Transaction ID'}
                        dir="ltr"
                      />
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {t('checkout.uploadReceipt')} *
                      </label>
                      <div
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                          receipt
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-700 hover:border-purple-500 hover:bg-purple-500/5'
                        }`}
                        onClick={() => document.getElementById('receipt-input').click()}
                      >
                        <input
                          id="receipt-input"
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {receipt ? (
                          <div>
                            <Check className="w-10 h-10 text-green-400 mx-auto mb-2" />
                            <p className="text-sm text-green-400 font-medium">{receipt.name}</p>
                            <p className="text-xs text-gray-500 mt-1">{(receipt.size / 1024 / 1024).toFixed(2)} MB</p>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setReceipt(null);
                              }}
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

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || !receipt}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all flex items-center justify-center"
                    >
                      {isSubmitting ? (
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

                {/* Important Notes */}
                <div className="mt-6 p-4 bg-gray-800 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-white mb-2 text-sm">{t('checkout.important')}</p>
                      <ul className="space-y-1">
                        {t('checkout.notes').map((note, i) => (
                          <li key={i} className="text-xs text-gray-400 flex items-start space-x-2">
                            <span className="text-purple-400 mt-0.5">•</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

// Need to import RefreshCw for the submit button
import { RefreshCw } from 'lucide-react';
