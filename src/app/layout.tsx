import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastContainer } from '@/components/ui/use-toast';
import { CommandPalette } from '@/components/command-palette';
import { PlausibleAnalytics } from '@/components/analytics';
import { CookieBanner } from '@/components/cookie-banner';
import { Figtree, Instrument_Serif } from 'next/font/google';
import './globals.css';

// Polices hébergées avec le site (aucune requête vers un service tiers depuis le navigateur).
const fontSans = Figtree({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const fontSerif = Instrument_Serif({ subsets: ['latin'], weight: '400', style: ['normal', 'italic'], variable: '--font-serif', display: 'swap' });
const fontVars = `${fontSans.variable} ${fontSerif.variable}`;

export const metadata: Metadata = {
  metadataBase: new URL('https://copie-express-v1.vercel.app'),
  title: {
    default: 'Copie Express — Redeviens un prof. Pas une machine à cliquer.',
    template: '%s · Copie Express',
  },
  description: 'Brevet blanc, bac blanc, contrôles : 90 copies en 30 secondes. Photographie depuis ton canapé, export CSV SACoche & Pronote. RGPD + données Europe.',
  keywords: ['correction copies', 'prof', 'brevet blanc', 'bac blanc', 'SACoche', 'Pronote', 'correction copies rapide', 'gain de temps prof'],
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
    <html lang="fr" suppressHydrationWarning className={fontVars}>
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
