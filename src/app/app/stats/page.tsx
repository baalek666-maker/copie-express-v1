'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Users, FileText, Award, Loader2, ArrowLeft } from 'lucide-react';

interface EvaluationStats {
  id: string;
  title: string;
  subject: string;
  class_level: string;
  created_at: string;
  total_copies: number | null;
  validated_count: number;
  avg_score: number;
  max_score: number;
  min_score: number;
  pass_rate: number; // % copies avec note ≥ moyenne/2
}

export default function StatsDashboard() {
  const [stats, setStats] = useState<EvaluationStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'date' | 'avg' | 'count'>('date');
  const router = useRouter();
  const supabase = createBrowserSupabase();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data: evaluations, error } = await supabase
        .from('evaluations')
        .select('id, title, subject, class_level, created_at, total_copies')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!evaluations?.length) { setStats([]); setLoading(false); return; }

      // Fetch copies for each evaluation and compute stats
      const statsList: EvaluationStats[] = [];
      for (const evalItem of evaluations) {
        const { data: copies } = await supabase
          .from('copies')
          .select('validated_by_user, proposed_score, proposed_max_score')
          .eq('evaluation_id', evalItem.id);

        const validated = (copies || []).filter((c) => c.validated_by_user);
        const scores = validated
          .map((c) => c.proposed_score)
          .filter((s): s is number => s !== null && s !== undefined);

        if (scores.length > 0) {
          const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
          const max = Math.max(...scores);
          const min = Math.min(...scores);
          const maxPossible = validated[0]?.proposed_max_score || 1;
          const passRate = scores.filter((s) => s >= (maxPossible / 2)).length / scores.length;

          statsList.push({
            id: evalItem.id,
            title: evalItem.title,
            subject: evalItem.subject,
            class_level: evalItem.class_level,
            created_at: evalItem.created_at,
            total_copies: evalItem.total_copies,
            validated_count: validated.length,
            avg_score: Math.round(avg * 100) / 100,
            max_score: max,
            min_score: min,
            pass_rate: Math.round(passRate * 100),
          });
        } else if ((copies || []).length > 0) {
          // Copies exist but none validated yet
          statsList.push({
            id: evalItem.id,
            title: evalItem.title,
            subject: evalItem.subject,
            class_level: evalItem.class_level,
            created_at: evalItem.created_at,
            total_copies: evalItem.total_copies,
            validated_count: 0,
            avg_score: 0,
            max_score: 0,
            min_score: 0,
            pass_rate: 0,
          });
        }
      }

      setStats(statsList);
    } catch (err) {
      console.error('Stats error:', err);
    }
    setLoading(false);
  };

  const sortedStats = [...stats].sort((a, b) => {
    if (sortBy === 'avg') return b.avg_score - a.avg_score;
    if (sortBy === 'count') return (b.validated_count || 0) - (a.validated_count || 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const globalAvg = stats.length > 0
    ? Math.round((stats.reduce((s, e) => s + e.avg_score, 0) / stats.filter((e) => e.validated_count > 0).length) * 100) / 100
    : 0;
  const globalTotal = stats.reduce((s, e) => s + (e.validated_count || 0), 0);

  const subjectColors: Record<string, string> = {
    maths: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    francais: 'text-red-600 bg-red-100 dark:bg-red-900/30',
    anglais: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    histoire: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
    svt: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30',
    physique: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.push('/app')} className="mb-2 -ml-2">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Statistiques de correction sur toutes tes évaluations
          </p>
        </div>
      </div>

      {stats.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">Aucune statistique</h3>
            <p className="text-muted-foreground mt-1">
              Corrige tes premières copies pour voir tes statistiques apparaître ici.
            </p>
            <Button className="mt-4" onClick={() => router.push('/app/new')}>
              Créer une évaluation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" />
                  Évaluations
                </CardDescription>
                <CardTitle className="text-2xl">{stats.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  Copies corrigées
                </CardDescription>
                <CardTitle className="text-2xl">{globalTotal}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Moyenne générale
                </CardDescription>
                <CardTitle className="text-2xl">{globalAvg}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  Taux réussite
                </CardDescription>
                <CardTitle className="text-2xl">
                  {stats.some((e) => e.validated_count > 0)
                    ? Math.round((stats.reduce((s, e) => s + e.pass_rate, 0) / stats.filter((e) => e.validated_count > 0).length)) + '%'
                    : '—'}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Sort + evaluation list */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Par évaluation</h2>
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Plus récentes</SelectItem>
                <SelectItem value="avg">Meilleure moyenne</SelectItem>
                <SelectItem value="count">Plus de copies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            {sortedStats.map((s) => {
              const colorClass = subjectColors[s.subject] || 'text-gray-600 bg-gray-100 dark:bg-gray-800';
              const barWidth = s.max_score > 0 ? (s.avg_score / s.max_score) * 100 : 0;

              return (
                <Card
                  key={s.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(`/app/evaluations/${s.id}`)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold truncate">{s.title}</h3>
                          <Badge variant="secondary" className="text-xs shrink-0">
                            {s.subject}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">
                          {s.class_level} · Créée le {new Date(s.created_at).toLocaleDateString('fr-FR')} · {s.validated_count}/{s.total_copies || '?'} copies
                        </p>

                        {s.validated_count > 0 ? (
                          <>
                            {/* Score bar */}
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-mono w-12">{s.avg_score}</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${colorClass.split(' ')[0]}`}
                                  style={{ width: `${Math.min(barWidth, 100)}%` }}
                                />
                              </div>
                              <span className="text-sm font-mono text-muted-foreground w-12 text-right">{s.max_score}</span>
                            </div>

                            {/* Mini stats */}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Min : <span className="font-mono font-medium">{s.min_score}</span></span>
                              <span>Max : <span className="font-mono font-medium">{s.max_score}</span></span>
                              <span>Taux réussite : <span className="font-medium">{s.pass_rate}%</span></span>
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground italic">
                            En attente de validation — les stats apparaîtront ici après validation
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}