'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { backendJson } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

// Résiliation en autonomie : l'accès reste ouvert jusqu'à la fin de la période déjà payée.
export function SubscriptionActions({ cancelAtPeriodEnd, periodEndLabel }: {
  cancelAtPeriodEnd: boolean;
  periodEndLabel: string;
}) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const call = async (path: string, success: string) => {
    setBusy(true);
    try {
      await backendJson(path, { method: 'POST' });
      toast.success(success);
      setConfirming(false);
      router.refresh();
    } catch (err: any) {
      toast.error(err?.message || 'Une erreur est survenue. Réessaie.');
    } finally {
      setBusy(false);
    }
  };

  if (cancelAtPeriodEnd) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Abonnement résilié : tu gardes ton forfait jusqu'au {periodEndLabel}, sans nouveau prélèvement.
        </p>
        <Button variant="outline" size="sm" disabled={busy} onClick={() => call('/api/stripe/resume', 'Abonnement repris')}>
          {busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
          Reprendre l'abonnement
        </Button>
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="space-y-2">
        <p className="text-sm">
          Tu gardes ton forfait jusqu'au {periodEndLabel}. Aucun prélèvement ensuite.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button variant="destructive" size="sm" disabled={busy} onClick={() => call('/api/stripe/cancel', 'Abonnement résilié')}>
            {busy && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
            Confirmer la résiliation
          </Button>
          <Button variant="ghost" size="sm" disabled={busy} onClick={() => setConfirming(false)}>
            Garder mon abonnement
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => setConfirming(true)}>
      Résilier l'abonnement
    </Button>
  );
}
