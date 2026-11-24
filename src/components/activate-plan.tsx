'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { backendJson } from '@/lib/api';

/**
 * Au retour du paiement : demande au serveur de confirmer l'abonnement, puis recharge la page.
 * Le forfait s'affiche ainsi sans attendre, et sans que l'enseignant ait à recharger lui-même.
 */
export function ActivatePlan({ sessionId }: { sessionId?: string }) {
  const router = useRouter();
  const [state, setState] = useState<'checking' | 'waiting'>('checking');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      for (let attempt = 0; attempt < 6 && !cancelled; attempt++) {
        try {
          const result = await backendJson<{ active: boolean }>('/api/stripe/sync', {
            method: 'POST',
            body: JSON.stringify(sessionId ? { session_id: sessionId } : {}),
          });
          if (result.active) {
            // la session du navigateur doit relire le forfait avant le nouvel affichage
            const { createBrowserSupabase } = await import('@/lib/supabase-browser');
            await createBrowserSupabase().auth.refreshSession();
            if (!cancelled) router.refresh();
            return;
          }
        } catch {
          // on réessaie : le paiement peut mettre quelques secondes à être confirmé
        }
        await new Promise((resolve) => setTimeout(resolve, 2500));
      }
      if (!cancelled) setState('waiting');
    })();

    return () => { cancelled = true; };
  }, [router, sessionId]);

  if (state === 'checking') {
    return (
      <p className="text-sm text-green-700/80 dark:text-green-400/80 inline-flex items-center gap-2" role="status">
        <Loader2 className="h-4 w-4 animate-spin" /> Activation de ton forfait…
      </p>
    );
  }
  return (
    <p className="text-sm text-green-700/80 dark:text-green-400/80" role="status">
      L’activation prend plus de temps que prévu. Recharge cette page dans une minute ; si rien ne change, écris-nous.
    </p>
  );
}
