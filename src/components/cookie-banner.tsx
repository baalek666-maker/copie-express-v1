'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Délai long : la modale n'apparaît jamais pendant la première intention de clic
      // (login, CTA) — elle ne doit pas avaler le premier submit.
      const timer = setTimeout(() => setShow(true), 4500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'declined');
    setShow(false);
  };

  if (!show) return null;

  // Bandeau fin, en bas de l'écran : il ne doit recouvrir ni un bouton ni un prix.
  return (
    <div
      className="fixed bottom-0 inset-x-0 z-50 animate-slide-up pointer-events-none p-3 sm:p-4"
      role="dialog"
      aria-label="Bandeau de consentement cookies"
    >
      <div className="pointer-events-auto mx-auto max-w-3xl bg-card border rounded-xl shadow-lg px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
        <p className="flex-1 min-w-0 text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
          <Cookie className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <span>
            <span className="font-semibold text-foreground">On respecte ta vie privée.</span>{' '}
            Mesure d'audience sans cookies ni donnée personnelle (Plausible).{' '}
            <Link href="/legal/privacy" className="text-primary hover:underline whitespace-nowrap">
              En savoir plus
            </Link>
          </span>
        </p>
        <div className="flex gap-2 shrink-0">
          <Button onClick={accept} size="sm" className="flex-1 sm:flex-none">
            OK, compris
          </Button>
          <Button onClick={decline} size="sm" variant="outline">
            Refuser
          </Button>
        </div>
      </div>
    </div>
  );
}
