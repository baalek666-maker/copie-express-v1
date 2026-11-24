'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { ApiError, backendJson } from '@/lib/api';
import {
  alignToScale,
  asAnswers,
  computeCopyScore,
  doubtfulCount,
  frPoints,
  isSafeCopy,
  maxFor,
  pointsFor,
  round2,
  DOUBT_ANSWER_THRESHOLD,
  type CopyAnswer,
  type ScaleQuestion,
} from '@/lib/scoring';
import { Celebration } from '@/components/celebration';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, CheckCircle2, ClipboardCopy, Compass, Edit3, Loader2, FileText, RotateCw, X } from 'lucide-react';
import { PhotoViewer } from './photo-viewer';
import { ConfidenceBadge } from './confidence-badge';
import { ErrorTypeBadges, countErrorTypes, countErrorTypesAll } from './error-types';
import { StudentReport } from './student-report';
import { toast } from 'sonner';

interface Copy {
  id: string;
  student_identifier: string | null;
  photo_storage_path: string;
  extracted_answers: any;
  confidence_score: number | null;
  validated_by_user: boolean;
  final_score: number | null;
  status: string;
  user_corrections?: any;
  proposed_score?: number | null;
  proposed_max_score?: number | null;
  validated_at?: string | null;
  created_at?: string | null;
}

const byName = (a: Copy, b: Copy) =>
  (a.student_identifier || '').localeCompare(b.student_identifier || '', 'fr', { numeric: true, sensitivity: 'base' });

// Ordre d'affichage : d'abord ce qui demande une action, les copies les moins sûres en tête.
function rank(copy: Copy): number {
  if (copy.status === 'error') return 0;
  if (copy.status === 'ready_to_validate' && !copy.validated_by_user) return 1;
  if (!copy.validated_by_user) return 2;
  return 3;
}

