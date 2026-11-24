import type { Metadata } from 'next';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyEvaluationsIllustration } from '@/components/illustrations';
import { FadeIn } from '@/components/fade-in';
import { Plus, FileText, Clock, CheckCircle2, Zap, TrendingUp, ArrowRight } from 'lucide-react';
import { planFromUser } from '@/lib/plan';
import { subjectLabel, levelLabel } from '@/lib/labels';

export const metadata: Metadata = { title: 'Mes évaluations' };

export const dynamic = 'force-dynamic';

export default async function AppDashboardPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: evaluations } = await supabase
    .from('evaluations')
    .select('*, copies(status, validated_by_user)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: userData } = await supabase
    .from('users')
    .select('trial_copies_count')
    .eq('id', user.id)
    .single();

  const totalCopiesUploaded = evaluations?.reduce((sum, e) => sum + (e.copies?.length || 0), 0) || 0;
  const totalCopiesValidated = evaluations?.reduce(
    (sum, e) => sum + (e.copies?.filter((c: any) => c.validated_by_user).length || 0), 0
  ) || 0;
  const timeSavedMin = totalCopiesValidated * 3;

  const account = planFromUser(user, userData?.trial_copies_count || 0);
  const quotaPct = account.limit > 0 ? Math.min(100, (account.used / account.limit) * 100) : 0;
  const toValidate = evaluations?.reduce(
    (sum, e) => sum + (e.copies?.filter((c: any) => c.status === 'ready_to_validate' && !c.validated_by_user).length || 0), 0
  ) || 0;

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-8">
      <FadeIn>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Mes évaluations</h1>
            <p className="text-muted-foreground mt-1">
              {evaluations?.length || 0} évaluation{(evaluations?.length || 0) > 1 ? 's' : ''} ·{' '}
              {totalCopiesValidated} / {totalCopiesUploaded} copies validées
              {toValidate > 0 ? ` · ${toValidate} à valider` : ''}
            </p>
          </div>
          <Button asChild size="lg" className="shadow-lg shadow-primary/20">
            <Link href="/app/new">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle évaluation
            </Link>
          </Button>
        </div>
      </FadeIn>

      {/* Stats cards avec gradient */}
      <FadeIn delay={100}>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="overflow-hidden relative group hover:shadow-md transition-shadow">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <CardHeader className="pb-2 relative">
              <CardDescription className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Temps gagné (estimation)
              </CardDescription>
              <CardTitle className="text-3xl font-bold text-primary">
                {Math.round(timeSavedMin / 60)}h {timeSavedMin % 60}min
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <p className="text-xs text-muted-foreground">
                {totalCopiesValidated} copie{totalCopiesValidated > 1 ? 's' : ''} validée{totalCopiesValidated > 1 ? 's' : ''} · base : 3 min par copie
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" /> Mon forfait
              </CardDescription>
              <CardTitle className="text-xl">{account.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">
                    {account.paid ? 'Copies lues ce mois-ci' : 'Copies d’essai utilisées'}
                  </span>
                  <span className="font-medium">{account.used} / {account.limit}</span>
                </div>
                <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-orange-500"
                    style={{ width: `${quotaPct}%` }}
                  />
                </div>
                {!account.paid && (
                  <Button variant="outline" size="sm" className="mt-2 w-full" asChild>
                    <Link href="/pricing">Voir les forfaits</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Copies validées
              </CardDescription>
              <CardTitle className="text-3xl font-bold">{totalCopiesValidated}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Photos supprimées après 30 jours
              </p>
            </CardContent>
          </Card>
        </div>
      </FadeIn>

      {/* Liste ou empty state */}
      {(!evaluations || evaluations.length === 0) ? (
        <FadeIn delay={200}>
          <Card className="border-dashed border-2">
            <CardContent className="p-12 text-center space-y-4">
              <EmptyEvaluationsIllustration className="h-48 w-48 mx-auto" />
              <div>
                <h2 className="text-2xl font-semibold">Pas encore d'évaluation</h2>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Crée ta première évaluation, dépose tes copies, puis vérifie et valide les notes proposées.
                </p>
              </div>
              <div className="flex justify-center">
                <Button asChild size="lg" className="shadow-lg shadow-primary/20">
                  <Link href="/app/new">
                    <Plus className="h-4 w-4 mr-2" />
                    Créer ma première évaluation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      ) : (
        <FadeIn delay={200}>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Évaluations récentes</h2>
              {evaluations.length > 5 && (
                <Link href="/app/usage" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
                  Tout voir <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
            {evaluations.slice(0, 8).map((evaluation, idx) => {
              const copies = evaluation.copies || [];
              const validated = copies.filter((c: any) => c.validated_by_user).length;
              const total = copies.length;
              const pending = copies.filter((c: any) => c.status === 'ready_to_validate' && !c.validated_by_user).length;
              const progress = total > 0 ? (validated / total) * 100 : 0;
              const isComplete = validated === total && total > 0;

              return (
                <Link
                  key={evaluation.id}
                  href={`/app/evaluations/${evaluation.id}`}
                  className="block animate-fade-in"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <Card className="hover:bg-secondary/30 hover:shadow-md transition-colors duration-200 ease-out cursor-pointer group">
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{evaluation.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {[subjectLabel(evaluation.subject), levelLabel(evaluation.class_level)].filter(Boolean).join(' · ')}
                          {pending > 0 ? ` · ${pending} à valider` : ''}
                        </p>
                        {total > 0 && (
                          <div className="mt-1.5 h-1 bg-secondary rounded-full overflow-hidden w-32">
                            <div
                              className={`h-full transition-colors duration-200 ease-out ${isComplete ? 'bg-green-500' : 'bg-primary'}`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {isComplete ? (
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Terminée
                          </Badge>
                        ) : total === 0 ? (
                          <Badge variant="secondary">À démarrer</Badge>
                        ) : (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {validated}/{total}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </FadeIn>
      )}
    </div>
  );
}