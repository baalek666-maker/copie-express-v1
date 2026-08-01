import { createServerSupabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FadeIn } from '@/components/fade-in';
import { FileText, Clock, TrendingUp, CheckCircle2, Calendar } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function UsagePage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: evaluations } = await supabase
    .from('evaluations')
    .select('*, copies(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const totalCopies = evaluations?.reduce((sum, e) => sum + (e.copies?.length || 0), 0) || 0;
  const validatedCopies = evaluations?.reduce((sum, e) =>
    sum + (e.copies?.filter((c: any) => c.validated_by_user).length || 0), 0
  ) || 0;

  // Stats par matière
  const bySubject: Record<string, { copies: number; validated: number }> = {};
  evaluations?.forEach((e) => {
    if (!bySubject[e.subject]) bySubject[e.subject] = { copies: 0, validated: 0 };
    bySubject[e.subject].copies += e.copies?.length || 0;
    bySubject[e.subject].validated += e.copies?.filter((c: any) => c.validated_by_user).length || 0;
  });
  const subjectStats = Object.entries(bySubject)
    .sort((a, b) => b[1].copies - a[1].copies)
    .slice(0, 5);

  // Stats 7 derniers jours
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentEvaluations = evaluations?.filter((e) => new Date(e.created_at) > sevenDaysAgo) || [];

  const timeSavedMin = validatedCopies * 3;
  const completionRate = totalCopies > 0 ? Math.round((validatedCopies / totalCopies) * 100) : 0;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <FadeIn>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Mon usage</h1>
          <p className="text-muted-foreground mt-1">
            Tes stats, ton temps gagné, tes matières.
          </p>
        </div>
      </FadeIn>

      {/* Stats principales */}
      <FadeIn delay={100}>
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5 text-xs">
                <FileText className="h-3.5 w-3.5" /> Évaluations
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{evaluations?.length || 0}</CardTitle>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5 text-xs">
                <CheckCircle2 className="h-3.5 w-3.5" /> Copies validées
              </CardDescription>
              <CardTitle className="text-3xl font-bold">
                {validatedCopies}
                <span className="text-sm text-muted-foreground font-normal"> / {totalCopies}</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardHeader className="pb-2 relative">
              <CardDescription className="flex items-center gap-1.5 text-xs">
                <Clock className="h-3.5 w-3.5" /> Temps économisé
              </CardDescription>
              <CardTitle className="text-3xl font-bold text-primary">
                {Math.round(timeSavedMin / 60)}h {timeSavedMin % 60}<span className="text-base">min</span>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5 text-xs">
                <TrendingUp className="h-3.5 w-3.5" /> Taux finalisation
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{completionRate}%</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-orange-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* 7 derniers jours + par matière */}
      <div className="grid md:grid-cols-2 gap-6">
        <FadeIn delay={200}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" />
                Cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{recentEvaluations.length}</p>
              <p className="text-sm text-muted-foreground">
                évaluation{recentEvaluations.length > 1 ? 's' : ''} créée{recentEvaluations.length > 1 ? 's' : ''} ces 7 derniers jours
              </p>
              {recentEvaluations.length > 0 && (
                <div className="mt-4 space-y-2">
                  {recentEvaluations.slice(0, 3).map((e) => (
                    <Link
                      key={e.id}
                      href={`/app/evaluations/${e.id}`}
                      className="flex items-center gap-2 text-sm hover:underline"
                    >
                      <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                      {e.title}
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={250}>
          <Card>
            <CardHeader>
              <CardTitle>Par matière</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {subjectStats.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aucune donnée encore.</p>
              ) : (
                subjectStats.map(([subject, stats]) => {
                  const max = subjectStats[0][1].copies;
                  const pct = max > 0 ? (stats.copies / max) * 100 : 0;
                  return (
                    <div key={subject}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize">{subject}</span>
                        <span className="text-muted-foreground">
                          {stats.validated}/{stats.copies}
                        </span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-orange-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </div>

      {/* Historique */}
      <FadeIn delay={300}>
        <Card>
          <CardHeader>
            <CardTitle>Historique</CardTitle>
            <CardDescription>
              Toutes tes évaluations, des plus récentes aux plus anciennes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {evaluations?.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                Pas encore d'évaluation. Crée ta première →
              </p>
            ) : (
              evaluations?.map((e, idx) => {
                const copies = e.copies || [];
                const validated = copies.filter((c: any) => c.validated_by_user).length;
                const total = copies.length;
                const isComplete = total > 0 && validated === total;
                return (
                  <Link
                    key={e.id}
                    href={`/app/evaluations/${e.id}`}
                    className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/30 transition-colors animate-fade-in"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <FileText className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{e.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(e.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                          })} · {e.subject}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isComplete ? (
                        <Badge variant="success">Terminée</Badge>
                      ) : (
                        <Badge variant="secondary">{validated}/{total}</Badge>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}