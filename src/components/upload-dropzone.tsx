'use client';

import { useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { runAntiAbuseAudit, generateFingerprint, registerFingerprint, incrementCopyCount } from '@/lib/anti-abuse';
import { translateError } from '@/lib/error-translator';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2, ImageIcon, FileText, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export function UploadDropzone({ evaluationId }: { evaluationId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) toast.success(`${droppedFiles.length} fichier(s) ajouté(s)`);
    setFiles((prev) => [...prev, ...droppedFiles].slice(0, 100));
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected].slice(0, 100));
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const fileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <ImageIcon className="h-4 w-4 text-blue-500" />;
    if (file.type === 'application/pdf') return <FileText className="h-4 w-4 text-red-500" />;
    return <FileText className="h-4 w-4 text-muted-foreground" />;
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    setProgress(0);
    setProgressLabel('Préparation…');

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      const audit = await runAntiAbuseAudit(user.id);
      if (!audit.allowed) {
        if (audit.quota.reason === 'trial_exhausted') {
          toast.error('Trial épuisé', {
            description: 'Tu as utilisé tes 10 copies gratuites. Passe à un forfait.',
            action: { label: 'Voir les forfaits', onClick: () => router.push('/pricing') },
          });
          throw new Error('Trial épuisé');
        }
        if (audit.quota.reason === 'monthly_quota_exceeded') {
          throw new Error(`Quota mensuel atteint.`);
        }
        if (audit.quota.reason === 'account_suspended') {
          throw new Error('Compte suspendu.');
        }
        if (!audit.delay.allowed) {
          toast.warning('Patiente un peu', {
            description: `Réessaie dans ${audit.delay.retry_after_seconds}s.`,
          });
          throw new Error('Délai anti-abus');
        }
        throw new Error('Action bloquée');
      }

      const fingerprint = generateFingerprint();
      await registerFingerprint(user.id, fingerprint);

      setProgress(15);
      setProgressLabel('Upload en cours…');

      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('evaluationId', evaluationId);
      formData.append('userId', user.id);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://copie-express-v1-production.up.railway.app';
      const response = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        throw new Error(translateError(errBody.error || 'upload_failed'));
      }

      const result = await response.json();
      setProgress(40);
      setProgressLabel('Création des copies…');

      const copiesToInsert = result.paths.map((path: string, i: number) => ({
        evaluation_id: evaluationId,
        photo_storage_path: path,
        student_identifier: `eleve_${String(i + 1).padStart(3, '0')}`,
        status: 'pending',
      }));

      const { error: dbError } = await supabase.from('copies').insert(copiesToInsert);
      if (dbError) throw dbError;

      for (let i = 0; i < result.paths.length; i++) {
        await incrementCopyCount(user.id);
      }

      // Lance l'extraction en arrière-plan, attend chaque copie
      setProgress(60);
      setProgressLabel('Extraction des réponses…');

      if (result.paths.length > 0) {
        const { data: firstCopies } = await supabase
          .from('copies')
          .select('id')
          .eq('evaluation_id', evaluationId)
          .order('created_at', { ascending: false })
          .limit(result.paths.length);

        for (let i = 0; i < (firstCopies || []).length; i++) {
          const copy = (firstCopies || [])[i];
          try {
            const extractRes = await fetch(`${backendUrl}/api/extract`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ evaluationId, copyId: copy.id, userId: user.id }),
            });
            if (!extractRes.ok) console.error('[extract] failed');
            setProgress(60 + Math.round((30 * (i + 1)) / (firstCopies || []).length));
          } catch (err) {
            console.error('[extract] error', err);
          }
        }
      }

      setProgress(100);
      setProgressLabel('Terminé ✓');

      toast.success(`${files.length} copie(s) traitée(s) ✓`, {
        description: 'Vérifie les résultats ci-dessous.',
      });

      setFiles([]);
      setTimeout(() => {
        router.refresh();
        setUploading(false);
        setProgress(0);
        setProgressLabel('');
      }, 600);
    } catch (err: any) {
      toast.error(err.message || 'Erreur lors de l\'upload');
      setError(err.message);
      setUploading(false);
      setProgress(0);
      setProgressLabel('');
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-primary bg-primary/10 scale-[1.01]'
            : 'border-border hover:border-primary/50 hover:bg-secondary/30'
        }`}
      >
        <div className="flex justify-center mb-3">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Upload className="h-6 w-6 text-primary" />
          </div>
        </div>
        <p className="text-sm font-medium mb-1">
          Glisse tes photos ici, ou <span className="text-primary underline">clique pour parcourir</span>
        </p>
        <p className="text-xs text-muted-foreground">
          Photo, scan, PDF, Word, Excel, PowerPoint · Max 100 fichiers · 50MB/fichier
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

      {files.length > 0 && (
        <div className="space-y-3 animate-slide-up">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{files.length} fichier(s) sélectionné(s)</p>
            <button
              type="button"
              onClick={() => setFiles([])}
              className="text-xs text-muted-foreground hover:text-destructive"
              disabled={uploading}
            >
              Tout effacer
            </button>
          </div>

          <div className="space-y-1 max-h-48 overflow-auto scrollbar-thin">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-secondary/40 rounded animate-fade-in">
                {fileIcon(file)}
                <span className="truncate flex-1">{file.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {uploading && (
            <div className="space-y-1.5">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                {progress === 100 ? (
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                ) : (
                  <Loader2 className="h-3 w-3 animate-spin" />
                )}
                {progressLabel} ({progress}%)
              </p>
            </div>
          )}

          {error && !uploading && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button onClick={handleUpload} disabled={uploading} size="lg" className="w-full">
            {uploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Traitement en cours…
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Envoyer {files.length} fichier(s)
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}