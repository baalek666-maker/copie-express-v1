import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center space-y-6 animate-fade-in">
        <div className="text-8xl font-bold text-primary">404</div>
        <h1 className="text-2xl font-semibold">Page introuvable</h1>
        <p className="text-muted-foreground max-w-md">
          La page que tu cherches n'existe pas ou a été déplacée.
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </Button>
      </div>
    </main>
  );
}