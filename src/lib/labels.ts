// Libellés lisibles des matières et niveaux (les valeurs stockées sont des codes).

const SUBJECT_LABELS: Record<string, string> = {
  maths: 'Mathématiques',
  physique: 'Physique-Chimie',
  svt: 'SVT',
  francais: 'Français',
  histoire: 'Histoire-Géographie',
  anglais: 'Anglais',
  allemand: 'Allemand',
  espagnol: 'Espagnol',
  italien: 'Italien',
  philo: 'Philosophie',
  ses: 'SES',
  techno: 'Technologie',
  'arts-plastiques': 'Arts plastiques',
  musique: 'Éducation musicale',
  eps: 'EPS',
};

const LEVEL_LABELS: Record<string, string> = {
  cp: 'CP',
  ce1: 'CE1',
  ce2: 'CE2',
  cm1: 'CM1',
  cm2: 'CM2',
  college: 'Collège',
  'college-6e': '6ème',
  'college-5e': '5ème',
  'college-4e': '4ème',
  'college-3e': '3ème',
  lycee: 'Lycée',
  'lycee-2nde': '2nde',
  'lycee-1ere': '1ère',
  'lycee-terminale': 'Terminale',
  'lycee-pro': 'Lycée pro',
  bts: 'BTS',
  prepa: 'Prépa',
};

function fallback(code: string): string {
  const clean = code.replace(/[-_]/g, ' ').trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : '';
}

export function subjectLabel(code: string | null | undefined): string {
  if (!code) return '';
  return SUBJECT_LABELS[code] || fallback(code);
}

export function levelLabel(code: string | null | undefined): string {
  if (!code) return '';
  return LEVEL_LABELS[code] || fallback(code);
}
