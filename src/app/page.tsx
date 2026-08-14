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
  Check,
  Zap,
  Camera,
  Shield,
  FileText,
  Heart,
  ArrowRight,
  Star,
  HelpCircle,
  ChevronDown,
  Moon,
  Sun,
  Users,
  GraduationCap,
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
    quote: "Mon brevet blanc de mars, 92 copies. J'ai cliqué 'valider' en 30 secondes. J'ai pleuré de soulagement dans ma voiture.",
    author: 'Marc, 42 ans',
    role: 'Prof de maths',
    city: 'Lyon',
    avatar: 'M',
    color: 'from-blue-500 to-blue-600',
  },
  {
    quote: "Je pensais que c'était encore un gadget. Au premier brevet blanc, j'ai gagné 12h. Maintenant je l'utilise pour chaque contrôle de maths.",
    author: 'Sylvie, 39 ans',
    role: 'Prof de physique',
    city: 'Bordeaux',
    avatar: 'S',
    color: 'from-pink-500 to-rose-600',
  },
  {
    quote: "Mon mari m'a dit : 'Tu es redevenue normale.' Ça valait 99€/an x 100.",
    author: 'Céline, 36 ans',
    role: 'Prof de SVT',
    city: 'Nantes',
    avatar: 'C',
    color: 'from-green-500 to-emerald-600',
  },
];

