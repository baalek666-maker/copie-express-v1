import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Pourquoi les profs quittent le métier — et comment la technologie peut aider",
  description: "Surcharge administrative, heures sup non payées, perte de sens. 3h de correction par semaine = 120h par an. Et si la technologie redonnait du temps ?",
};

export default function ArticleProfsQuittent() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto px-6 py-12">
      <h1>Pourquoi les profs quittent le métier — et comment la technologie peut aider</h1>
      <p className="text-xl text-muted-foreground">
        Un prof sur cinq quitte le métier dans les cinq premières années. La charge administrative est le motif n°1. Peut-on inverser la tendance ?
      </p>

      <h2>Le vrai problème : ce n&apos;est pas le salaire, c&apos;est le temps</h2>
      <p>
        Le salaire est un motif réel, mais ce n&apos;est pas le premier. La première raison,
        c&apos;est <strong>la surcharge administrative</strong>. Les heures passées à saisir des
        notes, remplir des tableaux, faire des statistiques, préparer des conseils de classe.
      </p>
      <p>
        <strong>3 heures par semaine × 40 semaines = 120 heures par an</strong>.
        C&apos;est 15 jours de travail à temps plein, juste pour la saisie administrative.
        Des heures non payées, non reconnues, non valorisées.
      </p>

      <h2>Ce que les profs disent vraiment</h2>
      <blockquote>
        « La correction, ça va. C&apos;est la saisie des notes qui me tue. » — Sylvie, 39 ans, physique
      </blockquote>
      <blockquote>
        « J&apos;ai passé plus de temps à cliquer dans SACoche qu&apos;à préparer mes cours. » — Marc, 42 ans, maths
      </blockquote>

      <h2>La technologie n&apos;est pas la solution à tout, mais elle peut libérer du temps</h2>
      <p>
        Un logiciel de gestion scolaire (SACoche, Pronote) est un outil de stockage. Il ne
        réduit pas le temps de saisie. Un outil de correction dédié, lui, le réduit de 60×.
      </p>

      <h2>120 heures rendues aux profs</h2>
      <p>
        C&apos;est la promesse. Pas une baguette magique, pas un remplacement du prof. Juste
        un outil qui fait ce que le prof ne devrait pas avoir à faire : saisir des chiffres.
      </p>
    </article>
  );
}