'use client';

import { AlertCircle, Check, HelpCircle } from 'lucide-react';

// Indice de lecture d'une réponse ou d'une copie : vert = sûr, ambre = à vérifier, rouge = incertain.
export function ConfidenceBadge({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);

  let color, label, Icon;
  if (pct >= 90) {
    color = 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950/30 dark:text-green-300 dark:border-green-900';
    label = 'Fiable';
    Icon = Check;
  } else if (pct >= 70) {
    color = 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900';
    label = 'À vérifier';
    Icon = AlertCircle;
  } else {
    color = 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/30 dark:text-red-300 dark:border-red-900';
    label = 'Incertain';
    Icon = HelpCircle;
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium tabular-nums ${color}`}
      title={`Indice de lecture : ${pct} % (${label})`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      <span>{pct} %</span>
    </span>
  );
}
