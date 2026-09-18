import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guide enseignant — Bien démarrer avec Copie Express',
  description: 'Pas à pas : préparer son sujet, photographier les copies, valider les notes, exporter vers SACoche ou Pronote.',
};

const STEPS: { n: string; title: string; body: string }[] = [
  { n: '1', title: 'Crée ton évaluation', body: 'Depuis ton espace, « Nouvelle évaluation ». Donne-lui un titre (ex. « Contrôle fractions 4eB »). Tout le travail de l\'année reste organisé par évaluation.' },
  { n: '2', title: 'Dépose le sujet (2 minutes)', body: 'Photo ou PDF du sujet. Copie Express en extrait les questions, le barème et les savoir-faire. Tout est modifiable : ajuste les points, change un intitulé, puis valide. Ce barème servira à toute la classe.' },
  { n: '3', title: 'Photographie les copies', body: 'Prends les copies une par une ou la pile entière — jusqu\'à 100 photos. Encadré bien, lumière suffisante, pas d\'ombre portée. Le détail des bonnes pratiques photo est rappelé à l\'upload.' },
  { n: '4', title: 'Relis, ajuste, valide', body: 'Pour chaque copie : les réponses lues, la note proposée, les erreurs classées par type (calcul, notion non comprise, étourderie…). Tu corriges ce qui te semble injuste, puis tu valides. La note finale est la tienne.' },
  { n: '5', title: 'Exporte tes notes', body: 'CSV, SACoche ou Pronote, au format attendu par ton logiciel — import en 2 clics. Le bilan détaillé de chaque élève est imprimable pour la remise des copies ou les réunions parents-profs.' },
];

const FAQ = [
  { q: 'Faut-il un scanner ?', a: 'Non. Un smartphone suffit. Un scanner fonctionne aussi, mais il n\'est pas nécessaire.' },
  { q: 'Et si l\'écriture est difficile ?', a: 'Les réponses peu lisibles sont signalées par un badge « à vérifier ». Rien n\'est validé en aveugle : tu vois toujours la photo originale à côté de l\'analyse.' },
  { q: 'Qui voit les copies ?', a: 'Toi seul. Les photos sont supprimées après 30 jours et ne servent à rien d\'autre. Une notice d\'information aux familles est disponible si tu souhaites informer parents et élèves.' },
  { q: 'Ça marche pour quelles matières ?', a: 'Toutes les matières à questions/réponses écrites : maths, physique, SVT, histoire, français… Les copies entièrement rédigées (dissertation) sont moins adaptées pour l\'instant.' },
];

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-secondary/30">
      <div className="container mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="text-sm text-muted-foreground hover:underline">← Copie Express</Link>
        <h1 className="text-3xl font-bold mt-4 mb-2">Guide enseignant</h1>
        <p className="text-muted-foreground mb-8">
          De la photo du sujet à l\'export des notes — le parcours complet en 5 étapes.
        </p>

        <div className="space-y-4">
          {STEPS.map((s) => (
            <Card key={s.n}>
              <CardHeader>
                <CardTitle className="text-lg">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-primary text-primary-foreground text-sm font-bold mr-2">{s.n}</span>
                  {s.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-700">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-10 mb-4">Questions fréquentes</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <Card key={f.q}>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-1">{f.q}</h3>
                <p className="text-sm text-slate-700">{f.a}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-xl bg-primary/5 border text-center">
          <p className="font-medium mb-2">Prêt à gagner tes soirées ?</p>
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Créer mon compte (5 copies gratuites) →
          </Link>
        </div>
      </div>
    </main>
  );
}
