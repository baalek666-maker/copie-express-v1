import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';
import { PayButton } from '@/components/pay-button';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CreditCard, Mail, PartyPopper, XCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const PLAN_DETAILS: Record<string, { name: string; price: string }> = {
  petit:         { name: 'Petit Correcteur',  price: '5€/mois' },
  monthly:       { name: 'Standard',          price: '15€/mois' },
  yearly:        { name: 'Annuel Standard',   price: '99€/an' },
  expert_yearly: { name: 'Expert Bac/Brevet', price: '149€/an' },
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { plan?: string; status?: string };
}) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const plan = searchParams.plan;
  const planNames: Record<string, string> = {
    monthly: 'Standard (15€/mois)',
    yearly: 'Annuel Standard (99€/an)',
    petit: 'Petit Correcteur (5€/mois)',
    expert_yearly: 'Expert Bac/Brevet (149€/an)',
  };
  const planLabel = plan && planNames[plan] ? planNames[plan] : 'Forfait';
  const details = plan ? PLAN_DETAILS[plan] : undefined;
  const showSuccess = searchParams.status === 'success';
  const showCancelled = searchParams.status === 'cancelled';

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <FadeIn>
        <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Tableau de bord
        </Link>
      </FadeIn>

      {showSuccess && (
        <FadeIn>
          <Card className="border-green-500/30 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <PartyPopper className="h-5 w-5" />
                Paiement reçu, forfait activé !
              </CardTitle>
              <CardDescription className="text-green-700/80">
                Ton forfait est actif. Bonne correction.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href="/app">Retour au tableau de bord</Link>
              </Button>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      {showCancelled && (
        <FadeIn>
          <Card className="border-amber-500/30 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <XCircle className="h-5 w-5" />
                Paiement annulé
              </CardTitle>
              <CardDescription className="text-amber-700/80">
                Aucun montant n'a été prélevé. Tu peux réessayer quand tu veux.
              </CardDescription>
            </CardHeader>
          </Card>
        </FadeIn>
      )}

      <FadeIn delay={50}>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Passer au forfait {planLabel}</h1>
          <p className="text-muted-foreground mt-2">
            Paiement sécurisé par carte bancaire. Résiliable à tout moment.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Paiement par carte
            </CardTitle>
            <CardDescription>
              {details
                ? `${details.name} — ${details.price}. Sans engagement.`
                : 'Choisis ton forfait depuis la page Tarifs.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {details ? (
              <PayButton plan={plan!} label={details.price} />
            ) : (
              <p className="text-sm text-muted-foreground">Aucun forfait sélectionné.</p>
            )}
            <p className="text-xs text-center text-muted-foreground">
              Paiement sécurisé Stripe · CB, Visa, Mastercard · Facture par email
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={150}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Autre solution : sur facture
            </CardTitle>
            <CardDescription>
              Établissement scolaire ou préférence pour un virement ? Écris-nous, on s'occupe de tout.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href={`mailto:contact@copie-express.fr?subject=Forfait ${planLabel}&body=Bonjour, je souhaite passer au forfait ${planLabel}. Mon email : ${user.email}`}
              className="flex items-center justify-center gap-2 w-full border border-input bg-background hover:bg-accent h-11 px-6 rounded-md font-medium transition-colors text-sm"
            >
              <Mail className="h-4 w-4" />
              Nous écrire
            </a>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
