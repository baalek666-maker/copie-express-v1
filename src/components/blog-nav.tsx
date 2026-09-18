'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Barre de navigation blog : retour selon le contexte (article → Blog, index → Accueil)
export function BlogNav() {
  const pathname = usePathname();
  const isArticle = pathname !== '/blog';

  return (
    <div className="border-b bg-background sticky top-0 z-40">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href={isArticle ? '/blog' : '/'}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← {isArticle ? 'Tous les articles' : 'Retour au site'}
        </Link>
        <Link href="/" className="text-sm font-bold">
          Copie Express
        </Link>
      </div>
    </div>
  );
}
