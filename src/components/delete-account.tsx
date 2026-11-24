'use client';

import { useState } from 'react';
import { backendJson } from '@/lib/api';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const WORD = 'SUPPRIMER';

export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    setBusy(true);
    try {
      await backendJson('/api/account', { method: 'DELETE', body: JSON.stringify({ confirm: WORD }) });
      await createBrowserSupabase().auth.signOut().catch(() => {});
      window.location.href = '/?compte=supprime';
    } catch (err: any) {
      toast.error(err?.message || 'La suppression a échoué.');
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setOpen(true)}>
        Supprimer mon compte et mes données
      </Button>
    );
  }

  return (
    <div className="space-y-3 rounded-md border border-destructive/30 p-3">
      <p className="text-sm text-foreground">
        Suppression immédiate et définitive : ton compte, tes évaluations, les copies et leurs photos.
        Un abonnement en cours est arrêté sans nouveau prélèvement.
      </p>
      <label htmlFor="delete-confirm" className="text-sm text-muted-foreground block">
        Écris {WORD} pour confirmer
      </label>
      <Input
        id="delete-confirm"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoComplete="off"
        className="max-w-xs"
      />
      <div className="flex gap-2 flex-wrap">
        <Button variant="destructive" size="sm" disabled={busy || text.trim() !== WORD} onClick={handleDelete}>
          {busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          Supprimer définitivement
        </Button>
        <Button variant="ghost" size="sm" disabled={busy} onClick={() => { setOpen(false); setText(''); }}>
          Annuler
        </Button>
      </div>
    </div>
  );
}
