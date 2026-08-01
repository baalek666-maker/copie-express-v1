'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronDown, Camera, AlertTriangle, CheckCircle2, Sun, Image as ImageIcon, FileText } from 'lucide-react';

export function PhotoTips() {
  const [open, setOpen] = useState(false);

  const tips = [
    {
      icon: Sun,
      color: 'text-amber-600',
      title: 'Bonne lumière',
      desc: 'Évite les ombres sur la copie. Lumière naturelle ou plafonnier.',
    },
    {
      icon: ImageIcon,
      color: 'text-blue-600',
      title: 'Photo à plat',
      desc: 'Pose la copie bien à plat sur une table. Pas de pliure ni de coin relevé.',
    },
    {
      icon: Camera,
      color: 'text-purple-600',
      title: 'Vue du dessus',
      desc: 'Tiens le téléphone bien parallèle à la feuille (pas en biais).',
    },
    {
      icon: FileText,
      color: 'text-green-600',
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
    <Card className="border-blue-200 bg-blue-50/30">
      <CardContent className="p-4">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center justify-between w-full text-left"
        >
          <div className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-blue-600" />
            <div>
              <div className="font-medium text-sm">📸 Conseils pour une bonne photo</div>
              <div className="text-xs text-muted-foreground">
                Une copie bien photographiée = une extraction fiable à 95%+
              </div>
            </div>
          </div>
          <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
        </button>

        {open && (
          <div className="mt-4 space-y-4">
            {/* Tips OK */}
            <div className="grid grid-cols-2 gap-3">
              {tips.map((tip, i) => (
                <div key={i} className="flex gap-2 p-2 rounded-md bg-white border">
                  <tip.icon className={`h-5 w-5 shrink-0 mt-0.5 ${tip.color}`} />
                  <div>
                    <div className="font-medium text-xs">{tip.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{tip.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mistakes */}
            <div className="rounded-md bg-red-50 border border-red-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="font-medium text-xs text-red-900">À éviter</span>
              </div>
              <ul className="space-y-1">
                {mistakes.map((m, i) => (
                  <li key={i} className="text-xs text-red-800 flex items-center gap-2">
                    <span className="text-red-400">✗</span>
                    {m}
                  </li>
                ))}
              </ul>
            </div>

            {/* Accepted formats */}
            <div className="text-xs text-muted-foreground flex items-center gap-2 pt-2 border-t">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
              Formats acceptés : JPG, PNG, WebP, PDF, Word, Excel, PowerPoint · Max 50 MB par fichier
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}