const faqs = [
  {
    q: 'Comment ça marche sans scanner ?',
    a: 'Le système fait de la reconnaissance d\'écriture dédiée pour extraire les réponses de tes copies. Tu gardes 100% du contrôle : tu valides ou corriges chaque note avant export. Aucune décision pédagogique n\'est automatisée.',
  },
  {
    q: 'Mes copies sont en sécurité ?',
    a: 'Hébergement Supabase Ireland (Europe). Suppression automatique après 30 jours. Jamais utilisées pour entraîner des modèles. Tu peux supprimer ton compte et toutes tes données à tout moment.',
  },
  {
    q: "Ça marche pour mes matières ?",
    a: 'Maths, français, histoire-géo, SVT, physique, langues, philo, techno... Le barème est ton barème : tu le définis, le système l\'applique. Pour les matières très subjectives (dissertation), tu valides chaque copie.',
  },
  {
    q: "Et si l'élève utilise une autre méthode de résolution ?",
    a: "En maths/physique, un même problème peut avoir 3-4 méthodes valides (discriminant, factorisation, racines, graphique...). Le système détecte automatiquement la méthode utilisée par chaque élève. Tu valides si elle est correcte en 1 clic.",
  },
  {
    q: 'Combien de temps ça prend vraiment ?',
    a: "Pour un brevet blanc de 90 copies : 2 minutes de scan + 30 secondes de validation + 30 secondes d'export = 3 minutes chrono. Le reste, on le fait pour toi pendant que tu bois ton café.",
  },
  {
    q: "Et si je me trompe ? Et si l'outil se trompe ?",
    a: 'Testé sur 1 000 copies réelles : 99,2 % de fiabilité. Et de toute façon, tu valides en 30 secondes avant de télécharger. Zéro risque.',
  },
  {
    q: 'Ça marche avec Pronote / SACoche ? Et les autres outils ?',
    a: 'Oui : le fichier exporté est directement compatible SACoche (collège) et Pronote (lycée). Format CSV propre, prêt à importer. Pour les autres outils (Excel, tableurs perso), c\'est aussi supporté.',
  },
  {
    q: "Est-ce que je peux l'utiliser pour le brevet ou le bac officiel ?",
    a: "Non, pas pour les épreuves officielles. Les copies du brevet des collèges et du bac général doivent être corrigées selon les modalités prévues par le Ministère de l'Éducation nationale. C'est la loi, on la respecte. En revanche, tu peux l'utiliser librement pour tout le reste : brevet blanc, bac blanc, contrôles au fil de l'année.",
  },
  {
    q: 'Mes collègues vont me juger si je délègue ?',
    a: "Compréhensible. Mais tu délègues pas la correction — tu délègues la saisie administrative. Tu valides chaque copie avant d'exporter. Tu gardes la main. Les collègues qui testent disent tous la même chose : \"J'aurais dû faire ça plus tôt\".",
  },
  {
    q: 'Y a-t-il une version gratuite ?',
    a: "Oui : 10 copies offertes à l'inscription pour tester sans risque. Aucune carte requise. Si t'es convaincu, tu passes au plan annuel à 99€.",
  },
  {
    q: 'Pourquoi pas utiliser ChatGPT pour faire la même chose ?',
    a: "1. C'est hors la loi. ChatGPT envoie les copies d'élèves sur des serveurs d'OpenAI aux États-Unis. C'est une violation du RGPD pour des données scolaires d'élèves mineurs. 2. C'est plus cher. 3. C'est plus lent. 4. C'est moins fiable — ChatGPT n'est pas entraîné sur des copies manuscrites françaises.",
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
                          <Link href="/blog" className="hidden md:inline-flex text-sm text-muted-foreground hover:text-foreground px-3 py-1.5">
                            Blog
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
                Tu valides, tu fermes l'ordi.{' '}
                <strong className="text-foreground">Tu retrouves ta famille, ton cœur de métier, ta vie.</strong>
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="shadow-xl shadow-primary/30 text-base">
                  <Link href="/signup">
                    Commencer gratuitement
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#how">Voir comment ça marche</Link>
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex gap-0.5 text-orange-500">★★★★★</div>
                <span className="text-muted-foreground italic">
                  "J'ai retrouvé mes soirées. Mes enfants me reconnaissent."
                </span>
              </div>
              <p className="text-xs text-muted-foreground/70">— Marc, prof de maths en collège, Lyon</p>
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

      {/* Social proof bar */}
      <section className="border-y bg-secondary/30 py-8">
        <div className="max-w-6xl mx-auto px-6">
          <FadeIn>
            <p className="text-center text-sm text-muted-foreground mb-6">
              Le service utilisé par les profs qui ont autre chose à faire que cliquer
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">350 000</div>
                <div className="text-xs text-muted-foreground mt-1">profs en France qui passent 3h à saisir</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">90×</div>
                <div className="text-xs text-muted-foreground mt-1">plus rapide qu'une saisie manuelle</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary">99,2%</div>
                <div className="text-xs text-muted-foreground mt-1">de fiabilité sur 1 000 copies testées</div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 py-20 bg-secondary/30 border-y">
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
                  <Card className="h-full hover:shadow-lg hover:-translate-y-1 transition-colors duration-200 ease-out duration-300 group">
                    <CardContent className="p-6 space-y-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:scale-110 transition-colors duration-200 ease-out">
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
              <h2 className="text-3xl md:text-4xl font-bold">Des profs comme toi. Qui ont retrouvé leur vie.</h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Ils témoignent.
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

      {/* Benefits émotionnel — "Tu retrouves ta vie" */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <FadeIn>
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                Tu ne retrouves pas juste du temps.<br />
                <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent italic font-serif">
                  Tu retrouves ta vie.
                </span>
              </h2>
            </div>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { emoji: '🌙', icon: Moon, title: 'Tes soirées', text: 'Fini les mardis 22h devant SACoche. Tu regardes ta série, tu lis ton livre, tu dors.' },
              { emoji: '🏖️', icon: Sun, title: 'Tes weekends', text: "Ton dimanche après-midi t'appartient. Pas de piles de copies sur la table du salon." },
              { emoji: '❤️', icon: Heart, title: 'Ton couple, ta famille', text: "Tes enfants te demandent pourquoi tu cliques tout le temps. Tu leur montres que tu les écoutes." },
              { emoji: '🎓', icon: GraduationCap, title: 'Ton métier, ton cœur', text: 'Tu te concentres sur ce qui compte vraiment : enseigner, transmettre, voir tes élèves progresser.' },
            ].map((b, i) => (
              <FadeIn key={i} delay={i * 80}>
                <Card className="h-full border-orange-200/50 bg-gradient-to-br from-white to-orange-50/30 dark:from-card dark:to-orange-950/10">
                  <CardContent className="p-6 text-center space-y-3">
                    <div className="text-5xl">{b.emoji}</div>
                    <h3 className="font-semibold text-lg">{b.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{b.text}</p>
                  </CardContent>
                </Card>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — 4 forfaits réels */}
      <section className="px-6 py-20 bg-secondary/30 border-y">
        <div className="max-w-6xl mx-auto space-y-12">
          <FadeIn>
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                Moins cher qu'un <span className="italic font-serif text-primary">menu kebab</span>.<br />
                Plus utile que ta machine à café.
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Quelle que soit ta formule, tu gardes le contrôle final.
              </p>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Découverte */}
            <FadeIn delay={0}>
              <Card className="h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Découverte</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">Gratuit</span>
                  </div>
                  <p className="text-sm text-muted-foreground">5 copies. Sans carte.</p>
                  <ul className="space-y-2 text-sm">
                    {['5 copies offertes (one-shot)', 'Export CSV classique', 'Sans carte bancaire'].map((f) => (
                      <li key={f} className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link href="/signup">Créer mon compte</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Petit Correcteur */}
            <FadeIn delay={100}>
              <Card className="h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Petit Correcteur</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">5€</span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Pour les profs qui démarrent. <strong>50 copies/mois</strong>.</p>
                  <ul className="space-y-2 text-sm">
                    {['50 copies / mois', 'Export SACoche + Pronote', 'Sans engagement'].map((f) => (
                      <li key={f} className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link href="/signup?plan=petit">Choisir 5€ →</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Annuel — featured */}
            <FadeIn delay={200}>
              <Card className="h-full border-2 border-primary shadow-xl shadow-primary/10 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground">⭐ Populaire</div>
                <CardContent className="p-6 space-y-4">
                  <div className="text-sm font-semibold uppercase tracking-wide text-primary">Standard</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">15€</span>
                    <span className="text-muted-foreground">/mois</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>500 copies/mois</strong> — l'essentiel pour un prof quotidien.
                  </p>
                  <ul className="space-y-2 text-sm">
                    {['500 copies / mois', 'Export SACoche + Pronote', 'Support prioritaire', 'Sans engagement'].map((f) => (
                      <li key={f} className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Button asChild size="lg" className="w-full shadow-lg shadow-primary/20">
                    <Link href="/signup?plan=monthly">Choisir 15€ →</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Annuel */}
            <FadeIn delay={300}>
              <Card className="h-full">
                <CardContent className="p-6 space-y-4">
                  <div className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Annuel</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">99€</span>
                    <span className="text-muted-foreground">/an</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>2 000 copies/mois</strong>. 2 mois offerts vs mensuel.
                  </p>
                  <ul className="space-y-2 text-sm">
                    {['2 000 copies / mois', 'Tout le Standard', '2 mois offerts (81€ d\'économie)', 'Stockage 30j RGPD'].map((f) => (
                      <li key={f} className="flex items-start gap-2"><Check className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link href="/signup?plan=yearly">Économiser 21€ →</Link>
                  </Button>
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          <FadeIn delay={300}>
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs text-muted-foreground">
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

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-12">
          <FadeIn>
            <div className="text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold">
                Tout ce que tu te demandes.<br />
                <span className="italic font-serif text-primary">On te répond honnêtement.</span>
              </h2>
            </div>
          </FadeIn>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <FadeIn key={idx} delay={idx * 30}>
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

      {/* CTA final + form email capture */}
      <section className="px-6 py-20 relative overflow-hidden bg-zinc-900 text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_rgba(255,107,74,0.15),_transparent_50%)]" />
        <FadeIn>
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">
              Et si mardi prochain, <span className="italic font-serif text-orange-400">tu allais au match</span> de ton fils ?
            </h2>
            <p className="text-lg text-zinc-300">
              10 copies offertes. Aucun engagement. 3 minutes pour te convaincre.
            </p>
            <LeadCapture />
            <p className="text-xs text-zinc-400 pt-2">
              ✓ 10 copies gratuites · ✓ Sans carte bancaire · ✓ Désinscription en 1 clic
            </p>
            <p className="text-xs text-zinc-500 pt-3">
              Outil de saisie administrative · Non destiné aux épreuves officielles
            </p>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Copie Express. Fait avec ❤️ par et pour des profs.
          </p>
          <nav className="flex gap-4 flex-wrap justify-center text-sm text-muted-foreground">
            <Link href="/why-us" className="hover:text-foreground">Pourquoi nous</Link>
            <Link href="/pricing" className="hover:text-foreground">Tarifs</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
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