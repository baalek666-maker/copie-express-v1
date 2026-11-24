import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, CheckCircle2, ChevronDown } from 'lucide-react';
import { UploadDropzone } from '@/components/upload-dropzone';
import { DeleteEvaluationButton } from '@/components/delete-evaluation-button';
import { CopiesList } from '@/components/copies-list';
import { SubjectUploader } from '@/components/subject-uploader';
import { GradingKeyEditor } from '@/components/grading-key-editor';
import { BaremeAuto } from '@/components/bareme-auto';
import { PhotoTips } from '@/components/photo-tips';
import { ExportButtons } from '@/components/export-buttons';
import { FadeIn } from '@/components/fade-in';
import { subjectLabel, levelLabel } from '@/lib/labels';
import { frPoints } from '@/lib/scoring';

export const metadata: Metadata = { title: 'Évaluation' };

function StepNumber({ n, done }: { n: number; done: boolean }) {
  return (
    <span
      className={`h-7 w-7 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${
        done ? 'bg-green-100 text-green-700' : 'bg-primary text-primary-foreground'
      }`}
      aria-hidden="true"
    >
      {done ? <CheckCircle2 className="h-4 w-4" /> : n}
    </span>
  );
}

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
    .order('created_at', { ascending: true });

  const scale = Array.isArray(evaluation.grading_scale) ? evaluation.grading_scale : [];
  const copyCount = copies?.length || 0;
  const validatedCount = copies?.filter((c) => c.validated_by_user).length || 0;
  const hasSubject = !!evaluation.subject_storage_path;
  const hasExpressBareme = !!evaluation.correct_answers;
  const hasPhotoBareme = !!evaluation.grading_key_storage_path;
  const hasBareme = hasExpressBareme || hasPhotoBareme || !!evaluation.grading_key;
  const baremeTotal = scale.reduce((sum: number, q: any) => sum + (Number(q.max_points) || 0), 0);
  const allValidated = copyCount > 0 && validatedCount === copyCount;

  const status = copyCount === 0
    ? { label: 'À démarrer', variant: 'secondary' as const }
    : allValidated
      ? { label: 'Terminée', variant: 'success' as const }
      : { label: 'En cours', variant: 'warning' as const };

  const step1Summary = [
    hasSubject ? 'sujet déposé' : 'sujet non déposé',
    hasExpressBareme ? `barème sur ${frPoints(baremeTotal)} pts` : hasBareme ? 'corrigé déposé' : 'sans barème',
  ].join(' · ');

  const meta = [subjectLabel(evaluation.subject), levelLabel(evaluation.class_level)].filter(Boolean).join(' · ');

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-5">
      <FadeIn>
        <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 py-1">
          <ArrowLeft className="h-3 w-3" /> Mes évaluations
        </Link>
      </FadeIn>

      <FadeIn delay={50}>
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight break-words">{evaluation.title}</h1>
              <Badge variant={status.variant}>{status.label}</Badge>
            </div>
            <p className="text-muted-foreground text-sm sm:text-base">
              {meta}
              {meta ? ' · ' : ''}
              {copyCount} copie{copyCount > 1 ? 's' : ''} déposée{copyCount > 1 ? 's' : ''}
              {evaluation.total_copies ? ` sur ${evaluation.total_copies} prévues` : ''}
              {copyCount > 0 ? ` · ${validatedCount} validée${validatedCount > 1 ? 's' : ''}` : ''}
            </p>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            {validatedCount > 0 && <ExportButtons evaluationId={params.id} title={evaluation.title} />}
            <DeleteEvaluationButton evaluationId={params.id} />
          </div>
        </div>
      </FadeIn>

      {/* Étape 1 — repliée dès que des copies sont déposées */}
      <details className="group rounded-xl border bg-card" open={copyCount === 0}>
        <summary className="flex items-center gap-3 p-4 sm:p-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <StepNumber n={1} done={hasSubject || hasBareme} />
          <span className="flex-1 min-w-0">
            <span className="font-semibold block">Sujet et barème</span>
            <span className="text-sm text-muted-foreground block truncate">{step1Summary}</span>
          </span>
          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="px-4 sm:px-5 pb-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            Facultatif, mais c'est ce qui rend la note proposée fiable : avec un barème, elle suit tes points
            question par question. Sans barème, chaque réponse juste compte 1 point et tu ajustes en validant.
          </p>
          <SubjectUploader evaluationId={params.id} existingSubjectPath={evaluation.subject_storage_path} />
          {!(hasPhotoBareme && !hasExpressBareme) && (
            <BaremeAuto evaluationId={params.id} hasSubject={hasSubject} alreadyGenerated={hasExpressBareme} />
          )}
          {!(hasExpressBareme && !hasPhotoBareme) && (
            <GradingKeyEditor evaluationId={params.id} initialGradingKey={evaluation.grading_key} />
          )}
        </div>
      </details>

      {/* Étape 2 */}
      <Card>
        <CardHeader className="p-4 sm:p-5 pb-3 sm:pb-3">
          <CardTitle className="flex items-center gap-3 text-base">
            <StepNumber n={2} done={copyCount > 0} />
            {copyCount > 0 ? 'Ajouter des copies' : 'Dépose les copies'}
          </CardTitle>
          <CardDescription className="pl-10">
            Une photo ou un fichier par copie. Depuis ton téléphone, prends-les directement en photo.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0 space-y-3">
          <UploadDropzone evaluationId={params.id} compact={copyCount > 0} />
          <PhotoTips />
        </CardContent>
      </Card>

      {/* Étape 3 */}
      <Card id="copies">
        <CardHeader className="p-4 sm:p-5 pb-3 sm:pb-3">
          <CardTitle className="flex items-center gap-3 text-base">
            <StepNumber n={3} done={allValidated} />
            Vérifie et valide ({validatedCount}/{copyCount})
          </CardTitle>
          <CardDescription className="pl-10">
            Le système propose une note par copie. Tu vérifies, tu corriges si besoin, tu valides : rien n'est exporté sans ton accord.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 pt-0 sm:pt-0">
          {copies && copies.length > 0 ? (
            <CopiesList copies={copies} evaluationId={params.id} gradingScale={scale} evaluationTitle={evaluation.title} />
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Aucune copie pour l'instant. Dépose tes premières copies à l'étape 2.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
