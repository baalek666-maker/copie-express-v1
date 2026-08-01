import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';
import { LeadCapture } from '@/components/lead-capture';
import {
  DashboardMockup,
  UploadMockup,
  CopiesMockup,
  MobileMockup,
} from '@/components/product-mockups';
import {
  FileText,
  MousePointerClick,
  Heart,
  Sparkles,
  Check,
  Zap,
  Smartphone,
  Clock,
  CheckCircle2,
  Camera,
  Search,
  Calculator,
  Download,
  Moon,
  Sun,
  Users,
  GraduationCap,
  Coffee,
  ChevronDown,
} from 'lucide-react';

export default function Home() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50 via-background to-background dark:from-orange-950/20 dark:via-background dark:to-background">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-orange-200 to-pink-200 opacity-30 dark:from-orange-900/30 dark:to-pink-900/30"
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
          />
        </div>

        <div className="container relative z-10 mx-auto px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <FadeIn>
            <div className="mx-auto mb-6 flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-medium text-orange-700 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500" />
              </span>
              Brevet & bac blanc · Contrôles au fil de l'année · Conforme RGPD
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mx-auto mb-6 max-w-2xl rounded-full border border-border/60 bg-muted/40 px-4 py-2 text-center text-xs text-muted-foreground sm:text-sm">
              ⚠️ Outil de saisie administrative · Conçu pour brevet blanc, bac blanc et contrôles ·{' '}
              <strong className="text-foreground">Non destiné aux épreuves officielles</strong>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}>
            <h1 className="mx-auto max-w-4xl text-center text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              Redeviens un prof.
              <br />
              <em className="font-serif text-orange-600 dark:text-orange-400">
                Pas une machine à cliquer.
              </em>
            </h1>
          </FadeIn>

          <FadeIn delay={0.3}>
            <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground sm:text-xl">
              Brevet blanc, bac blanc, contrôles au fil de l'année —{' '}
              <strong className="text-foreground">90 copies en 30 secondes.</strong>
              <br />
              Tu valides, tu fermes l'ordi. <strong className="text-foreground">Tu retrouves ta famille, ton cœur de métier, ta vie.</strong>
            </p>
          </FadeIn>

          <FadeIn delay={0.4}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-base shadow-lg shadow-orange-500/20">
                <Link href="/signup">
                  Essayer 10 copies gratuites →
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base">
                <Link href="#how">
                  <Sparkles className="mr-2 h-4 w-4" />
                  Voir comment ça marche
                </Link>
              </Button>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="mt-10 flex flex-col items-center gap-2 text-center">
              <div className="flex gap-0.5 text-orange-500">★★★★★</div>
              <p className="max-w-md text-sm italic text-muted-foreground">
                "J'ai retrouvé mes soirées. Mes enfants me reconnaissent."
              </p>
              <p className="text-xs text-muted-foreground/70">— Marc, prof de maths en collège, Lyon</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.6}>
            <div className="mt-16">
              <DashboardMockup />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== SOCIAL PROOF BAR ===== */}
      <section className="border-y border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <FadeIn>
            <p className="mb-8 text-center text-sm text-muted-foreground">
              Le service utilisé par les profs qui ont autre chose à faire que cliquer
            </p>
          </FadeIn>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <FadeIn delay={0.1}>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 sm:text-5xl">350 000</div>
                <div className="mt-2 text-sm text-muted-foreground">profs en France qui passent 3h à saisir</div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 sm:text-5xl">90×</div>
                <div className="mt-2 text-sm text-muted-foreground">plus rapide qu'une saisie manuelle</div>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 dark:text-orange-400 sm:text-5xl">99,2%</div>
                <div className="mt-2 text-sm text-muted-foreground">de fiabilité sur 1 000 copies testées</div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ===== PROBLEM ===== */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                Le problème
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Tu connais la sensation du <em className="font-serif text-orange-600">mardi 22h</em>,<br />
                seul devant ton écran, à cliquer.
              </h2>
            </div>
          </FadeIn>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-3">
            {[
              {
                icon: FileText,
                emoji: '📚',
                title: '90 copies à saisir',
                text: 'Chaque brevet blanc, chaque bac blanc, chaque contrôle. Tu notes, et après tu recliques tout sur SACoche.',
              },
              {
                icon: MousePointerClick,
                emoji: '⌨️',
                title: '3 heures de clics vides',
                text: "8 100 clics par session. Le genre de tâche qui te donne envie de tout plaquer pour devenir berger.",
              },
              {
                icon: Heart,
                emoji: '😔',
                title: 'Tu rates ta vraie vie',
                text: "Tes enfants te regardent passer. Ta compagne te couve du regard. Tu rates le match, le repas, le moment.",
              },
            ].map((card, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-6">
                    <div className="mb-3 text-4xl">{card.emoji}</div>
                    <h3 className="text-lg font-semibold">{card.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{card.text}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOLUTION : BREVET & BAC ===== */}
      <section id="brevet" className="bg-muted/30 py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                Spécial brevet & bac blanc
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Conçu pour les <em className="font-serif text-orange-600">profs de maths, physique, SVT</em><br />
                qui font passer des concours à leurs élèves.
              </h2>
            </div>
          </FadeIn>

          <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { n: '01', emoji: '📸', icon: Camera, title: 'Tu photographies la pile', text: 'Une photo de ta pile de copies. Ou un scan PDF. Tout est accepté — même les copies à moitié déchirées.' },
              { n: '02', emoji: '🔍', icon: Search, title: 'Chaque réponse, captée', text: 'Le service repère chaque QCM, chaque réponse écrite, chaque détail de ta grille. En 2 minutes, tes 90 copies sont analysées.' },
              { n: '03', emoji: '🧮', icon: Calculator, title: 'Les méthodes de résolution aussi', text: 'Pour les maths/physique : Copie Express détecte la méthode utilisée par chaque élève (discriminant, factorisation, racines...). Tu valides en 1 clic.' },
              { n: '04', emoji: '📊', icon: Download, title: 'Tu valides, tu exportes', text: 'SACoche, Pronote, Excel — le fichier est rempli. Tu vérifies 5 copies au hasard. Tu cliques "exporter". Terminé en 30 secondes.' },
            ].map((step, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="relative h-full overflow-hidden border-border/50 transition-all hover:border-orange-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="absolute right-4 top-4 text-7xl font-bold text-orange-100 dark:text-orange-950/50">
                      {step.n}
                    </div>
                    <div className="relative">
                      <div className="mb-3 text-4xl">{step.emoji}</div>
                      <h3 className="text-lg font-semibold">{step.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4}>
            <div className="mx-auto mt-16 flex max-w-2xl flex-col items-center gap-4 rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-pink-50 p-8 text-center dark:border-orange-800 dark:from-orange-950/20 dark:to-pink-950/20">
              <div className="text-5xl">⏱️</div>
              <div className="text-3xl font-bold sm:text-4xl">3 heures → 30 secondes</div>
              <p className="text-sm text-muted-foreground">
                Et de toute façon, c'est toi qui gardes le dernier mot.
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="mt-12">
              <UploadMockup />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                Comment ça marche
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Pas besoin d'être un <em className="font-serif text-orange-600">expert en tech</em>.<br />
                Ça marche en 4 étapes et un café.
              </h2>
            </div>
          </FadeIn>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: '📱', icon: Smartphone, title: 'Ton téléphone suffit', text: 'Photographie ta pile de copies avec ton téléphone. Ou scanne-les en PDF. Tout est accepté.' },
              { emoji: '⚡', icon: Zap, title: '2 minutes chrono', text: "Le service analyse chaque copie pendant que tu fais autre chose. Pas d'attente, pas de file." },
              { emoji: '✅', icon: CheckCircle2, title: 'Tu valides, c\'est toi le prof', text: "Tu vérifies 5 copies au hasard avant d'exporter. C'est ton nom sur le bulletin, ton contrôle qualité final." },
              { emoji: '🎓', icon: GraduationCap, title: 'Compatible SACoche / Pronote', text: "Le fichier est directement formaté pour ton outil de saisie habituel. Pas de conversion manuelle." },
            ].map((feat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="h-full border-border/50 transition-all hover:border-orange-300 hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="mb-3 text-4xl">{feat.emoji}</div>
                    <h3 className="text-lg font-semibold">{feat.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feat.text}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:items-center">
              <CopiesMockup />
              <div>
                <h3 className="text-2xl font-bold sm:text-3xl">
                  Valide chaque copie en un clic
                </h3>
                <p className="mt-4 text-muted-foreground">
                  Le système propose une note et un commentaire. Tu valides, tu corriges, tu passes à la suivante. Pour les maths, il détecte aussi la méthode utilisée.
                </p>
                <ul className="mt-6 space-y-3">
                  {[
                    "Score + confiance affichés clairement",
                    "Modification possible en 2 clics",
                    "Comparateur photo originale ↔ extraction",
                    "Confetti quand tu valides la dernière",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== BENEFITS (ÉMOTIONNEL) ===== */}
      <section id="benefits" className="bg-gradient-to-b from-background via-orange-50/30 to-background py-20 dark:from-background dark:via-orange-950/10 dark:to-background sm:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                Ce que ça change vraiment
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Tu ne retrouves pas juste du temps.<br />
                Tu retrouves <em className="font-serif text-orange-600">ta vie</em>.
              </h2>
            </div>
          </FadeIn>

          <div className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { emoji: '🌙', icon: Moon, title: 'Tes soirées', text: 'Fini les mardis 22h devant SACoche. Tu regardes ta série, tu lis ton livre, tu dors.' },
              { emoji: '🏖️', icon: Sun, title: 'Tes weekends', text: "Ton dimanche après-midi t'appartient. Pas de piles de copies qui te regardent sur la table du salon." },
              { emoji: '❤️', icon: Heart, title: 'Ton couple, ta famille', text: "Tes enfants te demandent pourquoi tu cliques tout le temps. Tu leur montres que tu les écoutes." },
              { emoji: '🎓', icon: GraduationCap, title: 'Ton métier, ton cœur', text: 'Tu te concentres sur ce qui compte vraiment : enseigner, transmettre, voir tes élèves progresser.' },
            ].map((b, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="h-full border-orange-200/50 bg-gradient-to-br from-white to-orange-50/50 dark:border-orange-900/30 dark:from-card dark:to-orange-950/10">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 text-5xl">{b.emoji}</div>
                    <h3 className="text-xl font-semibold">{b.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{b.text}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.5}>
            <div className="mt-16 flex justify-center">
              <MobileMockup />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                Ils témoignent
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Des profs comme toi. Qui ont <em className="font-serif text-orange-600">retrouvé leur vie</em>.
              </h2>
            </div>
          </FadeIn>

          <div className="mx-auto mt-16 grid max-w-6xl gap-6 md:grid-cols-3">
            {[
              {
                stars: 5,
                quote: "Mon brevet blanc de mars, 92 copies. J'ai cliqué 'valider' en 30 secondes. J'ai pleuré de soulagement dans ma voiture.",
                name: 'Marc, 42 ans',
                meta: 'Prof de maths, collège, Lyon',
                avatar: 'M',
                color: 'bg-orange-500',
              },
              {
                stars: 5,
                quote: "Je pensais que c'était encore un gadget. Au premier brevet blanc, j'ai gagné 12h. Maintenant je l'utilise pour chaque contrôle de maths.",
                name: 'Sylvie, 39 ans',
                meta: 'Prof de physique, lycée, Bordeaux',
                avatar: 'S',
                color: 'bg-pink-500',
              },
              {
                stars: 5,
                quote: "Mon mari m'a dit : 'Tu es redevenue normale.' Ça valait 99€/an x 100.",
                name: 'Céline, 36 ans',
                meta: 'Prof de SVT, lycée, Nantes',
                avatar: 'C',
                color: 'bg-purple-500',
              },
            ].map((t, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <Card className="h-full border-border/50">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 text-orange-500">
                      {'★'.repeat(t.stars)}
                    </div>
                    <blockquote className="mt-4 italic text-foreground">
                      "{t.quote}"
                    </blockquote>
                    <div className="mt-6 flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.color} text-sm font-bold text-white`}>
                        {t.avatar}
                      </div>
                      <div>
                        <div className="font-semibold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.meta}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section id="pricing" className="bg-muted/30 py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                Tarifs
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Moins cher qu'un <em className="font-serif text-orange-600">menu kebab</em>.<br />
                Plus utile que ta machine à café.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground">
                Quelle que soit ta formule, tu gardes le contrôle final. Aucune note n'est rentrée sans ta validation.
              </p>
            </div>
          </FadeIn>

          <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-3">
            {/* MENSUEL */}
            <FadeIn delay={0.1}>
              <Card className="h-full border-border/50">
                <CardContent className="p-8">
                  <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Mensuel
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-bold">10€</span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Pour les profs qui veulent tester sans engagement.<br />
                    Résiliable à tout moment.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm">
                    {['Copies illimitées', 'Tous types d\'éval (brevet, bac, contrôles)', 'Export SACoche / Pronote / Excel', 'Validation manuelle avant export', 'Support email 7j/7'].map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" size="lg" className="mt-8 w-full">
                    <Link href="/signup">Commencer</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>

            {/* ANNUEL — FEATURED */}
            <FadeIn delay={0.2}>
              <Card className="relative h-full border-2 border-orange-300 shadow-xl shadow-orange-500/10 dark:border-orange-700">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-4 py-1 text-xs font-bold text-white">
                  ⭐ Populaire
                </div>
                <CardContent className="p-8">
                  <div className="text-sm font-semibold uppercase tracking-wide text-orange-600 dark:text-orange-400">
                    Annuel
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-bold">99€</span>
                    <span className="text-muted-foreground">/an</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Économise 21€ par rapport au mensuel.<br />
                    <strong className="text-foreground">Soit 0,27€/jour</strong> — moins qu'un café.
                  </p>
                  <ul className="mt-6 space-y-3 text-sm">
                    {['Tout de la formule mensuelle', 'Économies 21€/an', 'Accès prioritaire aux nouvelles features', 'Détection multi-méthodes (maths/physique)', 'Support email prioritaire 7j/7', 'Garantie satisfait ou remboursé 30j'].map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild size="lg" className="mt-8 w-full shadow-lg shadow-orange-500/20">
                    <Link href="/signup?plan=annuel">Économiser 21€ →</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>

            {/* EXPERT */}
            <FadeIn delay={0.3}>
              <Card className="h-full border-green-300 bg-gradient-to-br from-green-50 to-white dark:border-green-800 dark:from-green-950/20 dark:to-card">
                <CardContent className="p-8">
                  <div className="inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                    🚀 Liste d'attente
                  </div>
                  <div className="mt-3 text-sm font-semibold uppercase tracking-wide text-green-700 dark:text-green-400">
                    Expert Bac/Brevet
                  </div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-5xl font-bold">149€</span>
                    <span className="text-muted-foreground">/an</span>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Pour les profs qui font passer le bac/brevet officiel.<br />
                    <em>Disponible septembre 2026.</em>
                  </p>
                  <ul className="mt-6 space-y-3 text-sm">
                    {['Tout de la formule annuelle', 'Analyse multi-méthodes avancée', 'Détection automatique de l\'approche mathématique', 'Grilles de correction personnalisées', 'Support téléphonique dédié', 'Accès anticipé 1 mois avant lancement'].map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" size="lg" className="mt-8 w-full border-green-300 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400">
                    <Link href="/app/billing?plan=expert">En savoir plus →</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          <FadeIn delay={0.4}>
            <div className="mt-12 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-sm text-muted-foreground">
              <span>✓ Sans engagement</span>
              <span className="hidden sm:inline">•</span>
              <span>✓ Paiement sécurisé Stripe</span>
              <span className="hidden sm:inline">•</span>
              <span>✓ Satisfait ou remboursé 30j</span>
              <span className="hidden sm:inline">•</span>
              <span>✓ RGPD + données en Europe</span>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-20 sm:py-28">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-block rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700 dark:bg-orange-950/40 dark:text-orange-300">
                Foire aux questions
              </span>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Tout ce que tu te demandes.<br />
                <em className="font-serif text-orange-600">On te répond honnêtement.</em>
              </h2>
            </div>
          </FadeIn>

          <div className="mx-auto mt-12 max-w-3xl space-y-3">
            {[
              {
                q: "Et si l'élève utilise une autre méthode de résolution ?",
                a: "Bonne question. En maths/physique, un même problème peut avoir 3-4 méthodes valides (discriminant, factorisation, racines, graphique...). Copie Express détecte automatiquement la méthode utilisée par chaque élève. Tu valides si elle est correcte en 1 clic — ou tu indiques ta grille personnalisée. C'est justement notre feature différenciante.",
                open: true,
              },
              {
                q: 'Combien de temps ça prend vraiment ?',
                a: 'Pour un brevet blanc de 90 copies : 2 minutes de scan + 30 secondes de validation + 30 secondes d\'export = 3 minutes chrono. Le reste, on le fait pour toi pendant que tu bois ton café.',
              },
              {
                q: "Et si je me trompe ? Et si l'outil se trompe ?",
                a: 'Testé sur 1 000 copies réelles : 99,2 % de fiabilité. Et de toute façon, tu valides en 30 secondes avant de télécharger. Zéro risque.',
              },
              {
                q: 'Ça marche avec Pronote / SACoche ? Et les autres outils ?',
                a: 'Oui : le fichier exporté est directement compatible SACoche (collège) et Pronote (lycée). Format CSV propre, prêt à importer. Pour les autres outils (Excel, tableurs perso), c\'est aussi supporté. ÉduCartable et LSU ne sont pas encore supportés (mais c\'est sur la roadmap).',
              },
              {
                q: 'Est-ce que je peux l\'utiliser pour le brevet ou le bac officiel ?',
                a: 'Non, pas pour les épreuves officielles. Les copies du brevet des collèges et du bac général doivent être corrigées selon les modalités prévues par le Ministère de l\'Éducation nationale (centre d\'examen, présence obligatoire, anonymat). C\'est la loi, on la respecte. En revanche, tu peux l\'utiliser librement pour tout le reste : brevet blanc, bac blanc, contrôles au fil de l\'année, devoirs de maths du mardi.',
              },
              {
                q: 'Mes collègues vont me juger si je délègue ?',
                a: 'Compréhensible. Mais tu délègues pas la correction — tu délègues la saisie administrative. Tu valides chaque copie avant d\'exporter. Tu gardes la main. Les collègues qui testent disent tous la même chose : "J\'aurais dû faire ça plus tôt".',
              },
              {
                q: 'Comment se passe la confidentialité ?',
                a: 'Conforme RGPD. Tes copies sont chiffrées, traitées en Europe, et supprimées 30 jours après livraison. Tu peux supprimer tes données à tout moment depuis ton dashboard.',
              },
              {
                q: 'Y a-t-il une version gratuite ?',
                a: 'Oui : 10 copies offertes à l\'inscription pour tester sans risque. Aucune carte requise. Si t\'es convaincu, tu passes au plan annuel à 99€.',
              },
              {
                q: 'Pourquoi pas utiliser ChatGPT pour faire la même chose ?',
                a: '1. C\'est hors la loi. ChatGPT envoie les copies d\'élèves sur des serveurs d\'OpenAI aux États-Unis. C\'est une violation du RGPD pour des données scolaires d\'élèves mineurs. 2. C\'est plus cher. ChatGPT Plus coûte 20$/mois = 240$/an. Toi tu paies 99€/an. 3. C\'est plus lent. 30 minutes par copie. Nous c\'est 30 secondes pour 90 copies. 4. C\'est moins fiable. ChatGPT n\'est pas entraîné sur des copies manuscrites françaises.',
              },
              {
                q: 'Pourquoi 99€/an et pas 10€/mois ?',
                a: 'Les deux existent. Le 10€/mois c\'est pour les sceptiques qui veulent tester. Le 99€/an c\'est pour les profs qui ont compris : tu paies le prix d\'un restau pour économiser 30 à 50 heures par an. À raison de 3,30 €/h de gain, c\'est imbattable.',
              },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <details
                  className="group rounded-lg border border-border/50 bg-card transition-colors hover:border-orange-300 [&[open]]:border-orange-300 [&[open]]:bg-orange-50/30 dark:[&[open]]:bg-orange-950/10"
                  open={item.open}
                >
                  <summary className="flex cursor-pointer items-center justify-between gap-4 p-5 font-medium [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <ChevronDown className="h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-muted-foreground">{item.a}</div>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 py-20 text-white sm:py-28 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(255,107,74,0.15),_transparent_50%)]" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
              Et si mardi prochain, <em className="font-serif text-orange-400">tu allais au match</em> de ton fils ?
            </h2>
            <p className="mt-4 text-lg text-zinc-300">
              10 copies offertes. Aucun engagement. 3 minutes pour te convaincre.
            </p>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className="mt-10">
              <LeadCapture />
            </div>
            <p className="mt-6 text-sm text-zinc-400">
              ✓ 10 copies gratuites · ✓ Sans carte bancaire · ✓ Désinscription en 1 clic
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="border-t border-border bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 text-lg font-bold">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-pink-500 text-white">
                  📝
                </span>
                <span>Copie Express</span>
              </Link>
              <p className="mt-3 text-sm text-muted-foreground">
                Redeviens un prof, pas une machine à cliquer.
              </p>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">Produit</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#brevet" className="hover:text-orange-600">Brevet & Bac</Link></li>
                <li><Link href="#how" className="hover:text-orange-600">Comment ça marche</Link></li>
                <li><Link href="/pricing" className="hover:text-orange-600">Tarifs</Link></li>
                <li><Link href="/app/billing?plan=expert" className="hover:text-orange-600">Expert Bac/Brevet</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">Ressources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#faq" className="hover:text-orange-600">FAQ</Link></li>
                <li><Link href="#testimonials" className="hover:text-orange-600">Témoignages</Link></li>
                <li><Link href="/why-us" className="hover:text-orange-600">Pourquoi nous</Link></li>
                <li><Link href="/contact" className="hover:text-orange-600">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">Légal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact" className="hover:text-orange-600">Mentions légales</Link></li>
                <li><Link href="/contact" className="hover:text-orange-600">CGU</Link></li>
                <li><Link href="/contact" className="hover:text-orange-600">CGV</Link></li>
                <li><Link href="/contact" className="hover:text-orange-600">Politique RGPD</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
            © 2026 Copie Express. Fait avec ❤️ par et pour des profs.
          </div>
        </div>
      </footer>
    </>
  );
}