import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, X, Clock, Brain, Shield, FileText, Camera, Heart } from 'lucide-react';

export default function WhyUsPage() {
  const comparison = [
    { feature: 'Extraction automatique', us: true, sacoche: false, pronote: false },
    { feature: 'Photo depuis le téléphone', us: true, sacoche: false, pronote: false },
    { feature: 'Reconnaissance d\'écriture fiable', us: true, sacoche: false, pronote: false },
    { feature: 'Notation auto vs barème', us: true, sacoche: false, pronote: false },
    { feature: 'Export SACoche', us: true, sacoche: true, pronote: false },
    { feature: 'Export Pronote', us: true, sacoche: false, pronote: true },
    { feature: 'Validation humaine obligatoire', us: true, sacoche: false, pronote: false },
    { feature: 'Mobile-friendly', us: true, sacoche: false, pronote: false },
    { feature: 'RGPD + données en Europe', us: true, sacoche: true, pronote: true },
    { feature: 'Gratuit', us: false, sacoche: true, pronote: false },
  ];

  const advantages = [
    {
      icon: Clock,
      title: '10x plus rapide',
      desc: '90 copies en 30 secondes au lieu de 3h de clics répétitifs.',
    },
    {
      icon: Brain,
      title: 'Le système propose, tu décides',
      desc: 'Tu gardes le contrôle. Le système propose, tu valides ou corriges.',
    },
    {
      icon: Camera,
      title: 'Photo de ton canapé',
      desc: 'Pas de scanner. Ton téléphone suffit, depuis ton salon à 23h.',
    },
    {
      icon: Shield,
      title: 'RGPD by design',
      desc: 'Données hébergées en Europe, suppression auto 30j, jamais utilisées pour entraîner des modèles.',
    },
    {
      icon: FileText,
      title: 'Compatible SACoche & Pronote',
      desc: 'On génère le CSV au bon format. Tu importes en 2 clics.',
    },
    {
      icon: Heart,
      title: 'Conçu par un prof pour les profs',
      desc: 'On sait que ton temps compte. Pas de fonctionnalités inutiles.',
    },
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-transparent border-b">
        <div className="max-w-4xl mx-auto p-8 md:p-12 text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Pourquoi <span className="text-primary italic">Copie Express</span> ?
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            On ne remplace pas SACoche ou Pronote.
            On t'évite 3h de clics par session d'évaluation.
          </p>
        </div>
      </section>

      {/* Avantages */}
      <section className="max-w-6xl mx-auto p-8 md:p-12">
        <h2 className="text-3xl font-bold text-center mb-8">6 raisons de nous essayer</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advantages.map((adv, i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-2">
                <adv.icon className="h-8 w-8 text-primary" />
                <h3 className="font-semibold text-lg">{adv.title}</h3>
                <p className="text-sm text-muted-foreground">{adv.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Comparaison */}
      <section className="bg-secondary/30 border-y">
        <div className="max-w-4xl mx-auto p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-2">Copie Express vs SACoche vs Pronote</h2>
          <p className="text-center text-muted-foreground mb-8">
            On ne remplace pas les outils officiels. On les complète.
          </p>

          <Card>
            <CardContent className="p-0">
              <table className="w-full text-sm">
                <thead className="bg-secondary border-b">
                  <tr>
                    <th className="text-left p-4 font-medium">Fonctionnalité</th>
                    <th className="text-center p-4 font-medium text-primary">Copie Express</th>
                    <th className="text-center p-4 font-medium">SACoche</th>
                    <th className="text-center p-4 font-medium">Pronote</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="p-4">{row.feature}</td>
                      <td className="p-4 text-center">
                        {row.us ? (
                          <Check className="h-5 w-5 text-green-600 inline" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 inline" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.sacoche ? (
                          <Check className="h-5 w-5 text-green-600 inline" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 inline" />
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {row.pronote ? (
                          <Check className="h-5 w-5 text-green-600 inline" />
                        ) : (
                          <X className="h-5 w-5 text-muted-foreground/30 inline" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <p className="text-xs text-muted-foreground text-center mt-4">
            * Comparaison basée sur les fonctionnalités principales. Ton cas d'usage spécifique peut varier.
          </p>
        </div>
      </section>

      {/* Témoignages placeholder */}
      <section className="max-w-4xl mx-auto p-8 md:p-12 text-center">
        <h2 className="text-3xl font-bold mb-8">Ils nous ont fait confiance</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm italic text-muted-foreground mb-3">
                "J'ai récupéré 2h sur mon brevet blanc. Le système a même trouvé des erreurs que j'avais manquées."
              </p>
              <p className="text-xs font-medium">— Marie, prof de maths, Lille</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm italic text-muted-foreground mb-3">
                "La photo de la pile de copies, depuis mon canapé à 23h, ça marche. Enfin."
              </p>
              <p className="text-xs font-medium">— Thomas, prof de SVT, Bordeaux</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm italic text-muted-foreground mb-3">
                "Mes collègues sont jaloux. J'ai corrigé mon bac blanc en 1h au lieu de 2 jours."
              </p>
              <p className="text-xs font-medium">— Catherine, prof de physique, Lyon</p>
            </CardContent>
          </Card>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          * Témoignages illustratifs. Bientôt remplacés par de vrais retours bêta.
        </p>
      </section>

      {/* CTA final */}
      <section className="bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto p-12 text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Prêt à récupérer 3h par évaluation ?
          </h2>
          <p className="text-lg opacity-90">
            10 copies gratuites, sans carte bancaire. Tu vois en 30 secondes si ça te convient.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Créer mon compte gratuit →</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link href="/pricing">Voir les tarifs</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}