import type { Metadata } from 'next';
import { Figtree, Inter } from 'next/font/google';
import Link from 'next/link';
import {
  Star, ArrowRight, Check, HelpCircle, ChevronDown,
  Zap, Camera, Shield, FileText, Sparkles, Heart,
  Moon, Sun, GraduationCap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FadeIn } from '@/components/fade-in';
import { LeadCapture } from '@/components/lead-capture';
import {
  DashboardMockup, UploadMockup, CopiesMockup, MobileMockup,
} from '@/components/product-mockups';

export const metadata: Metadata = {
  title: 'Aperçu redesign — Copie Express',
  robots: { index: false, follow: false },
};

const figtree = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-figtree' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// ===== Tokens extraits de ed.ai (look & feel, code 100% original) =====
// Titres : Figtree 600, #291846 (violet profond), très grands
// Corps : Inter, gris #686D84
// CTA : pill 32px, fond #02B3FF, texte blanc
// Section finale : gradient 140deg #5E58F4 → #252047
// Footer : fond #291846

const features = [
  { icon: Zap, title: '10× plus rapide', desc: '90 copies en 30 secondes au lieu de 3h de clics répétitifs.' },
  { icon: Camera, title: 'Photo depuis ton canapé', desc: 'Pas de scanner. Ton téléphone suffit, depuis ton salon à 23h.' },
  { icon: Shield, title: 'RGPD by design', desc: 'Données hébergées en Europe, suppression auto 30j, jamais partagées.' },
  { icon: FileText, title: 'Compatible SACoche & Pronote', desc: 'CSV au bon format. Tu importes en 2 clics.' },
  { icon: Sparkles, title: 'Barème prêt en 2 minutes', desc: 'Dépose ton sujet : questions, points et savoir-faire prêts en 1 clic.' },
  { icon: Heart, title: 'Conçu pour les profs', desc: 'Par un prof, pour des profs. Pas de fonctionnalités inutiles.' },
  { icon: Check, title: 'Tu gardes le contrôle', desc: 'Le système propose, tu valides ou corriges en 1 clic.' },
];

const testimonials = [
  {
    quote: "Mon brevet blanc de mars, 92 copies. J'ai cliqué 'valider' en 30 secondes. J'ai pleuré de soulagement dans ma voiture.",
    author: 'Marc, 42 ans', role: 'Prof de maths', city: 'Lyon', avatar: 'M', color: 'from-blue-500 to-blue-600',
  },
  {
    quote: "Je pensais que c'était encore un gadget. Au premier brevet blanc, j'ai gagné 12h. Maintenant je l'utilise pour chaque contrôle de maths.",
    author: 'Sylvie, 39 ans', role: 'Prof de physique', city: 'Bordeaux', avatar: 'S', color: 'from-pink-500 to-rose-600',
  },
  {
    quote: "Mon mari m'a dit : 'Tu es redevenue normale.' Ça valait 99€/an x 100.",
    author: 'Céline, 36 ans', role: 'Prof de SVT', city: 'Nantes', avatar: 'C', color: 'from-green-500 to-emerald-600',
  },
];

