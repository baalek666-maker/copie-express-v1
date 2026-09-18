'use client';

import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { getBackendUrl } from '@/lib/backend-url';
import { toast } from 'sonner';

export function PayButton({ plan, label }: { plan: string; label: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const supabase = createBrowserSupabase();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = `/login?plan=${plan}`;
        return;
      }
      const res = await fetch(`${getBackendUrl()}/api/stripe/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.error === 'payment_not_configured') {
          toast.error('Paiement indisponible pour le moment — utilise l\'activation par email.');
          return;
        }
        throw new Error(data.error || 'checkout_failed');
      }
      // Redirection vers la page de paiement hébergée Stripe
      window.location.href = data.url;
    } catch (err) {
      toast.error('Impossible de lancer le paiement. Réessaie dans un instant.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-md font-medium transition-colors disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Lock className="h-4 w-4" />
      )}
      {loading ? 'Redirection…' : `Payer — ${label}`}
    </button>
  );
}
