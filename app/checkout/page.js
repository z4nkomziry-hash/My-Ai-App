'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CreditCard, Wallet, Bitcoin, Upload, Check, Copy, 
  ArrowLeft, Building2, Phone, QrCode, AlertCircle
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { supabase, getUser, uploadReceipt, submitPaymentRequest } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const paymentMethods = [
  {
    id: 'FIB',
    name: 'First Iraqi Bank (FIB)',
    icon: <Building2 className="w-6 h-6" />,
    details: {
      accountName: 'AIVision Technologies',
      accountNumber: '1234-5678-9012-3456',
      iban: 'IQ12 FIBI 1234 5678 9012 3456',
    },
    qrData: 'FIB|AIVision|IQ12FIBI1234567890123456|USD|9.99'
  },
  {
    id: 'FastPay',
    name: 'FastPay Wallet',
    icon: <Phone className="w-6 h-6" />,
    details: {
      receiverName: 'AIVision Tech',
      phoneNumber: '+964 770 123 4567',
    },
    qrData: 'FASTPAY|+9647701234567|AIVision|USD|9.99'
  },
  {
    id: 'USDT',
    name: 'USDT (TRC20)',
    icon: <Bitcoin className="w-6 h-6" />,
    details: {
      walletAddress: 'TXa1B2c3D4e5F6g7H8i9J0kL1mN2oP3qR4sT5uV',
      network: 'TRC20',
    },
    qrData: 'TXa1B2c3D4e5F6g7H8i9J0kL1mN2oP3qR4sT5uV'
  }
];

