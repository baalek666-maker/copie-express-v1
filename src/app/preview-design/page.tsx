import type { Metadata } from 'next';
import Link from 'next/link';
import { Star, ArrowRight, ArrowUpRight } from 'lucide-react';
import { PreviewDesignClient } from './preview-client';

export const metadata: Metadata = {
  title: 'Aperçu redesign V2 — Copie Express',
  robots: { index: false, follow: false },
};

export default function PreviewDesignPage() {
  return (
    <PreviewDesignClient>
      {/* Bandeau preview */}
      <div className="fixed top-0 inset-x-0 z-[60] bg-[#291846] text-white text-center text-xs py-2 px-4">
        🎨 <strong>Aperçu redesign V2</strong> — ta page actuelle reste en ligne.{' '}
        <Link href="/" className="underline">Voir la version actuelle</Link>
      </div>

      {/* HEADER flottant qui se condense au scroll */}
      <header className="fixed top-[32px] inset-x-0 z-50">
        <div className="mx-auto max-w-6xl px-6">
          <div className="header-inner flex h-16 items-center justify-between rounded-[32px] px-6 mt-4">
            <Link href="/" className="flex items-center gap-2 font-semibold text-lg text-[#291846]">
              <img src="/favicon.svg" alt="" className="h-8 w-8" />
              <span className="font-[family-name:var(--font-figtree)]">Copie Express</span>
            </Link>
            <nav className="flex items-center gap-1">
              <Link href="/why-us" className="text-sm text-[#686D84] hover:text-black px-4 py-2 rounded-[32px] hover:bg-[#F3F0FF] transition-all duration-200">Pourquoi nous</Link>
              <Link href="/pricing" className="text-sm text-[#686D84] hover:text-black px-4 py-2 rounded-[32px] hover:bg-[#F3F0FF] transition-all duration-200">Tarifs</Link>
              <Link href="/blog" className="text-sm text-[#686D84] hover:text-black px-4 py-2 rounded-[32px] hover:bg-[#F3F0FF] transition-all duration-200">Blog</Link>
              <Link href="/login" className="text-sm text-[#6812DC] hover:text-black px-4 py-2 rounded-[32px] transition-all duration-200">Connexion</Link>
              <Link href="/signup" className="text-sm bg-[#5E58F4] text-white px-5 py-2.5 rounded-[32px] font-medium hover:bg-[#4a44d9] transition-all duration-200 inline-flex items-center gap-1.5 group">
                Essai gratuit
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* HERO — cercle lavande + illustrations flottantes */}
      <section className="relative overflow-hidden pt-52 pb-24 px-6 text-center">
        <div className="hero-circle absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 w-[min(978px,150vw)] aspect-square rounded-full bg-[#F3F0FF] -z-10" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse,rgba(94,88,244,0.12),transparent_65%)] -z-10" />

        <div className="absolute left-[7%] top-[32%] hidden lg:block float-a" aria-hidden>
          <svg width="120" height="150" viewBox="0 0 120 150" fill="none">
            <rect x="20" y="30" width="80" height="100" rx="8" fill="#fff" stroke="#E5E0F4" />
            <rect x="32" y="48" width="56" height="8" rx="4" fill="#F3F0FF" />
            <rect x="32" y="64" width="40" height="8" rx="4" fill="#F3F0FF" />
            <rect x="32" y="80" width="48" height="8" rx="4" fill="#5E58F4" opacity="0.8" />
            <circle cx="96" cy="34" r="16" fill="#02B3FF" opacity="0.9" />
            <path d="M90 34l4 4 8-8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="absolute right-[7%] top-[30%] hidden lg:block float-b" aria-hidden>
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none">
            <circle cx="55" cy="55" r="48" fill="#fff" stroke="#E5E0F4" />
            <path d="M35 62c8 6 18 6 26 0s18-6 26 0" stroke="#5E58F4" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="42" cy="44" r="3" fill="#291846" />
            <circle cx="68" cy="44" r="3" fill="#291846" />
          </svg>
        </div>
        <div className="absolute right-[15%] bottom-[10%] hidden lg:block float-a" aria-hidden>
          <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
            <rect x="14" y="20" width="72" height="86" rx="8" fill="#fff" stroke="#E5E0F4" />
            <circle cx="50" cy="48" r="14" fill="#F3F0FF" />
            <path d="M44 48l4 4 7-7" stroke="#5E58F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="30" y="72" width="40" height="6" rx="3" fill="#F3F0FF" />
            <rect x="30" y="84" width="28" height="6" rx="3" fill="#F3F0FF" />
            <rect x="38" y="2" width="24" height="20" rx="4" fill="#291846" />
            <circle cx="50" cy="12" r="4" fill="#02B3FF" />
          </svg>
        </div>

        <div className="relative max-w-4xl mx-auto space-y-8">
          <div className="reveal inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E5E0F4] text-[#5E58F4] text-sm font-medium shadow-sm">
            <Star className="h-3.5 w-3.5 fill-current" />
            10 copies gratuites, sans carte bancaire
          </div>
          <h1 className="reveal font-[family-name:var(--font-figtree)] text-[clamp(2.8rem,7vw,5rem)] leading-[1.04] font-semibold text-[#291846] tracking-[-0.02em]">
            Redeviens un prof.
            <br />
            Pas une machine à cliquer.
          </h1>
          <p className="reveal text-lg md:text-xl text-[#686D84] leading-relaxed max-w-2xl mx-auto">
            Brevet blanc, bac blanc, contrôles au fil de l&apos;année —{' '}
            <strong className="text-[#291846]">90 copies en 30 secondes.</strong>
            <br />
            Tu valides, tu fermes l&apos;ordi.{' '}
            <strong className="text-[#291846]">Tu retrouves ta famille, ton cœur de métier, ta vie.</strong>
          </p>
          <div className="reveal flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link href="/signup" className="text-base bg-[#5E58F4] text-white px-8 py-3.5 rounded-[32px] font-medium hover:bg-[#4a44d9] transition-all duration-200 inline-flex items-center gap-2 shadow-lg shadow-[#5E58F4]/25 group">
              Commencer gratuitement
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link href="#how" className="text-base text-[#291846] px-8 py-3.5 rounded-[32px] font-medium border border-[#E5E0F4] hover:border-[#291846]/40 transition-all duration-200 bg-white/60 backdrop-blur">
              Voir comment ça marche
            </Link>
          </div>
          <div className="reveal flex items-center justify-center gap-2 text-sm">
            <div className="flex gap-0.5 text-[#5E58F4]">★★★★★</div>
            <span className="text-[#686D84] italic">&quot;J&apos;ai retrouvé mes soirées. Mes enfants me reconnaissent.&quot;</span>
          </div>
          <p className="reveal text-xs text-[#686D84]/70">— Marc, prof de maths en collège, Lyon</p>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#EEE9F7] bg-white py-14 px-6">
        <p className="reveal text-center text-sm text-[#686D84] mb-10">
          Le service utilisé par les profs qui ont autre chose à faire que cliquer
        </p>
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-8 text-center">
          <div className="reveal">
            <div className="font-[family-name:var(--font-figtree)] text-4xl md:text-5xl font-semibold text-[#291846]">350 000</div>
            <div className="text-xs text-[#686D84] mt-2">profs en France qui passent 3h à saisir</div>
          </div>
          <div className="reveal" data-delay={100}>
            <div className="font-[family-name:var(--font-figtree)] text-4xl md:text-5xl font-semibold text-[#291846]">90×</div>
            <div className="text-xs text-[#686D84] mt-2">plus rapide qu&apos;une saisie manuelle</div>
          </div>
          <div className="reveal" data-delay={200}>
            <div className="font-[family-name:var(--font-figtree)] text-4xl md:text-5xl font-semibold text-[#291846]">99,2%</div>
            <div className="text-xs text-[#686D84] mt-2">de fiabilité sur 1 000 copies testées</div>
          </div>
        </div>
      </section>

      {/* BIG STATEMENT */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="reveal font-[family-name:var(--font-figtree)] text-[clamp(2.2rem,5vw,3.5rem)] leading-[1.1] font-semibold text-[#291846]">
            3 heures de saisie en moins,
            <br />
            chaque semaine.
          </h2>
          <p className="reveal text-lg text-[#686D84] mt-6 max-w-2xl mx-auto">
            Le temps d&apos;un café, tes copies sont lues, notées selon ton barème et exportées.
            Toi, tu valides.
          </p>
        </div>
      </section>

      {/* HOW IT WORKS — bullets avec flèche glissante */}
      <section id="how" className="px-6 py-20 bg-[#FAF8FE] border-y border-[#EEE9F7]">
        <div className="max-w-6xl mx-auto space-y-14">
          <div className="text-center space-y-3">
            <h2 className="reveal font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">Comment ça marche</h2>
            <p className="reveal text-lg text-[#686D84] max-w-xl mx-auto">3 étapes. 30 secondes par copie. Zéro compétence technique.</p>
          </div>

          <div className="space-y-8">
            {/* Étape 1 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center py-8">
              <div className="space-y-4">
                <div className="reveal inline-flex items-center gap-2 text-sm font-medium text-[#5E58F4]">
                  <div className="h-7 w-7 rounded-full bg-[#5E58F4] text-white flex items-center justify-center text-sm font-bold">1</div>
                  Tu photographies
                </div>
                <h3 className="reveal font-[family-name:var(--font-figtree)] text-2xl md:text-[2rem] font-semibold text-[#291846]">Photographie depuis ton canapé</h3>
                <p className="reveal text-[#686D84] leading-relaxed">
                  Pas besoin de scanner. Prends tes copies en photo depuis ton téléphone — ou un dossier de scans si tu préfères.
                  PDF, Word, PowerPoint : on accepte tout.
                </p>
                <ul className="space-y-3 text-sm text-[#3d3a52]">
                  <li className="group reveal flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full border-2 border-[#5E58F4] group-hover:bg-[#5E58F4] transition-colors duration-200 shrink-0" />
                    <span className="font-medium">JPEG, PNG, PDF, DOCX, XLSX, PPTX</span>
                  </li>
                  <li className="group reveal flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full border-2 border-[#5E58F4] group-hover:bg-[#5E58F4] transition-colors duration-200 shrink-0" />
                    <span className="font-medium">Photo via téléphone, ou drag &amp; drop depuis ton ordi</span>
                  </li>
                  <li className="group reveal flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full border-2 border-[#5E58F4] group-hover:bg-[#5E58F4] transition-colors duration-200 shrink-0" />
                    <span className="font-medium">100 copies en une fois</span>
                  </li>
                </ul>
              </div>
              <div className="h-72 rounded-3xl bg-white border border-[#EEE9F7] shadow-sm flex items-center justify-center">
                <svg width="220" height="180" viewBox="0 0 220 180" fill="none" className="reveal">
                  <rect x="30" y="20" width="100" height="140" rx="10" fill="#FAF8FE" stroke="#E5E0F4" />
                  <rect x="145" y="35" width="60" height="80" rx="8" fill="#fff" stroke="#E5E0F4" />
                  <rect x="45" y="40" width="70" height="6" rx="3" fill="#E5E0F4" />
                  <rect x="45" y="54" width="50" height="6" rx="3" fill="#E5E0F4" />
                  <circle cx="175" cy="55" r="14" fill="#5E58F4" opacity="0.15" />
                  <path d="M170 55l3.5 3.5 7-7" stroke="#5E58F4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="155" y="85" width="40" height="5" rx="2.5" fill="#F3F0FF" />
                  <rect x="160" y="96" width="30" height="5" rx="2.5" fill="#F3F0FF" />
                </svg>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center py-8 border-t border-[#EEE9F7]">
              <div className="h-72 rounded-3xl bg-white border border-[#EEE9F7] shadow-sm flex items-center justify-center lg:order-1">
                <svg width="240" height="180" viewBox="0 0 240 180" fill="none" className="reveal">
                  <rect x="20" y="20" width="200" height="32" rx="16" fill="#F3F0FF" />
                  <circle cx="40" cy="36" r="8" fill="#5E58F4" opacity="0.3" />
                  <rect x="58" y="30" width="80" height="12" rx="6" fill="#E5E0F4" />
                  <rect x="20" y="64" width="200" height="32" rx="16" fill="#fff" stroke="#E5E0F4" />
                  <circle cx="40" cy="80" r="8" fill="#02B3FF" opacity="0.25" />
                  <rect x="58" y="74" width="60" height="12" rx="6" fill="#F3F0FF" />
                  <rect x="20" y="108" width="200" height="32" rx="16" fill="#fff" stroke="#E5E0F4" />
                  <circle cx="40" cy="124" r="8" fill="#10B981" opacity="0.25" />
                  <rect x="58" y="118" width="90" height="12" rx="6" fill="#F3F0FF" />
                </svg>
              </div>
              <div className="space-y-4 lg:order-2">
                <div className="reveal inline-flex items-center gap-2 text-sm font-medium text-[#5E58F4]">
                  <div className="h-7 w-7 rounded-full bg-[#5E58F4] text-white flex items-center justify-center text-sm font-bold">2</div>
                  Le système extrait
                </div>
                <h3 className="reveal font-[family-name:var(--font-figtree)] text-2xl md:text-[2rem] font-semibold text-[#291846]">Le système lit, tu valides</h3>
                <p className="reveal text-[#686D84] leading-relaxed">
                  Pour chaque copie, le système extrait les réponses et propose une note selon ton barème.
                  Tu vérifies la photo à côté, tu valides ou corriges en 1 clic.
                </p>
                <ul className="space-y-3 text-sm text-[#3d3a52]">
                  <li className="group reveal flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full border-2 border-[#5E58F4] group-hover:bg-[#5E58F4] transition-colors duration-200 shrink-0" />
                    <span className="font-medium">Tu vois la photo + l&apos;extraction côte à côte</span>
                  </li>
                  <li className="group reveal flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full border-2 border-[#5E58F4] group-hover:bg-[#5E58F4] transition-colors duration-200 shrink-0" />
                    <span className="font-medium">Confiance affichée pour chaque réponse</span>
                  </li>
                  <li className="group reveal flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full border-2 border-[#5E58F4] group-hover:bg-[#5E58F4] transition-colors duration-200 shrink-0" />
                    <span className="font-medium">Tu peux modifier avant de valider</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="grid lg:grid-cols-2 gap-12 items-center py-8 border-t border-[#EEE9F7]">
              <div className="space-y-4">
                <div className="reveal inline-flex items-center gap-2 text-sm font-medium text-[#5E58F4]">
                  <div className="h-7 w-7 rounded-full bg-[#5E58F4] text-white flex items-center justify-center text-sm font-bold">3</div>
                  Tu exportes
                </div>
                <h3 className="reveal font-[family-name:var(--font-figtree)] text-2xl md:text-[2rem] font-semibold text-[#291846]">CSV au bon format</h3>
                <p className="reveal text-[#686D84] leading-relaxed">
                  Télécharge un CSV au format SACoche ou Pronote. Tu l&apos;importes directement dans ton logiciel de gestion scolaire.
                  Zéro ressaisie, zéro copier-coller.
                </p>
                <ul className="space-y-3 text-sm text-[#3d3a52]">
                  <li className="group reveal flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full border-2 border-[#5E58F4] group-hover:bg-[#5E58F4] transition-colors duration-200 shrink-0" />
                    <span className="font-medium">Export SACoche avec matières, classes, appréciations</span>
                  </li>
                  <li className="group reveal flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full border-2 border-[#5E58F4] group-hover:bg-[#5E58F4] transition-colors duration-200 shrink-0" />
                    <span className="font-medium">Export Pronote avec notes et appréciations auto</span>
                  </li>
                  <li className="group reveal flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full border-2 border-[#5E58F4] group-hover:bg-[#5E58F4] transition-colors duration-200 shrink-0" />
                    <span className="font-medium">Compatible Excel, Numbers, tableurs</span>
                  </li>
                </ul>
              </div>
              <div className="h-72 rounded-3xl bg-white border border-[#EEE9F7] shadow-sm flex items-center justify-center">
                <svg width="220" height="180" viewBox="0 0 220 180" fill="none" className="reveal">
                  <rect x="60" y="15" width="100" height="150" rx="10" fill="#fff" stroke="#E5E0F4" />
                  <rect x="75" y="35" width="70" height="8" rx="4" fill="#F3F0FF" />
                  <rect x="75" y="53" width="70" height="8" rx="4" fill="#F3F0FF" />
                  <rect x="75" y="71" width="70" height="8" rx="4" fill="#5E58F4" opacity="0.7" />
                  <rect x="75" y="89" width="46" height="8" rx="4" fill="#F3F0FF" />
                  <path d="M170 90h30m0 0l-8-8m8 8l-8 8" stroke="#5E58F4" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="160" y="120" width="46" height="28" rx="14" fill="#5E58F4" />
                  <text x="183" y="139" textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff">CSV</text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES grid */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="reveal font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">Pourquoi ça marche</h2>
            <p className="reveal text-lg text-[#686D84] max-w-xl mx-auto">Tout ce qu&apos;il te faut. Rien de superflu.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { t: '10× plus rapide', d: '90 copies en 30 secondes au lieu de 3h de clics répétitifs.' },
              { t: 'Photo depuis ton canapé', d: 'Pas de scanner. Ton téléphone suffit, depuis ton salon à 23h.' },
              { t: 'RGPD by design', d: 'Données hébergées en Europe, suppression auto 30j, jamais partagées.' },
              { t: 'Compatible SACoche & Pronote', d: 'CSV au bon format. Tu importes en 2 clics.' },
              { t: 'Barème prêt en 2 minutes', d: 'Dépose ton sujet : questions, points et savoir-faire prêts en 1 clic.' },
              { t: 'Conçu pour les profs', d: 'Par un prof, pour des profs. Pas de fonctionnalités inutiles.' },
              { t: 'Tu gardes le contrôle', d: 'Le système propose, tu valides ou corriges en 1 clic.' },
            ].map((f, i) => (
              <div key={f.t} className="reveal" data-delay={(i % 3) * 80}>
                <div className="feat-card h-full rounded-2xl border border-[#EEE9F7] bg-white p-6 space-y-2.5">
                  <div className="h-11 w-11 rounded-2xl bg-[#F3F0FF] flex items-center justify-center feat-icon transition-all duration-200">
                    <span className="text-lg font-[family-name:var(--font-figtree)] font-semibold text-[#5E58F4]">{i + 1}</span>
                  </div>
                  <h3 className="font-[family-name:var(--font-figtree)] font-semibold text-lg text-[#291846]">{f.t}</h3>
                  <p className="text-sm text-[#686D84] leading-relaxed">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="px-6 py-20 bg-[#FAF8FE] border-y border-[#EEE9F7]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <div className="reveal inline-flex items-center gap-1.5 text-[#5E58F4]">
              {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
            </div>
            <h2 className="reveal font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">Des profs comme toi. Qui ont retrouvé leur vie.</h2>
            <p className="reveal text-lg text-[#686D84]">Ils témoignent.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { q: "Mon brevet blanc de mars, 92 copies. J'ai cliqué 'valider' en 30 secondes. J'ai pleuré de soulagement dans ma voiture.", a: 'Marc, 42 ans', r: 'Prof de maths · Lyon', av: 'M', c: 'from-blue-500 to-blue-600' },
              { q: "Je pensais que c'était encore un gadget. Au premier brevet blanc, j'ai gagné 12h. Maintenant je l'utilise pour chaque contrôle de maths.", a: 'Sylvie, 39 ans', r: 'Prof de physique · Bordeaux', av: 'S', c: 'from-pink-500 to-rose-600' },
              { q: "Mon mari m'a dit : 'Tu es redevenue normale.' Ça valait 99€/an x 100.", a: 'Céline, 36 ans', r: 'Prof de SVT · Nantes', av: 'C', c: 'from-green-500 to-emerald-600' },
            ].map((t, i) => (
              <div key={i} className="reveal" data-delay={i * 100}>
                <div className="feat-card h-full rounded-2xl border border-[#EEE9F7] bg-white p-6 space-y-4 flex flex-col">
                  <div className="flex items-center gap-1 text-[#5E58F4]">
                    {[...Array(5)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-current" />)}
                  </div>
                  <p className="text-sm leading-relaxed italic text-[#3d3a52] flex-1">« {t.q} »</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-[#EEE9F7]">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.c} text-white flex items-center justify-center font-bold shrink-0`}>{t.av}</div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#291846]">{t.a}</p>
                      <p className="text-xs text-[#686D84]">{t.r}</p>
    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center">
            <h2 className="reveal font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">
              Tu ne retrouves pas juste du temps.<br />Tu retrouves ta vie.
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { e: '🌙', t: 'Tes soirées', d: 'Fini les mardis 22h devant SACoche. Tu regardes ta série, tu lis ton livre, tu dors.' },
              { e: '🏖️', t: 'Tes weekends', d: "Ton dimanche après-midi t'appartient. Pas de piles de copies sur la table du salon." },
              { e: '❤️', t: 'Ton couple, ta famille', d: "Tes enfants te demandent pourquoi tu cliques tout le temps. Tu leur montres que tu les écoutes." },
              { t: 'Ton métier, ton cœur', e: '🎓', d: 'Tu te concentres sur ce qui compte vraiment : enseigner, transmettre, voir tes élèves progresser.' },
            ].map((b, i) => (
              <div key={i} className="reveal" data-delay={i * 80}>
                <div className="feat-card h-full rounded-2xl border border-[#EEE9F7] bg-white p-6 text-center space-y-3">
                  <div className="text-5xl">{b.e}</div>
                  <h3 className="font-[family-name:var(--font-figtree)] font-semibold text-lg text-[#291846]">{b.t}</h3>
                  <p className="text-sm text-[#686D84] leading-relaxed">{b.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="px-6 py-20 bg-[#FAF8FE] border-y border-[#EEE9F7]">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="reveal font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">
              Moins cher qu&apos;un menu kebab.<br />Plus utile que ta machine à café.
            </h2>
            <p className="reveal text-lg text-[#686D84] max-w-xl mx-auto">Quelle que soit ta formule, tu gardes le contrôle final.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Découverte', price: 'Gratuit', unit: '', desc: '5 copies. Sans carte.', feats: ['5 copies offertes (one-shot)', 'Export CSV classique', 'Sans carte bancaire'], cta: 'Créer mon compte', href: '/signup', featured: false },
              { name: 'Petit Correcteur', price: '5€', unit: '/mois', desc: 'Pour les profs qui démarrent. 50 copies/mois.', feats: ['50 copies / mois', 'Export SACoche + Pronote', 'Sans engagement'], cta: 'Choisir 5€ →', href: '/signup?plan=petit', featured: false },
              { name: 'Standard', price: '15€', unit: '/mois', desc: '500 copies/mois — l\'essentiel pour un prof quotidien.', feats: ['500 copies / mois', 'Export SACoche + Pronote', 'Support prioritaire', 'Sans engagement'], cta: 'Choisir 15€ →', href: '/signup?plan=monthly', featured: true },
              { name: 'Annuel', price: '99€', unit: '/an', desc: '2 000 copies/mois. 2 mois offerts vs mensuel.', feats: ['2 000 copies / mois', 'Tout le Standard', '2 mois offerts (81€ d\'économie)', 'Stockage 30j RGPD'], cta: 'Économiser 21€ →', href: '/signup?plan=yearly', featured: false },
            ].map((p) => (
              <div key={p.name} className="reveal">
                <div className={`feat-card h-full rounded-2xl border bg-white p-6 space-y-4 relative ${p.featured ? 'border-2 border-[#5E58F4] shadow-xl shadow-[#5E58F4]/10' : 'border-[#EEE9F7]'}`}>
                  {p.featured && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#5E58F4] px-3 py-0.5 text-xs font-bold text-white">⭐ Populaire</div>
                  )}
                  <div className={`text-sm font-semibold uppercase tracking-wide ${p.featured ? 'text-[#5E58F4]' : 'text-[#686D84]'}`}>{p.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="font-[family-name:var(--font-figtree)] text-4xl font-semibold text-[#291846]">{p.price}</span>
                    {p.unit && <span className="text-[#686D84]">{p.unit}</span>}
                  </div>
                  <p className="text-sm text-[#686D84]">{p.desc}</p>
                  <ul className="space-y-2 text-sm text-[#3d3a52]">
                    {p.feats.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-[#F3F0FF] flex items-center justify-center shrink-0 mt-0.5"><span className="w-1.5 h-1.5 rounded-full bg-[#5E58F4]" /></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  {p.featured ? (
                    <Link href={p.href} className="text-sm bg-[#5E58F4] text-white px-5 py-2.5 rounded-[32px] font-medium hover:bg-[#4a44d9] transition-all duration-200 w-full text-center block">{p.cta}</Link>
                  ) : (
                    <Link href={p.href} className="text-sm text-[#291846] px-5 py-2.5 rounded-[32px] font-medium border border-[#E5E0F4] hover:border-[#291846]/40 hover:bg-[#F3F0FF] transition-all duration-200 w-full text-center block">{p.cta}</Link>
                  )}
                </div>
              </div>
              ))}
          </div>
          <div className="reveal flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-center text-xs text-[#686D84]">
            <span>✓ Sans engagement</span><span className="hidden sm:inline">•</span>
            <span>✓ Paiement sécurisé Stripe</span><span className="hidden sm:inline">•</span>
            <span>✓ Satisfait ou remboursé 30j</span><span className="hidden sm:inline">•</span>
            <span>✓ RGPD + données en Europe</span>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="text-center">
            <h2 className="reveal font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold text-[#291846]">
              Tout ce que tu te demandes.<br />On te répond honnêtement.
            </h2>
          </div>
          <div className="space-y-3">
            {[
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
            ].map((faq) => (
              <details key={faq.q} className="reveal group rounded-2xl border border-[#EEE9F7] bg-white hover:shadow-md transition-shadow">
                <summary className="cursor-pointer p-4 font-medium flex items-center gap-2 list-none text-[#291846]">
                  <span className="w-4 h-4 rounded-full border-2 border-[#5E58F4] shrink-0" />
                  <span className="flex-1">{faq.q}</span>
                  <span className="text-[#5E58F4] text-xl leading-none group-open:rotate-45 transition-transform duration-200">+</span>
                </summary>
                <div className="px-4 pb-4 pl-10 text-sm text-[#686D84] leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final gradient */}
      <section className="px-6 py-24 text-center" style={{ background: 'linear-gradient(140deg, #5E58F4 10%, #252047 100%)' }}>
        <div className="max-w-2xl mx-auto text-white space-y-6">
          <h2 className="reveal font-[family-name:var(--font-figtree)] text-3xl md:text-5xl font-semibold">
            Et si mardi prochain, tu allais au match de ton fils ?
          </h2>
          <p className="reveal text-lg text-white/80">10 copies offertes. Aucun engagement. 3 minutes pour te convaincre.</p>
          <div className="reveal pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="text-base bg-white text-[#291846] px-8 py-3.5 rounded-[32px] font-medium hover:bg-[#F3F0FF] transition-all duration-200 inline-flex items-center gap-2">
              Commencer gratuitement <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="reveal text-xs text-white/60 pt-2">✓ 10 copies gratuites · ✓ Sans carte bancaire · ✓ Désinscription en 1 clic</p>
          <p className="reveal text-xs text-white/40 pt-3">Outil de saisie administrative · Non destiné aux épreuves officielles</p>
        </div>
      </section>

      {/* FOOTER violet */}
      <footer className="bg-[#291846] text-white py-14 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-semibold text-lg">
                <img src="/favicon.svg" alt="" className="h-7 w-7" />
                <span className="font-[family-name:var(--font-figtree)]">Copie Express</span>
              </div>
              <p className="text-sm text-white/60">© 2026 Copie Express. Fait avec ❤️ par et pour des profs.</p>
            </div>
            <nav className="grid grid-cols-2 sm:grid-cols-3 gap-x-10 gap-y-2 text-sm text-white/70">
              <Link href="/why-us" className="hover:text-white transition-colors">Pourquoi nous</Link>
              <Link href="/guide" className="hover:text-white transition-colors">Guide enseignant</Link>
              <Link href="/notice-familles" className="hover:text-white transition-colors">Notice familles</Link>
              <Link href="/pricing" className="hover:text-white transition-colors">Tarifs</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
              <Link href="/legal/cgu" className="hover:text-white transition-colors">CGU</Link>
              <Link href="/legal/cgv" className="hover:text-white transition-colors">CGV</Link>
              <Link href="/legal/privacy" className="hover:text-white transition-colors">Confidentialité</Link>
              <Link href="/legal/mentions" className="hover:text-white transition-colors col-span-2 sm:col-span-1">Mentions légales</Link>
            </nav>
          </div>
        </div>
      </footer>
    </PreviewDesignClient>
  );
}
