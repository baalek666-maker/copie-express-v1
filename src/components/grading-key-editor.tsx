'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Keyboard, CheckCircle2, Edit3, Save, Loader2, FileText, X } from 'lucide-react';

export function GradingKeyEditor({
  evaluationId,
  initialGradingKey,
}: {
  evaluationId: string;
  initialGradingKey: string | null;
}) {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [mode, setMode] = useState<'display' | 'edit-text' | 'upload-photo'>(
    initialGradingKey ? 'display' : 'edit-text'
  );
  const [gradingKey, setGradingKey] = useState(initialGradingKey || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    const { error } = await supabase
      .from('evaluations')
      .update({ grading_key: gradingKey.trim() || null })
      .eq('id', evaluationId);

    if (error) {
      setError(error.message);
      setSaving(false);
      return;
    }

    setSuccess(true);
    setMode('display');
    setSaving(false);
    setTimeout(() => setSuccess(false), 2000);
    router.refresh();
  };

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
      const response = await fetch(`${backendUrl}/api/grading-key`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();
      setGradingKey(result.extracted_text);
      setSuccess(true);
      setUploading(false);
      setMode('display');
      setTimeout(() => setSuccess(false), 2000);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setUploading(false);
    }
  };

  // MODE DISPLAY : barème existe, on l'affiche avec options
  if (mode === 'display' && gradingKey) {
    return (
      <Card className="border-green-200 bg-green-50/30">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Barème défini
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setMode('edit-text')}>
                <Edit3 className="h-3 w-3 mr-1" />
                Modifier
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Le système utilise ce barème pour proposer une note par copie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-white rounded-md p-4 text-sm font-mono whitespace-pre-wrap border">
{gradingKey}
          </pre>
          <p className="text-xs text-muted-foreground mt-2">
            💡 Pour modifier, clique sur "Modifier". Pour uploader une nouvelle photo,{" "}
            <button onClick={() => setMode('upload-photo')} className="text-primary hover:underline">
              clique ici
            </button>.
          </p>
        </CardContent>
      </Card>
    );
  }

  // MODE EDIT-TEXT ou UPLOAD-PHOTO : on édite
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Barème <span className="text-sm font-normal text-muted-foreground">(optionnel mais recommandé)</span>
        </CardTitle>
        <CardDescription>
          Le système comparera chaque copie à ce barème pour te proposer une note. Tu valides tout à la fin.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Onglets mode */}
        <div className="flex gap-2 border-b">
          <button
            type="button"
            onClick={() => setMode('upload-photo')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              mode === 'upload-photo'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Camera className="h-4 w-4 inline mr-1" />
            Photo du barème
          </button>
          <button
            type="button"
            onClick={() => setMode('edit-text')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              mode === 'edit-text'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Keyboard className="h-4 w-4 inline mr-1" />
            Saisie texte
          </button>
        </div>

        {/* MODE UPLOAD PHOTO */}
        {mode === 'upload-photo' && (
          <div className="space-y-3">
            <div
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
              onClick={() => document.getElementById('grading-key-input')?.click()}
            >
              <Camera className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium mb-1">
                {uploading ? 'Extraction en cours...' : 'Clique pour uploader une photo'}
              </p>
              <p className="text-xs text-muted-foreground">
                Photo du corrigé type, capture d'écran, ou PDF
              </p>
              <input
                id="grading-key-input"
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

            {uploading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Extraction du texte en cours via le système de reconnaissance...
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              Le système extraira automatiquement le texte de l'image. Tu pourras le corriger après.
            </p>
          </div>
        )}

        {/* MODE EDIT TEXT */}
        {mode === 'edit-text' && (
          <div className="space-y-3">
            <Textarea
              placeholder={`Une réponse attendue par ligne. Exemple :\n\n1. 4\n2. Paris\n3. La cellule`}
              value={gradingKey}
              onChange={(e) => setGradingKey(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Enregistrement...' : 'Enregistrer le barème'}
              </Button>
              {initialGradingKey && (
                <Button variant="outline" onClick={() => { setMode('display'); setGradingKey(initialGradingKey); }}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-md bg-green-50 border border-green-200 p-3 text-sm text-green-900">
            ✓ Barème enregistré. Les prochaines copies extraites utiliseront ce barème.
          </div>
        )}
      </CardContent>
    </Card>
  );
}