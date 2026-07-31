import { createServerSupabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

import { FileText } from 'lucide-react';
import Link from 'next/link';

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
    sum + (e.copies?.filter((c: any) => c.validated_by_user).length || 0), 0) || 0;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Mon usage</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Évaluations créées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{evaluations?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Copies traitées</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{totalCopies}</p>
            <p className="text-xs text-muted-foreground">{validatedCopies} validées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Temps économisé (estimé)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{Math.round(validatedCopies * 3)} min</p>
            <p className="text-xs text-muted-foreground">≈ 3 min par copie</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des évaluations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {evaluations?.map((e) => (
            <Link
              key={e.id}
              href={`/app/evaluations/${e.id}`}
              className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/30"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="font-medium text-sm">{e.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(e.created_at).toLocaleDateString('fr-FR')} · {e.subject}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {e.copies?.filter((c: any) => c.validated_by_user).length || 0} / {e.copies?.length || 0} validées
              </p>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}