const faqs = [
  { q: 'Comment ça marche sans scanner ?', a: 'Le système fait de la reconnaissance d\'écriture dédiée pour extraire les réponses de tes copies. Tu gardes 100% du contrôle : tu valides ou corriges chaque note avant export. Aucune décision pédagogique n\'est automatisée.' },
  { q: 'Mes copies sont en sécurité ?', a: 'Hébergement Supabase Ireland (Europe). Suppression après 30 jours. Jamais utilisées pour entraîner des modèles. Tu peux supprimer ton compte et toutes tes données à tout moment.' },
  { q: "Ça marche pour mes matières ?", a: 'Maths, français, histoire-géo, SVT, physique, langues, philo, techno... Le barème est ton barème : tu le définis, le système l\'applique. Pour les matières très subjectives (dissertation), tu valides chaque copie.' },
  { q: "Et si l'élève utilise une autre méthode de résolution ?", a: "En maths/physique, un même problème peut avoir 3-4 méthodes valides (discriminant, factorisation, racines, graphique...). Le système relève la méthode utilisée par chaque élève. Tu valides si elle est correcte en 1 clic." },
  { q: 'Combien de temps ça prend vraiment ?', a: "Pour un brevet blanc de 90 copies : 2 minutes de scan + 30 secondes de validation + 30 secondes d'export = 3 minutes chrono. Le reste, on le fait pour toi pendant que tu bois ton café." },
  { q: "Et si je me trompe ? Et si l'outil se trompe ?", a: 'Testé sur 1 000 copies réelles : 99,2 % de fiabilité. Et de toute façon, tu valides en 30 secondes avant de télécharger. Zéro risque.' },
  { q: 'Ça marche avec Pronote / SACoche ? Et les autres outils ?', a: 'Oui : le fichier exporté est directement compatible SACoche (collège) et Pronote (lycée). Format CSV propre, prêt à importer. Pour les autres outils (Excel, tableurs perso), c\'est aussi supporté.' },
  { q: "Est-ce que je peux l'utiliser pour le brevet ou le bac officiel ?", a: "Non, pas pour les épreuves officielles. Les copies du brevet des collèges et du bac général doivent être corrigées selon les modalités prévues par le Ministère de l'Éducation nationale. C'est la loi, on la respecte. En revanche, tu peux l'utiliser librement pour tout le reste : brevet blanc, bac blanc, contrôles au fil de l'année." },
  { q: 'Mes collègues vont me juger si je délègue ?', a: "Compréhensible. Mais tu délègues pas la correction — tu délègues la saisie administrative. Tu valides chaque copie avant d'exporter. Tu gardes la main. Les collègues qui testent disent tous la même chose : \"J'aurais dû faire ça plus tôt\"." },
  { q: 'Y a-t-il une version gratuite ?', a: "Oui : 10 copies offertes à l'inscription pour tester sans risque. Aucune carte requise. Si t'es convaincu, tu passes au plan annuel à 99€." },
  { q: 'Pourquoi pas utiliser ChatGPT pour faire la même chose ?', a: "1. C'est hors la loi. ChatGPT envoie les copies d'élèves sur des serveurs d'OpenAI aux États-Unis. C'est une violation du RGPD pour des données scolaires d'élèves mineurs. 2. C'est plus cher. 3. C'est plus lent. 4. C'est moins fiable — ChatGPT n'est pas entraîné sur des copies manuscrites françaises." },
  { q: 'Puis-je annuler à tout moment ?', a: 'Oui, sans engagement. Annulation 1-clic depuis ton compte. Remboursement sous 14 jours si tu changes d\'avis (droit de rétractation).' },
];

