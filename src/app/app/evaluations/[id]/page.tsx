import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, FileText } from 'lucide-react';
import { UploadDropzone } from '@/components/upload-dropzone';
import { CopiesList } from '@/components/copies-list';
import { SubjectUploader } from '@/components/subject-uploader';
import { GradingKeyEditor } from '@/components/grading-key-editor';
import { PhotoTips } from '@/components/photo-tips';
import { FadeIn } from '@/components/fade-in';

export default async function EvaluationDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: evaluation } = await supabase
    .from('evaluations')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (!evaluation) notFound();

  const { data: copies } = await supabase
    .from('copies')
    .select('*')
    .eq('evaluation_id', params.id)
    .order('created_at', { ascending: false });

  const validatedCount = copies?.filter((c) => c.validated_by_user).length || 0;

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      <FadeIn>
        <div>
          <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Mes évaluations
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={50}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{evaluation.title}</h1>
              <Badge variant={evaluation.status === 'completed' ? 'success' : 'secondary'}>
                {evaluation.status === 'completed' ? 'Terminée' : evaluation.status === 'draft' ? 'Brouillon' : 'En cours'}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              {evaluation.subject} · {evaluation.class_level} · {evaluation.total_copies} copies prévues
            </p>
          </div>
          <div className="flex gap-2">
            {validatedCount > 0 && (
              <>
                <Button variant="outline" asChild>
                  <a href={`/api/export?evaluationId=${params.id}&format=sacoche`}>
                    <Download className="h-4 w-4 mr-2" />
                    Export SACoche
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={`/api/export?evaluationId=${params.id}&format=pronote`}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Pronote
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </FadeIn>

      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total points</CardDescription>
            <CardTitle className="text-2xl">
              {evaluation.grading_scale.reduce((sum: number, q: any) => sum + Number(q.max_points), 0)} pts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Sur {evaluation.grading_scale.length} exercice{evaluation.grading_scale.length > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Copies uploadées</CardDescription>
            <CardTitle className="text-2xl">{copies?.length || 0} / {evaluation.total_copies}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {validatedCount} validée{validatedCount > 1 ? 's' : ''}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Statut</CardDescription>
            <CardTitle className="text-2xl">
              {validatedCount === (copies?.length || 0) && (copies?.length || 0) > 0 ? '✓ Prêt' : '⏳ En cours'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {copies?.filter((c) => c.status === 'ready_to_validate').length || 0} en attente de validation
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <PhotoTips />

        {!evaluation.grading_key && !evaluation.grading_key_storage_path && (
          <Card className="border-amber-300 bg-amber-50">
            <CardContent className="p-4 flex items-start gap-3">
              <FileText className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-amber-900">📊 Pas de barème ? La correction automatique est moins fiable.</p>
                <p className="text-sm text-amber-800 mt-1">
                  Sans barème, le système note en se basant sur le sujet et les réponses attendues classiques (très efficace pour les maths/calculs, moins pour les dissertations ou réponses ouvertes).
                  Pour une précision maximale, upload une photo de ton corrigé type → notation exacte question par question.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <SubjectUploader
          evaluationId={params.id}
          existingSubjectPath={evaluation.subject_storage_path}
        />

        <GradingKeyEditor
          evaluationId={params.id}
          initialGradingKey={evaluation.grading_key}
        />

        <Card>
          <CardHeader>
            <CardTitle>Uploader des copies</CardTitle>
            <CardDescription>
              Photo de pile, photos individuelles, ou PDF multi-pages. Jusqu'à 100 fichiers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UploadDropzone evaluationId={params.id} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Copies ({copies?.length || 0})</CardTitle>
          <CardDescription>
            Clique sur une copie pour valider, corriger les réponses, ou la noter.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {copies && copies.length > 0 ? (
            <CopiesList copies={copies} evaluationId={params.id} gradingScale={evaluation.grading_scale} />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune copie pour l'instant. Uploade tes premières copies ci-dessus.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}