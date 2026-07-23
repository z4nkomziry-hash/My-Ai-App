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

export const metadata = {
  title: {
    default: 'AIVision - AI-Powered Multi-Lingual Platform',
    template: '%s | AIVision'
  },
  description: 'Advanced AI text generation, translation, and grammar correction across 12 languages with specialized Kurdish dialect support. Powered by Google Gemini 1.5 Flash.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  keywords: [
    'AI translation', 'Kurdish AI', 'multilingual AI', 'text generation',
    'grammar correction', 'Badini Kurdish', 'Sorani Kurdish', 'language AI',
    'Google Gemini', 'AI writing assistant', 'SaaS platform', 'Zaniyar Al-Mzurii'
  ],
  authors: [{ name: 'Zaniyar Al-Mzurii', url: 'https://t.me/z_14x' }],
  creator: 'Zaniyar Al-Mzurii',
  publisher: 'AIVision Technologies',
  formatDetection: {
    telephone: false,
    email: false,
    address: false
  },
  icons: {
    icon: '/assets/logo/favicon.ico',
    shortcut: '/assets/logo/favicon.ico',
    apple: '/assets/logo/logo.png'
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'AIVision',
    title: 'AIVision - AI-Powered Multi-Lingual Platform',
    description: 'Advanced AI text generation, translation, and grammar correction across 12 languages.',
    images: [
      {
        url: '/assets/logo/logo.png',
        width: 1200,
        height: 630,
        alt: 'AIVision Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIVision - AI-Powered Multi-Lingual Platform',
    description: 'Advanced AI text generation across 12 languages.',
    images: ['/assets/logo/logo.png']
  },
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
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090D16',
  colorScheme: 'dark'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className="dark">
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
