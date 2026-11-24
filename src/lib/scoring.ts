// Calcul de la note d'une copie.
// Règle identique à celle du serveur (index.js, computeCopyScore) : garder les deux alignées.

export interface CopyAnswer {
  question_id: string;
  question_text?: string | null;
  student_wrote?: string | null;
  expected?: string | null;
  is_correct?: boolean;
  error_type?: string | null;
  confidence?: number;
  /** Points fixés à la main par l'enseignant (prioritaires sur juste/faux). */
  points?: number;
}

export interface ScaleQuestion {
  id: string;
  label?: string;
  max_points: number;
  skill?: string;
}

export interface CopyScore {
  score: number;
  max: number;
  /** true : points du barème. false : 1 point par réponse lue. */
  weighted: boolean;
}

export const round2 = (n: number) => Math.round(n * 100) / 100;

export function normId(v: unknown): string {
  return String(v ?? '').trim().toLowerCase()
    .replace(/^(question|exercice|ex|q)\s*\.?\s*/, '')
    .replace(/[\s.)]+$/, '');
}

export function pointsFor(answer: CopyAnswer | undefined, max: number): number {
  if (!answer) return 0;
  if (typeof answer.points === 'number' && Number.isFinite(answer.points)) {
    return Math.min(max, Math.max(0, answer.points));
  }
  return answer.is_correct === true ? max : 0;
}

/** Les évaluations créées avant novembre 2026 portent un barème factice (1 question, 1 point) : on l'ignore. */
export function usableScale(scale: ScaleQuestion[] | null | undefined): ScaleQuestion[] {
  const sc = Array.isArray(scale) ? scale : [];
  if (sc.length === 1 && normId(sc[0]?.id) === '1' && Number(sc[0]?.max_points) === 1 && /^question 1$/i.test(String(sc[0]?.label || ''))) return [];
  return sc;
}

export function asAnswers(raw: unknown): CopyAnswer[] {
  return Array.isArray(raw) ? (raw as CopyAnswer[]) : [];
}

/** Points maximum d'une réponse : ceux du barème si la question y figure, sinon 1. */
export function maxFor(answer: CopyAnswer, scale: ScaleQuestion[] | null | undefined, weighted: boolean): number {
  if (!weighted) return 1;
  const q = usableScale(scale).find((s) => normId(s.id) === normId(answer.question_id));
  return q ? Number(q.max_points) || 0 : 0;
}

export function computeCopyScore(rawAnswers: unknown, scale: ScaleQuestion[] | null | undefined): CopyScore {
  const list = asAnswers(rawAnswers);
  const sc = usableScale(scale);
  if (!list.length) return { score: 0, max: 0, weighted: false };
  const byId = new Map(list.map((a) => [normId(a.question_id), a]));
  const matched = sc.filter((q) => byId.has(normId(q.id))).length;
  // Avec un barème, il fait foi : une question sans réponse vaut 0.
  const weighted = sc.length > 0 && matched >= 1;
  if (weighted) {
    let score = 0;
    let max = 0;
    for (const q of sc) {
      const m = Number(q.max_points) || 0;
      max += m;
      score += pointsFor(byId.get(normId(q.id)), m);
    }
    return { score: round2(score), max: round2(max), weighted: true };
  }
  let score = 0;
  for (const a of list) score += pointsFor(a, 1);
  return { score: round2(score), max: list.length, weighted: false };
}

/** Affichage français d'un nombre de points : 2,5 */
export function frPoints(n: number | null | undefined): string {
  if (n === null || n === undefined || Number.isNaN(Number(n))) return '—';
  return String(round2(Number(n))).replace('.', ',');
}

/** Une copie est « sûre » si l'indice global et chaque réponse sont au-dessus des seuils. */
export const SAFE_COPY_THRESHOLD = 0.9;
export const DOUBT_ANSWER_THRESHOLD = 0.7;

/** Questions du barème pour lesquelles aucune réponse n'a été lue. */
export function missingCount(rawAnswers: unknown, scale?: ScaleQuestion[] | null): number {
  const sc = usableScale(scale);
  if (!sc.length) return 0;
  const ids = new Set(asAnswers(rawAnswers).map((a) => normId(a.question_id)));
  if (!sc.some((q) => ids.has(normId(q.id)))) return 0; // barème non applicable : géré par l'indice global
  return sc.filter((q) => !ids.has(normId(q.id))).length;
}

/** Une entrée par question du barème, dans l'ordre du barème (les manquantes sont ajoutées « sans réponse »). */
export function alignToScale(rawAnswers: unknown, scale?: ScaleQuestion[] | null): CopyAnswer[] {
  const list = asAnswers(rawAnswers).map((a) => ({ ...a }));
  const sc = usableScale(scale);
  if (!sc.length) return list;
  const byId = new Map(list.map((a) => [normId(a.question_id), a]));
  if (!sc.some((q) => byId.has(normId(q.id)))) return list;
  return sc.map((q) => byId.get(normId(q.id)) || {
    question_id: String(q.id), student_wrote: null, expected: null, is_correct: false, error_type: 'absence', confidence: 0.5,
  });
}

export function isSafeCopy(confidence: number | null | undefined, rawAnswers: unknown, scale?: ScaleQuestion[] | null): boolean {
  const list = asAnswers(rawAnswers);
  if (!list.length) return false;
  if ((confidence ?? 0) < SAFE_COPY_THRESHOLD) return false;
  if (missingCount(rawAnswers, scale) > 0) return false;
  return list.every((a) => (a.confidence ?? 0) >= DOUBT_ANSWER_THRESHOLD);
}

export function doubtfulCount(rawAnswers: unknown, scale?: ScaleQuestion[] | null): number {
  return asAnswers(rawAnswers).filter((a) => (a.confidence ?? 0) < DOUBT_ANSWER_THRESHOLD).length + missingCount(rawAnswers, scale);
}
