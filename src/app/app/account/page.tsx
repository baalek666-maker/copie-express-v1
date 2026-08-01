import { createServerSupabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/fade-in';
import { Mail, User, School, BookOpen, Sparkles, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AccountPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  const subscriptionActive = userData?.subscription_status === 'active';

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Mon compte</h1>
          <p className="text-muted-foreground mt-1">
            Tes infos et ton abonnement.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Profil
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Nom</p>
                <p className="font-medium">{userData?.full_name || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <School className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Académie</p>
                <p className="font-medium">{userData?.academy || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Matière(s) · Niveau(x)</p>
                <p className="font-medium">
                  {userData?.subject?.join(', ') || '—'} · {userData?.school_level?.join(', ') || '—'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={200}>
        <Card className={subscriptionActive ? 'border-green-300 dark:border-green-800' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Abonnement
            </CardTitle>
            <CardDescription>
              {subscriptionActive ? 'Tu profites de l\'accès illimité.' : 'Tu utilises le forfait Découverte.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {subscriptionActive ? (
              <>
                <Badge variant="success" className="flex items-center gap-1 w-fit">
                  ✓ Abonnement actif
                </Badge>
                <p className="text-sm">
                  Forfait : <strong>{userData?.subscription_plan}</strong> ·{' '}
                  Renouvellement : {userData?.subscription_expires_at
                    ? new Date(userData.subscription_expires_at).toLocaleDateString('fr-FR')
                    : '—'}
                </p>
                <Button variant="outline" asChild>
                  <Link href="/pricing">Voir les forfaits</Link>
                </Button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Découverte</Badge>
                  <span className="text-sm text-muted-foreground">
                    {userData?.trial_copies_count || 0} / 10 copies utilisées
                  </span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-orange-500 transition-all"
                    style={{ width: `${((userData?.trial_copies_count || 0) / 10) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Passe à un forfait pour continuer sans limite.
                </p>
                <Button asChild className="shadow-lg shadow-primary/20">
                  <Link href="/pricing">
                    Voir les forfaits
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={300}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Confidentialité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Tes copies sont hébergées en Europe (Supabase Ireland), supprimées automatiquement après 30 jours.
            </p>
            <p>
              Voir nos <Link href="/legal/privacy" className="text-primary hover:underline">engagements RGPD</Link>.
            </p>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}