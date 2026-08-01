// Templates de barèmes pré-remplis par matière/niveau
export interface Template {
  id: string;
  title: string;
  subject: string;
  classLevel: string;
  gradingKey: string;
  questions: { id: string; label: string; max_points: number }[];
}

export const GRADING_TEMPLATES: Template[] = [
  {
    id: 'maths-6e-controle',
    title: 'Contrôle Maths 6ème',
    subject: 'maths',
    classLevel: 'college-6e',
    questions: [
      { id: 'q1', label: 'Exercice 1 — Calculs', max_points: 5 },
      { id: 'q2', label: 'Exercice 2 — Géométrie', max_points: 5 },
      { id: 'q3', label: 'Exercice 3 — Problème', max_points: 10 },
    ],
    gradingKey: `1. 12 + 8 = 20
2. Les angles d'un triangle font 180°
3. 25 % de 80 = 20`,
  },
  {
    id: 'maths-3e-brevet',
    title: 'Brevet Blanc Maths 3ème',
    subject: 'maths',
    classLevel: 'college-3e',
    questions: [
      { id: 'q1', label: 'Exercice 1 — Nombres & calculs', max_points: 8 },
      { id: 'q2', label: 'Exercice 2 — Géométrie', max_points: 8 },
      { id: 'q3', label: 'Exercice 3 — Fonction', max_points: 8 },
      { id: 'q4', label: 'Exercice 4 — Problème', max_points: 12 },
    ],
    gradingKey: `1. PGCD(48, 72) = 24
2. Théorème de Pythagore appliqué
3. f(x) = 2x + 3
4. Voir corrigé type`,
  },
  {
    id: 'francais-3e-dissertation',
    title: 'Dissertation Français 3ème',
    subject: 'francais',
    classLevel: 'college-3e',
    questions: [
      { id: 'q1', label: 'Question 1 — Compréhension', max_points: 4 },
      { id: 'q2', label: 'Question 2 — Analyse', max_points: 6 },
      { id: 'q3', label: 'Dissertation', max_points: 10 },
    ],
    gradingKey: `1. Réponse dans le texte
2. Analyse des procédés littéraires
3. Argumentation structurée`,
  },
  {
    id: 'francais-1ere-commentaire',
    title: 'Commentaire Français 1ère',
    subject: 'francais',
    classLevel: 'lycee-1ere',
    questions: [
      { id: 'q1', label: 'Introduction', max_points: 4 },
      { id: 'q2', label: 'Mouvement 1', max_points: 5 },
      { id: 'q3', label: 'Mouvement 2', max_points: 5 },
      { id: 'q4', label: 'Conclusion', max_points: 2 },
    ],
    gradingKey: `1. Accroche + problématique + plan
2. Procédés + analyse
3. Procédés + analyse
4. Bilan + ouverture`,
  },
  {
    id: 'histoire-3e',
    title: 'Histoire 3ème — Chapitre',
    subject: 'histoire',
    classLevel: 'college-3e',
    questions: [
      { id: 'q1', label: 'Questions de cours', max_points: 6 },
      { id: 'q2', label: 'Analyse de document', max_points: 6 },
      { id: 'q3', label: 'Rédaction', max_points: 8 },
    ],
    gradingKey: `1. Dates et personnages clés
2. Description + contexte du document
3. Argumentation historique`,
  },
  {
    id: 'anglais-6e',
    title: 'Anglais 6ème — Vocabulaire',
    subject: 'anglais',
    classLevel: 'college-6e',
    questions: [
      { id: 'q1', label: 'Compréhension orale', max_points: 5 },
      { id: 'q2', label: 'Vocabulaire', max_points: 5 },
      { id: 'q3', label: 'Grammaire', max_points: 5 },
      { id: 'q4', label: 'Expression écrite', max_points: 5 },
    ],
    gradingKey: `1. Colors, family, animals
2. Traduction français → anglais
3. Present simple, articles
4. Phrase de 5 lignes minimum`,
  },
  {
    id: 'svt-3e',
    title: 'SVT 3ème — génétique',
    subject: 'svt',
    classLevel: 'college-3e',
    questions: [
      { id: 'q1', label: 'Schéma légendé', max_points: 6 },
      { id: 'q2', label: 'Explication', max_points: 8 },
      { id: 'q3', label: 'Application', max_points: 6 },
    ],
    gradingKey: `1. ADN, gène, chromosome
2. Transmission des caractères
3. Exemple concret`,
  },
  {
    id: 'physique-2nde',
    title: 'Physique 2nde — Mécanique',
    subject: 'physique',
    classLevel: 'lycee-2nde',
    questions: [
      { id: 'q1', label: 'Cours', max_points: 6 },
      { id: 'q2', label: 'Calcul de vitesse', max_points: 7 },
      { id: 'q3', label: 'Schéma de forces', max_points: 7 },
    ],
    gradingKey: `1. Définition vitesse, référentiel
2. v = d/t
3. Forces appliquées + point d'application`,
  },
];