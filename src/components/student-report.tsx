'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { countErrorTypes, ERROR_CATEGORIES } from './error-types';
import { frPoints, normId, type CopyAnswer, type ScaleQuestion } from '@/lib/scoring';

// Bilan élève imprimable. Règle de vocabulaire : ce document part chez les familles,
// il ne décrit jamais le fonctionnement de l'outil.

function truncate(s: string | null | undefined, n: number) {
  if (!s) return '—';
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function buildProgressText(errorCounts: Record<string, number>) {
  const entries = Object.entries(errorCounts).sort((a, b) => b[1] - a[1]);
  if (!entries.length) return '';
  const parts = entries.map(([type, n]) => {
    const cat = ERROR_CATEGORIES[type];
    const label = cat ? cat.label.toLowerCase() : type;
    return n === 1 ? label : `${label} (${n} fois)`;
  });
  if (entries.length === 1) return `Points à retravailler : ${parts[0]}.`;
  const head = parts.slice(0, -1).join(', ');
  return `Points à retravailler : ${head} et ${parts[parts.length - 1]}.`;
}

export function StudentReport({ studentName, answers, scale, score, max, evaluationTitle, validatedAt }: {
  studentName: string;
  answers: CopyAnswer[];
  scale: ScaleQuestion[];
  score: number | null;
  max: number;
  evaluationTitle?: string;
  validatedAt?: string | null;
}) {
  const [open, setOpen] = useState(false);

  const note20 = score !== null && max > 0 ? Math.round((score / max) * 20 * 4) / 4 : null;
  const wrong = answers.filter((a) => a.is_correct !== true);
  const right = answers.filter((a) => a.is_correct === true);
  const errorCounts = countErrorTypes(answers);
  const skillOf = (a: CopyAnswer) => scale.find((q) => normId(q.id) === normId(a.question_id))?.skill || null;
  const skillsOk = Array.from(new Set(right.map(skillOf).filter((s): s is string => !!s)));
  const dateStr = new Date(validatedAt || Date.now()).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>Bilan de l'élève</Button>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4 overflow-auto">
          <div className="bg-background w-full max-w-2xl max-h-[90vh] overflow-auto rounded-lg shadow-xl">
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between print:hidden">
                <div>
                  <h2 className="text-lg font-bold">Bilan de {studentName}</h2>
                  <p className="text-sm text-muted-foreground">
                    À imprimer ou à enregistrer en PDF pour l'élève ou sa famille.
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Fermer"><X className="h-4 w-4" /></Button>
              </div>

              <div className="report-print-zone bg-white text-slate-900 rounded-lg p-8 text-[13px] leading-relaxed">
                <div className="flex justify-between items-start border-b-2 border-slate-800 pb-3 mb-5">
                  <div>
                    <div className="text-xl font-bold">Copie Express</div>
                    <div className="text-xs text-slate-500">Bilan d'évaluation</div>
                  </div>
                  <div className="text-right text-xs text-slate-500">
                    <div>{evaluationTitle || 'Évaluation'}</div>
                    <div>{dateStr}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-5">
                  <div>
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-medium">Élève</div>
                    <div className="text-lg font-semibold">{studentName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-medium">Note</div>
                    <div className="text-3xl font-bold">
                      {score !== null && max > 0 ? `${frPoints(score)} / ${frPoints(max)}` : frPoints(score)}
                    </div>
                    {note20 !== null && max !== 20 && (
                      <div className="text-xs text-slate-500">soit {frPoints(note20)} / 20</div>
                    )}
                  </div>
                </div>

                {right.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">
                      Acquis — questions réussies
                    </div>
                    <div className="text-sm">{right.map((a) => `Q${a.question_id}`).join(' · ')}</div>
                    {skillsOk.length > 0 && (
                      <div className="text-xs text-slate-500 mt-1">
                        Savoir-faire maîtrisés : {skillsOk.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {wrong.length > 0 && (
                  <div className="mb-4">
                    <div className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-2">
                      Erreurs relevées
                    </div>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-slate-300 text-left text-xs text-slate-500">
                          <th className="py-1.5 pr-2">Question</th>
                          <th className="py-1.5 pr-2">Réponse de l'élève</th>
                          <th className="py-1.5 pr-2">Attendu</th>
                          <th className="py-1.5">Type d'erreur</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wrong.map((a, i) => (
                          <tr key={i} className="border-b border-slate-100 align-top">
                            <td className="py-1.5 pr-2 font-medium">Q{a.question_id}</td>
                            <td className="py-1.5 pr-2 italic" style={{ maxWidth: 180 }}>
                              {a.student_wrote ? `« ${truncate(a.student_wrote, 60)} »` : 'Pas de réponse'}
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
                      Accompagnement conseillé : reprendre avec l'enseignant les notions associées aux erreurs relevées ci-dessus.
                    </p>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-3 mt-6 flex justify-between text-[11px] text-slate-500">
                  <span>Copie Express — analyse validée par l'enseignant</span>
                  <span>copie-express-v1.vercel.app</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 print:hidden">
                <Button variant="outline" onClick={() => setOpen(false)}>Fermer</Button>
                <Button onClick={() => window.print()}>Imprimer / PDF</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