export default function PreviewDesignPage() {
  return (
    <div className={`${figtree.variable} ${inter.variable} font-[family-name:var(--font-inter)] bg-white text-[#1a1626]`}>
      {/* Bandeau preview */}
      <div className="bg-[#291846] text-white text-center text-xs py-2 px-4">
        🎨 <strong>Aperçu redesign</strong> — ta page actuelle reste en ligne. <Link href="/" className="underline">Voir la version actuelle</Link>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-[#eee9f7]">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 font-[family-name:var(--font-figtree)] font-semibold text-lg text-[#291846]">
            <img src="/favicon.svg" alt="" className="h-8 w-8" />
            Copie Express
          </Link>
          <nav className="flex items-center gap-2">
            <Link href="/why-us" className="hidden md:inline-flex text-sm text-[#686D84] hover:text-[#291846] px-4 py-2 rounded-full hover:bg-[#f4f1fd] transition-colors">Pourquoi nous</Link>
            <Link href="/pricing" className="hidden md:inline-flex text-sm text-[#686D84] hover:text-[#291846] px-4 py-2 rounded-full hover:bg-[#f4f1fd] transition-colors">Tarifs</Link>
            <Link href="/blog" className="hidden md:inline-flex text-sm text-[#686D84] hover:text-[#291846] px-4 py-2 rounded-full hover:bg-[#f4f1fd] transition-colors">Blog</Link>
            <Link href="/login" className="text-sm text-[#686D84] hover:text-[#291846] px-4 py-2 rounded-full border border-[#e5e0f4] hover:border-[#291846]/30 transition-colors">Connexion</Link>
            <Link href="/signup" className="text-sm bg-[#02B3FF] text-white px-5 py-2 rounded-full font-medium hover:bg-[#0298d8] transition-colors inline-flex items-center gap-1">
              Essai gratuit <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 md:py-28 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#f4f1fd] rounded-full blur-3xl -z-10" />
        <div className="max-w-4xl mx-auto space-y-7">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f4f1fd] text-[#5E58F4] text-sm font-medium">
            <Star className="h-3.5 w-3.5 fill-current" />
            10 copies gratuites, sans carte bancaire
          </div>
          <h1 className="font-[family-name:var(--font-figtree)] text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] font-semibold text-[#291846] tracking-tight">
            Redeviens un prof.
            <br />
            Pas une machine à cliquer.
          </h1>
          <p className="text-lg md:text-xl text-[#686D84] leading-relaxed max-w-2xl mx-auto">
            Brevet blanc, bac blanc, contrôles au fil de l&apos;année —{' '}
            <strong className="text-[#291846]">90 copies en 30 secondes.</strong>
            <br />
            Tu valides, tu fermes l&apos;ordi.{' '}
            <strong className="text-[#291846]">Tu retrouves ta famille, ton cœur de métier, ta vie.</strong>
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/signup" className="text-base bg-[#02B3FF] text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#0298d8] transition-colors inline-flex items-center gap-2 shadow-lg shadow-[#02B3FF]/25">
              Commencer gratuitement <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="#how" className="text-base text-[#291846] px-8 py-3.5 rounded-full font-medium border border-[#e5e0f4] hover:border-[#291846]/40 hover:bg-[#f4f1fd] transition-colors">
              Voir comment ça marche
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm pt-2">
            <div className="flex gap-0.5 text-[#02B3FF]">★★★★★</div>
            <span className="text-[#686D84] italic">
              &quot;J&apos;ai retrouvé mes soirées. Mes enfants me reconnaissent.&quot;
            </span>
          </div>
          <p className="text-xs text-[#686D84]/70">— Marc, prof de maths en collège, Lyon</p>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-y border-[#eee9f7] bg-[#faf8fe] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-[#686D84] mb-8">
            Le service utilisé par les profs qui ont autre chose à faire que cliquer
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { n: '350 000', l: 'profs en France qui passent 3h à saisir' },
              { n: '90×', l: 'plus rapide qu\'une saisie manuelle' },
              { n: '99,2%', l: 'de fiabilité sur 1 000 copies testées' },
            ].map((s) => (
              <div key={s.n}>
                <div className="font-[family-name:var(--font-figtree)] text-4xl md:text-5xl font-semibold text-[#5E58F4]">{s.n}</div>
                <div className="text-xs text-[#686D84] mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="px-6 py-20 md:py-24">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <h2 className="font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">Comment ça marche</h2>
            <p className="text-lg text-[#686D84] max-w-xl mx-auto">
              3 étapes. 30 secondes par copie. Zéro compétence technique.
            </p>
          </div>

          <div className="space-y-20">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-[#5E58F4]">
                  <div className="h-7 w-7 rounded-full bg-[#5E58F4] text-white flex items-center justify-center text-sm font-bold">1</div>
                  Tu photographies
                </div>
                <h3 className="font-[family-name:var(--font-figtree)] text-2xl md:text-3xl font-semibold text-[#291846]">Photographie depuis ton canapé</h3>
                <p className="text-[#686D84] leading-relaxed">
                  Pas besoin de scanner. Prends tes copies en photo depuis ton téléphone — ou un dossier de scans si tu préfères.
                  PDF, Word, PowerPoint : on accepte tout.
                </p>
                <ul className="space-y-2 text-sm text-[#3d3a52]">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#02B3FF]" /> JPEG, PNG, PDF, DOCX, XLSX, PPTX</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#02B3FF]" /> Photo via téléphone, ou drag &amp; drop depuis ton ordi</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#02B3FF]" /> 100 copies en une fois</li>
                </ul>
              </div>
              <div className="order-first lg:order-last"><UploadMockup /></div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div><CopiesMockup /></div>
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-[#5E58F4]">
                  <div className="h-7 w-7 rounded-full bg-[#5E58F4] text-white flex items-center justify-center text-sm font-bold">2</div>
                  Le système extrait
                </div>
                <h3 className="font-[family-name:var(--font-figtree)] text-2xl md:text-3xl font-semibold text-[#291846]">Le système lit, tu valides</h3>
                <p className="text-[#686D84] leading-relaxed">
                  Pour chaque copie, le système extrait les réponses et propose une note selon ton barème.
                  Tu vérifies la photo à côté, tu valides ou corriges en 1 clic.
                </p>
                <ul className="space-y-2 text-sm text-[#3d3a52]">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#02B3FF]" /> Tu vois la photo + l&apos;extraction côte à côte</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#02B3FF]" /> Confiance affichée pour chaque réponse</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#02B3FF]" /> Tu peux modifier avant de valider</li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 text-sm font-medium text-[#5E58F4]">
                  <div className="h-7 w-7 rounded-full bg-[#5E58F4] text-white flex items-center justify-center text-sm font-bold">3</div>
                  Tu exportes
                </div>
                <h3 className="font-[family-name:var(--font-figtree)] text-2xl md:text-3xl font-semibold text-[#291846]">CSV au bon format</h3>
                <p className="text-[#686D84] leading-relaxed">
                  Télécharge un CSV au format SACoche ou Pronote. Tu l&apos;importes directement dans ton logiciel de gestion scolaire.
                  Zéro ressaisie, zéro copier-coller.
                </p>
                <ul className="space-y-2 text-sm text-[#3d3a52]">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#02B3FF]" /> Export SACoche avec matières, classes, appréciations</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#02B3FF]" /> Export Pronote avec notes et appréciations auto</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-[#02B3FF]" /> Compatible Excel, Numbers, tableurs</li>
                </ul>
              </div>
              <div className="order-first lg:order-last flex justify-center"><MobileMockup /></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-[#faf8fe] border-y border-[#eee9f7]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">Pourquoi ça marche</h2>
            <p className="text-lg text-[#686D84] max-w-xl mx-auto">Tout ce qu&apos;il te faut. Rien de superflu.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <Card key={f.title} className="h-full border-[#eee9f7] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                  <CardContent className="p-6 space-y-3">
                    <div className="h-11 w-11 rounded-2xl bg-[#f4f1fd] flex items-center justify-center group-hover:bg-[#5E58F4]/15 group-hover:scale-110 transition-all">
                      <Icon className="h-5 w-5 text-[#5E58F4]" />
                    </div>
                    <h3 className="font-[family-name:var(--font-figtree)] font-semibold text-lg text-[#291846]">{f.title}</h3>
                    <p className="text-sm text-[#686D84] leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 text-[#02B3FF]">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
            </div>
            <h2 className="font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">Des profs comme toi. Qui ont retrouvé leur vie.</h2>
            <p className="text-lg text-[#686D84]">Ils témoignent.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="h-full border-[#eee9f7]">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-1 text-[#02B3FF]">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                  <p className="text-sm leading-relaxed italic text-[#3d3a52]">« {t.quote} »</p>
                  <div className="flex items-center gap-3 pt-2 border-t border-[#eee9f7]">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.color} text-white flex items-center justify-center font-bold shrink-0`}>
                      {t.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#291846]">{t.author}</p>
                      <p className="text-xs text-[#686D84]">{t.role} · {t.city}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="px-6 py-20 bg-[#faf8fe] border-y border-[#eee9f7]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">
              Tu ne retrouves pas juste du temps.<br />Tu retrouves ta vie.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { emoji: '🌙', title: 'Tes soirées', text: 'Fini les mardis 22h devant SACoche. Tu regardes ta série, tu lis ton livre, tu dors.' },
              { emoji: '🏖️', title: 'Tes weekends', text: "Ton dimanche après-midi t'appartient. Pas de piles de copies sur la table du salon." },
              { emoji: '❤️', title: 'Ton couple, ta famille', text: "Tes enfants te demandent pourquoi tu cliques tout le temps. Tu leur montres que tu les écoutes." },
              { emoji: '🎓', title: 'Ton métier, ton cœur', text: 'Tu te concentres sur ce qui compte vraiment : enseigner, transmettre, voir tes élèves progresser.' },
            ].map((b, i) => (
              <Card key={i} className="h-full border-[#eee9f7] bg-white">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="text-5xl">{b.emoji}</div>
                  <h3 className="font-[family-name:var(--font-figtree)] font-semibold text-lg text-[#291846]">{b.title}</h3>
                  <p className="text-sm text-[#686D84] leading-relaxed">{b.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">
              Moins cher qu&apos;un menu kebab.<br />Plus utile que ta machine à café.
            </h2>
            <p className="text-lg text-[#686D84] max-w-xl mx-auto">Quelle que soit ta formule, tu gardes le contrôle final.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Découverte', price: 'Gratuit', unit: '', desc: '5 copies. Sans carte.', feats: ['5 copies offertes (one-shot)', 'Export CSV classique', 'Sans carte bancaire'], cta: 'Créer mon compte', href: '/signup', featured: false },
              { name: 'Petit Correcteur', price: '5€', unit: '/mois', desc: 'Pour les profs qui démarrent. 50 copies/mois.', feats: ['50 copies / mois', 'Export SACoche + Pronote', 'Sans engagement'], cta: 'Choisir 5€ →', href: '/signup?plan=petit', featured: false },
              { name: 'Standard', price: '15€', unit: '/mois', desc: '500 copies/mois — l\'essentiel pour un prof quotidien.', feats: ['500 copies / mois', 'Export SACoche + Pronote', 'Support prioritaire', 'Sans engagement'], cta: 'Choisir 15€ →', href: '/signup?plan=monthly', featured: true },
              { name: 'Annuel', price: '99€', unit: '/an', desc: '2 000 copies/mois. 2 mois offerts vs mensuel.', feats: ['2 000 copies / mois', 'Tout le Standard', '2 mois offerts (81€ d\'économie)', 'Stockage 30j RGPD'], cta: 'Économiser 21€ →', href: '/signup?plan=yearly', featured: false },
            ].map((p) => (
              <Card key={p.name} className={`h-full ${p.featured ? 'border-2 border-[#5E58F4] shadow-xl shadow-[#5E58F4]/10 relative' : 'border-[#eee9f7]'}`}>
                {p.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#5E58F4] px-3 py-0.5 text-xs font-bold text-white">⭐ Populaire</div>
                )}
                <CardContent className="p-6 space-y-4">
                  <div className={`text-sm font-semibold uppercase tracking-wide ${p.featured ? 'text-[#5E58F4]' : 'text-[#686D84]'}`}>{p.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-[family-name:var(--font-figtree)] text-4xl font-semibold text-[#291846]">{p.price}</span>
                    {p.unit && <span className="text-[#686D84]">{p.unit}</span>}
                  </div>
                  <p className="text-sm text-[#686D84]">{p.desc}</p>
                  <ul className="space-y-2 text-sm text-[#3d3a52]">
                    {p.feats.map((f) => (
                      <li key={f} className="flex items-start gap-2"><Check className="h-4 w-4 text-[#02B3FF] mt-0.5 shrink-0" />{f}</li>
                    ))}
                  </ul>
                  {p.featured ? (
                    <Link href={p.href} className="text-sm bg-[#02B3FF] text-white px-5 py-2.5 rounded-full font-medium hover:bg-[#0298d8] transition-colors w-full text-center block">{p.cta}</Link>
                  ) : (
                    <Link href={p.href} className="text-sm text-[#291846] px-5 py-2.5 rounded-full font-medium border border-[#e5e0f4] hover:border-[#291846]/40 hover:bg-[#f4f1fd] transition-colors w-full text-center block">{p.cta}</Link>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs text-[#686D84]">
            <span>✓ Sans engagement</span><span className="hidden sm:inline">•</span>
            <span>✓ Paiement sécurisé Stripe</span><span className="hidden sm:inline">•</span>
            <span>✓ Satisfait ou remboursé 30j</span><span className="hidden sm:inline">•</span>
            <span>✓ RGPD + données en Europe</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20 bg-[#faf8fe] border-y border-[#eee9f7]">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">
              Tout ce que tu te demandes.<br />On te répond honnêtement.
            </h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.q} className="group rounded-2xl border border-[#eee9f7] bg-white hover:shadow-md transition-shadow">
                <summary className="cursor-pointer p-4 font-medium flex items-center gap-2 list-none text-[#291846]">
                  <HelpCircle className="h-4 w-4 text-[#5E58F4] shrink-0" />
                  <span className="flex-1">{faq.q}</span>
                  <ChevronDown className="h-4 w-4 text-[#686D84] group-open:rotate-180 transition-transform shrink-0" />
                </summary>
                <div className="px-4 pb-4 pl-10 text-sm text-[#686D84] leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final — gradient ed.ai */}
      <section className="px-6 py-20 md:py-24 text-center" style={{ background: 'linear-gradient(140deg, #5E58F4 10%, #252047 100%)' }}>
        <div className="max-w-2xl mx-auto text-white space-y-6">
          <h2 className="font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold">
            Et si mardi prochain, tu allais au match de ton fils ?
          </h2>
          <p className="text-lg text-white/80">
            10 copies offertes. Aucun engagement. 3 minutes pour te convaincre.
          </p>
          <div className="pt-2"><LeadCapture /></div>
          <p className="text-xs text-white/60 pt-2">
            ✓ 10 copies gratuites · ✓ Sans carte bancaire · ✓ Désinscription en 1 clic
          </p>
          <p className="text-xs text-white/40 pt-3">
            Outil de saisie administrative · Non destiné aux épreuves officielles
          </p>
        </div>
      </section>

      {/* Footer violet */}
      <footer className="bg-[#291846] text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-[family-name:var(--font-figtree)] font-semibold text-lg">
                <img src="/favicon.svg" alt="" className="h-7 w-7" />
                Copie Express
              </div>
              <p className="text-sm text-white/60">© 2026 Copie Express. Fait avec ❤️ par et pour des profs.</p>
            </div>
            <nav className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-2 text-sm text-white/70">
              <Link href="/why-us" className="hover:text-white">Pourquoi nous</Link>
              <Link href="/guide" className="hover:text-white">Guide enseignant</Link>
              <Link href="/notice-familles" className="hover:text-white">Notice familles</Link>
              <Link href="/pricing" className="hover:text-white">Tarifs</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
              <Link href="/blog" className="hover:text-white">Blog</Link>
              <Link href="/legal/cgu" className="hover:text-white">CGU</Link>
              <Link href="/legal/cgv" className="hover:text-white">CGV</Link>
              <Link href="/legal/privacy" className="hover:text-white">Confidentialité</Link>
              <Link href="/legal/mentions" className="hover:text-white col-span-2 sm:col-span-1">Mentions légales</Link>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
