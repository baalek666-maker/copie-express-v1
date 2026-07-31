import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Copie Express — Redeviens un prof. Pas une machine à cliquer.',
  description: 'Brevet blanc, bac blanc, contrôles : 90 copies en 30 secondes.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}