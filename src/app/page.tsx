import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';
import { Check, Zap, Camera, Shield, FileText, Heart, ArrowRight, Star } from 'lucide-react';

const features = [
  {
    icon: Zap,
    title: '10× plus rapide',
    desc: '90 copies en 30 secondes au lieu de 3h de clics répétitifs.',
  },
  {
    icon: Camera,
    title: 'Photo depuis ton canapé',
    desc: 'Pas de scanner. Ton téléphone suffit, depuis ton salon à 23h.',
  },
  {
    icon: Shield,
    title: 'RGPD by design',
    desc: 'Données hébergées en Europe, suppression auto 30j, jamais partagées.',
  },
  {
    icon: FileText,
    title: 'Compatible SACoche & Pronote',
    desc: 'CSV au bon format. Tu importes en 2 clics.',
  },
  {
    icon: Heart,
    title: 'Conçu pour les profs',
    desc: 'Par un prof, pour des profs. Pas de fonctionnalités inutiles.',
  },
  {
    icon: Check,
    title: 'Tu gardes le contrôle',
    desc: 'Le système propose, tu valides ou corriges en 1 clic.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/80 backdrop-blur sticky top-0 z-30">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            <span>Copie Express</span>
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/why-us" className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground px-3 py-1.5">
              Pourquoi nous
            </Link>
            <Link href="/pricing" className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground px-3 py-1.5">
              Tarifs
            </Link>
            <Button asChild variant="ghost">
              <Link href="/login">Connexion</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                Essai gratuit <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 md:py-32 relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl -z-10" />

        <FadeIn>
          <div className="max-w-4xl w-full text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Star className="h-3.5 w-3.5 fill-current" />
              10 copies gratuites, sans carte bancaire
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Redeviens un prof.
              <br />
              <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent italic font-serif">
                Pas une machine à cliquer.
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Brevet blanc, bac blanc, contrôles au fil de l'année —{' '}
              <strong className="text-foreground">90 copies en 30 secondes.</strong>
              <br />
              Tu valides, tu fermes l'ordi. Tu retrouves ta vie.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
              <Button asChild size="lg" className="shadow-xl shadow-primary/30 text-base">
                <Link href="/signup">
                  Commencer gratuitement
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/pricing">Voir les tarifs</Link>
              </Button>
            </div>

            <p className="text-sm text-muted-foreground pt-4">
              ✓ Sans carte bancaire · ✓ Sans engagement · ✓ RGPD + données Europe
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Features grid */}
      <section className="px-6 py-20 bg-secondary/30 border-y">
        <div className="max-w-6xl mx-auto space-y-12">
          <FadeIn>
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">Pourquoi ça marche</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Tout ce qu'il te faut. Rien de superflu.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <FadeIn key={f.title} delay={idx * 60}>
                  <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                    <CardContent className="p-6 space-y-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-all">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg">{f.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                    </CardContent>
                  </Card>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-20">
        <FadeIn>
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">
              Prêt à récupérer tes soirées ?
            </h2>
            <p className="text-xl text-muted-foreground">
              Rejoins les profs qui ont déjà repris le contrôle de leur temps.
            </p>
            <Button asChild size="lg" className="shadow-xl shadow-primary/30">
              <Link href="/signup">
                Créer mon compte gratuit
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
            <p className="text-xs text-muted-foreground pt-2">
              Outil de saisie administrative · Non destiné aux épreuves officielles
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 Copie Express · Tous droits réservés</p>
          <nav className="flex gap-4">
            <Link href="/legal/cgu" className="hover:text-foreground">CGU</Link>
            <Link href="/legal/cgv" className="hover:text-foreground">CGV</Link>
            <Link href="/legal/privacy" className="hover:text-foreground">Confidentialité</Link>
            <Link href="/legal/mentions" className="hover:text-foreground">Mentions légales</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}