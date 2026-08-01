'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cookie, X } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Petit délai pour ne pas agresser à l'atterrissage
      const timer = setTimeout(() => setShow(true), 1500);
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

  return (
    <div
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-up"
      role="dialog"
      aria-label="Bandeau de consentement cookies"
    >
      <div className="bg-card border-2 rounded-xl shadow-2xl p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Cookie className="h-4 w-4 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold">On respecte ta vie privée</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              On utilise Plausible Analytics, un outil sans cookies et conforme RGPD, pour comprendre comment améliorer le service.
              Aucune donnée personnelle collectée.{' '}
              <Link href="/legal/privacy" className="text-primary hover:underline">
                En savoir plus
              </Link>
            </p>
          </div>
          <button
            onClick={decline}
            className="text-muted-foreground hover:text-foreground shrink-0"
            aria-label="Fermer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2">
          <Button onClick={accept} size="sm" className="flex-1">
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
