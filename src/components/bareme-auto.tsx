'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Wand2, Save, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getBackendUrl } from '@/lib/backend-url';

type BaremeQuestion = {
  id: string;
  label: string;
  expected: string;
  points: number;
  skill?: string;
};

export function BaremeAuto({
  evaluationId,
  hasSubject,
  alreadyGenerated,
}: {
  evaluationId: string;
  hasSubject: boolean;
  alreadyGenerated: boolean;
}) {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<BaremeQuestion[] | null>(null);
  const [comment, setComment] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      const { data: { session } } = await supabase.auth.getSession();
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/bareme-auto`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ evaluationId, userId: user.id }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.hint || data.error || 'Génération impossible');
      }
      setQuestions(data.questions);
      setComment(data.comment);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const saveAdjustments = async () => {
    if (!questions) return;
    setSaving(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');
      const { data: { session } } = await supabase.auth.getSession();
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/api/bareme-auto`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ evaluationId, userId: user.id, questions }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.hint || data.error || 'Enregistrement impossible');
      setSavedAt(new Date());
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updatePoints = (idx: number, value: string) => {
    if (!questions) return;
    const pts = Math.min(10, Math.max(0.5, parseFloat(value.replace(',', '.')) || 1));
    const next = [...questions];
    next[idx] = { ...next[idx], points: pts };
    setQuestions(next);
  };

  const total = questions?.reduce((s, q) => s + q.points, 0) || 0;

  // Déjà généré et pas en cours d'édition → état discret
  if (alreadyGenerated && !questions && !loading) {
    return (
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Barème express généré
            </span>
            <Button size="sm" variant="outline" onClick={generate} disabled={loading}>
              <Wand2 className="h-3 w-3 mr-1" />
              Regénérer
            </Button>
          </CardTitle>
          <CardDescription>
            Les corrections s'appuient sur ce barème. Tu peux le régénérer ou l'ajuster.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          Barème express <span className="text-sm font-normal text-muted-foreground">(nouveau)</span>
        </CardTitle>
        <CardDescription>
          {hasSubject
            ? 'Génère un barème complet depuis ton sujet : questions, points, savoir-faire et réponses attendues. Modifiable avant correction.'
            : 'Upload d\'abord le sujet ci-dessus, puis génère le barème en un clic.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!questions && (
          <Button onClick={generate} disabled={loading || !hasSubject} className="w-full sm:w-auto">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyse du sujet... (~20 sec)
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4 mr-2" />
                Générer le barème depuis le sujet
              </>
            )}
          </Button>
        )}

        {questions && (
          <div className="space-y-3">
            {comment && (
              <p className="text-sm text-muted-foreground italic">💡 {comment}</p>
            )}
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left">
                  <tr>
                    <th className="p-2 font-medium w-10">#</th>
                    <th className="p-2 font-medium">Question</th>
                    <th className="p-2 font-medium hidden md:table-cell">Réponse attendue</th>
                    <th className="p-2 font-medium w-20 text-right">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q, i) => (
                    <tr key={q.id} className="border-t">
                      <td className="p-2 text-muted-foreground">{q.id}</td>
                      <td className="p-2">
                        <p className="font-medium">{q.label}</p>
                        {q.skill && <Badge variant="outline" className="mt-1 text-xs font-normal">{q.skill}</Badge>}
                      </td>
                      <td className="p-2 text-muted-foreground hidden md:table-cell">{q.expected}</td>
                      <td className="p-2 text-right">
                        <input
                          type="number"
                          min={0.5}
                          max={10}
                          step={0.5}
                          value={q.points}
                          onChange={(e) => updatePoints(i, e.target.value)}
                          className="w-16 text-right rounded-md border px-2 py-1 bg-background"
                          aria-label={`Points question ${q.id}`}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-muted/50">
                  <tr>
                    <td colSpan={3} className="p-2 font-medium">Total</td>
                    <td className="p-2 text-right font-bold">{total} pts</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <Button onClick={saveAdjustments} disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Valider le barème
                  </>
                )}
              </Button>
              {savedAt && (
                <span className="text-sm text-green-700">✓ Barème enregistré à {savedAt.toLocaleTimeString('fr-FR')}</span>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
