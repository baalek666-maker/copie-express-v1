import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/fade-in';
import { ArrowLeft, Sparkles, CreditCard, Mail } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { plan?: string };
}) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const plan = searchParams.plan;
  const planNames: Record<string, string> = {
    monthly: 'Mensuel (10€/mois)',
    yearly: 'Annuel Standard (99€/an)',
    expert: 'Expert Bac/Brevet (149€/an)',
  };
  const planLabel = plan && planNames[plan] ? planNames[plan] : 'Forfait';

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <FadeIn>
        <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Tableau de bord
        </Link>
      </FadeIn>

      <FadeIn delay={50}>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Passer au forfait {planLabel}</h1>
          <p className="text-muted-foreground mt-2">
            Le paiement en ligne arrive très bientôt. En attendant, on active ton forfait à la main.
          </p>
        </div>
      </FadeIn>

      <FadeIn delay={100}>
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Activation express
            </CardTitle>
            <CardDescription>
              Envoie-nous un email, on active ton forfait dans la journée.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <a
              href={`mailto:contact@copie-express.fr?subject=Passer au forfait ${planLabel}&body=Bonjour, je souhaite passer au forfait ${planLabel}. Mon email : ${user.email}`}
              className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-md font-medium transition-colors"
            >
              <Mail className="h-4 w-4" />
              Nous écrire
            </a>
            <p className="text-xs text-center text-muted-foreground">
              Réponse sous 24h en moyenne · Paiement sur facture ou virement
            </p>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn delay={200}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-primary" />
              Paiement en ligne (bientôt)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              Le paiement CB via Stripe sera disponible dans les prochaines semaines.
            </p>
            <p>
              En attendant, on active manuellement ton forfait dès réception de ton email.
            </p>
            <Button variant="outline" asChild className="mt-2">
              <Link href="/app/account">Voir mon compte</Link>
            </Button>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
