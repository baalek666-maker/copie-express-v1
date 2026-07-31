'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createBrowserSupabase();

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Connexion</CardTitle>
          <CardDescription>On t'envoie un lien magique par email. Pas de mot de passe à retenir.</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="space-y-4 text-center">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-900">
                <p className="font-semibold mb-1">Lien envoyé ✉️</p>
                <p>Vérifie ta boîte mail <strong>{email}</strong>. Le lien expire dans 1 heure.</p>
              </div>
              <Button variant="outline" onClick={() => setSent(false)}>
                Renvoyer un autre email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email professionnel</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="prenom.nom@ac-xxx.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete="email"
                />
                <p className="text-xs text-muted-foreground">
                  Ton email n'est utilisé que pour t'identifier. Jamais partagé.
                </p>
              </div>

              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Recevoir mon lien magique →'}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Pas encore de compte ?{' '}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Créer un compte (10 copies gratuites)
                </Link>
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}