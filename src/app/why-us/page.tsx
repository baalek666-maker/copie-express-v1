import Link from 'next/link';
import { FadeIn } from '@/components/fade-in';
import { Check, X, Minus } from 'lucide-react';

const comparison = [
  { feature: 'Correction assistée', us: true, sacoche: false, pronote: false, gradescope: true },
  { feature: 'Upload par photo', us: true, sacoche: false, pronote: false, gradescope: false },
  { feature: 'Export SACoche natif', us: true, sacoche: true, pronote: false, gradescope: false },
  { feature: 'Export Pronote natif', us: true, sacoche: false, pronote: true, gradescope: false },
  { feature: 'Détection multi-méthodes', us: true, sacoche: false, pronote: false, gradescope: false },
  { feature: 'RGPD / Données UE', us: true, sacoche: true, pronote: true, gradescope: false },
  { feature: 'Pas de carte bancaire', us: true, sacoche: true, pronote: true, gradescope: false },
  { feature: 'Support email', us: true, sacoche: true, pronote: true, gradescope: true },
  { feature: '30 secondes par copie', us: true, sacoche: false, pronote: false, gradescope: true },
  { feature: 'Sans engagement', us: true, sacoche: true, pronote: true, gradescope: true },
  { feature: 'Gratuit pour tester', us: true, sacoche: true, pronote: true, gradescope: false },
];

export default function WhyUsPage() {
  return (
    <main className="min-h-screen bg-secondary/30">
      <FadeIn>
        <div className="max-w-4xl mx-auto p-6 md:p-12 space-y-16">
          {/* Hero */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Pourquoi choisir <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent italic font-serif">Copie Express</span> ?
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              On a comparé ce qui existe. Voici pourquoi nos profs ne retournent jamais en arrière.
            </p>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Fonctionnalité</th>
                  <th className="text-center py-3 px-4 font-semibold bg-primary/5 rounded-t-lg">
                    <span className="text-primary">Copie Express</span>
                  </th>
                  <th className="text-center py-3 px-4 font-semibold">SACoche</th>
                  <th className="text-center py-3 px-4 font-semibold">Pronote</th>
                  <th className="text-center py-3 px-4 font-semibold">Gradescope</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={i} className="border-b hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4">{row.feature}</td>
                    <td className="text-center py-3 px-4 bg-primary/5">
                      {row.us ? <Check className="h-4 w-4 text-green-600 mx-auto" /> : row.us === null ? <Minus className="h-4 w-4 text-muted-foreground mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.sacoche ? <Check className="h-4 w-4 text-green-600 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.pronote ? <Check className="h-4 w-4 text-green-600 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />}
                    </td>
                    <td className="text-center py-3 px-4">
                      {row.gradescope ? <Check className="h-4 w-4 text-green-600 mx-auto" /> : <X className="h-4 w-4 text-red-400 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verdict */}
          <div className="text-center space-y-6 p-8 bg-primary/5 rounded-2xl border border-primary/10">
            <h2 className="text-2xl font-bold">Le seul outil pensé par un prof, pour des profs.</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              SACoche et Pronote sont des logiciels de gestion scolaire — pas des outils de correction. Gradescope n'est pas conforme RGPD et ne parle pas français. Copie Express est le seul à faire les deux.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/signup" className="inline-flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 rounded-md font-medium transition-colors shadow-lg shadow-primary/20">
                Essayer gratuitement
              </Link>
              <Link href="/pricing" className="inline-flex items-center justify-center border hover:bg-secondary h-11 px-8 rounded-md font-medium transition-colors">
                Voir les tarifs
              </Link>
            </div>
          </div>
        </div>
      </FadeIn>
    </main>
  );
}