'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

// L'adresse saisie pré-remplit le formulaire d'inscription : une seule étape, rien n'est perdu.
export function LeadCapture() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clean = email.trim();
    if (!clean || !clean.includes('@')) return;
    setLoading(true);
    router.push(`/login?new=1&email=${encodeURIComponent(clean)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-lg flex-col gap-2 sm:flex-row">
      <div className="relative flex-1">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <label htmlFor="lead-email" className="sr-only">Ton adresse e-mail</label>
        <input
          id="lead-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="prenom.nom@ac-academie.fr"
          autoComplete="email"
          className="h-12 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>
      <Button type="submit" size="lg" disabled={loading} className="h-12">
        {loading ? 'Un instant…' : 'Créer mon compte'}
      </Button>
    </form>
  );
}
