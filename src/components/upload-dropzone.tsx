'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ApiError, backendJson, fetchUsage } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, ImageIcon, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

const MAX_FILES = 100;
const BATCH_MAX_FILES = 5;
const BATCH_MAX_BYTES = 25 * 1024 * 1024; // reste sous la limite de taille d'une requête
const READ_CONCURRENCY = 4;
const STOP_CODES = ['engine_unavailable', 'trial_exhausted', 'monthly_quota_exceeded', 'account_suspended', 'unauthorized', 'invalid_token'];

// Les photos de téléphone font souvent 4 à 8 Mo : on les allège avant l'envoi
// (envoi plus rapide, lecture identique). En cas d'échec, le fichier d'origine part tel quel.
async function lightenImage(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 1.5 * 1024 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const MAX_SIDE = 2400;
    const ratio = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * ratio);
    canvas.height = Math.round(bitmap.height * ratio);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.(png|webp|jpe?g)$/i, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}

function makeBatches(files: File[]): File[][] {
  const batches: File[][] = [];
  let current: File[] = [];
  let size = 0;
  for (const file of files) {
    if (current.length && (current.length >= BATCH_MAX_FILES || size + file.size > BATCH_MAX_BYTES)) {
      batches.push(current);
      current = [];
      size = 0;
    }
    current.push(file);
    size += file.size;
  }
  if (current.length) batches.push(current);
  return batches;
}

