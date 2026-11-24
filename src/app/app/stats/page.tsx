import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ErrorTypeBadges } from '@/components/error-types';
import { BarChart3, FileText, Target, Users } from 'lucide-react';
import { asAnswers, computeCopyScore, frPoints, maxFor, normId, pointsFor, type ScaleQuestion } from '@/lib/scoring';
import { subjectLabel, levelLabel } from '@/lib/labels';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Résultats' };

interface EvalResult {
  id: string;
  title: string;
  meta: string;
  createdAt: string;
  total: number;
  validated: number;
  avg20: number | null;
  min20: number | null;
  max20: number | null;
  passRate: number | null;
  hardest: { label: string; rate: number }[];
  errors: Record<string, number>;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

function buildResult(evaluation: any): EvalResult {
  const scale: ScaleQuestion[] = Array.isArray(evaluation.grading_scale) ? evaluation.grading_scale : [];
  const copies: any[] = evaluation.copies || [];
  const validated = copies.filter((c) => c.validated_by_user);

  const notes20: number[] = [];
  const perQuestion = new Map<string, { label: string; got: number; max: number }>();
  const errors: Record<string, number> = {};

  for (const copy of validated) {
    const answers = asAnswers(copy.extracted_answers);
    const computed = computeCopyScore(answers, scale);
    const score = copy.final_score != null ? Number(copy.final_score) : computed.score;
    if (computed.max > 0) notes20.push(Math.min(20, (score / computed.max) * 20));

    for (const a of answers) {
      const max = maxFor(a, scale, computed.weighted);
      if (max <= 0) continue;
      const key = normId(a.question_id);
      const entry = perQuestion.get(key) || { label: `Question ${a.question_id}`, got: 0, max: 0 };
      entry.got += pointsFor(a, max);
      entry.max += max;
      perQuestion.set(key, entry);
      if (a.is_correct !== true && a.error_type) errors[a.error_type] = (errors[a.error_type] || 0) + 1;
    }
  }

  const hardest = Array.from(perQuestion.values())
    .map((q) => ({ label: q.label, rate: q.max > 0 ? Math.round((q.got / q.max) * 100) : 0 }))
    .filter((q) => q.rate < 60)
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 3);

  const has = notes20.length > 0;
  return {
    id: evaluation.id,
    title: evaluation.title,
    meta: [subjectLabel(evaluation.subject), levelLabel(evaluation.class_level)].filter(Boolean).join(' · '),
    createdAt: evaluation.created_at,
    total: copies.length,
    validated: validated.length,
    avg20: has ? round1(notes20.reduce((s, n) => s + n, 0) / notes20.length) : null,
    min20: has ? round1(Math.min(...notes20)) : null,
    max20: has ? round1(Math.max(...notes20)) : null,
    passRate: has ? Math.round((notes20.filter((n) => n >= 10).length / notes20.length) * 100) : null,
    hardest,
    errors,
  };
}

export default async function StatsPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: evaluations } = await supabase
    .from('evaluations')
    .select('id, title, subject, class_level, created_at, grading_scale, copies(validated_by_user, final_score, extracted_answers)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const results = (evaluations || []).map(buildResult).filter((r) => r.total > 0);
  const withNotes = results.filter((r) => r.avg20 !== null);
  const validatedTotal = results.reduce((s, r) => s + r.validated, 0);
  const weight = withNotes.reduce((s, r) => s + r.validated, 0);
  const globalAvg = weight > 0 ? round1(withNotes.reduce((s, r) => s + (r.avg20 as number) * r.validated, 0) / weight) : null;
  const globalPass = weight > 0 ? Math.round(withNotes.reduce((s, r) => s + (r.passRate as number) * r.validated, 0) / weight) : null;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Résultats</h1>
        <p className="text-muted-foreground mt-1">
          Les moyennes de tes classes et les questions qui ont posé problème, calculées sur les copies validées.
        </p>
      </div>

      {results.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="p-10 text-center space-y-3">
            <BarChart3 className="h-10 w-10 mx-auto text-muted-foreground" />
            <h2 className="text-xl font-semibold">Pas encore de résultats</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Dès que tu valides des copies, la moyenne de la classe et les questions les moins réussies apparaissent ici.
            </p>
            <Button asChild>
              <Link href="/app/new">Créer une évaluation</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1"><FileText className="h-3.5 w-3.5" /> Évaluations</CardDescription>
                <CardTitle className="text-2xl">{results.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Copies validées</CardDescription>
                <CardTitle className="text-2xl">{validatedTotal}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1"><BarChart3 className="h-3.5 w-3.5" /> Moyenne générale</CardDescription>
                <CardTitle className="text-2xl">{globalAvg !== null ? `${frPoints(globalAvg)} / 20` : '—'}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1"><Target className="h-3.5 w-3.5" /> Au-dessus de 10 / 20</CardDescription>
                <CardTitle className="text-2xl">{globalPass !== null ? `${globalPass} %` : '—'}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-semibold">Par évaluation</h2>
            {results.map((r) => (
              <Link key={r.id} href={`/app/evaluations/${r.id}`} className="block">
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <h3 className="font-semibold truncate">{r.title}</h3>
                        <p className="text-xs text-muted-foreground">
                          {r.meta}{r.meta ? ' · ' : ''}{new Date(r.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} · {r.validated}/{r.total} copies validées
                        </p>
                      </div>
                      {r.avg20 !== null && (
                        <Badge variant="secondary" className="text-sm shrink-0">Moyenne {frPoints(r.avg20)} / 20</Badge>
                      )}
                    </div>

                    {r.avg20 !== null ? (
                      <>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden" aria-hidden="true">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, (r.avg20 / 20) * 100)}%` }} />
                        </div>
                        <div className="flex items-center gap-x-4 gap-y-1 text-xs text-muted-foreground flex-wrap">
                          <span>Note la plus basse : <span className="font-medium text-foreground">{frPoints(r.min20)}</span></span>
                          <span>Note la plus haute : <span className="font-medium text-foreground">{frPoints(r.max20)}</span></span>
                          <span>Au-dessus de 10 : <span className="font-medium text-foreground">{r.passRate} %</span></span>
                        </div>
                        {r.hardest.length > 0 && (
                          <p className="text-sm">
                            <span className="text-muted-foreground">À reprendre en classe : </span>
                            {r.hardest.map((q) => `${q.label} (${q.rate} % de réussite)`).join(' · ')}
                          </p>
                        )}
                        <ErrorTypeBadges counts={r.errors} max={4} />
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Aucune copie validée pour l'instant : les résultats apparaîtront après validation.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
