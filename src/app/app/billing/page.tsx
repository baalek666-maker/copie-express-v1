import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';
import { PayButton } from '@/components/pay-button';
import { ActivatePlan } from '@/components/activate-plan';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle2, CreditCard, Mail, XCircle } from 'lucide-react';
import { PLAN_LIMITS, PLAN_NAMES, PLAN_PRICES, frDate, planFromUser } from '@/lib/plan';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Mon forfait' };

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { plan?: string; status?: string; session_id?: string };
}) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const account = planFromUser(user);
  const plan = searchParams.plan && PLAN_LIMITS[searchParams.plan] ? searchParams.plan : null;
  const showSuccess = searchParams.status === 'success';
  const showCancelled = searchParams.status === 'cancelled';
  const alreadyOnPlan = account.paid && !account.cancelAtPeriodEnd;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <FadeIn>
        <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 py-1">
          <ArrowLeft className="h-3 w-3" /> Mes évaluations
        </Link>
      </FadeIn>

      {showSuccess && (
        <FadeIn>
          <Card className="border-green-500/30 bg-green-50 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
                {account.paid ? `Forfait ${account.name} activé` : 'Paiement reçu'}
              </CardTitle>
              <CardDescription className="text-green-700/80 dark:text-green-400/80">
                {account.paid
                  ? `Tu disposes de ${account.limit} copies par mois.`
                  : 'Merci ! Ton forfait s’active, cela prend quelques secondes.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {!account.paid && <ActivatePlan sessionId={searchParams.session_id} />}
              <div className="flex gap-2 flex-wrap">
                <Button asChild>
                  <Link href="/app">Retour à mes évaluations</Link>
                </Button>
                {!account.paid && (
                  <Button variant="outline" asChild>
                    <Link href="/contact?sujet=probleme">Nous écrire</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {showCancelled && (
        <FadeIn>
          <Card className="border-amber-500/30 bg-amber-50 dark:bg-amber-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
                <XCircle className="h-5 w-5" />
                Paiement abandonné
              </CardTitle>
              <CardDescription className="text-amber-700/80 dark:text-amber-400/80">
                Rien n'a été prélevé. Tu peux reprendre quand tu veux.
              </CardDescription>
            </CardHeader>
          </Card>
        </FadeIn>
      )}

      <FadeIn delay={50}>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {plan && !alreadyOnPlan ? `Forfait ${PLAN_NAMES[plan]}` : 'Mon forfait'}
          </h1>
          <p className="text-muted-foreground mt-2">
            {account.paid
              ? `Forfait actuel : ${account.name} — ${account.used} / ${account.limit} copies lues ce mois-ci.`
              : `Forfait actuel : Découverte — ${account.used} / ${account.limit} copies d’essai utilisées.`}
          </p>
        </div>
      </FadeIn>

      {alreadyOnPlan ? (
        <FadeIn delay={100}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ton abonnement est actif</CardTitle>
              <CardDescription>
                Prochain renouvellement le {frDate(account.periodEnd)}. Tu peux le résilier toi-même depuis ton compte.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href="/app/account">Gérer mon abonnement</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <FadeIn delay={100}>
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-primary" />
                Paiement par carte
              </CardTitle>
              <CardDescription>
                {plan
                  ? `${PLAN_NAMES[plan]} — ${PLAN_PRICES[plan]} — ${PLAN_LIMITS[plan]} copies par mois. Sans engagement, résiliable depuis ton compte.`
                  : 'Choisis d’abord un forfait.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {plan ? (
                <PayButton plan={plan} label={PLAN_PRICES[plan]} />
              ) : (
                <Button asChild className="w-full">
                  <Link href="/pricing">Voir les forfaits</Link>
                </Button>
              )}
              <p className="text-xs text-center text-muted-foreground">
                Paiement sécurisé · CB, Visa, Mastercard
              </p>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      <FadeIn delay={150}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Mail className="h-4 w-4 text-primary" />
              Paiement par l'établissement ou sur facture
            </CardTitle>
            <CardDescription>
              Ton collège ou ton lycée règle l'abonnement ? Écris-nous, on prépare un devis et une facture.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href={`/contact?sujet=facture${plan ? `&forfait=${plan}` : ''}`}>Nous écrire</Link>
            </Button>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
