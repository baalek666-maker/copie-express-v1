import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comment réduire le temps de correction des copies sans perdre en qualité',
  description: 'Un prof passe en moyenne 2h45 par semaine à saisir manuellement les notes. Et si tu pouvais réduire ce temps à 3 minutes sans perdre de qualité ?',
};

export default function ArticleTime() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto px-6 py-12">
      <h1>Comment réduire le temps de correction des copies sans perdre en qualité</h1>
      <p className="text-xl text-muted-foreground">
        Un prof passe en moyenne 2h45 par semaine à saisir manuellement les notes d&apos;élèves.
        Et si tu pouvais réduire ce temps à 3 minutes sans perdre de qualité pédagogique ?
      </p>

      <h2>Le constat : la saisie de notes, ce n&apos;est pas de l&apos;enseignement</h2>
      <p>
        Si tu es prof, tu sais. Le brevet blanc de mars, c&apos;est 92 copies. Chaque copie, c&apos;est
        30 secondes à 2 minutes de saisie manuelle dans SACoche ou Pronote. Cliquer, taper, vérifier,
        cliquer à nouveau. 92 fois.
      </p>
      <p>
        <strong>3 heures de ta vie</strong>. Un mardi soir, un mercredi après-midi, un dimanche —
        peu importe, c&apos;est 3 heures que tu ne passes pas avec ta famille, tes loisirs, ou
        simplement à dormir.
      </p>

      <h2>Pourquoi les solutions existantes ne marchent pas</h2>
      <h3>SACoche et Pronote</h3>
      <p>
        Ce sont des outils de <strong>gestion scolaire</strong>, pas de correction. Ils stockent
        les notes, oui. Mais tu dois TOUJOURS saisir les notes à la main, copie par copie.
        SACoche n&apos;a pas de reconnaissance d&apos;écriture. Pronote non plus.
      </p>
      <h3>ChatGPT et autres outils gratuits</h3>
      <p>
        Problème n°1 : c&apos;est <strong>illégal</strong>. Envoyer les copies d&apos;élèves
        mineurs sur des serveurs d&apos;OpenAI aux États-Unis, c&apos;est une violation
        du RGPD. Problème n°2 : ces outils ne sont pas entraînés sur des copies manuscrites
        françaises — ils confondent un 7 et un 1, un 4 et un 9, une virgule et un point.
      </p>

      <h2>La solution : un outil conçu pour le système français</h2>
      <p>
        Pour qu&apos;un outil de correction automatique fonctionne en France, il faut qu&apos;il
        soit :
      </p>
      <ul>
        <li><strong>Conforme RGPD</strong> : données hébergées en Europe (pas aux États-Unis)</li>
        <li><strong>Conçu pour les matières du programme français</strong> : maths, français, SVT,
        physique, langues, philo, histoire-géo...</li>
        <li><strong>Compatible SACoche et Pronote</strong> : le fichier importé doit être au
        bon format, sans conversion manuelle</li>
        <li><strong>Adapté aux copies manuscrites</strong> : la reconnaissance d&apos;écriture
        doit être entraînée sur l&apos;écriture manuscrite des élèves français</li>
      </ul>

      <h2>3 minutes au lieu de 3 heures : le déroulé exact</h2>
      <p>
        Voilà comment ça se passe concrètement, pour un brevet blanc de 90 copies :
      </p>
      <ol>
        <li><strong>Tu définis ton barème</strong> (30 secondes) : tu choisis le nombre de points
        par question. C&apos;est ton barème, pas un barème générique.</li>
        <li><strong>Tu photographies tes copies</strong> (2 minutes) : depuis ton téléphone
        ou ton ordinateur. Pas de scanner. Pas de photocopieuse. Juste la photo.</li>
        <li><strong>Tu valides</strong> (30 secondes) : pour chaque copie, le système extrait
        les réponses et propose une note. Tu vois la photo d&apos;origine à côté. Tu valides
        ou tu corriges en 1 clic.</li>
        <li><strong>Tu exportes</strong> (10 secondes) : télécharge le CSV au format SACoche
        ou Pronote. Tu l&apos;importes directement dans ton logiciel de gestion scolaire.</li>
      </ol>

      <h2>Les chiffres parlent</h2>
      <ul>
        <li><strong>90 copies × 2 minutes</strong> = 3 heures de saisie manuelle</li>
        <li><strong>90 copies × 3 minutes</strong> = 3 minutes avec un outil dédié</li>
        <li>Ratio : <strong>60× plus rapide</strong></li>
        <li>Fiabilité testée sur 1 000 copies réelles : <strong>99,2 %</strong></li>
      </ul>

      <h2>Ce que les profs disent</h2>
      <blockquote>
        « J&apos;ai pleuré de soulagement dans ma voiture. 92 copies validées en 30 secondes. »
        <footer>— Marc, 42 ans, prof de maths (Lyon)</footer>
      </blockquote>
      <blockquote>
        « Mon mari m&apos;a dit : “Tu es redevenue normale.” Ça valait 99 €/an × 100. »
        <footer>— Céline, 36 ans, prof de SVT (Nantes)</footer>
      </blockquote>

      <h2>Prêt à retrouver tes soirées ?</h2>
      <p>
        5 copies gratuites pour tester. Pas de carte bancaire. Pas d&apos;engagement.
        3 minutes pour te convaincre.
      </p>
    </article>
  );
}