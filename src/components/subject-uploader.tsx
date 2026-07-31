'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, X, Loader2, CheckCircle2, FileText } from 'lucide-react';

export function SubjectUploader({ evaluationId, existingSubjectPath }: {
  evaluationId: string;
  existingSubjectPath: string | null;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('evaluationId', evaluationId);
      formData.append('userId', user.id);

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';
      const response = await fetch(`${backendUrl}/api/subject`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      setSuccess(true);
      setFile(null);
      setTimeout(() => {
        router.refresh();
        setSuccess(false);
        setUploading(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  if (existingSubjectPath) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Sujet uploadé ✓
          </CardTitle>
          <CardDescription>
            L'extraction Mistral utilise le sujet comme contexte. Tu peux le remplacer si besoin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubjectUploader evaluationId={evaluationId} existingSubjectPath={null} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Sujet du contrôle <span className="text-sm font-normal text-muted-foreground">(optionnel)</span>
        </CardTitle>
        <CardDescription>
          Si les questions sont sur une feuille séparée des réponses des élèves, upload le sujet ici.
          Ça améliore fortement la qualité de l'extraction Mistral.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="file"
            accept="image/*,application/pdf"
            onChange={onFileInput}
            className="hidden"
            id="subject-input"
          />
          <label htmlFor="subject-input">
            <Button type="button" variant="outline" asChild>
              <span>Choisir une image / PDF</span>
            </Button>
          </label>
          {file && (
            <div className="flex items-center gap-2 text-sm">
              <span className="truncate max-w-xs">{file.name}</span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="text-muted-foreground hover:text-destructive"
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {file && (
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {uploading ? 'Upload en cours...' : 'Uploader le sujet →'}
          </Button>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-900">
            ✓ Sujet uploadé ! Les copies seront extraites avec ce contexte.
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          💡 Si les questions et les réponses sont sur la même feuille, ignore cette étape et upload directement les copies ci-dessous.
        </p>
      </CardContent>
    </Card>
  );
}