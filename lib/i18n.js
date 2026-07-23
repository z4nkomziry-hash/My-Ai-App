/**
 * AIVision - Complete i18n Translation System
 * Supports 12 languages with robust fallback handling
 * Developer: Zaniyar Al-Mzurii
 */

const translations = {
  EN: {
    nav: {
      home: "Home",
      features: "Features",
      languages: "Languages",
      pricing: "Pricing",
      faq: "FAQ",
      contact: "Contact",
      dashboard: "Dashboard",
      account: "Account",
      tryFree: "Try Free",
      signIn: "Sign In",
      signOut: "Sign Out"
    },
    hero: {
      title: "AI-Powered Language Intelligence Platform",
      subtitle: "Advanced AI text generation, translation, and grammar correction across 12 languages with specialized Kurdish dialect support. Built for professionals who demand precision.",
      cta1: "Start Generating Free",
      cta2: "See How It Works",
      stats: {
        languages: "Languages Supported",
        accuracy: "Translation Accuracy",
        speed: "Average Response Time"
      }
    },
    demo: {
      title: "Experience the Power of AI",
      subtitle: "Try our AI with a quick interactive demo. No sign-up required.",
      placeholder: "Enter your text here and see the magic happen...",
      generate: "Generate",
      clear: "Clear",
      result: "AI Response",
      copy: "Copy",
      generating: "AI is thinking...",
      copied: "Copied to clipboard!",
      tabs: {
        generate: "Generate Text",
        rewrite: "Rewrite Content",
        grammar: "Fix Grammar",
        translate: "Translate Text"
      }
    },
    features: {
      title: "Everything You Need",
      subtitle: "Powerful tools for multilingual content creation, all in one platform.",
      items: [
        { title: "AI Text Generation", description: "Create high-quality, engaging content in 12 languages with state-of-the-art AI models trained for accuracy and cultural nuance." },
        { title: "Precise Translation", description: "Industry-leading translation engine with specialized expertise in Kurdish dialects — both Badini (Kurmanji) and Sorani." },
        { title: "Grammar Perfection", description: "Advanced multilingual grammar correction that understands complex linguistic nuances across all 12 supported languages." },
        { title: "Lightning Fast", description: "Powered by Google's Gemini 1.5 Flash model for near-instant responses with maximum computational efficiency." },
        { title: "Full RTL Support", description: "Complete right-to-left support for Arabic, Kurdish, and Persian with proper text flow, typography, and layout." },
        { title: "Smart Rewriting", description: "Intelligent content rewriting that enhances clarity, tone, and style while preserving your unique voice and message." }
      ]
    },
    languages: {
      title: "12 Languages, One Platform",
      subtitle: "Including specialized Kurdish dialect support for Badini and Sorani — a feature unmatched by any competitor.",
      rtl: "Right-to-Left",
      ltr: "Left-to-Right"
    },
    pricing: {
      title: "Simple, Transparent Pricing",
      subtitle: "Start for free. Upgrade to Pro when you need more power. No hidden fees.",
      free: {
        name: "Free Plan",
        price: "$0",
        period: "/month",
        description: "Perfect for exploring and getting started with AI-powered content creation.",
        features: [
          "5 AI generations per day",
          "12 language support",
          "Basic grammar correction",
          "Standard translation quality",
          "Community support access"
        ],
        cta: "Get Started Free"
      },
      pro: {
        name: "Pro Plan",
        price: "$9.99",
        period: "/month",
        description: "For power users, professionals, and businesses who need unlimited access and priority features.",
        features: [
          "Unlimited AI generations",
          "Advanced Kurdish dialect tuning",
          "Extended context window (4K tokens)",
          "Priority processing speed",
          "Advanced grammar correction",
          "Priority customer support",
          "Early access to new features"
        ],
        cta: "Upgrade to Pro",
        badge: "Most Popular"
      }
    },
    owner: {
      title: "Full-Stack Developer & AI Engineer",
      subtitle: "Zaniyar Al-Mzurii",
      description: "I design and build high-performance websites, cross-platform mobile applications, and custom AI integrations tailored to your unique business requirements — all at competitive, transparent pricing.",
      cta: "Order Your Custom Solution",
      skills: "Full-Stack Developer | AI Integration Specialist | UI/UX Designer"
    },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Everything you need to know about AIVision.",
      searchPlaceholder: "Search questions...",
      items: [
        { question: "What is AIVision?", answer: "AIVision is an AI-powered multilingual platform that provides text generation, translation, grammar correction, and content rewriting across 12 languages with specialized Kurdish dialect support." },
        { question: "How does the free plan work?", answer: "The free plan gives you 5 AI generations per day with access to all 12 languages and basic features. It's perfect for testing and light usage." },
        { question: "What payment methods do you accept?", answer: "We accept FIB (First Iraqi Bank), FastPay wallet, and USDT (TRC20) cryptocurrency. All payments are processed manually with receipt verification." },
        { question: "How accurate is the Kurdish translation?", answer: "Our Kurdish translation is specifically tuned for both Badini (Kurmanji) and Sorani dialects. We use specialized system prompts to ensure vocabulary and grammar accuracy for each dialect." },
        { question: "Can I cancel my Pro subscription?", answer: "Yes, Pro is a monthly subscription with no long-term commitment. You can choose not to renew at any time." },
        { question: "Is my data secure?", answer: "Absolutely. We use Supabase with Row-Level Security (RLS) policies. Your data is encrypted and only accessible by you." }
      ]
    },
    contact: {
      title: "Let's Connect",
      subtitle: "Have questions, feedback, or need custom development? We'd love to hear from you.",
      whatsapp: "Chat on WhatsApp",
      telegram: "Message on Telegram",
      email: "Send an Email",
      instagram: "Follow on Instagram",
      snapchat: "Add on Snapchat"
    },
    footer: {
      copyright: "© 2025 AIVision. All rights reserved.",
      tagline: "Crafted with precision by Zaniyar Al-Mzurii",
      builtWith: "Built with Next.js, Supabase & Google Gemini"
    },
    auth: {
      signIn: "Welcome Back",
      signUp: "Create Your Account",
      signInSubtitle: "Sign in to access your dashboard and continue creating.",
      signUpSubtitle: "Join thousands of users creating multilingual content with AI.",
      email: "Email address",
      password: "Password",
      fullName: "Full Name",
      signInBtn: "Sign In Securely",
      signUpBtn: "Create Free Account",
      googleSignIn: "Continue with Google",
      appleSignIn: "Continue with Apple",
      orContinue: "Or continue with email",
      noAccount: "New to AIVision?",
      haveAccount: "Already have an account?",
      forgotPassword: "Forgot password?",
      otpTitle: "Verify Your Email",
      otpDescription: "We sent a 6-digit verification code to",
      otpPlaceholder: "Enter 6-digit code",
      verifyOTP: "Verify & Continue",
      resendOTP: "Resend Code",
      otpSent: "Verification code sent!",
      redirecting: "Redirecting you to dashboard..."
    },
    dashboard: {
      title: "AI Workspace",
      welcome: "Welcome back",
      credits: "Daily Credits",
      remaining: "remaining today",
      unlimited: "Unlimited Access",
      history: "Generation History",
      noHistory: "Your generation history will appear here.",
      searchHistory: "Search your history...",
      upgrade: "Upgrade to Pro",
      pro: "Pro Plan Active",
      free: "Free Plan",
      dailyLimit: "Daily limit reached. Upgrade to Pro for unlimited access.",
      placeholder: "What would you like me to create, rewrite, or translate today?",
      send: "Generate",
      clear: "Clear",
      signInRequired: "Please sign in to access your AI workspace.",
      loadMore: "Load More",
      deleteConfirm: "Delete this generation?",
      model: "Model",
      tokens: "Tokens used"
    },
    account: {
      title: "Account Settings",
      profile: "Profile",
      subscription: "Subscription",
      payments: "Payment History",
      settings: "Settings",
      memberSince: "Member since",
      currentPlan: "Current Plan",
      upgradePlan: "Upgrade Plan",
      paymentHistory: "Payment History",
      noPayments: "No payment history yet.",
      status: "Status",
      approved: "Approved",
      pending: "Pending",
      rejected: "Rejected"
    },
    checkout: {
      title: "Upgrade to Pro Plan",
      subtitle: "$9.99/month — Unlimited AI generations, priority support, and advanced features.",
      back: "Back to Home",
      paymentDetails: "Payment Details",
      copyAddress: "Copy",
      copied: "Copied!",
      showQR: "Show QR Code",
      hideQR: "Hide QR Code",
      amount: "Amount Due",
      monthly: "Billed monthly. Cancel anytime.",
      submitProof: "Submit Payment Verification",
      fullName: "Your Full Name",
      email: "Your Email Address",
      transactionId: "Transaction ID / Hash",
      uploadReceipt: "Upload Payment Receipt",
      dragDrop: "Drag and drop your screenshot here, or click to browse",
      fileTypes: "Accepted: PNG, JPG, or PDF (max 5MB)",
      submit: "Submit for Verification",
      submitting: "Submitting your payment...",
      important: "Important Information",
      notes: [
        "Manual verification typically takes 1-24 hours",
        "Ensure you send the exact amount of $9.99",
        "Save your transaction ID for reference",
        "Contact support if not verified within 24 hours"
      ],
      success: "Payment proof submitted successfully! Our team will verify and activate your Pro account within 24 hours.",
      networks: {
        fib: "First Iraqi Bank (FIB)",
        fastpay: "FastPay Wallet",
        usdt: "USDT (TRC20 Network)"
      }
    },
    status: {
      operational: "All Systems Operational",
      degraded: "Partial Service Disruption",
      maintenance: "Scheduled Maintenance"
    },
    support: {
      title: "Need Help?",
      subtitle: "We're here for you. Choose your preferred way to reach us.",
      whatsapp: "Chat on WhatsApp",
      telegram: "Message on Telegram"
    }
  }
};

