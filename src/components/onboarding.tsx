'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, FileText, CheckCircle2, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'onboarding_done';

const steps = [
  {
    icon: FileText,
    title: 'Crée ton évaluation',
    desc: 'Titre, matière, niveau. 10 secondes.',
  },
  {
    icon: Upload,
    title: 'Upload tes copies',
    desc: 'Photos depuis ton téléphone. JPEG, PDF, Word acceptés.',
  },
  {
    icon: CheckCircle2,
    title: 'Le système propose, tu valides',
    desc: 'Note suggérée question par question. Tu valides en 1 clic.',
  },
];

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setOpen(false);
  };

  const handleStart = () => {
    handleClose();
    router.push('/app/new');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-md w-full relative animate-scale-in">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-2 right-2 rounded-full"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="p-8 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-bold">Bienvenue sur Copie Express ! 🎉</h2>
            <p className="text-sm text-muted-foreground">3 étapes, c'est tout.</p>
          </div>

          <div className="space-y-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-9 w-9 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold leading-tight">
                      {i + 1}. {s.title}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{s.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Plus tard
            </Button>
            <Button onClick={handleStart} className="flex-1">
              Je crée ma première évaluation
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
