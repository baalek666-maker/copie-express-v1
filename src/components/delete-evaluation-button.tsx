'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';

// Suppression d'évaluation avec confirmation (2 clics).
// La DB a ON DELETE CASCADE sur copies/exports : tout est purgé.
export function DeleteEvaluationButton({ evaluationId }: { evaluationId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createBrowserSupabase();
    const { error } = await supabase.from('evaluations').delete().eq('id', evaluationId);
    if (error) {
      setDeleting(false);
      setConfirming(false);
      alert('Suppression impossible : ' + error.message);
      return;
    }
    router.push('/app');
    router.refresh();
  };

  if (deleting) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
        Suppression…
      </Button>
    );
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1">
        <Button variant="destructive" size="sm" onClick={handleDelete}>
          Confirmer
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          Annuler
        </Button>
      </div>
    );
  }

  return (
    <Button variant="outline" size="sm" onClick={() => setConfirming(true)}>
      <Trash2 className="h-4 w-4 mr-1" />
      Supprimer
    </Button>
  );
}