export function UploadDropzone({ evaluationId, compact = false }: { evaluationId: string; compact?: boolean }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((incoming: File[]) => {
    if (!incoming.length) return;
    setError(null);
    setFiles((prev) => {
      const next = [...prev, ...incoming];
      if (next.length > MAX_FILES) toast.warning(`${MAX_FILES} fichiers au maximum par dépôt.`);
      return next.slice(0, MAX_FILES);
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files || []));
    e.target.value = ''; // permet de re-sélectionner le même fichier
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const fileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="h-4 w-4 text-muted-foreground" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4 text-red-500" />;
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const handleUpload = async () => {
    if (files.length === 0 || uploading) return;
    setUploading(true);
    setError(null);
    setProgress(3);
    setProgressLabel('Préparation…');

    try {
      // 1. Reste-t-il assez de copies dans le forfait ?
      const usage = await fetchUsage();
      if (usage.remaining <= 0) {
        throw new ApiError(usage.paid ? 'monthly_quota_exceeded' : 'trial_exhausted', 403);
      }
      if (files.length > usage.remaining) {
        const extra = files.length - usage.remaining;
        throw new Error(
          `Il te reste ${usage.remaining} copie${usage.remaining > 1 ? 's' : ''} ${usage.paid ? 'ce mois-ci' : 'd’essai'}. ` +
          `Retire ${extra} fichier${extra > 1 ? 's' : ''} ou choisis un forfait plus large.`
        );
      }

      // 2. Envoi par petits lots
      const prepared: File[] = [];
      for (let i = 0; i < files.length; i++) {
        prepared.push(await lightenImage(files[i]));
        setProgress(3 + Math.round((7 * (i + 1)) / files.length));
      }

      const batches = makeBatches(prepared);
      const copyIds: string[] = [];
      let sent = 0;
      let notSent = 0;
      for (const batch of batches) {
        setProgressLabel(`Envoi des fichiers… ${sent}/${prepared.length}`);
        const formData = new FormData();
        batch.forEach((file) => formData.append('files', file));
        formData.append('evaluationId', evaluationId);
        const result = await backendJson<{ uploaded: number; failed: number; copies: { id: string }[] }>(
          '/api/upload',
          { method: 'POST', body: formData }
        );
        copyIds.push(...result.copies.map((c) => c.id));
        notSent += result.failed || 0;
        sent += batch.length;
        setProgress(10 + Math.round((30 * sent) / prepared.length));
      }
      router.refresh(); // les copies apparaissent tout de suite dans la liste

      // 3. Lecture des copies
      let read = 0;
      let failed = 0;
      let stopCode: string | null = null;
      let lastError: string | null = null;
      const queue = [...copyIds];

      const worker = async () => {
        while (queue.length && !stopCode) {
          const copyId = queue.shift()!;
          try {
            await backendJson('/api/extract', { method: 'POST', body: JSON.stringify({ copyId }) });
            read++;
          } catch (err: any) {
            failed++;
            lastError = err?.message || null;
            if (err instanceof ApiError && STOP_CODES.includes(err.code)) stopCode = err.code;
          }
          setProgress(40 + Math.round((58 * (read + failed)) / copyIds.length));
          setProgressLabel(`Lecture des copies… ${read + failed}/${copyIds.length}`);
        }
      };
      setProgressLabel(`Lecture des copies… 0/${copyIds.length}`);
      await Promise.all(Array.from({ length: Math.min(READ_CONCURRENCY, copyIds.length) }, worker));

      setProgress(100);
      setProgressLabel('Terminé');
      setFiles([]);

      const waiting = copyIds.length - read;
      if (waiting === 0 && notSent === 0) {
        toast.success(`${read} copie${read > 1 ? 's' : ''} lue${read > 1 ? 's' : ''}`, {
          description: 'Vérifie les résultats dans la liste ci-dessous.',
        });
      } else {
        const parts: string[] = [];
        if (read > 0) parts.push(`${read} copie${read > 1 ? 's' : ''} lue${read > 1 ? 's' : ''}`);
        if (waiting > 0) parts.push(`${waiting} en attente de lecture`);
        if (notSent > 0) parts.push(`${notSent} fichier${notSent > 1 ? 's' : ''} non envoyé${notSent > 1 ? 's' : ''}`);
        toast.warning(parts.join(' · '), {
          description: waiting > 0
            ? (lastError || 'Tes fichiers sont conservés : bouton « Relancer la lecture » dans la liste.')
            : 'Redépose les fichiers manquants.',
          duration: 12000,
        });
        if (waiting > 0 && lastError) setError(lastError);
      }

      setTimeout(() => {
        router.refresh();
        setUploading(false);
        setProgress(0);
        setProgressLabel('');
      }, 600);
    } catch (err: any) {
      const message = err?.message || 'L’envoi a échoué. Réessaie.';
      const needsPlan = err instanceof ApiError && ['trial_exhausted', 'monthly_quota_exceeded'].includes(err.code);
      toast.error(needsPlan ? 'Tu as atteint la limite de ton forfait' : 'Dépôt interrompu', {
        description: message,
        ...(needsPlan ? { action: { label: 'Voir les forfaits', onClick: () => router.push('/pricing') } } : {}),
      });
      setError(message);
      setUploading(false);
      setProgress(0);
      setProgressLabel('');
      router.refresh();
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click(); } }}
        role="button"
        tabIndex={0}
        aria-label="Ajouter des copies"
        className={`border-2 border-dashed rounded-xl text-center transition-colors duration-200 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${compact ? 'p-5' : 'p-8 sm:p-10'} ${
          isDragging
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/50 hover:bg-secondary/30'
        }`}
      >
        {!compact && (
          <div className="flex justify-center mb-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
          </div>
        )}
        <p className="text-sm font-medium mb-1">
          <span className="sm:hidden"><span className="text-primary underline">Prends tes copies en photo</span> ou choisis des fichiers</span>
          <span className="hidden sm:inline">Glisse tes photos ici, ou <span className="text-primary underline">clique pour parcourir</span></span>
        </p>
        <p className="text-xs text-muted-foreground">
          Photo, scan ou PDF · une copie par fichier · {MAX_FILES} fichiers max · 50 Mo par fichier
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,application/pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt"
          onChange={onFileInput}
          className="hidden"
          id="file-input"
        />
      </div>

      {error && !uploading && files.length === 0 && (
        <div role="alert" className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {files.length} fichier{files.length > 1 ? 's' : ''} prêt{files.length > 1 ? 's' : ''} = {files.length} copie{files.length > 1 ? 's' : ''}
            </p>
            <button
              type="button"
              onClick={() => setFiles([])}
              className="text-xs text-muted-foreground hover:text-destructive py-2"
              disabled={uploading}
            >
              Tout retirer
            </button>
          </div>

          <div className="space-y-1 max-h-48 overflow-auto scrollbar-thin">
            {files.map((file, idx) => (
              <div key={`${file.name}-${idx}`} className="flex items-center gap-2 text-sm p-2 bg-secondary/40 rounded animate-fade-in">
                {fileIcon(file)}
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{(file.size / 1024 / 1024).toFixed(1).replace('.', ',')} Mo</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="text-muted-foreground hover:text-destructive shrink-0 p-1"
                  disabled={uploading}
                  aria-label={`Retirer ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {uploading && (
            <div className="space-y-1.5" aria-live="polite">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-[width] duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                {progress === 100 ? (
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                ) : (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {progressLabel}
              </p>
            </div>
          )}

          {error && !uploading && (
            <div role="alert" className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button onClick={handleUpload} disabled={uploading} size="lg" className="w-full">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traitement en cours… ne ferme pas la page
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Envoyer {files.length} copie{files.length > 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
