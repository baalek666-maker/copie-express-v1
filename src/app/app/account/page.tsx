import type { Metadata } from 'next';
import { createServerSupabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/fade-in';
import { Mail, User, Sparkles, ArrowRight, Shield } from 'lucide-react';
import Link from 'next/link';
import { frDate, planFromUser } from '@/lib/plan';
import { SubscriptionActions } from '@/components/subscription-actions';
import { DeleteAccount } from '@/components/delete-account';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Mon compte' };

export default async function AccountPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userData } = await supabase
    .from('users')
    .select('full_name, trial_copies_count')
    .eq('id', user.id)
    .maybeSingle();

  const account = planFromUser(user, userData?.trial_copies_count || 0);
  const pct = account.limit > 0 ? Math.min(100, (account.used / account.limit) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <FadeIn>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Mon compte</h1>
          <p className="text-muted-foreground mt-1">Ton profil, ton forfait, tes données.</p>
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
            {userData?.full_name && (
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Nom</p>
                  <p className="font-medium">{userData.full_name}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3">
              <Mail className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">Adresse e-mail</p>
                <p className="font-medium break-all">{user.email}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Pour changer de mot de passe : déconnecte-toi, puis « Mot de passe oublié » sur la page de connexion.
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={200}>
        <Card className={account.paid ? 'border-green-300 dark:border-green-800' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Forfait
            </CardTitle>
            <CardDescription>
              {account.paid
                ? `${account.limit} copies par mois. Le compteur repart à zéro le 1er de chaque mois.`
                : `${account.limit} copies offertes pour essayer, sans carte bancaire.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={account.paid ? 'success' : 'secondary'}>{account.name}</Badge>
              <span className="text-sm text-muted-foreground">
                {account.used} / {account.limit} {account.paid ? 'copies lues ce mois-ci' : 'copies d’essai utilisées'}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-orange-500" style={{ width: `${pct}%` }} />
            </div>

            {account.paid ? (
              <>
                {!account.cancelAtPeriodEnd && (
                  <p className="text-sm">Prochain renouvellement : {frDate(account.periodEnd)}</p>
                )}
                <div className="flex items-start gap-2 flex-wrap">
                  <SubscriptionActions
                    cancelAtPeriodEnd={account.cancelAtPeriodEnd}
                    periodEndLabel={frDate(account.periodEnd)}
                  />
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {account.remaining > 0
                    ? `Il te reste ${account.remaining} copie${account.remaining > 1 ? 's' : ''} d’essai.`
                    : 'Tes copies d’essai sont utilisées. Choisis un forfait pour continuer.'}
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
              Mes données
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Les photos des copies et les réponses des élèves sont supprimées 30 jours après le dépôt.
              Les notes validées restent dans ton compte. Hébergement dans l'Union européenne.
            </p>
            <p>
              Détail dans nos <Link href="/legal/privacy" className="text-primary hover:underline">engagements de confidentialité</Link>.
            </p>
            <div className="pt-3 border-t space-y-1">
              <p className="font-medium text-foreground">Ressources</p>
              <p>
                <Link href="/guide" className="text-primary hover:underline">Guide enseignant</Link>
                {' — '}le parcours complet, pas à pas.
              </p>
              <p>
                <Link href="/notice-familles" className="text-primary hover:underline">Notice d&apos;information aux familles</Link>
                {' — '}à imprimer pour informer parents et élèves.
              </p>
              <p>
                <Link href="/contact" className="text-primary hover:underline">Nous écrire</Link>
                {' — '}une question, un problème, une idée.
              </p>
            </div>
            <div className="pt-3 border-t">
              <DeleteAccount />
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
