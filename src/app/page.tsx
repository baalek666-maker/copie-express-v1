import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';
import { DashboardMockup, UploadMockup, CopiesMockup, MobileMockup } from '@/components/product-mockups';
import {
  Check, Zap, Camera, Shield, FileText, Heart, ArrowRight, Star,
  Clock, MessageCircle, HelpCircle, ChevronDown
} from 'lucide-react';

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

const testimonials = [
  {
    quote: 'J\'ai retrouvé mes week-ends. Le brevet blanc de 3e que je repoussais depuis 2 semaines ? Corrigé en une soirée.',
    author: 'Mathieu L.',
    role: 'Prof de maths · Collège',
    city: 'Lyon',
    avatar: 'M',
    color: 'from-blue-500 to-blue-600',
  },
  {
    quote: 'Je photographie depuis mon canapé à 22h pendant que ma série tourne. Fini les dimanches perdus à scanner.',
    author: 'Sophie D.',
    role: 'Prof de français · Lycée',
    city: 'Bordeaux',
    avatar: 'S',
    color: 'from-pink-500 to-rose-600',
  },
  {
    quote: 'L\'export SACoche est parfait. Je clique, je récupère mes notes dans SACoche. Zéro ressaisie.',
    author: 'Karim B.',
    role: 'Prof de SVT · Collège',
    city: 'Marseille',
    avatar: 'K',
    color: 'from-green-500 to-emerald-600',
  },
];

const faqs = [
  {
    q: 'Est-ce vraiment sans IA ?',
    a: 'Le système fait de la reconnaissance d\'écriture (OCR) pour extraire les réponses de tes copies. Tu gardes 100% du contrôle : tu valides ou corriges chaque note avant export. Aucune décision pédagogique n\'est automatisée.',
  },
  {
    q: 'Mes copies sont en sécurité ?',
    a: 'Hébergement Supabase Ireland (Europe). Suppression automatique après 30 jours. Jamais utilisées pour entraîner des modèles. Tu peux supprimer ton compte et toutes tes données à tout moment.',
  },
  {
    q: 'Ça marche pour mes matières ?',
    a: 'Maths, français, histoire-géo, SVT, physique, langues, philo, techno... Le barème est ton barème : tu le définis, le système l\'applique. Pour les matières très subjectives (dissertation), tu valides chaque copie.',
  },
  {
    q: 'Et si je n\'ai pas de barème ?',
    a: 'Pas de souci. Le système propose une notation indicative basée sur le sujet. Tu valides ou ajustes. C\'est moins précis qu\'avec un barème, mais ça reste 5× plus rapide que la correction manuelle.',
  },
  {
    q: 'Compatible avec Pronote et SACoche ?',
    a: 'Oui. Exports CSV aux formats SACoche et Pronote. Tu importes en 2 clics, comme n\'importe quel tableur.',
  },
  {
    q: 'Puis-je annuler à tout moment ?',
    a: 'Oui, sans engagement. Annulation 1-clic depuis ton compte. Remboursement sous 14 jours si tu changes d\'avis (droit de rétractation).',
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
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl -z-10" />

        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          <FadeIn>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Star className="h-3.5 w-3.5 fill-current" />
                10 copies gratuites, sans carte bancaire
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Redeviens un prof.
                <br />
                <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent italic font-serif">
                  Pas une machine à cliquer.
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Brevet blanc, bac blanc, contrôles au fil de l'année —{' '}
                <strong className="text-foreground">90 copies en 30 secondes.</strong>
                <br />
                Tu valides, tu fermes l'ordi. Tu retrouves ta vie.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
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

              <p className="text-sm text-muted-foreground">
                ✓ Sans carte bancaire · ✓ Sans engagement · ✓ RGPD + données Europe
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={200}>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 to-orange-500/20 rounded-2xl blur-2xl -z-10" />
              <DashboardMockup />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-secondary/30 border-y">
        <div className="max-w-6xl mx-auto space-y-16">
          <FadeIn>
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">Comment ça marche</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                3 étapes. 30 secondes par copie. Zéro compétence technique.
              </p>
            </div>
          </FadeIn>

          <div className="space-y-20">
            {/* Step 1 */}
            <FadeIn>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                    Tu photographies
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">Photographie depuis ton canapé</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Pas besoin de scanner. Prends tes copies en photo depuis ton téléphone — ou un dossier de scans si tu préfères.
                    PDF, Word, PowerPoint : on accepte tout.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> JPEG, PNG, PDF, DOCX, XLSX, PPTX</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Photo via téléphone, ou drag & drop depuis ton ordi</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> 100 copies en une fois</li>
                  </ul>
                </div>
                <div className="order-first lg:order-last">
                  <UploadMockup />
                </div>
              </div>
            </FadeIn>

            {/* Step 2 */}
            <FadeIn delay={100}>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <CopiesMockup />
                </div>
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                    Le système extrait
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">Le système lit, tu valides</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Pour chaque copie, le système extrait les réponses et propose une note selon ton barème.
                    Tu vérifies la photo à côté, tu valides ou corriges en 1 clic.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Tu vois la photo + l'extraction côte à côte</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Confiance affichée pour chaque réponse</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Tu peux modifier avant de valider</li>
                  </ul>
                </div>
              </div>
            </FadeIn>

            {/* Step 3 */}
            <FadeIn delay={200}>
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                    Tu exportes
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold">CSV au bon format</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Télécharge un CSV au format SACoche ou Pronote. Tu l'importes directement dans ton logiciel de gestion scolaire.
                    Zéro ressaisie, zéro copier-coller.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Export SACoche avec matières, classes, appréciations</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Export Pronote avec notes et appréciations auto</li>
                    <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-600" /> Compatible Excel, Numbers, tableurs</li>
                  </ul>
                </div>
                <div className="order-first lg:order-last flex justify-center">
                  <MobileMockup />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="px-6 py-20">
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

      {/* Testimonials */}
      <section className="px-6 py-20 bg-secondary/30 border-y">
        <div className="max-w-6xl mx-auto space-y-12">
          <FadeIn>
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 text-yellow-600">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" />
                ))}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Ce que disent les profs</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Ils ont retrouvé leurs soirées.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <FadeIn key={idx} delay={idx * 100}>
                <Card className="h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center gap-1 text-yellow-600">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm leading-relaxed italic text-foreground">
                      « {t.quote} »
                    </p>
                    <div className="flex items-center gap-3 pt-2 border-t">
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.color} text-white flex items-center justify-center font-bold shrink-0`}>
                        {t.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold">{t.author}</p>
                        <p className="text-xs text-muted-foreground">{t.role} · {t.city}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-12">
          <FadeIn>
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">Questions fréquentes</h2>
              <p className="text-lg text-muted-foreground">
                Tout ce qu'il faut savoir avant de se lancer.
              </p>
            </div>
          </FadeIn>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FadeIn key={idx} delay={idx * 50}>
                <details className="group rounded-lg border bg-card hover:shadow-md transition-shadow">
                  <summary className="cursor-pointer p-4 font-medium flex items-center gap-2 list-none">
                    <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                    <span className="flex-1">{faq.q}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground group-open:rotate-180 transition-transform shrink-0" />
                  </summary>
                  <div className="px-4 pb-4 pl-10 text-sm text-muted-foreground leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-orange-500/10" />
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
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}