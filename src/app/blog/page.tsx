import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Copie Express',
  description: 'Articles pour les profs : correction de copies, gain de temps, RGPD, outils pédagogiques.',
};

const articles = [
  {
    title: 'Comment réduire le temps de correction des copies sans perdre en qualité',
    desc: 'Un prof passe en moyenne 2h45 par semaine à saisir manuellement les notes. Et si tu pouvais réduire ce temps à 3 minutes ?',
    href: '/blog/temps-correction-copies',
    date: '2026-08-14',
  },
  {
    title: "RGPD et copies d'élèves : ce que tout prof doit savoir en 2026",
    desc: "Peut-on utiliser ChatGPT pour corriger des copies ? Que risque-t-on vraiment ? Réponses sans jargon.",
    href: '/blog/rgpd-copies-eleves',
    date: '2026-08-14',
  },
  {
    title: 'Export SACoche vs Pronote : lequel choisir ?',
    desc: 'Guide comparatif des deux logiciels de gestion scolaire les plus utilisés en France. Formats CSV, compatibilité, astuces.',
    href: '/blog/sacoche-vs-pronote',
    date: '2026-08-14',
  },
  {
    title: '5 astuces pour ne pas passer son dimanche à corriger des copies',
    desc: 'Organisation, concentration, barème clair... 5 habitudes de profs qui corrigent 2× plus vite.',
    href: '/blog/5-astuces-correction-rapide',
    date: '2026-08-14',
  },
  {
    title: 'Pourquoi les profs quittent le métier — et comment la technologie peut aider',
    desc: "Surcharge administrative, heures sup non payées, perte de sens. Et si la technologie redonnait du temps pour l'essentiel ?",
    href: '/blog/profs-quittent-metier',
    date: '2026-08-14',
  },
];

export default function BlogIndex() {
  return (
    <main className="min-h-screen bg-secondary/30">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Le blog des profs qui veulent <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent italic font-serif">retrouver leur vie</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Correction, gain de temps, RGPD, outils pédagogiques. Des articles sans jargon, écrits avec des profs.
          </p>
        </div>

        <div className="space-y-6">
          {articles.map((a) => (
            <Link key={a.href} href={a.href} className="block group">
              <article className="p-6 rounded-xl border bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
                <time className="text-xs text-muted-foreground">{a.date}</time>
                <h2 className="text-xl font-bold mt-1 group-hover:text-primary transition-colors">
                  {a.title}
                </h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {a.desc}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}