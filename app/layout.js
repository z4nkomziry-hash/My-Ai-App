import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './AuthProvider';
import StatusBadge from '@/components/ui/StatusBadge';
import SupportModal from '@/components/ui/SupportModal';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true
});

// ============================================================
// METADATA — Complete configuration for SEO, PWA, and Images
// ============================================================
export const metadata = {
  // Title
  title: {
    default: 'AIVision - AI-Powered Multi-Lingual Platform',
    template: '%s | AIVision'
  },
  description:
    'Advanced AI text generation, translation, and grammar correction across 12 languages with specialized Kurdish dialect support. Built by Zaniyar Al-Mzurii.',

  // Base URL
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://aivision.vercel.app'),

  // Keywords
  keywords: [
    'AI translation',
    'Kurdish AI',
    'multilingual AI',
    'text generation',
    'grammar correction',
    'Badini Kurdish',
    'Sorani Kurdish',
    'Zaniyar Al-Mzurii',
    'AIVision'
  ],

  // Authors
  authors: [{ name: 'Zaniyar Al-Mzurii', url: 'https://t.me/z_14x' }],
  creator: 'Zaniyar Al-Mzurii',
  publisher: 'AIVision Technologies',

  // Format detection (prevents auto-linking on mobile)
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  },

  // ==========================================
  // ICONS — This is the KEY fix for favicon
  // ==========================================
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48', type: 'image/x-icon' },
      { url: '/icon.png', sizes: '512x512', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { rel: 'apple-touch-icon', url: '/apple-icon.png' }
    ]
  },

  // ==========================================
  // PWA MANIFEST
  // ==========================================
  manifest: '/manifest.json',

  // ==========================================
  // OPEN GRAPH (Social Media Preview)
  // ==========================================
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'AIVision',
    title: 'AIVision - AI-Powered Multi-Lingual Platform',
    description: 'Advanced AI text generation, translation, and grammar correction across 12 languages.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AIVision - AI-Powered Multi-Lingual Platform'
      }
    ]
  },

  // ==========================================
  // TWITTER CARD
  // ==========================================
  twitter: {
    card: 'summary_large_image',
    title: 'AIVision - AI-Powered Multi-Lingual Platform',
    description: 'Advanced AI text generation across 12 languages.',
    images: ['/og-image.png'],
    creator: '@aivision'
  },

  // ==========================================
  // ROBOTS
  // ==========================================
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },

  // ==========================================
  // VERIFICATION (optional)
  // ==========================================
  verification: {
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
  },

  // ==========================================
  // ALTERNATES (language variants)
  // ==========================================
  alternates: {
    canonical: process.env.NEXT_PUBLIC_APP_URL,
    languages: {
      'en': `${process.env.NEXT_PUBLIC_APP_URL}?lang=EN`,
      'ar': `${process.env.NEXT_PUBLIC_APP_URL}?lang=AR`,
      'tr': `${process.env.NEXT_PUBLIC_APP_URL}?lang=TR`,
      'ku': `${process.env.NEXT_PUBLIC_APP_URL}?lang=KU-BD`
    }
  }
};

// ============================================================
// VIEWPORT
// ============================================================
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090D16',
  colorScheme: 'dark'
};

// ============================================================
// ROOT LAYOUT
// ============================================================
export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className="dark">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />

        {/* Apple Web App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AIVision" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#090D16" />
        <meta name="msapplication-TileImage" content="/icon.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Theme Color */}
        <meta name="theme-color" content="#090D16" media="(prefers-color-scheme: dark)" />
        <meta name="theme-color" content="#090D16" media="(prefers-color-scheme: light)" />

        {/* Canonical URL */}
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL || 'https://aivision.vercel.app'} />
      </head>
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          {children}
          <StatusBadge />
          <SupportModal />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#111827',
                color: '#fff',
                border: '1px solid #374151',
                borderRadius: '14px',
                padding: '12px 16px',
                fontSize: '14px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
              },
              success: {
                iconTheme: { primary: '#10B981', secondary: '#fff' },
                style: { border: '1px solid rgba(16, 185, 129, 0.3)' }
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
                style: { border: '1px solid rgba(239, 68, 68, 0.3)' }
              }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
