import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const tiers = [
    {
      name: 'Découverte',
      price: 'Gratuit',
      period: '',
      description: 'Pour tester sans risque',
      features: [
        '10 copies offertes (une seule fois)',
        'Export CSV basique',
        'Sans carte bancaire',
        'Support email',
      ],
      cta: 'Créer mon compte',
      ctaLink: '/signup',
      variant: 'outline' as const,
    },
    {
      name: 'Mensuel',
      price: '10€',
      period: '/ mois',
      description: 'Pour tester sur un trimestre',
      features: [
        'Copies illimitées',
        'Export SACoche + Pronote',
        'Support prioritaire',
        'Sans engagement',
      ],
      cta: 'Choisir mensuel',
      ctaLink: '/login?plan=monthly',
      variant: 'outline' as const,
    },
    {
      name: 'Annuel Standard',
      price: '99€',
      period: '/ an',
      description: 'Pour les profs qui corrigent toute l\'année',
      features: [
        'Copies illimitées (brevet blanc, bac blanc, contrôles)',
        'Export SACoche + Pronote',
        'Stockage copies 30j (RGPD)',
        'Support prioritaire',
        '2 mois offerts vs mensuel',
      ],
      cta: 'Choisir annuel',
      ctaLink: '/login?plan=yearly',
      variant: 'outline' as const,
      highlight: false,
    },
    {
      name: 'Expert Bac/Brevet',
      price: '149€',
      period: '/ an',
      description: 'Pour les profs experts qui partagent leurs barèmes',
      features: [
        'Tout l\'Annuel Standard',
        'Bibliothèque de barèmes experts',
        'Correcteur calibré brevet/bac',
        'Mises à jour barèmes offertes',
        'Accès anticipé nouvelles features',
      ],
      cta: 'Devenir Expert',
      ctaLink: '/login?plan=expert',
      variant: 'default' as const,
      highlight: true,
    },
  ];

  return (
    <main className="min-h-screen bg-secondary/30">
      <div className="max-w-6xl mx-auto p-6 md:p-12 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Choisis ton forfait</h1>
          <p className="text-lg text-muted-foreground">
            Tous les forfaits incluent l'extraction automatique des réponses, l'export SACoche/Pronote, et la conformité RGPD.
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <span className="flex items-center gap-1">✓ Sans engagement</span>
            <span className="flex items-center gap-1">✓ Annulation 1-clic</span>
            <span className="flex items-center gap-1">✓ Données en Europe</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.name} className={tier.highlight ? 'border-primary border-2 relative' : ''}>
              {tier.highlight && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
                  Plus populaire
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
                <div className="pt-2">
                  <span className="text-3xl font-bold">{tier.price}</span>
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
            <CardTitle className="text-lg">Comparaison détaillée</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <p>• Copies illimitées = maximum 2 000 copies/mois (anti-abus). Au-delà, on te prévient et on discute.</p>
            <p>• Toutes les copies sont supprimées automatiquement après 30 jours (RGPD).</p>
            <p>• Tu peux exporter tes données à tout moment depuis ton compte.</p>
            <p>• Paiement sécurisé Stripe. On ne stocke aucune info de carte.</p>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Une question ? <Link href="/contact" className="underline">Contacte-nous</Link></p>
          <p className="mt-2">Outil de saisie administrative · Non destiné aux épreuves officielles · Conformité RGPD garantie</p>
        </div>
      </div>
    </main>
  );
}