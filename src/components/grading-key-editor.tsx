'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Edit3, Save, FileText } from 'lucide-react';

export function GradingKeyEditor({
  evaluationId,
  initialGradingKey,
}: {
  evaluationId: string;
  initialGradingKey: string | null;
}) {
  const [editing, setEditing] = useState(!initialGradingKey);
  const [gradingKey, setGradingKey] = useState(initialGradingKey || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabase();

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

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
    setEditing(false);
    setSaving(false);
    setTimeout(() => setSuccess(false), 2000);
    router.refresh();
  };

  if (gradingKey && !editing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-base">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Barème défini ✓
            </span>
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              <Edit3 className="h-3 w-3 mr-1" />
              Modifier
            </Button>
          </CardTitle>
          <CardDescription>
            Une bonne réponse par ligne. Le système propose une note par copie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-secondary/30 rounded-md p-3 text-sm font-mono whitespace-pre-wrap">
{gradingKey}
          </pre>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Barème <span className="text-sm font-normal text-muted-foreground">(optionnel mais recommandé)</span>
        </CardTitle>
        <CardDescription>
          Une bonne réponse par ligne. Le système comparera chaque copie avec ce barème pour proposer une note.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          placeholder={`Une réponse attendue par ligne. Exemple :\n1. 4\n2. Paris\n3. La cellule`}
          value={gradingKey}
          onChange={(e) => setGradingKey(e.target.value)}
          rows={6}
          className="font-mono text-sm"
        />

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

        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Enregistrement...' : 'Enregistrer le barème'}
          </Button>
          {initialGradingKey && (
            <Button variant="outline" onClick={() => { setEditing(false); setGradingKey(initialGradingKey); }}>
              Annuler
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          💡 <strong>Tu peux modifier le barème plus tard.</strong> Les copies déjà extraites garderont leur ancienne note.
        </p>
      </CardContent>
    </Card>
  );
}