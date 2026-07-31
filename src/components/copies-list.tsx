'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Edit3, Loader2, FileText } from 'lucide-react';

interface Copy {
  id: string;
  student_identifier: string | null;
  extracted_answers: any;
  confidence_score: number | null;
  validated_by_user: boolean;
  final_score: number | null;
  status: string;
  ocr_text?: string;
  proposed_score?: number | null;
  proposed_max_score?: number | null;
}

interface Question {
  id: string;
  label: string;
  max_points: number;
}

export function CopiesList({ copies, evaluationId, gradingScale }: {
  copies: Copy[];
  evaluationId: string;
  gradingScale: Question[];
}) {
  const [editingCopy, setEditingCopy] = useState<Copy | null>(null);
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const handleValidate = async (copy: Copy) => {
    const score = computeScore(copy.extracted_answers, gradingScale);
    await supabase.from('copies').update({
      validated_by_user: true,
      final_score: score,
      status: 'validated',
      validated_at: new Date().toISOString(),
    }).eq('id', copy.id);
    router.refresh();
  };

  const computeScore = (answers: any, scale: Question[]) => {
    let total = 0;
    for (const q of scale) {
      const ans = answers?.[q.id];
      // Pour la V1 : scoring simple (présence = point). Pour V2 : barème expert.
      if (ans && ans.trim().length > 0) total += q.max_points * 0.7; // heuristique simple
    }
    return Math.round(total * 100) / 100;
  };

  return (
    <div className="space-y-3">
      {copies.map((copy) => {
        const isValidated = copy.validated_by_user;
        const isReady = copy.status === 'ready_to_validate';
        const isPending = copy.status === 'pending' || copy.status === 'processing';

        return (
          <Card key={copy.id} className={isValidated ? 'border-green-300 bg-green-50/50' : ''}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                    isValidated ? 'bg-green-100 text-green-700' : 'bg-secondary'
                  }`}>
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{copy.student_identifier || 'Élève inconnu'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mt-0.5">
                      {isValidated && (
                        <span className="text-green-700 font-medium">
                          ✓ Note validée : {copy.final_score} / {gradingScale.reduce((s, q) => s + q.max_points, 0)} pts
                        </span>
                      )}
                      {!isValidated && copy.proposed_score !== null && copy.proposed_score !== undefined && (
                        <span className="text-blue-700 font-medium">
                          📊 Note proposée : {copy.proposed_score} / {copy.proposed_max_score} pts
                        </span>
                      )}
                      {!isValidated && copy.confidence_score !== null && (
                        <span className="text-muted-foreground">
                          · Fiabilité {Math.round(copy.confidence_score * 100)}%
                        </span>
                      )}
                      {isPending && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Extraction en cours...
                        </span>
                      )}
                      {isReady && copy.proposed_score === null && (
                        <span>Prêt à valider</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isValidated && (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      OK
                    </Badge>
                  )}
                  {isReady && !isValidated && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => setEditingCopy(copy)}>
                        <Edit3 className="h-3 w-3 mr-1" />
                        Vérifier
                      </Button>
                      <Button size="sm" onClick={() => handleValidate(copy)}>
                        Valider ✓
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {editingCopy && (
        <CopyEditorDialog
          copy={editingCopy}
          gradingScale={gradingScale}
          onClose={() => setEditingCopy(null)}
          onSaved={() => { setEditingCopy(null); router.refresh(); }}
        />
      )}
    </div>
  );
}

function CopyEditorDialog({ copy, gradingScale, onClose, onSaved }: {
  copy: Copy;
  gradingScale: Question[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, string>>(copy.extracted_answers || {});
  const [saving, setSaving] = useState(false);
  const supabase = createBrowserSupabase();

  const handleSave = async () => {
    setSaving(true);
    let total = 0;
    for (const q of gradingScale) {
      const ans = answers[q.id];
      if (ans && ans.trim().length > 0) total += q.max_points * 0.7;
    }
    total = Math.round(total * 100) / 100;

    await supabase.from('copies').update({
      extracted_answers: answers,
      user_corrections: answers,
      validated_by_user: true,
      final_score: total,
      status: 'validated',
      validated_at: new Date().toISOString(),
    }).eq('id', copy.id);

    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-auto">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-auto">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{copy.student_identifier || 'Élève inconnu'}</h2>
              <p className="text-sm text-muted-foreground">
                Vérifie les réponses extraites automatiquement. Corrige si nécessaire.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
          </div>

          {copy.ocr_text && (
            <details className="rounded-md bg-secondary/30 p-3 text-xs">
              <summary className="cursor-pointer font-medium">Voir le texte extrait</summary>
              <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">{copy.ocr_text}</pre>
            </details>
          )}

          {/* Affichage par question/réponse selon ce que Mistral a retourné */}
          <div className="space-y-3">
            {Array.isArray(copy.extracted_answers) ? (
              // Mode barème : array de {question_id, student_wrote, expected, is_correct, confidence}
              copy.extracted_answers.map((a: any, idx: number) => (
                <Card key={idx} className={`p-4 ${a.is_correct ? 'border-green-300 bg-green-50/40' : a.is_correct === false ? 'border-red-200 bg-red-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Question {a.question_id}</span>
                        {a.confidence !== undefined && (
                          <span className="text-xs text-muted-foreground">
                            · Fiabilité {Math.round((a.confidence || 0) * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="text-sm">
                        <div className="text-muted-foreground text-xs">Élève a écrit :</div>
                        <div className="font-mono">{a.student_wrote || <em className="text-muted-foreground">(vide)</em>}</div>
                      </div>
                      {a.expected && (
                        <div className="text-sm mt-2">
                          <div className="text-muted-foreground text-xs">Réponse attendue :</div>
                          <div className="font-mono text-green-700">{a.expected}</div>
                        </div>
                      )}
                    </div>
                    <div className="shrink-0">
                      {a.is_correct === true && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                          ✓ Correct
                        </span>
                      )}
                      {a.is_correct === false && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-medium">
                          ✗ Incorrect
                        </span>
                      )}
                      {a.is_correct === undefined && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">
                          ? Incertain
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              // Mode simple (pas de barème) : objet {q1: "réponse", q2: "..."}
              Object.entries(copy.extracted_answers || {}).map(([qId, ans]) => (
                <Card key={qId} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="font-medium text-sm mb-1">Question {qId}</div>
                      <div className="font-mono text-sm">{String(ans || '') || <em className="text-muted-foreground">(vide)</em>}</div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleSave} disabled={saving} size="lg">
              {saving ? 'Validation...' : '✓ Valider la note proposée'}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={saving}>
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}