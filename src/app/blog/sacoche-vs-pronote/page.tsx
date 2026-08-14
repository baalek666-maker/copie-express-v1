import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Export SACoche vs Pronote : lequel choisir ?',
  description: 'Guide comparatif des deux logiciels de gestion scolaire les plus utilisés en France. Formats CSV, compatibilité, astuces pour importer facilement.',
};

export default function ArticleSACochePronote() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto px-6 py-12">
      <h1>SACoche vs Pronote : quel logiciel pour gérer tes notes ?</h1>
      <p className="text-xl text-muted-foreground">
        SACoche au collège, Pronote au lycée ? Petit guide des deux logiciels les plus utilisés, avec leurs forces, leurs faiblesses, et comment importer tes notes sans saisie manuelle.
      </p>
      <h2>SACoche : le logiciel des collèges</h2>
      <p>
        Gratuit, open source, maintenu par l&apos;académie de Versailles. SACoche est le logiciel
        de compétences le plus utilisé dans les collèges français. Il gère le socle commun,
        les cycles, et l&apos;évaluation par compétences (pas seulement par notes).
      </p>
      <h3>Forces</h3>
      <ul><li>Gratuit</li><li>Évaluation par compétences (socle)</li><li>Conforme RGPD</li></ul>
      <h3>Faiblesses</h3>
      <ul><li>Interface datée</li><li>Pas d&apos;import automatique de notes manuscrites</li><li>Nécessite saisie manuelle</li></ul>
      <h2>Pronote : le mastodonte des lycées</h2>
      <p>
        Utilisé par la majorité des lycées français. Pronote gère les notes, les absences, les
        emplois du temps, et la communication avec les familles. C&apos;est un outil complet… mais
        lourd.
      </p>
      <h3>Forces</h3>
      <ul><li>Complet (notes + absences + EDT + communication)</li><li>Interface moderne</li><li>Conforme RGPD</li></ul>
      <h3>Faiblesses</h3>
      <ul><li>Payant pour l&apos;établissement</li><li>Pas d&apos;import automatique non plus</li><li>Saisie manuelle inévitable</li></ul>
      <h2>Comment importer sans saisir ?</h2>
      <p>La seule solution : générer un CSV au bon format, puis l&apos;importer dans SACoche ou Pronote.</p>
      <p>C&apos;est exactement ce que fait un outil de correction dédié : il extrait les réponses, propose une note, et exporte le CSV. Plus besoin de saisir ligne par ligne.</p>
    </article>
  );
}