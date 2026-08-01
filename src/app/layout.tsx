import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { ToastContainer } from '@/components/ui/use-toast';
import { CommandPalette } from '@/components/command-palette';
import './globals.css';

export const metadata: Metadata = {
  title: 'Copie Express — Redeviens un prof. Pas une machine à cliquer.',
  description: 'Brevet blanc, bac blanc, contrôles : 90 copies en 30 secondes.',
  openGraph: {
    title: 'Copie Express — Redeviens un prof.',
    description: '90 copies corrigées en 30 secondes. Tu valides, tu fermes l\'ordi.',
    locale: 'fr_FR',
    type: 'website',
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
          </ToastContainer>
        </ThemeProvider>
      </body>
    </html>
  );
}