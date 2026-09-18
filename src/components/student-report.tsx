'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { countErrorTypes, ERROR_CATEGORIES } from './error-types';

// Bilan eleve imprimable. Regle VOC : jamais de mention IA ni "automatique".

type CopyData = {
  id: string;
  student_identifier: string | null;
  final_score: number | null;
  proposed_score?: number | null;
  proposed_max_score?: number | null;
  status: string;
  extracted_answers: any;
  validated_at?: string | null;
};

type BaremeItem = {
  question_id: string;
  student_wrote: string | null;
  expected: string | null;
  is_correct: boolean | null;
  error_type: string | null;
  skill?: string | null;
};

function truncate(s: string | null, n: number) {
  if (!s) return '—';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function buildProgressText(errorCounts: Record<string, number>) {
  const entries = Object.entries(errorCounts).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return '';
  const parts = entries.map(([type, n]) => {
    const cat = ERROR_CATEGORIES[type];
    const label = cat ? cat.label.toLowerCase() : type;
    return n === 1 ? label : label + ' (' + n + ' fois)';
  });
  if (entries.length === 1) return 'Points a retravailler : ' + parts[0] + '.';
  const head = parts.slice(0, -1).join(', ');
  return 'Points a retravailler : ' + head + ' et ' + parts[parts.length - 1] + '.';
}

export function StudentReport({ copy, evaluationTitle, maxTotalPoints }: {
  copy: CopyData;
  evaluationTitle?: string;
  maxTotalPoints: number;
}) {
  const [open, setOpen] = useState(false);

  const answers: BaremeItem[] = Array.isArray(copy.extracted_answers) ? copy.extracted_answers : [];
  const validated = copy.status === 'validated' || copy.final_score !== null;
  const score = validated ? copy.final_score : copy.proposed_score;
  const maxPoints = validated
    ? (maxTotalPoints || copy.proposed_max_score || 0)
    : (copy.proposed_max_score || maxTotalPoints || 0);
  const note20 = score !== null && score !== undefined && maxPoints > 0
    ? Math.round((score / maxPoints) * 20 * 4) / 4
    : null;

  const wrong = answers.filter((a) => a.is_correct === false);
  const right = answers.filter((a) => a.is_correct === true);
  const errorCounts = countErrorTypes(copy.extracted_answers);
  const skillsOk = Array.from(new Set(
    right.map((a) => a.skill || null).filter((s): s is string => !!s)
  ));
  const dateStr = new Date(copy.validated_at || Date.now()).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>📄 Bilan</Button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-auto rounded-lg shadow-xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between print:hidden">
                <div>
                  <h2 className="text-lg font-bold">Bilan de {copy.student_identifier || 'l eleve'}</h2>
                  <p className="text-sm text-muted-foreground">
                    A imprimer ou enregistrer en PDF pour l eleve ou les familles.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>✕</Button>
              </div>

              <div className="report-print-zone bg-white text-slate-900 rounded-lg p-8 text-[13px] leading-relaxed">
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3 mb-5">
                  <div>
                    <div className="text-xl font-bold">Copie Express</div>
                    <div className="text-xs text-slate-500">Analyse d evaluation scolaire</div>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div>{evaluationTitle || 'Évaluation'}</div>
                    <div>{dateStr}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-5">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-medium">Eleve</div>
                    <div className="text-lg font-semibold">{copy.student_identifier || '—'}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-medium">Note</div>
                    <div className="text-3xl font-bold">
                      {note20 !== null ? note20 + ' / 20' : (score ?? '—') + ' / ' + (maxPoints || '—') + ' pts'}
                    </div>
                    {note20 !== null && maxPoints > 0 && (
                      <div className="text-xs text-slate-500">{score} points sur {maxPoints}</div>
                    )}
                  </div>
                </div>

                {right.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">
                      Acquis — questions reussies
                    </div>
                    <div className="text-sm">{right.map((a) => 'Q' + a.question_id).join(' · ')}</div>
                    {skillsOk.length > 0 && (
                      <div className="text-xs text-slate-500 mt-1">
                        Savoir-faire maitrises : {skillsOk.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {wrong.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">
                      Erreurs relevees
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-300 text-left text-xs text-slate-500">
                          <th className="py-1.5 pr-2">Question</th>
                          <th className="py-1.5 pr-2">Reponse de l eleve</th>
                          <th className="py-1.5 pr-2">Attendu</th>
                          <th className="py-1.5">Type d erreur</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wrong.map((a, i) => (
                          <tr key={i} className="border-b border-slate-100 align-top">
                            <td className="py-1.5 pr-2 font-medium">Q{a.question_id}</td>
                            <td className="py-1.5 pr-2 italic" style={{ maxWidth: 180 }}>
                              &quot;{truncate(a.student_wrote, 60)}&quot;
                            </td>
                            <td className="py-1.5 pr-2" style={{ maxWidth: 180 }}>{truncate(a.expected, 60)}</td>
                            <td className="py-1.5 text-xs">
                              {a.error_type && ERROR_CATEGORIES[a.error_type]
                                ? ERROR_CATEGORIES[a.error_type].label
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {Object.keys(errorCounts).length > 0 && (
                  <div className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded">
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-1">
                      Pour progresser
                    </div>
                    <p className="text-sm">{buildProgressText(errorCounts)}</p>
                  </div>
                )}

                {note20 !== null && note20 < 10 && (
                  <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded">
                    <p className="text-sm">
                      Accompagnement conseille : reprendre avec l enseignant les notions associees aux erreurs relevees ci-dessus.
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-3 mt-6 flex justify-between text-[11px] text-slate-500">
                  <span>Copie Express — analyse validee par l enseignant</span>
                  <span>copie-express-v1.vercel.app</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 print:hidden">
                <Button variant="outline" onClick={() => setOpen(false)}>Fermer</Button>
                <Button onClick={() => window.print()}>🖨️ Imprimer / PDF</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
