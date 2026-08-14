import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'RGPD et copies d\'élèves : ce que tout prof doit savoir en 2026',
  description: 'Peut-on envoyer les copies de ses élèves sur ChatGPT ou un serveur américain ? Que dit le RGPD ? Un guide simple, sans jargon juridique.',
};

export default function ArticleRGPD() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto px-6 py-12">
      <h1>RGPD et copies d&apos;élèves : ce que tout prof doit savoir</h1>
      <p className="text-xl text-muted-foreground">
        Peut-on utiliser ChatGPT pour corriger des copies ? Est-ce que SACoche est conforme ?
        Que risque-t-on vraiment ? Réponses sans jargon.
      </p>

      <h2>Les copies d&apos;élèves, c&apos;est des données personnelles</h2>
      <p>
        Le RGPD ne fait pas dans la nuance : une copie d&apos;élève, c&apos;est
        <strong>une donnée personnelle</strong>. Elle contient le nom, le prénom, la classe,
        et les réponses manuscrites de l&apos;élève. C&apos;est soumis aux mêmes règles
        que n&apos;importe quel fichier médical ou bancaire.
      </p>

      <h2>ChatGPT et les données scolaires : non, ce n&apos;est pas légal</h2>
      <p>
        La tentation est grande : tu prends une photo de la copie, tu la colles dans ChatGPT,
        et tu demandes « Quelle note ? ». Résultat immédiat. Gratuit. Sans effort.
      </p>
      <p>
        <strong>Problème : c&apos;est illégal.</strong> Pour quatre raisons :
      </p>
      <ol>
        <li><strong>Les données partent aux États-Unis</strong> : OpenAI héberge ses serveurs
        aux États-Unis. Le transfert de données personnelles hors UE est strictement encadré
        par le RGPD.</li>
        <li><strong>Pas de contrat de sous-traitance (DPA)</strong> : le RGPD exige un contrat
        écrit entre toi (le responsable de traitement) et le prestataire (le sous-traitant).</li>
        <li><strong>Les données peuvent être utilisées pour entraîner les modèles</strong> :
        même si OpenAI a désactivé l&apos;entraînement sur les données d&apos;API, le risque
        juridique existe.</li>
        <li><strong>Les élèves mineurs sont protégés</strong> : les données des mineurs
        bénéficient d&apos;une protection renforcée dans le RGPD.</li>
      </ol>

      <h2>Conséquences d&apos;une violation</h2>
      <ul>
        <li>Amende administrative : jusqu&apos;à <strong>20 millions d&apos;euros</strong> ou
        4 % du chiffre d&apos;affaires mondial</li>
        <li>Signalement à la CNIL</li>
        <li>Obligation de notification à toutes les familles concernées</li>
        <li>Risque disciplinaire (rectorat, inspection académique)</li>
      </ul>

      <h2>Et SACoche ? Et Pronote ?</h2>
      <p>
        Bonne nouvelle : SACoche et Pronote sont <strong>conformes RGPD</strong>. Leurs
        données sont hébergées en France ou en Europe, et ils ont signé les contrats
        de sous-traitance nécessaires. MAIS : ce sont des outils de stockage de notes,
        pas de correction. Tu dois TOUJOURS saisir les notes à la main.
      </p>

      <h2>Comment choisir un outil de correction conforme ?</h2>
      <p>Deux critères simples :</p>
      <ol>
        <li><strong>Où sont hébergées les données ?</strong> → Exiger l&apos;Europe (France,
        Irlande, Allemagne, Pays-Bas). Pas les États-Unis.</li>
        <li><strong>Le prestataire signe-t-il un DPA (Data Processing Agreement) ?</strong> →
        C&apos;est le contrat de sous-traitance RGPD. S&apos;il ne le propose pas, c&apos;est
        non.</li>
      </ol>

      <h2>Conclusion : ne prends pas le risque</h2>
      <p>
        Tu passes déjà 3 heures à saisir des notes. Tu ne veux pas y ajouter une procédure
        CNIL. Utilise un outil conforme RGPD, hébergé en Europe, qui ne conserve pas les
        données au-delà du nécessaire. Ta tranquillité juridique vaut bien 5 € par mois.
      </p>
    </article>
  );
}