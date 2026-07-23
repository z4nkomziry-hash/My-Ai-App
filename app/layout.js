import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './AuthProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: {
    default: 'AIVision - AI-Powered Multi-Lingual Platform',
    template: '%s | AIVision'
  },
  description: 'Advanced AI text generation, translation, and grammar correction across 12 languages with specialized Kurdish dialect support. Powered by Google Gemini.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  keywords: ['AI', 'translation', 'Kurdish', 'language AI', 'text generation', 'grammar correction', 'Badini', 'Sorani', 'multilingual', 'SaaS'],
  authors: [{ name: 'Taha Sardar', url: 'https://t.me/z_14x' }],
  creator: 'Taha Sardar',
  publisher: 'AIVision',
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'AIVision',
    title: 'AIVision - AI-Powered Multi-Lingual Platform',
    description: 'Advanced AI text generation, translation, and grammar correction across 12 languages.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AIVision Platform' }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AIVision - AI-Powered Multi-Lingual Platform',
    description: 'Advanced AI text generation across 12 languages.',
    images: ['/og-image.png']
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#090D16'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: { background: '#111827', color: '#fff', border: '1px solid #374151', borderRadius: '12px' },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } }
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
