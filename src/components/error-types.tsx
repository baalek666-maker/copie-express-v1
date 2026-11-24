'use client';

// Catégories d'erreurs (feature 16/09/2026 — inspirée ed.ai)
// Lit extracted_answers (array backend ou record legacy), agrège les error_type.

import { Brain, Calculator, CircleDashed, CircleHelp, Eye, MinusCircle, Wind, type LucideIcon } from 'lucide-react';

// Une icône par catégorie, une seule teinte : la liste des copies reste lisible d'un coup d'œil.
export const ERROR_CATEGORIES: Record<string, { label: string; icon: LucideIcon }> = {
  calcul: { label: 'Calcul', icon: Calculator },
  concept: { label: 'Notion non comprise', icon: Brain },
  lecture: { label: 'Énoncé mal lu', icon: Eye },
  inattention: { label: 'Étourderie', icon: Wind },
  incomplet: { label: 'Réponse incomplète', icon: CircleDashed },
  absence: { label: 'Pas de réponse', icon: MinusCircle },
  autre: { label: 'Autre', icon: CircleHelp },
};

type AnswerItem = {
  question_id?: string | number;
  is_correct?: boolean;
  error_type?: string | null;
};

// Compte les catégories d'erreurs d'une copie
export function countErrorTypes(extractedAnswers: any): Record<string, number> {
  const counts: Record<string, number> = {};
  if (!Array.isArray(extractedAnswers)) return counts;
  for (const a of extractedAnswers as AnswerItem[]) {
    if (a?.is_correct === false && a.error_type && ERROR_CATEGORIES[a.error_type]) {
      counts[a.error_type] = (counts[a.error_type] || 0) + 1;
    }
  }
  return counts;
}

// Agrège sur toute la classe
export function countErrorTypesAll(copies: { extracted_answers: any }[]): Record<string, number> {
  const totals: Record<string, number> = {};
  for (const c of copies) {
    for (const [k, v] of Object.entries(countErrorTypes(c.extracted_answers))) {
      totals[k] = (totals[k] || 0) + v;
    }
  }
  return totals;
}

export function ErrorTypeBadges({ counts, max = 4 }: { counts: Record<string, number>; max?: number }) {
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, max);
  if (!entries.length) return null;
  return (
    <span className="flex items-center gap-1 flex-wrap">
      {entries.map(([type, n]) => {
        const cat = ERROR_CATEGORIES[type];
        if (!cat) return null;
        const Icon = cat.icon;
        return (
          <span
            key={type}
            className="inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-xs text-foreground/80"
          >
            <Icon className="h-3 w-3 text-muted-foreground" aria-hidden="true" />
            {cat.label}
            <span className="tabular-nums text-muted-foreground">×{n}</span>
          </span>
        );
      })}
    </span>
  );
}