export default function CheckoutPage() {
  const router = useRouter();
  const [selectedMethod, setSelectedMethod] = useState('FIB');
  const [showQR, setShowQR] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    transactionId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const currentMethod = paymentMethods.find(m => m.id === selectedMethod);

  const handleCopyAddress = async (text) => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFileDrop = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File too large. Maximum 5MB allowed.');
        return;
      }
      setReceipt(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!receipt) {
      toast.error('Please upload payment receipt');
      return;
    }

    if (!formData.fullName || !formData.email || !formData.transactionId) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const user = await getUser();
      if (!user) {
        router.push('/');
        return;
      }

      // Upload receipt
      const receiptUrl = await uploadReceipt(receipt, user.id);

      // Submit payment request
      await submitPaymentRequest({
        user_id: user.id,
        method: selectedMethod,
        transaction_id: formData.transactionId,
        receipt_url: receiptUrl,
        full_name: formData.fullName,
        email: formData.email,
      });

      toast.success('Payment proof submitted successfully! We will verify and activate your Pro account within 24 hours.');
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit payment proof. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Methods */}
          <div>
            <h1 className="text-3xl font-bold mb-2">Upgrade to Pro</h1>
            <p className="text-gray-400 mb-8">$9.99/month - Choose your payment method</p>

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
                    <div className={`p-3 rounded-lg ${
                      selectedMethod === method.id ? 'bg-purple-500/20' : 'bg-gray-800'
                    }`}>
                      {method.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">{method.name}</h3>
                      {method.id === 'USDT' && (
                        <span className="text-sm text-gray-400">Network: TRC20</span>
                      )}
                    </div>
                    {selectedMethod === method.id && (
                      <Check className="w-5 h-5 text-purple-400 ml-auto" />
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Payment Details & Upload */}
          <div>
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedMethod}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#111827] rounded-2xl border border-gray-800 p-6"
              >
                <h2 className="text-xl font-bold mb-6">Payment Details</h2>

                {/* Bank Account / Wallet Details */}
                <div className="space-y-4 mb-6">
                  {selectedMethod === 'FIB' && (
                    <>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <label className="text-sm text-gray-400">Account Name</label>
                        <p className="font-medium">{currentMethod.details.accountName}</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <label className="text-sm text-gray-400">Account Number</label>
                        <div className="flex items-center justify-between">
                          <p className="font-medium font-mono">{currentMethod.details.accountNumber}</p>
                          <button
                            onClick={() => handleCopyAddress(currentMethod.details.accountNumber)}
                            className="p-1.5 hover:bg-gray-700 rounded-lg"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <label className="text-sm text-gray-400">IBAN</label>
                        <div className="flex items-center justify-between">
                          <p className="font-medium font-mono text-sm">{currentMethod.details.iban}</p>
                          <button
                            onClick={() => handleCopyAddress(currentMethod.details.iban)}
                            className="p-1.5 hover:bg-gray-700 rounded-lg"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedMethod === 'FastPay' && (
                    <>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <label className="text-sm text-gray-400">Receiver Name</label>
                        <p className="font-medium">{currentMethod.details.receiverName}</p>
                      </div>
                      <div className="bg-gray-800 rounded-lg p-4">
                        <label className="text-sm text-gray-400">Phone Number</label>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">{currentMethod.details.phoneNumber}</p>
                          <button
                            onClick={() => handleCopyAddress(currentMethod.details.phoneNumber)}
                            className="p-1.5 hover:bg-gray-700 rounded-lg"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {selectedMethod === 'USDT' && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <label className="text-sm text-gray-400">TRC20 Wallet Address</label>
                      <div className="flex items-center justify-between mt-1">
                        <p className="font-medium font-mono text-sm break-all">
                          {currentMethod.details.walletAddress}
                        </p>
                        <button
                          onClick={() => handleCopyAddress(currentMethod.details.walletAddress)}
                          className={`p-1.5 hover:bg-gray-700 rounded-lg ml-2 ${
                            isCopied ? 'text-green-400' : ''
                          }`}
                        >
                          {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        <AlertCircle className="w-4 h-4 text-yellow-400" />
                        <span className="text-xs text-yellow-400">
                          Send only USDT on TRC20 network
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* QR Code */}
                <div className="text-center mb-6">
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className="flex items-center space-x-2 mx-auto text-purple-400 hover:text-purple-300"
                  >
                    <QrCode className="w-5 h-5" />
                    <span>{showQR ? 'Hide QR Code' : 'Show QR Code'}</span>
                  </button>
                  
                  <AnimatePresence>
                    {showQR && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 bg-white p-4 rounded-lg inline-block"
                      >
                        <QRCode value={currentMethod.qrData} size={200} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Amount Info */}
                <div className="bg-gradient-to-r from-purple-900/30 to-cyan-900/30 rounded-lg p-4 mb-6 border border-purple-500/30">
                  <div className="flex justify-between items-center">
                    <span>Amount to Pay</span>
                    <span className="text-2xl font-bold">$9.99</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Monthly subscription</p>
                </div>

                {/* Proof of Payment Form */}
                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg font-semibold mb-4">Submit Payment Proof</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        {selectedMethod === 'USDT' ? 'Transaction Hash *' : 'Transaction ID *'}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.transactionId}
                        onChange={(e) => setFormData({ ...formData, transactionId: e.target.value })}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
                        placeholder={selectedMethod === 'USDT' ? 'Enter transaction hash' : 'Enter transaction ID'}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Upload Receipt *</label>
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                          receipt
                            ? 'border-green-500 bg-green-500/10'
                            : 'border-gray-700 hover:border-purple-500'
                        }`}
                      >
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileDrop}
                          className="hidden"
                          id="receipt-upload"
                        />
                        <label
                          htmlFor="receipt-upload"
                          className="cursor-pointer"
                        >
                          {receipt ? (
                            <div>
                              <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                              <p className="text-sm text-green-400">{receipt.name}</p>
                              <p className="text-xs text-gray-500 mt-1">Click to change</p>
                            </div>
                          ) : (
                            <div>
                              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-400">
                                Drag & drop or click to upload
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PNG, JPG, or PDF (max 5MB)
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !receipt}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-purple-500/25 transition-all"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : (
                        'Submit Payment for Verification'
                      )}
                    </button>
                  </div>
                </form>

                <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-400">
                      <p className="font-medium text-white mb-1">Important:</p>
                      <ul className="space-y-1">
                        <li>• Verification usually takes 1-24 hours</li>
                        <li>• Make sure to send the exact amount</li>
                        <li>• Keep your transaction ID safe</li>
                        <li>• Contact support if not verified within 24 hours</li>
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
