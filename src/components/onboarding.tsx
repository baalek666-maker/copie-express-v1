'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, FileText, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const steps = [
  {
    icon: FileText,
    title: 'Crée ta première évaluation',
    desc: 'Titre, matière, niveau. 10 secondes.',
    cta: 'Créer',
    href: '/app/new',
  },
  {
    icon: Upload,
    title: 'Upload tes copies',
    desc: 'Photos depuis ton téléphone. JPEG, PDF, Word acceptés.',
    cta: 'Compris',
  },
  {
    icon: Sparkles,
    title: 'Le système propose, tu valides',
    desc: 'Note suggérée question par question. Tu valides en 1 clic.',
    cta: 'Allons-y',
  },
];

const STORAGE_KEY = 'onboarding_done';

export function Onboarding() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
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

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      const target = steps[step].href;
      handleClose();
      if (target) router.push(target);
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!open) return null;

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-md w-full relative animate-scale-in">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="absolute top-2 right-2 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>

        <CardContent className="p-8 space-y-6 text-center">
          <div className="flex justify-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-8 bg-primary' : 'w-1.5 bg-muted'
                }`}
              />
            ))}
          </div>

          <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Icon className="h-10 w-10 text-primary" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold">{current.title}</h2>
            <p className="text-muted-foreground">{current.desc}</p>
          </div>

          <div className="flex gap-2 justify-center pt-2">
            {step > 0 && (
              <Button variant="outline" onClick={handlePrev}>
                <ArrowLeft className="h-4 w-4 mr-1" /> Retour
              </Button>
            )}
            <Button onClick={handleNext} className="flex-1">
              {current.cta}
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}