// Safe language metadata
export const languageMeta = {
  EN: { name: 'English', nativeName: 'English', flag: '🇬🇧', direction: 'ltr' },
  'KU-BD': { name: 'Kurdish Badini', nativeName: 'کوردی بادینی', flag: '🏴', direction: 'rtl' },
  'KU-SO': { name: 'Kurdish Sorani', nativeName: 'کوردی سۆرانی', flag: '🏴', direction: 'rtl' },
  AR: { name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  TR: { name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷', direction: 'ltr' },
  FA: { name: 'Persian', nativeName: 'فارسی', flag: '🇮🇷', direction: 'rtl' },
  DE: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', direction: 'ltr' },
  FR: { name: 'French', nativeName: 'Français', flag: '🇫🇷', direction: 'ltr' },
  ES: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', direction: 'ltr' },
  RU: { name: 'Russian', nativeName: 'Русский', flag: '🇷🇺', direction: 'ltr' },
  ZH: { name: 'Chinese', nativeName: '中文', flag: '🇨🇳', direction: 'ltr' },
  HI: { name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', direction: 'ltr' }
};

const rtlLanguages = ['KU-BD', 'KU-SO', 'AR', 'FA'];

/**
 * SAFE translation getter — never throws, always returns a valid value
 * @param {string} lang - Language code
 * @param {string} keyPath - Dot-notation path (e.g., 'nav.home')
 * @returns {*} The translated value, or English fallback, or the keyPath itself
 */
export function getTranslation(lang, keyPath) {
  if (!lang || !keyPath) return String(keyPath || '');

  const keys = String(keyPath).split('.');
  const source = translations[lang] || translations['EN'];
  const fallback = translations['EN'];

  // Try the requested language first
  let value = source;
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      value = undefined;
      break;
    }
  }

  // If found in requested language, return it
  if (value !== undefined && value !== null) {
    return value;
  }

  // Try English fallback
  let enValue = fallback;
  for (const key of keys) {
    if (enValue && typeof enValue === 'object' && key in enValue) {
      enValue = enValue[key];
    } else {
      return typeof value === 'string' ? value : keyPath;
    }
  }

  return enValue !== undefined ? enValue : keyPath;
}

/**
 * Get text direction for a language
 */
export function getDirection(lang) {
  return (languageMeta[lang] && languageMeta[lang].direction) || 'ltr';
}

/**
 * Check if language uses RTL direction
 */
export function isRTL(lang) {
  return rtlLanguages.includes(lang);
}

/**
 * SAFE helper: ensures the result is always an array
 * @param {*} value - Any value that might be an array
 * @returns {Array} Guaranteed array
 */
export function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

/**
 * SAFE helper: get translation and ensure it's an array
 * @param {string} lang - Language code
 * @param {string} keyPath - Dot-notation path
 * @returns {Array} Guaranteed array
 */
export function getTranslationArray(lang, keyPath) {
  const value = getTranslation(lang, keyPath);
  return ensureArray(value);
}

/**
 * SAFE helper: get translation and ensure it's a string
 * @param {string} lang - Language code
 * @param {string} keyPath - Dot-notation path
 * @returns {string} Guaranteed string
 */
export function getTranslationString(lang, keyPath) {
  const value = getTranslation(lang, keyPath);
  return typeof value === 'string' ? value : String(value || keyPath);
}

export default translations;
