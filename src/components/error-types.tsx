'use client';

// Catégories d'erreurs (feature 16/09/2026 — inspirée ed.ai)
// Lit extracted_answers (array backend ou record legacy), agrège les error_type.

import { Badge } from '@/components/ui/badge';

export const ERROR_CATEGORIES: Record<string, { label: string; emoji: string; color: string }> = {
  calcul: { label: 'Calcul', emoji: '➗', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  concept: { label: 'Notion non comprise', emoji: '🧠', color: 'bg-red-100 text-red-800 border-red-200' },
  lecture: { label: 'Énoncé mal lu', emoji: '👀', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  inattention: { label: 'Étourderie', emoji: '💨', color: 'bg-violet-100 text-violet-800 border-violet-200' },
  incomplet: { label: 'Réponse incomplète', emoji: '✂️', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  absence: { label: 'Pas de réponse', emoji: '🕳️', color: 'bg-gray-100 text-gray-800 border-gray-200' },
  autre: { label: 'Autre', emoji: '❓', color: 'bg-slate-100 text-slate-800 border-slate-200' },
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
        return (
          <Badge key={type} variant="outline" className={`text-xs font-normal ${cat.color}`}>
            {cat.emoji} {cat.label} ×{n}
          </Badge>
        );
      })}
    </span>
  );
}
