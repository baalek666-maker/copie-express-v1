import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Tarifs',
  description: 'Copie Express : 5 copies offertes sans carte bancaire, puis à partir de 5 € par mois. Annuel à 99 €. Sans engagement, résiliable depuis ton compte.',
  alternates: { canonical: '/pricing' },
};

export default function PricingPage() {
  const tiers = [
      {
        name: 'Découverte',
        price: 'Gratuit',
        period: '',
        description: 'Pour tester sans risque',
        features: [
          '5 copies offertes (une seule fois)',
          'Export Pronote et SACoche',
          'Sans carte bancaire',
          'Aide par e-mail',
        ],
        cta: 'Créer mon compte',
        ctaLink: '/signup',
        variant: 'outline' as const,
      },
      {
        name: 'Petit Correcteur',
        price: '5€',
        period: '/ mois',
        description: 'Une ou deux classes',
        features: [
          '50 copies / mois',
          'Export Pronote et SACoche',
          'Barème à partir du sujet',
          'Sans engagement',
        ],
        cta: 'Choisir Petit Correcteur',
        ctaLink: '/api/upgrade?plan=petit',
        variant: 'outline' as const,
      },
      {
        name: 'Standard',
        price: '15€',
        period: '/ mois',
        description: 'Pour les profs au quotidien',
        features: [
          '500 copies / mois',
          'Export Pronote et SACoche',
          'Barème à partir du sujet',
          'Bilan imprimable par élève',
          'Sans engagement',
        ],
        cta: 'Choisir Standard',
        ctaLink: '/api/upgrade?plan=monthly',
        variant: 'outline' as const,
      },
      {
        name: 'Annuel',
        price: '99€',
        period: '/ an',
        description: 'Tout le Standard, pour l’année',
        features: [
          '2 000 copies / mois',
          'Export Pronote et SACoche',
          'Barème à partir du sujet',
          'Bilan imprimable par élève',
          '81 € d’économie sur un an',
        ],
        cta: 'Choisir Annuel',
        ctaLink: '/api/upgrade?plan=yearly',
        variant: 'default' as const,
        highlight: true,
      },
    ];

  return (
    <main className="min-h-screen bg-secondary/30">
      <header className="border-b bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <img src="/favicon.svg" alt="" className="h-7 w-7" />
            Copie Express
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link href="/login" className="px-3 py-2 rounded-md text-muted-foreground hover:text-foreground">Connexion</Link>
            <Button size="sm" asChild>
              <Link href="/signup">Essayer gratuitement</Link>
            </Button>
          </nav>
        </div>
      </header>
      <div className="max-w-6xl mx-auto p-4 sm:p-6 md:p-12 space-y-10">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 py-1">
          <ArrowLeft className="h-3 w-3" /> Retour à l'accueil
        </Link>
        <div className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">Choisis ton forfait</h1>
          <p className="text-lg text-muted-foreground">
            Tous les forfaits incluent la lecture des copies, la note proposée par copie et l'export Pronote et SACoche.
          </p>
          <div className="flex justify-center gap-x-6 gap-y-2 text-sm flex-wrap">
            {['Sans engagement', 'Résiliable depuis ton compte', 'Données hébergées en Europe'].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-green-600" aria-hidden="true" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.highlight ? 'border-primary border-2 relative' : ''}>
              {tier.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap" variant="default">
                  Le plus avantageux
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="pt-2">
                  <span className="text-3xl font-bold tracking-tight tabular-nums">{tier.price}</span>
                  <span className="text-sm text-muted-foreground">{tier.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={tier.variant} className="w-full" asChild>
                  <Link href={tier.ctaLink}>{tier.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-lg">Bon à savoir</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Une copie est décomptée quand elle est lue, une seule fois. Une copie illisible ou une lecture en échec ne compte pas.</p>
            <p>• Le compteur mensuel repart à zéro le 1er de chaque mois.</p>
            <p>• Les photos des copies sont supprimées 30 jours après le dépôt. Tes notes validées restent dans ton compte.</p>
            <p>• Tu résilies toi-même depuis ton compte, sans nous écrire : l'accès reste ouvert jusqu'à la fin de la période payée.</p>
            <p>• Paiement sécurisé par carte. Nous ne conservons aucune donnée de carte bancaire.</p>
            <p>• Ton établissement règle l'abonnement ? <Link href="/contact?sujet=facture" className="underline">Demande un devis</Link>.</p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Une question ? <Link href="/contact" className="underline">Écris-nous</Link></p>
          <p className="mt-2">Outil d'aide à la correction : l'enseignant vérifie et valide chaque note · Non destiné aux épreuves officielles</p>
        </div>
      </div>
    </main>
  );
}