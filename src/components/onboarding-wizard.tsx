'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Camera, CheckCircle, ArrowRight, FileText, TrendingUp, Gift, X } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'Crée ta première évaluation',
    desc: 'Donne un titre, choisis ta matière et ton niveau. 30 secondes.',
    cta: 'Créer une évaluation',
    href: '/app/new',
  },
  {
    icon: Camera,
    title: 'Upload tes copies',
    desc: 'Prends tes copies en photo depuis ton téléphone. Glisse-dépose. C\'est tout.',
    cta: 'Uploader des copies',
    href: '/app/new',
  },
  {
    icon: CheckCircle,
    title: 'Valide et exporte',
    desc: 'Le système lit les copies. Tu valides en 1 clic. Export SACoche ou Pronote.',
    cta: 'C\'est parti !',
    href: '/app/new',
  },
];

export function OnboardingWizard() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('onboarding-wizard-dismissed');
    if (!dismissed) {
      const timer = setTimeout(() => setShow(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    localStorage.setItem('onboarding-wizard-dismissed', 'true');
    toast('Tu peux revoir ce guide à tout moment depuis Parrainage → Guide express');
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />
      <Card className="relative w-full max-w-lg max-h-[80vh] overflow-y-auto animate-scale-in">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Bienvenue sur Copie Express ! 🎉</h2>
              <p className="text-sm text-muted-foreground mt-1">
                En 3 étapes, tu corriges tes copies 10× plus vite.
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={dismiss} aria-label="Fermer">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex gap-4 items-start p-4 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3 pt-2">
            <Button asChild className="flex-1">
              <a href="/app/new">
                Commencer <ArrowRight className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" onClick={dismiss}>
              Plus tard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}