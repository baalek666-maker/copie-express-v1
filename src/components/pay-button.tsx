'use client';

import { useState } from 'react';
import { Loader2, Lock } from 'lucide-react';
import { ApiError, backendJson } from '@/lib/api';
import { toast } from 'sonner';

export function PayButton({ plan, label }: { plan: string; label: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const data = await backendJson<{ url: string }>('/api/stripe/checkout', {
        method: 'POST',
        body: JSON.stringify({ plan }),
      });
      // Page de paiement sécurisée
      window.location.href = data.url;
    } catch (err: any) {
      if (err instanceof ApiError && err.status === 401) {
        window.location.href = `/login?plan=${encodeURIComponent(plan)}`;
        return;
      }
      toast.error('Le paiement n’a pas démarré', { description: err?.message });
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePay}
      disabled={loading}
      className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-6 rounded-md font-medium transition-colors disabled:opacity-60"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
      {loading ? 'Ouverture du paiement…' : `Payer ${label}`}
    </button>
  );
}
