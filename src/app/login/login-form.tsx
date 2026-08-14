'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const isNew = searchParams.get('new') === '1';
  const plan = searchParams.get('plan');

  useEffect(() => {
    if (isNew) setMode('signup');
  }, [isNew]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabase();

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Le mot de passe doit faire au moins 6 caractères.');
        setLoading(false);
        return;
      }

      // Server-side signup with email_confirm: true (no confirmation email needed)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || 'Erreur lors de la creation du compte.');
      } else if (result.session?.access_token) {
        // Set session directly from API response (instant login)
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: result.session.access_token,
          refresh_token: result.session.refresh_token,
        });
        if (sessionError) {
          setError('Session echouee. Reessaie de te connecter.');
        } else {
          router.push(plan ? `/app/billing?plan=${plan}` : '/app');
          router.refresh();
        }
      } else if (result.needsManualLogin) {
        // Fallback: try to sign in client-side
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) {
          setError('Compte cree mais connexion echouee. Reessaie.');
        } else {
          router.push(plan ? `/app/billing?plan=${plan}` : '/app');
          router.refresh();
        }
      }
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError('Email ou mot de passe incorrect.');
      } else {
        router.push(plan ? `/app/billing?plan=${plan}` : '/app');
        router.refresh();
      }
    }

    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createBrowserSupabase();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/login`,
    });

    if (error) {
      setError(error.message);
    } else {
      setResetSent(true);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{mode === 'signup' ? 'Créer mon compte' : 'Connexion'}</CardTitle>
          <CardDescription>
            {mode === 'signup'
              ? '5 copies gratuites, sans carte bancaire.'
              : 'Connecte-toi avec ton email et ton mot de passe.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {resetSent ? (
            <div className="space-y-4 text-center">
              <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-900">
                <p className="font-semibold mb-1">Email envoyé ✉️</p>
                <p>Clique sur le lien dans l'email pour réinitialiser ton mot de passe.</p>
              </div>
              <Button variant="outline" onClick={() => { setResetSent(false); setMode('login'); }}>
                Retour à la connexion
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                />
                {mode === 'signup' && (
                  <p className="text-xs text-muted-foreground">Minimum 6 caractères.</p>
                )}
              </div>

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    autoComplete="new-password"
                  />
                </div>
              )}

              {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Chargement...' : mode === 'signup' ? 'Créer mon compte →' : 'Se connecter →'}
              </Button>

              {mode === 'login' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setResetSent(false)}
                    className="text-sm text-primary hover:underline"
                  >
                    Mot de passe oublié ?
                  </button>
                </div>
              )}

              <p className="text-center text-sm text-muted-foreground">
                {mode === 'signup' ? (
                  <>
                    Déjà un compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-primary hover:underline font-medium"
                    >
                      Se connecter
                    </button>
                  </>
                ) : (
                  <>
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="text-primary hover:underline font-medium"
                    >
                      Créer un compte (5 copies gratuites)
                    </button>
                  </>
                )}
              </p>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
