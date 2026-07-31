export const dynamic = 'force-static';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-8">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Retour</a>
        <h1>Politique de Confidentialité — Copie Express</h1>
        <p><strong>Dernière mise à jour :</strong> 30 juillet 2026</p>

        <p>Cette politique de confidentialité décrit comment Copie Express collecte, utilise et protège les données personnelles de ses utilisateurs, conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi française Informatique et Libertés.</p>

        <h2>1. Responsable du traitement</h2>
        <p><strong>Copie Express</strong> (auto-entreprise en cours d&apos;immatriculation)<br />
        Email DPO : dpo@copie-express.fr<br />
        Contact : contact@copie-express.fr</p>

        <h2>2. Données collectées</h2>
        <p>Nous collectons les données suivantes :</p>
        <h3>Données d&apos;inscription</h3>
        <ul>
          <li>Email professionnel (obligatoire)</li>
          <li>Nom complet (obligatoire)</li>
          <li>Académie d&apos;affectation (obligatoire)</li>
          <li>Matière(s) enseignée(s) (obligatoire)</li>
          <li>Niveau(x) scolaire(s) (obligatoire)</li>
        </ul>
        <h3>Données d&apos;usage du service</h3>
        <ul>
          <li>Évaluations créées (titre, type, matière, barème)</li>
          <li>Photos de copies d&apos;élèves uploadées</li>
          <li>Texte extrait des copies par notre système de reconnaissance</li>
          <li>Réponses des élèves identifiées automatiquement</li>
          <li>Notes finales validées par l&apos;enseignant</li>
          <li>Exports générés (CSV SACoche, Pronote)</li>
        </ul>
        <h3>Données techniques</h3>
        <ul>
          <li>Adresse IP (à des fins de sécurité)</li>
          <li>Fingerprint navigateur (mesures anti-abus)</li>
          <li>Logs d&apos;accès au service</li>
        </ul>
        <h3>Données de paiement</h3>
        <p>Les données de paiement (numéro de carte, date d&apos;expiration) sont collectées et traitées exclusivement par notre prestataire sécurisé <strong>Stripe</strong>. Aucune donnée bancaire n&apos;est stockée sur nos serveurs.</p>

        <h2>3. Finalités du traitement</h2>
        <p>Vos données sont utilisées pour :</p>
        <ul>
          <li>Fournir le service d&apos;extraction automatique et d&apos;assistance à la saisie</li>
          <li>Gérer votre compte utilisateur et votre abonnement</li>
          <li>Vous envoyer des emails transactionnels (confirmation, reçu, alertes de quota)</li>
          <li>Assurer la sécurité du service et prévenir les abus</li>
          <li>Respecter nos obligations légales et comptables</li>
          <li>Améliorer le service de manière agrégée et anonymisée</li>
        </ul>

        <h2>4. Base légale du traitement</h2>
        <p>Les traitements sont fondés sur :</p>
        <ul>
          <li><strong>Exécution du contrat</strong> : pour la fourniture du service</li>
          <li><strong>Consentement</strong> : pour les communications marketing (opt-in)</li>
          <li><strong>Intérêt légitime</strong> : pour la sécurité et la prévention des abus</li>
          <li><strong>Obligation légale</strong> : pour la conservation des données comptables (10 ans)</li>
        </ul>

        <h2>5. Sous-traitants et transferts de données</h2>
        <p>Vos données sont hébergées chez les sous-traitants suivants :</p>
        <table>
          <thead>
            <tr><th>Sous-traitant</th><th>Service</th><th>Localisation</th><th>Garanties</th></tr>
          </thead>
          <tbody>
            <tr><td>Supabase Inc.</td><td>Base de données, authentification, stockage fichiers</td><td>Frankfurt, UE (Irlande par défaut)</td><td>DPO, DPA signé, hébergement UE</td></tr>
            <tr><td>Vercel Inc.</td><td>Hébergement du site web</td><td>Edge network mondial (US, EU, Asie)</td><td>DPA, chiffrement TLS</td></tr>
            <tr><td>Prestataire d&apos;extraction (UE)</td><td>Extraction automatique des réponses sur les copies</td><td>France (UE)</td><td>Pas de conservation des données, DPA</td></tr>
            <tr><td>Resend</td><td>Envoi d&apos;emails transactionnels</td><td>US (siège), edge network mondial</td><td>DPA, transfert via Standard Contractual Clauses</td></tr>
            <tr><td>Stripe</td><td>Paiement en ligne</td><td>US (siège), hébergement UE</td><td>PCI-DSS niveau 1, DPA signé</td></tr>
          </tbody>
        </table>
        <p><strong>Aucun transfert de données vers des pays tiers sans garanties appropriées</strong> (clauses contractuelles types de la Commission européenne).</p>

        <h2>6. Durée de conservation</h2>
        <ul>
          <li><strong>Photos de copies et texte extrait :</strong> 30 jours après la création de l&apos;évaluation (suppression automatique)</li>
          <li><strong>Évaluations et barèmes :</strong> tant que le compte est actif</li>
          <li><strong>Notes finales validées :</strong> tant que le compte est actif (export recommandé par l&apos;enseignant)</li>
          <li><strong>Données de compte :</strong> tant que le compte est actif + 3 ans après suppression (obligation comptable)</li>
          <li><strong>Données comptables :</strong> 10 ans (obligation légale)</li>
          <li><strong>Logs de connexion :</strong> 1 an</li>
        </ul>

        <h2>7. Vos droits (RGPD)</h2>
        <p>Conformément au RGPD, vous disposez à tout moment des droits suivants :</p>
        <ul>
          <li><strong>Droit d&apos;accès</strong> : obtenir une copie de vos données</li>
          <li><strong>Droit de rectification</strong> : corriger des données inexactes</li>
          <li><strong>Droit à l&apos;effacement</strong> : supprimer vos données</li>
          <li><strong>Droit à la limitation</strong> : limiter le traitement</li>
          <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format ouvert</li>
          <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement</li>
          <li><strong>Droit de retrait du consentement</strong> : pour les traitements basés sur le consentement</li>
          <li><strong>Droit d&apos;introduire une réclamation</strong> auprès de la CNIL (Commission Nationale de l&apos;Informatique et des Libertés)</li>
        </ul>
        <p>Pour exercer ces droits : <strong>dpo@copie-express.fr</strong>. Réponse sous 1 mois.</p>

        <h2>8. Sécurité des données</h2>
        <p>Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos données :</p>
        <ul>
          <li>Chiffrement TLS pour toutes les communications</li>
          <li>Chiffrement at rest des données (Supabase)</li>
          <li>Row Level Security (RLS) sur toutes les tables de la base de données</li>
          <li>Authentification forte par lien magique à expiration</li>
          <li>Buckets de stockage privés avec policies d&apos;accès strictes</li>
          <li>Mesures anti-abus (quota, fingerprint, détection de patterns)</li>
          <li>Sauvegardes automatiques quotidiennes</li>
          <li>Audits de sécurité réguliers</li>
        </ul>

        <h2>9. Cookies et traceurs</h2>
        <p>Nous utilisons uniquement des cookies strictement nécessaires à l&apos;authentification (Supabase Auth). Aucun cookie publicitaire, aucun tracker tiers (Google Analytics, Facebook Pixel, etc.).</p>

        <h2>10. Données des élèves (copies)</h2>
        <p>Les photos de copies d&apos;élèves sont des données sensibles. Vous, enseignant, êtes responsable de leur collecte (secret professionnel). Copie Express agit comme sous-traitant au sens du RGPD.</p>
        <p>Engagements de Copie Express :</p>
        <ul>
          <li>Aucune copie n&apos;est utilisée pour entraîner des modèles d&apos;IA</li>
          <li>Aucune copie n&apos;est partagée avec des tiers</li>
          <li>Suppression automatique des copies après 30 jours</li>
          <li>Hébergement exclusif en UE (Supabase Frankfurt)</li>
        </ul>

        <h2>11. Modifications de cette politique</h2>
        <p>Nous nous réservons le droit de modifier cette politique de confidentialité. Toute modification substantielle sera notifiée par email au moins 30 jours avant son entrée en vigueur.</p>

        <h2>12. Contact</h2>
        <p>Pour toute question relative à cette politique ou à vos données personnelles :</p>
        <ul>
          <li><strong>DPO</strong> : dpo@copie-express.fr</li>
          <li><strong>Support</strong> : contact@copie-express.fr</li>
          <li><strong>CNIL</strong> : www.cnil.fr (en cas de réclamation)</li>
        </ul>

        <hr />
        <p><em>Copie Express s&apos;engage à protéger vos données personnelles avec le plus grand soin et à respecter scrupuleusement le RGPD.</em></p>
      </div>
    </main>
  );
}