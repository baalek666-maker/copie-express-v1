'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Camera, AlertTriangle, CheckCircle2, Sun, Image as ImageIcon, FileText, X } from 'lucide-react';

export function PhotoTips() {
  const [open, setOpen] = useState(false);

  const tips = [
    {
      icon: Sun,
      color: 'text-primary',
      title: 'Bonne lumière',
      desc: 'Évite les ombres sur la copie. Lumière naturelle ou plafonnier.',
    },
    {
      icon: ImageIcon,
      color: 'text-primary',
      title: 'Photo à plat',
      desc: 'Pose la copie bien à plat sur une table. Pas de pliure ni de coin relevé.',
    },
    {
      icon: Camera,
      color: 'text-primary',
      title: 'Vue du dessus',
      desc: 'Tiens le téléphone bien parallèle à la feuille (pas en biais).',
    },
    {
      icon: FileText,
      color: 'text-primary',
      title: 'Tout le texte visible',
      desc: 'Cadre la copie entière, sans couper les bords. Pas de doigts visibles.',
    },
  ];

  const mistakes = [
    'Photo floue ou bougée',
    'Ombre du téléphone sur la feuille',
    'Copie froissée ou cornée',
    'Écriture trop petite ou cursive illisible',
  ];

  return (
    <Card className="bg-secondary/40 shadow-none">
      <CardContent className="p-4">
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-primary" />
            <div>
              <div className="font-medium text-sm">Conseils pour une bonne photo</div>
              <div className="text-xs text-muted-foreground">
                Plus la photo est nette, plus la lecture est fiable.
              </div>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="mt-4 space-y-4">
            {/* Tips OK */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tips.map((tip, i) => (
                <div key={i} className="flex gap-2 p-2 rounded-md bg-card border">
                  <tip.icon className={`h-5 w-5 shrink-0 mt-0.5 ${tip.color}`} />
                  <div>
                    <div className="font-medium text-xs">{tip.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{tip.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mistakes */}
            <div className="rounded-md bg-red-50 border border-red-200 p-3 dark:bg-red-950/20 dark:border-red-900">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-xs text-red-900 dark:text-red-200">À éviter</span>
              </div>
              <ul className="space-y-1">
                {mistakes.map((m, i) => (
                  <li key={i} className="text-xs text-red-800 dark:text-red-300 flex items-center gap-2">
                    <X className="h-3 w-3 text-red-400 shrink-0" aria-hidden="true" />
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            {/* Accepted formats */}
            <div className="text-xs text-muted-foreground flex items-center gap-2 pt-2 border-t">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              Formats acceptés : JPG, PNG, WebP, PDF, Word, Excel, PowerPoint · 50 Mo maximum par fichier
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}