'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CheckCircle2, Edit3, Loader2, FileText, AlertCircle } from 'lucide-react';

export function SubjectUploader({
  evaluationId,
  existingSubjectPath,
}: {
  evaluationId: string;
  existingSubjectPath: string | null;
}) {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePhotoUpload = async (file: File) => {
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

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://copie-express-v1-production.up.railway.app';
      const { data: { session } } = await supabase.auth.getSession();
      const accessToken = session?.access_token;
      if (!accessToken) throw new Error('Session expirée — reconnecte-toi');

      const response = await fetch(`${backendUrl}/api/subject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}`);
      }

      const result = await response.json();

      // Afficher succès immédiatement
      setSuccess(true);
      setUploading(false);
      // Attendre 1.5s pour que le user voie le message
      setTimeout(() => {
        router.refresh();
        setSuccess(false);
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'upload');
      setUploading(false);
    }
  };

  if (existingSubjectPath) {
    return (
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Photo du sujet uploadée
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => document.getElementById('subject-replace-input')?.click()}
              disabled={uploading}
            >
              <Edit3 className="h-3 w-3 mr-1" />
              {uploading ? 'Upload...' : 'Remplacer'}
            </Button>
          </CardTitle>
          <CardDescription>
            L'extraction utilise cette photo comme contexte. Remplace-la si besoin.
          </CardDescription>
        </CardHeader>
        <input
          id="subject-replace-input"
          type="file"
          accept="image/*,application/pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handlePhotoUpload(file);
          }}
        />
      </Card>
    );
  }

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Photo du sujet <span className="text-sm font-normal text-muted-foreground">(optionnel)</span>
        </CardTitle>
        <CardDescription>
          Si les questions sont sur une feuille séparée des copies, prends-les en photo ici.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          onClick={() => !uploading && document.getElementById('subject-input')?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 mx-auto text-primary mb-3 animate-spin" />
              <p className="text-sm font-medium">Extraction en cours...</p>
              <p className="text-xs text-muted-foreground mt-1">On lit ta photo, ça prend ~10 sec</p>
            </>
          ) : (
            <>
              <Camera className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">📸 Prends en photo le sujet du contrôle</p>
              <p className="text-xs text-muted-foreground">
                Photo, scan, PDF, Word (.docx), Excel (.xlsx), PowerPoint (.pptx)
              </p>
            </>
          )}
          <input
            id="subject-input"
            type="file"
            accept="image/*,application/pdf,.docx,.doc,.xlsx,.xls,.pptx,.ppt"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhotoUpload(file);
            }}
          />
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive mt-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-900 mt-3 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Sujet uploadé avec succès ! La page va se rafraîchir...
          </div>
        )}
      </CardContent>
    </Card>
  );
}