export function CopiesList({ copies, evaluationId, gradingScale, evaluationTitle }: {
  copies: Copy[];
  evaluationId: string;
  gradingScale: ScaleQuestion[] | null;
  evaluationTitle?: string;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [readingIds, setReadingIds] = useState<string[]>([]);
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [bulkRunning, setBulkRunning] = useState(false);
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabase(), []);
  const scale = useMemo(() => (Array.isArray(gradingScale) ? gradingScale : []), [gradingScale]);

  const sorted = useMemo(() => [...copies].sort((a, b) => {
    const r = rank(a) - rank(b);
    if (r !== 0) return r;
    if (rank(a) === 1) {
      const sa = isSafeCopy(a.confidence_score, a.extracted_answers, scale) ? 1 : 0;
      const sb = isSafeCopy(b.confidence_score, b.extracted_answers, scale) ? 1 : 0;
      if (sa !== sb) return sa - sb;
      return (a.confidence_score ?? 0) - (b.confidence_score ?? 0) || byName(a, b);
    }
    return byName(a, b);
  }), [copies, scale]);

  const ready = copies.filter((c) => c.status === 'ready_to_validate' && !c.validated_by_user);
  const safe = ready.filter((c) => isSafeCopy(c.confidence_score, c.extracted_answers, scale));
  const toCheck = ready.length - safe.length;
  const unread = copies.filter((c) => !c.validated_by_user && ['pending', 'error'].includes(c.status));
  const validated = copies.filter((c) => c.validated_by_user);
  const editingCopy = copies.find((c) => c.id === editingId) || null;

  // Tant que des copies sont en cours de lecture, la liste se rafraîchit toute seule.
  const hasProcessing = copies.some((c) => c.status === 'processing');
  useEffect(() => {
    if (!hasProcessing) return;
    const timer = setInterval(() => router.refresh(), 5000);
    return () => clearInterval(timer);
  }, [hasProcessing, router]);

  const celebrate = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const validateOne = async (copy: Copy): Promise<boolean> => {
    const { score } = computeCopyScore(copy.extracted_answers, scale);
    const { error } = await supabase.from('copies').update({
      validated_by_user: true,
      final_score: score,
      status: 'validated',
      validated_at: new Date().toISOString(),
    }).eq('id', copy.id);
    return !error;
  };

  const handleValidate = async (copy: Copy) => {
    const ok = await validateOne(copy);
    if (!ok) {
      toast.error('La validation n’a pas été enregistrée. Vérifie ta connexion et réessaie.');
      return;
    }
    const remaining = copies.filter((c) => !c.validated_by_user && c.id !== copy.id).length;
    if (remaining === 0 && copies.length > 1) {
      toast.success('Toutes les copies sont validées', { description: 'Tu peux exporter les notes.' });
      celebrate();
    } else {
      toast.success('Copie validée');
    }
    router.refresh();
  };

  const validateSafe = async () => {
    setBulkRunning(true);
    let done = 0;
    for (const copy of safe) {
      if (await validateOne(copy)) done++;
    }
    setBulkRunning(false);
    setConfirmBulk(false);
    if (done < safe.length) {
      toast.warning(`${done} copie${done > 1 ? 's' : ''} validée${done > 1 ? 's' : ''} sur ${safe.length}`, {
        description: 'Vérifie ta connexion et recommence pour les autres.',
      });
    } else {
      toast.success(`${done} copie${done > 1 ? 's' : ''} validée${done > 1 ? 's' : ''}`, {
        description: toCheck > 0 ? `Il reste ${toCheck} copie${toCheck > 1 ? 's' : ''} à regarder de près.` : 'Tu peux exporter les notes.',
      });
      if (toCheck === 0) celebrate();
    }
    router.refresh();
  };

  const readCopies = async (ids: string[]) => {
    setReadingIds((prev) => [...prev, ...ids]);
    let ok = 0;
    let lastError: string | null = null;
    for (const copyId of ids) {
      try {
        await backendJson('/api/extract', { method: 'POST', body: JSON.stringify({ copyId }) });
        ok++;
      } catch (err: any) {
        lastError = err?.message || null;
        if (err instanceof ApiError && ['engine_unavailable', 'trial_exhausted', 'monthly_quota_exceeded'].includes(err.code)) break;
      }
    }
    setReadingIds((prev) => prev.filter((id) => !ids.includes(id)));
    if (ok === ids.length) toast.success(ok > 1 ? `${ok} copies lues` : 'Copie lue');
    else toast.error(ok > 0 ? `${ok} copie${ok > 1 ? 's' : ''} lue${ok > 1 ? 's' : ''} sur ${ids.length}` : 'Lecture impossible', { description: lastError || undefined, duration: 10000 });
    router.refresh();
  };

  const copyGrades = async () => {
    const lines = [...validated].sort(byName).map((c) => {
      const { max } = computeCopyScore(c.extracted_answers, scale);
      return `${c.student_identifier || 'Élève'}\t${frPoints(c.final_score)}\t${frPoints(max)}`;
    });
    try {
      await navigator.clipboard.writeText(['Élève\tNote\tBarème', ...lines].join('\n'));
      toast.success('Notes copiées', { description: 'Colle-les dans ton tableur ou ton logiciel de notes (Ctrl + V).' });
    } catch {
      toast.error('Copie impossible depuis ce navigateur. Utilise l’export.');
    }
  };

  const classErrors = countErrorTypesAll(copies);
  const classErrorTotal = Object.values(classErrors).reduce((s, n) => s + n, 0);

  return (
    <div className="space-y-3">
      {showConfetti && <Celebration />}

      {classErrorTotal >= 3 && (
        <div className="p-3 rounded-lg bg-secondary/50 border flex items-start justify-between gap-3 flex-wrap">
          <div>
            <p className="text-sm font-medium flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-primary" aria-hidden="true" />
              Erreurs récurrentes de la classe
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {classErrorTotal} erreurs classées sur l'ensemble des copies — piste directe de remédiation.
            </p>
          </div>
          <ErrorTypeBadges counts={classErrors} max={5} />
        </div>
      )}

      {unread.length > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap p-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20">
          <span className="text-sm font-medium text-amber-900 dark:text-amber-200">
            {unread.length} copie{unread.length > 1 ? 's' : ''} en attente de lecture
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={readingIds.length > 0}
            onClick={() => readCopies(unread.map((c) => c.id))}
          >
            {readingIds.length > 0 ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <RotateCw className="h-4 w-4 mr-1" />}
            Relancer la lecture
          </Button>
        </div>
      )}

      {ready.length > 0 && (
        <div className="flex items-center justify-between gap-3 flex-wrap p-3 rounded-lg bg-secondary/50 border">
          <span className="text-sm">
            <span className="font-medium">{ready.length} copie{ready.length > 1 ? 's' : ''} à valider</span>
            {toCheck > 0 && (
              <span className="text-muted-foreground"> · {toCheck} à regarder de près (en tête de liste)</span>
            )}
          </span>
          {safe.length > 1 && !confirmBulk && (
            <Button size="sm" onClick={() => setConfirmBulk(true)}>
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Valider les {safe.length} copies sûres
            </Button>
          )}
          {confirmBulk && (
            <span className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground">Les notes proposées deviennent les notes finales.</span>
              <Button size="sm" onClick={validateSafe} disabled={bulkRunning}>
                {bulkRunning ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
                Confirmer
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setConfirmBulk(false)} disabled={bulkRunning}>Annuler</Button>
            </span>
          )}
        </div>
      )}

      {validated.length > 0 && (
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={copyGrades}>
            <ClipboardCopy className="h-4 w-4 mr-1" />
            Copier les notes ({validated.length})
          </Button>
        </div>
      )}

      {sorted.map((copy) => {
        const isValidated = copy.validated_by_user;
        const isReady = copy.status === 'ready_to_validate' && !isValidated;
        const isReading = readingIds.includes(copy.id) || copy.status === 'processing';
        const isError = copy.status === 'error' && !isReading;
        const isWaiting = copy.status === 'pending' && !isReading;
        const score = computeCopyScore(copy.extracted_answers, scale);
        const doubts = doubtfulCount(copy.extracted_answers, scale);
        const showGrade = (isValidated || isReady) && score.max > 0;
        const grade = frPoints(isValidated ? copy.final_score : score.score);

        return (
          <Card
            key={copy.id}
            className={`transition-colors duration-200 ease-out ${isValidated ? 'border-green-300 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800' : ''}`}
          >
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                {/* Sur téléphone, les boutons passent sous le nom : la ligne reste lisible. */}
                <div className="flex items-start sm:items-center gap-3 min-w-0 basis-full sm:basis-0 sm:flex-1">
                  {showGrade ? (
                    <div
                      className={`w-[4.5rem] shrink-0 rounded-lg border px-1 py-1.5 text-center ${
                        isValidated
                          ? 'border-green-300 bg-background dark:border-green-800'
                          : 'border-border bg-secondary/50'
                      }`}
                      aria-label={`${isValidated ? 'Note validée' : 'Note proposée'} : ${grade} sur ${frPoints(score.max)}`}
                    >
                      <div className={`text-xl font-semibold leading-none tabular-nums tracking-tight ${isValidated ? 'text-green-700 dark:text-green-400' : ''}`}>
                        {grade}
                      </div>
                      <div className="mt-1 text-[11px] leading-none text-muted-foreground tabular-nums">sur {frPoints(score.max)}</div>
                    </div>
                  ) : (
                    <div className={`h-12 w-[4.5rem] rounded-lg flex items-center justify-center shrink-0 ${
                      isError ? 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300' : 'bg-secondary text-muted-foreground'
                    }`}>
                      {isError ? <AlertTriangle className="h-5 w-5" /> : isReading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium truncate">{copy.student_identifier || 'Élève'}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap mt-1">
                      {isReady && score.max > 0 && <span>Note proposée</span>}
                      {isReady && <ErrorTypeBadges counts={countErrorTypes(copy.extracted_answers)} max={3} />}
                      {isReady && copy.confidence_score !== null && (
                        <ConfidenceBadge confidence={copy.confidence_score} />
                      )}
                      {isReady && doubts > 0 && (
                        <span className="text-amber-700 dark:text-amber-300">
                          {doubts} réponse{doubts > 1 ? 's' : ''} à vérifier
                        </span>
                      )}
                      {isReading && (
                        <span className="text-amber-700 dark:text-amber-300">Lecture en cours…</span>
                      )}
                      {isWaiting && <span>En attente de lecture</span>}
                      {isError && <span className="text-destructive">Lecture impossible pour le moment</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                  {isValidated && (
                    <>
                      <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Validée
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => setEditingId(copy.id)}>Modifier</Button>
                    </>
                  )}
                  {isReady && (
                    <>
                      <Button size="sm" variant="outline" className="flex-1 sm:flex-none" onClick={() => setEditingId(copy.id)}>
                        <Edit3 className="h-3 w-3 mr-1" />
                        Vérifier
                      </Button>
                      <Button size="sm" className="flex-1 sm:flex-none" onClick={() => handleValidate(copy)}>Valider</Button>
                    </>
                  )}
                  {(isError || isWaiting) && (
                    <Button size="sm" variant="outline" onClick={() => readCopies([copy.id])} disabled={readingIds.length > 0}>
                      <RotateCw className="h-3 w-3 mr-1" />
                      Relancer
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {editingCopy && (
        <CopyEditorDialog
          key={editingCopy.id}
          copy={editingCopy}
          scale={scale}
          evaluationTitle={evaluationTitle}
          onClose={() => setEditingId(null)}
          onSaved={() => { setEditingId(null); router.refresh(); }}
        />
      )}
    </div>
  );
}

function CopyEditorDialog({ copy, scale, evaluationTitle, onClose, onSaved }: {
  copy: Copy;
  scale: ScaleQuestion[];
  evaluationTitle?: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isList = Array.isArray(copy.extracted_answers);
  const [name, setName] = useState(copy.student_identifier || '');
  const initialAnswers = useMemo(() => alignToScale(copy.extracted_answers, scale), [copy.extracted_answers, scale]);
  const [answers, setAnswers] = useState<CopyAnswer[]>(initialAnswers);
  const initialManual = copy.user_corrections?.manual_score;
  const [manual, setManual] = useState<string>(typeof initialManual === 'number' ? String(initialManual).replace('.', ',') : '');
  const [onlyDoubts, setOnlyDoubts] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = useMemo(() => createBrowserSupabase(), []);

  // Modifications non enregistrées : Échap ne ferme pas la fenêtre par accident.
  const dirty = name !== (copy.student_identifier || '')
    || manual.trim() !== (typeof initialManual === 'number' ? String(initialManual).replace('.', ',') : '')
    || JSON.stringify(answers) !== JSON.stringify(initialAnswers);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !saving && !dirty) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving, dirty]);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, []);

  const computed = computeCopyScore(answers, scale);
  const manualValue = manual.trim() === '' ? null : Number(manual.replace(',', '.'));
  const manualValid = manualValue === null || (Number.isFinite(manualValue) && manualValue >= 0 && manualValue <= Math.max(computed.max, 99.99));
  const finalScore = manualValue !== null && manualValid ? round2(manualValue) : computed.score;
  const doubts = answers.filter((a) => (a.confidence ?? 0) < DOUBT_ANSWER_THRESHOLD).length;
  const canValidate = manualValid && (computed.max > 0 || manualValue !== null);

  const setCorrect = (idx: number, isCorrect: boolean) => {
    setAnswers((prev) => prev.map((a, i) => {
      if (i !== idx) return a;
      const { points, ...rest } = a;
      return { ...rest, is_correct: isCorrect, error_type: isCorrect ? null : (a.error_type || 'autre') };
    }));
  };

  const setPoints = (idx: number, value: string, max: number) => {
    const n = Number(value.replace(',', '.'));
    setAnswers((prev) => prev.map((a, i) => {
      if (i !== idx) return a;
      if (value.trim() === '' || !Number.isFinite(n)) {
        const { points, ...rest } = a;
        return rest;
      }
      const pts = Math.min(max, Math.max(0, n));
      return { ...a, points: pts, is_correct: pts >= max, error_type: pts >= max ? null : (a.error_type || 'autre') };
    }));
  };

  const handleSave = async () => {
    if (!canValidate) return;
    setSaving(true);
    const edited = JSON.stringify(answers) !== JSON.stringify(asAnswers(copy.extracted_answers)) || manualValue !== null;
    const { error } = await supabase.from('copies').update({
      student_identifier: name.trim() || copy.student_identifier,
      ...(isList ? { extracted_answers: answers } : {}),
      user_corrections: { edited, manual_score: manualValue !== null ? finalScore : null },
      validated_by_user: true,
      final_score: Math.min(99.99, finalScore),
      status: 'validated',
      validated_at: new Date().toISOString(),
    }).eq('id', copy.id);
    setSaving(false);
    if (error) {
      toast.error('La validation n’a pas été enregistrée. Vérifie ta connexion et réessaie.');
      return;
    }
    toast.success('Copie validée');
    onSaved();
  };

  const shown = answers
    .map((a, idx) => ({ a, idx }))
    .filter(({ a }) => !onlyDoubts || (a.confidence ?? 0) < DOUBT_ANSWER_THRESHOLD);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-stretch sm:items-center justify-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Vérification de la copie de ${name || 'l’élève'}`}
    >
      <Card className="w-full max-w-4xl h-full sm:h-auto sm:max-h-[92vh] overflow-auto rounded-none sm:rounded-lg">
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0 space-y-1">
              <label htmlFor="student-name" className="text-xs text-muted-foreground">Nom de l'élève</label>
              <Input
                id="student-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                className="max-w-sm font-medium"
              />
              <p className="text-sm text-muted-foreground">
                Compare la photo et ce que le système a lu. Change ce qui doit l'être, puis valide.
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Fermer"><X className="h-4 w-4" /></Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Copie originale</div>
              <PhotoViewer storagePath={copy.photo_storage_path} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Réponses lues</div>
                {doubts > 0 && (
                  <button
                    type="button"
                    onClick={() => setOnlyDoubts((v) => !v)}
                    className="text-xs underline underline-offset-2 text-amber-700 dark:text-amber-300 py-1"
                  >
                    {onlyDoubts ? 'Voir toutes les réponses' : doubts > 1 ? `Voir seulement les ${doubts} à vérifier` : 'Voir seulement la réponse à vérifier'}
                  </button>
                )}
              </div>

              <div className="space-y-2 lg:max-h-[460px] lg:overflow-y-auto lg:pr-2">
                {isList ? shown.map(({ a, idx }) => {
                  const max = maxFor(a, scale, computed.weighted);
                  const pts = pointsFor(a, max);
                  const doubtful = (a.confidence ?? 0) < DOUBT_ANSWER_THRESHOLD;
                  return (
                    <div
                      key={idx}
                      className={`rounded-lg border p-3 ${a.is_correct ? 'border-green-300 bg-green-50/40 dark:bg-green-950/20' : 'border-red-200 bg-red-50/30 dark:bg-red-950/20'} ${doubtful ? 'ring-2 ring-amber-300' : ''}`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium text-xs">Question {a.question_id}</span>
                        <span className="flex items-center gap-2">
                          {doubtful && <span className="text-xs text-amber-700 dark:text-amber-300">À vérifier</span>}
                          {a.confidence !== undefined && <ConfidenceBadge confidence={a.confidence} />}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground text-xs">Élève : </span>
                        {a.student_wrote
                          ? <span className="font-mono">{a.student_wrote}</span>
                          : <span className="text-muted-foreground">pas de réponse</span>}
                      </div>
                      {a.expected && (
                        <div className="text-sm mt-1">
                          <span className="text-muted-foreground text-xs">Attendu : </span>
                          <span className="font-mono text-green-700 dark:text-green-400">{a.expected}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <div className="inline-flex rounded-md border overflow-hidden" role="group" aria-label={`Question ${a.question_id}`}>
                          <button
                            type="button"
                            aria-pressed={a.is_correct === true}
                            onClick={() => setCorrect(idx, true)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium ${a.is_correct ? 'bg-green-600 text-white' : 'bg-background hover:bg-secondary'}`}
                          >
                            <Check className="h-3 w-3" aria-hidden="true" /> Juste
                          </button>
                          <button
                            type="button"
                            aria-pressed={a.is_correct !== true}
                            onClick={() => setCorrect(idx, false)}
                            className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium border-l ${!a.is_correct ? 'bg-red-600 text-white' : 'bg-background hover:bg-secondary'}`}
                          >
                            <X className="h-3 w-3" aria-hidden="true" /> Faux
                          </button>
                        </div>
                        {computed.weighted && max > 0 && (
                          <label className="flex items-center gap-1 text-xs text-muted-foreground">
                            Points
                            <input
                              type="text"
                              inputMode="decimal"
                              value={typeof a.points === 'number' ? String(a.points).replace('.', ',') : ''}
                              placeholder={frPoints(pts)}
                              onChange={(e) => setPoints(idx, e.target.value, max)}
                              className="w-14 h-8 rounded-md border bg-background px-2 text-sm text-foreground"
                              aria-label={`Points pour la question ${a.question_id}, sur ${frPoints(max)}`}
                            />
                            / {frPoints(max)}
                          </label>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="rounded-lg border p-3 text-sm text-muted-foreground">
                    Cette copie a été lue avec une ancienne version : le détail par question n'est pas disponible.
                    Indique la note finale ci-dessous.
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg bg-secondary/60 border space-y-2">
                <div className="flex items-end justify-between gap-3 flex-wrap">
                  <div>
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Note</div>
                    <div className="mt-1 text-4xl font-semibold leading-none tracking-tight tabular-nums">
                      {frPoints(finalScore)} <span className="text-lg font-normal text-muted-foreground">/ {frPoints(computed.max) === '0' ? '—' : frPoints(computed.max)}</span>
                    </div>
                  </div>
                  <label className="text-xs text-muted-foreground flex items-center gap-2">
                    Ajuster la note
                    <input
                      type="text"
                      inputMode="decimal"
                      value={manual}
                      placeholder={frPoints(computed.score)}
                      onChange={(e) => setManual(e.target.value)}
                      className={`w-20 h-9 rounded-md border bg-background px-2 text-sm text-foreground ${manualValid ? '' : 'border-destructive'}`}
                      aria-invalid={!manualValid}
                    />
                  </label>
                </div>
                {!manualValid && (
                  <p className="text-xs text-destructive">Indique un nombre entre 0 et {frPoints(computed.max || 99.99)}.</p>
                )}
                {!computed.weighted && computed.max > 0 && (
                  <p className="text-xs text-muted-foreground">
                    Sans barème, chaque réponse juste compte 1 point. Ajoute un barème à l'étape 1 pour noter avec tes points.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4 border-t flex-wrap sticky bottom-0 bg-card pb-1">
            <Button onClick={handleSave} disabled={saving || !canValidate} size="lg">
              {saving ? 'Validation…' : `Valider ${frPoints(finalScore)} / ${frPoints(computed.max) === '0' ? '—' : frPoints(computed.max)}`}
            </Button>
            <StudentReport
              studentName={name || 'Élève'}
              answers={answers}
              scale={scale}
              score={finalScore}
              max={computed.max}
              evaluationTitle={evaluationTitle}
              validatedAt={copy.validated_at}
            />
            <Button variant="outline" onClick={onClose} disabled={saving}>
              {dirty ? 'Fermer sans enregistrer' : 'Fermer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
