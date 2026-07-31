import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, FileText, Clock, CheckCircle2 } from 'lucide-react';

export default async function AppDashboardPage() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Récupère les evaluations du user
  const { data: evaluations } = await supabase
    .from('evaluations')
    .select('*, copies(status)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const { data: userData } = await supabase
    .from('users')
    .select('trial_copies_count, subscription_status, subscription_plan')
    .eq('id', user.id)
    .single();

  const totalCopies = evaluations?.reduce((sum, e) => sum + e.total_copies, 0) || 0;

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes évaluations</h1>
          <p className="text-muted-foreground mt-1">
            {evaluations?.length || 0} évaluation{(evaluations?.length || 0) > 1 ? 's' : ''} ·{' '}
            {totalCopies} copie{totalCopies > 1 ? 's' : ''} au total
          </p>
        </div>
        <Button asChild>
          <Link href="/app/new">
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle évaluation
          </Link>
        </Button>
      </div>

      {(!evaluations || evaluations.length === 0) && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center space-y-4">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-xl font-semibold">Pas encore d'évaluation</h2>
              <p className="text-muted-foreground mt-2">
                Crée ta première évaluation. Uploade tes copies. Valide en 30 secondes par copie.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/app/new">
                <Plus className="h-4 w-4 mr-2" />
                Créer ma première évaluation
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Mon forfait</CardDescription>
            <CardTitle className="text-xl">
              {userData?.subscription_status === 'active'
                ? userData.subscription_plan || 'Standard'
                : 'Découverte'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userData?.subscription_status !== 'active' ? (
              <>
                <p className="text-sm text-muted-foreground">
                  {userData?.trial_copies_count || 0} / 10 copies utilisées
                </p>
                <Button variant="outline" size="sm" className="mt-3 w-full" asChild>
                  <Link href="/pricing">Passer à un forfait</Link>
                </Button>
              </>
            ) : (
              <p className="text-sm text-green-700 font-medium">✓ Abonnement actif</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Copies traitées</CardDescription>
            <CardTitle className="text-3xl">{totalCopies}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Suppression auto après 30 jours (RGPD)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Temps économisé</CardDescription>
            <CardTitle className="text-3xl">{Math.round(totalCopies * 3)} min</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Estimation : 3 min/copie en moyenne
            </p>
          </CardContent>
        </Card>
      </div>

      {evaluations && evaluations.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Évaluations récentes</h2>
          {evaluations.map((evaluation) => {
            const validated = evaluation.copies?.filter((c: any) => c.status === 'validated').length || 0;
            const total = evaluation.copies?.length || 0;
            return (
              <Card key={evaluation.id} className="hover:bg-secondary/30 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <Link href={`/app/evaluations/${evaluation.id}`} className="flex-1">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{evaluation.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {evaluation.subject} · {evaluation.class_level} ·{' '}
                          {evaluation.total_copies} copies
                        </p>
                      </div>
                    </div>
                  </Link>
                  <div className="flex items-center gap-3">
                    {validated === total && total > 0 ? (
                      <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Terminée
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {validated}/{total}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}