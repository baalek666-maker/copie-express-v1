'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { isDisposableEmail } from '@/lib/anti-abuse';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [academy, setAcademy] = useState('');
  const [subject, setSubject] = useState('');
  const [schoolLevel, setSchoolLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserSupabase();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !fullName || !academy || !subject || !schoolLevel) {
      setError('Tous les champs sont requis.');
      setLoading(false);
      return;
    }

    // Anti-abuse : bloquer les emails jetables
    if (isDisposableEmail(email)) {
      setError('Les emails jetables (yopmail, tempmail, etc.) ne sont pas acceptés. Utilise ton email professionnel.');
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: fullName, academy, subject, school_level: schoolLevel },
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

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Bienvenue 👋</CardTitle>
            <CardDescription>Ton lien de connexion est envoyé.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-900">
              <p className="font-semibold mb-2">Vérifie ta boîte mail ✉️</p>
              <p>On a envoyé un lien magique à <strong>{email}</strong>.</p>
              <p className="mt-2 text-xs">Tes 10 copies gratuites sont offertes, sans carte bancaire.</p>
            </div>
            <Button variant="outline" onClick={() => setSent(false)}>
              Renvoyer un autre email
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle>Créer ton compte prof</CardTitle>
          <CardDescription>10 copies gratuites · Sans carte bancaire · RGPD + données Europe</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email professionnel</Label>
              <Input
                id="email"
                type="email"
                placeholder="prenom.nom@ac-xxx.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Marie Dupont"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="academy">Académie</Label>
              <Select value={academy} onValueChange={setAcademy}>
                <SelectTrigger id="academy">
                  <SelectValue placeholder="Choisis ton académie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aix-marseille">Aix-Marseille</SelectItem>
                  <SelectItem value="amiens">Amiens</SelectItem>
                  <SelectItem value="besancon">Besançon</SelectItem>
                  <SelectItem value="bordeaux">Bordeaux</SelectItem>
                  <SelectItem value="clermont-ferrand">Clermont-Ferrand</SelectItem>
                  <SelectItem value="corse">Corse</SelectItem>
                  <SelectItem value="creteil">Créteil</SelectItem>
                  <SelectItem value="dijon">Dijon</SelectItem>
                  <SelectItem value="grenoble">Grenoble</SelectItem>
                  <SelectItem value="lille">Lille</SelectItem>
                  <SelectItem value="limoges">Limoges</SelectItem>
                  <SelectItem value="lyon">Lyon</SelectItem>
                  <SelectItem value="montpellier">Montpellier</SelectItem>
                  <SelectItem value="nancy-metz">Nancy-Metz</SelectItem>
                  <SelectItem value="nantes">Nantes</SelectItem>
                  <SelectItem value="nice">Nice</SelectItem>
                  <SelectItem value="normandie">Normandie</SelectItem>
                  <SelectItem value="orleans-tours">Orléans-Tours</SelectItem>
                  <SelectItem value="paris">Paris</SelectItem>
                  <SelectItem value="poitiers">Poitiers</SelectItem>
                  <SelectItem value="reims">Reims</SelectItem>
                  <SelectItem value="rennes">Rennes</SelectItem>
                  <SelectItem value="reunion">La Réunion</SelectItem>
                  <SelectItem value="strasbourg">Strasbourg</SelectItem>
                  <SelectItem value="toulouse">Toulouse</SelectItem>
                  <SelectItem value="versailles">Versailles</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Matière principale</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maths">Mathématiques</SelectItem>
                    <SelectItem value="physique">Physique-Chimie</SelectItem>
                    <SelectItem value="svt">SVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schoolLevel">Niveaux</Label>
                <Select value={schoolLevel} onValueChange={setSchoolLevel}>
                  <SelectTrigger id="schoolLevel">
                    <SelectValue placeholder="Niveau" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="college">Collège</SelectItem>
                    <SelectItem value="lycee-general">Lycée général</SelectItem>
                    <SelectItem value="lycee-pro">Lycée pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Création...' : 'Créer mon compte (10 copies offertes) →'}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Se connecter
              </Link>
            </p>

            <p className="text-xs text-center text-muted-foreground">
              En créant ton compte, tu acceptes nos{' '}
              <Link href="/legal/cgu" className="underline">CGU</Link> et notre{' '}
              <Link href="/legal/privacy" className="underline">politique RGPD</Link>.
            </p>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}