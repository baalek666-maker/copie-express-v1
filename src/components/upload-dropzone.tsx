'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { runAntiAbuseAudit, generateFingerprint, registerFingerprint, incrementCopyCount } from '@/lib/anti-abuse';
import { Button } from '@/components/ui/button';
import { Upload, X, Loader2 } from 'lucide-react';

export function UploadDropzone({ evaluationId }: { evaluationId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles].slice(0, 100));
  }, []);

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...selected].slice(0, 100));
  };

  const removeFile = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    setProgress(0);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      // === ANTI-ABUSE AUDIT ===
      const audit = await runAntiAbuseAudit(user.id);
      if (!audit.allowed) {
        if (audit.quota.reason === 'trial_exhausted') {
          throw new Error('Tu as utilisé tes 10 copies gratuites. Passe à un forfait pour continuer.');
        }
        if (audit.quota.reason === 'monthly_quota_exceeded') {
          throw new Error(`Quota mensuel atteint. Tu pourras continuer le ${new Date(audit.quota.reset_at!).toLocaleDateString('fr-FR')}.`);
        }
        if (audit.quota.reason === 'account_suspended') {
          throw new Error('Compte suspendu. Contacte le support.');
        }
        if (!audit.delay.allowed) {
          throw new Error(`Patiente ${audit.delay.retry_after_seconds}s avant d'uploader une nouvelle copie.`);
        }
        throw new Error(`Action bloquée : ${audit.reasons.join(', ')}`);
      }

      // === ENREGISTREMENT FINGERPRINT (1 fois par user) ===
      const fingerprint = generateFingerprint();
      await registerFingerprint(user.id, fingerprint);

      // Upload via le backend Express
      const formData = new FormData();
      files.forEach((file) => formData.append('files', file));
      formData.append('evaluationId', evaluationId);
      formData.append('userId', user.id);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      setProgress(50);

      // Crée les copies en DB
      const copiesToInsert = [];
      for (let i = 0; i < result.paths.length; i++) {
        copiesToInsert.push({
          evaluation_id: evaluationId,
          photo_storage_path: result.paths[i],
          student_identifier: `eleve_${String(i + 1).padStart(3, '0')}`,
          status: 'pending',
        });
      }

      const { error: dbError } = await supabase.from('copies').insert(copiesToInsert);
      if (dbError) throw dbError;

      setProgress(75);

      // === INCRÉMENT COMPTEUR (pour les copies réellement uploadées) ===
      for (let i = 0; i < result.paths.length; i++) {
        await incrementCopyCount(user.id);
      }

      // Lance l'extraction en arrière-plan (une par une ou par batch)
      if (result.paths.length > 0) {
        const { data: firstCopies } = await supabase
          .from('copies')
          .select('id')
          .eq('evaluation_id', evaluationId)
          .order('created_at', { ascending: false })
          .limit(result.paths.length);

        for (const copy of firstCopies || []) {
          fetch(`${backendUrl}/api/extract`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ evaluationId, copyId: copy.id, userId: user.id }),
          }).catch(console.error);
        }
      }

      setProgress(100);
      setFiles([]);
      setTimeout(() => {
        router.refresh();
        setUploading(false);
        setProgress(0);
      }, 1000);
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        }`}
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm font-medium mb-1">
          Glisse tes photos/PDF ici, ou clique pour parcourir
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          Photo, scan, PDF, Word, Excel, PowerPoint · Max 100 fichiers · 50MB/fichier
        </p>
        <input
          type="file"
          multiple
          accept="image/*,application/pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt"
          onChange={onFileInput}
          className="hidden"
          id="file-input"
        />
        <label htmlFor="file-input">
          <Button type="button" variant="outline" asChild>
            <span>Parcourir mes fichiers</span>
          </Button>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">{files.length} fichier(s) sélectionné(s)</p>
          <div className="space-y-1 max-h-40 overflow-auto">
            {files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm p-2 bg-secondary/30 rounded">
                <span className="truncate">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-muted-foreground hover:text-destructive"
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {uploading && (
            <div className="space-y-1">
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {progress < 50 && 'Upload en cours...'}
                {progress >= 50 && progress < 75 && 'Création des copies...'}
                {progress >= 75 && progress < 100 && 'Extraction en arrière-plan...'}
                {progress === 100 && 'Terminé ✓'}
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button onClick={handleUpload} disabled={uploading}>
            {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {uploading ? 'Upload + extraction en cours...' : `Envoyer ${files.length} fichier(s) →`}
          </Button>
        </div>
      )}
    </div>
  );
}