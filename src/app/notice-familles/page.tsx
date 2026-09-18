import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Notice d\'information aux familles — Copie Express',
  description: 'Document à remettre aux familles : comment les évaluations sont analysées, qui valide les notes, ce qu\'il advient des copies.',
};

const BLOCKS: { title: string; items: string[] }[] = [
  {
    title: 'Ce que fait Copie Express',
    items: [
      'L\'enseignant photographie les copies de la classe avec son téléphone ou un scanner.',
      'Copie Express lit les réponses rédigées, les compare au barème préparé par l\'enseignant, et propose une note détaillée.',
      'L\'enseignant relit, ajuste et valide chaque note. Aucune note n\'est transmise sans son accord.',
    ],
  },
  {
    title: 'Qui décide ?',
    items: [
      'L\'enseignant reste seul responsable de la note finale : il peut modifier tout élément, à tout moment.',
      'Les commentaires et pistes de progression sont des suggestions que l\'enseignant relit avant remise.',
      'Le bilan remis à l\'élève mentionne que l\'analyse a été validée par l\'enseignant.',
    ],
  },
  {
    title: 'Que deviennent les copies ?',
    items: [
      'Les photos sont conservées 30 jours, puis supprimées. Elles ne servent jamais à autre chose que votre évaluation.',
      'Hébergement en Europe (Irlande). Conformité RGPD.',
      'L\'enseignant peut supprimer toutes les données à tout moment.',
      'Aucune donnée n\'est revendue, partagée ou utilisée à des fins publicitaires.',
    ],
  },
];

export default function NoticeFamillesPage() {
  return (
    <main className="min-h-screen bg-secondary/30">
      <div className="container mx-auto max-w-3xl px-4 py-12 notice-print-zone">
        <div className="flex justify-between items-center flex-wrap gap-2 mb-8">
          <Link href="/" className="text-sm text-muted-foreground hover:underline print:hidden">← Copie Express</Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Notice d&apos;information aux familles</CardTitle>
            <CardDescription>
              À imprimer et à remettre aux élèves en début d&apos;année ou avant la première évaluation analysée avec Copie Express.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {BLOCKS.map((b) => (
              <section key={b.title} className="space-y-2">
                <h2 className="text-lg font-semibold">{b.title}</h2>
                <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
                  {b.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}

            <p className="text-xs text-muted-foreground border-t pt-4">
              Copie Express — service d&apos;assistance à la correction destiné aux enseignants.
              Renseignements auprès de l&apos;enseignant de votre enfant ou sur copie-express-v1.vercel.app
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
