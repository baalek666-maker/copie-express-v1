'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Keyboard, CheckCircle2, Edit3, Loader2, FileText, X } from 'lucide-react';

export function SubjectUploader({
  evaluationId,
  existingSubjectPath,
}: {
  evaluationId: string;
  existingSubjectPath: string | null;
}) {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [mode, setMode] = useState<'display' | 'edit-text' | 'upload-photo'>(
    existingSubjectPath ? 'display' : 'upload-photo'
  );
  const [subjectText, setSubjectText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    setError(null);

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

      setMode('display');
      setUploading(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  if (mode === 'display' && existingSubjectPath) {
    return (
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Sujet uploadé
            </span>
            <Button size="sm" variant="outline" onClick={() => setMode('upload-photo')}>
              <Edit3 className="h-3 w-3 mr-1" />
              Remplacer
            </Button>
          </CardTitle>
          <CardDescription>
            L'extraction utilise le sujet comme contexte. Tu peux le remplacer si besoin.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Sujet du contrôle <span className="text-sm font-normal text-muted-foreground">(optionnel)</span>
        </CardTitle>
        <CardDescription>
          Si les questions sont sur une feuille séparée, upload le sujet ici pour améliorer l'extraction.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2 border-b">
          <button
            type="button"
            onClick={() => setMode('upload-photo')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              mode === 'upload-photo' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            }`}
          >
            <Camera className="h-4 w-4 inline mr-1" />
            Photo du sujet
          </button>
          <button
            type="button"
            onClick={() => setMode('edit-text')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              mode === 'edit-text' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
            }`}
          >
            <Keyboard className="h-4 w-4 inline mr-1" />
            Saisie texte
          </button>
        </div>

        {mode === 'upload-photo' && (
          <div
            className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            onClick={() => document.getElementById('subject-input')?.click()}
          >
            <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm font-medium mb-1">
              {uploading ? 'Upload en cours...' : 'Clique pour uploader une photo'}
            </p>
            <p className="text-xs text-muted-foreground">
              Photo du sujet, scan, ou PDF
            </p>
            <input
              id="subject-input"
              type="file"
              accept="image/*,application/pdf"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
              }}
            />
          </div>
        )}

        {mode === 'edit-text' && (
          <p className="text-sm text-muted-foreground italic">
            Saisie texte du sujet à venir. Pour l'instant, upload une photo.
          </p>
        )}

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Upload en cours...
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}