'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { backendFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, CheckCircle2, Edit3, Loader2, FileText, AlertCircle } from 'lucide-react';

export function GradingKeyEditor({
  evaluationId,
  initialGradingKey,
}: {
  evaluationId: string;
  initialGradingKey: string | null;
}) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('evaluationId', evaluationId);

      await backendFetch('/api/grading-key', { method: 'POST', body: formData });

      setUploading(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'L’envoi du corrigé a échoué. Réessaie.');
      setUploading(false);
    }
  };

  if (initialGradingKey) {
    return (
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Barème prêt
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => document.getElementById('grading-key-replace-input')?.click()}
              disabled={uploading}
            >
              <Edit3 className="h-3 w-3 mr-1" />
              {uploading ? 'Envoi…' : 'Remplacer par un corrigé'}
            </Button>
          </CardTitle>
          <CardDescription>
            Le système s'appuie sur ce barème pour proposer une note par copie.
          </CardDescription>
        </CardHeader>
        <input
          id="grading-key-replace-input"
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
          Ou : ton corrigé <span className="text-sm font-normal text-muted-foreground">(si tu en as déjà un)</span>
        </CardTitle>
        <CardDescription>
          Dépose ton corrigé type : le système y lit les bonnes réponses. Chaque réponse juste compte alors 1 point ; pour des points par question, utilise le barème express.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
          onClick={() => !uploading && document.getElementById('grading-key-input')?.click()}
        >
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 mx-auto text-primary mb-3 animate-spin" />
              <p className="text-sm font-medium">Lecture du corrigé…</p>
              <p className="text-xs text-muted-foreground mt-1">Une dizaine de secondes</p>
            </>
          ) : (
            <>
              <Camera className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm font-medium mb-1">Prends ton corrigé en photo, ou choisis le fichier</p>
              <p className="text-xs text-muted-foreground">
                Photo, scan, PDF, Word, Excel ou PowerPoint
              </p>
            </>
          )}
          <input
            id="grading-key-input"
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

        <p className="text-xs text-muted-foreground mt-3">
          Sans barème, chaque réponse juste compte 1 point : tu ajustes la note au moment de valider.
        </p>
      </CardContent>
    </Card>
  );
}