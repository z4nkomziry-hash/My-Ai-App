import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './AuthProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: {
    default: 'AIVision - AI-Powered Multi-Lingual Platform',
    template: '%s | AIVision',
  },
  description: 'Advanced AI text generation, translation, and grammar correction across 12 languages with specialized Kurdish dialect support.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#090D16',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning className="dark">
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#111827',
                color: '#fff',
                border: '1px solid #374151',
                borderRadius: '14px',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
