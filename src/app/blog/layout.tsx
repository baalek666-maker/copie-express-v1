import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Correction de copies : 3h de gagnées par semaine — Blog Copie Express',
  description: 'Un prof passe en moyenne 3h par semaine à saisir des notes. Découvre comment réduire ce temps à 3 minutes grâce à la reconnaissance d\'écriture.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}