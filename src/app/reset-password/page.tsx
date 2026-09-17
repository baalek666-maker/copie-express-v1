'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Page ciblée par le mail de réinitialisation Supabase.
// Flux : lien mail → session recovery → champ nouveau mot de passe → updateUser.
export default function ResetPasswordPage() {
  const [ready, setReady] = useState(false); // session recovery détectée
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserSupabase();

    // Cas 1 : événement PASSWORD_RECOVERY déclenché à l'arrivée depuis le mail
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true);
      }
      if (event === 'SIGNED_IN') {
        // session déjà établie (échange du code déjà fait au chargement)
        supabase.auth.getSession().then(({ data }) => {
          if (data.session) setReady(true);
        });
      }
    });

    // Cas 2 : le code a déjà été échangé avant que le listener soit posé
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit faire au moins 6 caractères.');
      return;
    }

    setLoading(true);
    const supabase = createBrowserSupabase();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setDone(true);
    setLoading(false);
    // Connexion établie avec le nouveau mot de passe → on va à l'app
    setTimeout(() => {
      router.push('/app');
      router.refresh();
    }, 1500);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Nouveau mot de passe</CardTitle>
          <CardDescription>
            {done
              ? 'Mot de passe mis à jour, redirection vers ton espace…'
              : ready
                ? 'Choisis ton nouveau mot de passe.'
                : 'Validation du lien de réinitialisation…'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {done ? (
            <p className="text-center text-sm text-muted-foreground">
              ✓ C'est fait. Tu arrive dans ton espace dans un instant.
            </p>
          ) : ready ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirme le mot de passe</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Enregistrement…' : 'Définir mon mot de passe'}
              </Button>
            </form>
          ) : (
            <div className="space-y-3 text-center">
              <p className="text-sm text-muted-foreground">
                Si rien ne se passe, le lien a peut-être expiré (valide 1 heure).
              </p>
              <Link href="/login" className="text-sm underline text-muted-foreground">
                Retour à la connexion
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
