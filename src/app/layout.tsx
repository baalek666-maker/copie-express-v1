import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastContainer } from '@/components/ui/use-toast';
import { CommandPalette } from '@/components/command-palette';
import { PlausibleAnalytics } from '@/components/analytics';
import { CookieBanner } from '@/components/cookie-banner';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://copie-express-v1.vercel.app'),
  title: {
    default: 'Copie Express — Redeviens un prof. Pas une machine à cliquer.',
    template: '%s · Copie Express',
  },
  description: 'Brevet blanc, bac blanc, contrôles : 90 copies en 30 secondes. Photographie depuis ton canapé, export CSV SACoche & Pronote. RGPD + données Europe.',
  keywords: ['correction copies', 'prof', 'brevet blanc', 'bac blanc', 'SACoche', 'Pronote', 'OCR copies', 'extraction automatique', 'gain de temps prof'],
  authors: [{ name: 'Copie Express' }],
  creator: 'Copie Express',
  publisher: 'Copie Express',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://copie-express-v1.vercel.app',
    siteName: 'Copie Express',
    title: 'Copie Express — Redeviens un prof. Pas une machine à cliquer.',
    description: 'Brevet blanc, bac blanc, contrôles : 90 copies corrigées en 30 secondes. Tu valides, tu fermes l\'ordi.',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Copie Express',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Copie Express — 90 copies en 30 secondes.',
    description: 'Pour les profs qui ont mieux à faire.',
    images: ['/twitter-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastContainer>
            <CommandPalette />
            {children}
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                style: { fontFamily: 'inherit' },
              }}
            />
            <CookieBanner />
          </ToastContainer>
          <PlausibleAnalytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
