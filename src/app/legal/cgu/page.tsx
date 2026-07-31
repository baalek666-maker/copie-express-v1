export const dynamic = 'force-static';

export default function CGUPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-8">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Retour</a>
        <h1>Conditions Générales d&apos;Utilisation — Copie Express</h1>
        <p><strong>Dernière mise à jour :</strong> 30 juillet 2026</p>

        <p><strong>Éditeur du service :</strong><br />
        Copie Express (auto-entreprise en cours d&apos;immatriculation)<br />
        Contact : contact@copie-express.fr</p>

        <p><strong>Hébergeur :</strong><br />
        Vercel Inc. (siège social : Walnut, CA, USA)<br />
        Supabase Inc. (siège social : Singapore)</p>

        <hr />

        <h2>1. Présentation du service</h2>
        <p>Copie Express est un service d&apos;assistance à la saisie administrative d&apos;évaluations scolaires. Il permet aux enseignants de photographier ou scanner leurs copies d&apos;élèves, d&apos;en extraire automatiquement les réponses via reconnaissance optique de caractères (OCR) et intelligence artificielle, puis de générer des fichiers d&apos;export compatibles avec les logiciels de gestion scolaire (SACoche, Pronote).</p>
        <p><strong>Copie Express est un outil d&apos;aide à la saisie administrative. Il ne procède à aucune évaluation des élèves ni à aucune notation. La validation finale des notes et appréciations reste de la responsabilité exclusive de l&apos;enseignant.</strong></p>
        <p>Le service n&apos;est pas destiné aux épreuves officielles du système éducatif français (DNB, baccalauréat, contrôle continu officiel). Pour ces évaluations, l&apos;enseignant doit utiliser les outils officiels mis à disposition par le Ministère de l&apos;Éducation nationale.</p>

        <h2>2. Acceptation des conditions</h2>
        <p>L&apos;utilisation du service implique l&apos;acceptation pleine et entière des présentes conditions générales d&apos;utilisation. Tout utilisateur s&apos;engage à les respecter.</p>

        <h2>3. Inscription et compte utilisateur</h2>
        <h3>3.1 Conditions d&apos;inscription</h3>
        <p>Le service est réservé aux personnes majeures. L&apos;inscription se fait par email professionnel. L&apos;utilisateur s&apos;engage à fournir des informations exactes lors de son inscription.</p>
        <h3>3.2 Authentification</h3>
        <p>L&apos;authentification se fait par « lien magique » envoyé par email. L&apos;utilisateur est responsable de la confidentialité de sa boîte email. Tout accès au service via son email est réputé être de son fait.</p>
        <h3>3.3 Suspension et résiliation</h3>
        <p>L&apos;éditeur se réserve le droit de suspendre ou supprimer tout compte en cas de :</p>
        <ul>
          <li>Non-respect des présentes CGU</li>
          <li>Utilisation frauduleuse ou abusive du service</li>
          <li>Activité illégale</li>
          <li>Non-paiement de l&apos;abonnement</li>
        </ul>
        <p>L&apos;utilisateur peut supprimer son compte à tout moment depuis son espace personnel.</p>

        <h2>4. Description des services et tarifs</h2>
        <h3>4.1 Forfait Découverte (gratuit)</h3>
        <ul>
          <li>10 copies offertes à l&apos;inscription, sans carte bancaire</li>
          <li>Une seule fois par utilisateur (mesures anti-abus)</li>
          <li>Fonctionnalités : OCR, export CSV basique</li>
        </ul>
        <h3>4.2 Forfait Mensuel</h3>
        <ul>
          <li>Prix : 10 € TTC / mois</li>
          <li>Copies illimitées (jusqu&apos;à 1 500 / mois, mesures anti-abus)</li>
          <li>Sans engagement, résiliation à tout moment</li>
          <li>Fonctionnalités : OCR, export SACoche, export Pronote, support prioritaire</li>
        </ul>
        <h3>4.3 Forfait Annuel Standard</h3>
        <ul>
          <li>Prix : 99 € TTC / an</li>
          <li>Copies illimitées (jusqu&apos;à 2 000 / mois, mesures anti-abus)</li>
          <li>Économie de 21 € par rapport au forfait mensuel</li>
          <li>Stockage des copies : 30 jours (conformément au RGPD)</li>
          <li>Support prioritaire</li>
        </ul>
        <h3>4.4 Forfait Expert Bac/Brevet</h3>
        <ul>
          <li>Prix : 149 € TTC / an</li>
          <li>Copies illimitées (jusqu&apos;à 3 000 / mois, mesures anti-abus)</li>
          <li>Bibliothèque de barèmes experts (à venir)</li>
          <li>Correcteur IA calibré brevet/bac (à venir)</li>
          <li>Mises à jour barèmes offertes</li>
          <li>Accès anticipé aux nouvelles fonctionnalités</li>
        </ul>
        <p>Les prix sont indiques TTC. La TVA n&apos;est pas applicable (auto-entreprise, article 293 B du CGI, en cours d&apos;immatriculation).</p>

        <h2>5. Paiement et renouvellement</h2>
        <h3>5.1 Modalités de paiement</h3>
        <p>Le paiement s&apos;effectue par carte bancaire via le service sécurisé Stripe. Aucune information bancaire n&apos;est stockée sur les serveurs de Copie Express.</p>
        <h3>5.2 Renouvellement</h3>
        <p>Les abonnements mensuels et annuels se renouvellent automatiquement à échéance. L&apos;utilisateur peut résilier à tout moment depuis son espace personnel. La résiliation prend effet à la fin de la période en cours.</p>
        <h3>5.3 Droit de rétractation</h3>
        <p>Conformément à l&apos;article L221-18 du Code de la consommation, l&apos;utilisateur dispose d&apos;un délai de 14 jours à compter de la souscription pour se rétracter, par email à contact@copie-express.fr. Le remboursement est effectué sous 14 jours.</p>
        <p>Passé ce délai, aucun remboursement n&apos;est effectué pour les abonnements annuels ou mensuels en cours.</p>

        <h2>6. Obligations de l&apos;utilisateur</h2>
        <p>L&apos;utilisateur s&apos;engage à :</p>
        <ul>
          <li>Ne pas utiliser le service pour des évaluations officielles (DNB, baccalauréat, contrôle continu officiel)</li>
          <li>Respecter le secret professionnel sur les copies d&apos;élèves</li>
          <li>Ne pas tenter de contourner les mesures de sécurité et anti-abus</li>
          <li>Ne pas revendre ou redistribuer l&apos;accès au service</li>
          <li>Signaler toute utilisation non autorisée de son compte</li>
        </ul>
        <p>L&apos;utilisateur est seul responsable des copies qu&apos;il télécharge et des données qu&apos;il renseigne.</p>

        <h2>7. Propriété intellectuelle</h2>
        <h3>7.1 Sur le service</h3>
        <p>L&apos;ensemble des éléments du service (code, design, textes, logos) est la propriété exclusive de l&apos;éditeur. Toute reproduction est interdite.</p>
        <h3>7.2 Sur les données utilisateur</h3>
        <p>L&apos;utilisateur conserve l&apos;entière propriété des copies qu&apos;il télécharge et des données qu&apos;il renseigne. Il concède à l&apos;éditeur une licence limitée au traitement technique nécessaire à la fourniture du service (OCR, extraction, export).</p>
        <h3>7.3 Sur les barèmes experts (forfait Expert uniquement)</h3>
        <p>Les barèmes partagés via la bibliothèque Expert restent la propriété de leurs auteurs. La redistribution en dehors du service est interdite.</p>

        <h2>8. Protection des données personnelles (RGPD)</h2>
        <p>Le traitement des données personnelles est détaillé dans la <strong>Politique de Confidentialité</strong> (voir /legal/privacy). En synthèse :</p>
        <ul>
          <li>Données stockées en Europe (Supabase Frankfurt)</li>
          <li>Aucune donnée revendue à des tiers</li>
          <li>Suppression automatique des copies après 30 jours</li>
          <li>Droit d&apos;accès, rectification, suppression, portabilité</li>
        </ul>

        <h2>9. Limitation de responsabilité</h2>
        <h3>9.1 Qualité du service</h3>
        <p>L&apos;éditeur s&apos;efforce d&apos;assurer la disponibilité du service 24h/24, 7j/7, mais ne peut garantir une disponibilité absolue. En cas d&apos;interruption pour maintenance ou cas de force majeure, l&apos;éditeur ne saurait être tenu responsable.</p>
        <h3>9.2 Qualité de l&apos;extraction</h3>
        <p>L&apos;OCR et l&apos;extraction par intelligence artificielle peuvent comporter des erreurs. <strong>L&apos;utilisateur est seul responsable de la validation finale des notes.</strong> L&apos;éditeur ne saurait être tenu responsable en cas d&apos;erreur d&apos;extraction ayant des conséquences sur la notation des élèves.</p>
        <h3>9.3 Dommages</h3>
        <p>En tout état de cause, la responsabilité de l&apos;éditeur est limitée au montant des sommes versées par l&apos;utilisateur au cours des 12 derniers mois.</p>

        <h2>10. Suspension du service</h2>
        <p>En cas de force majeure, de difficulté technique grave, ou de décision réglementaire ou judiciaire, l&apos;éditeur se réserve le droit de suspendre temporairement ou définitivement le service. Les utilisateurs en sont informés par email. Les abonnements en cours sont remboursés au prorata.</p>

        <h2>11. Évolution des conditions</h2>
        <p>L&apos;éditeur se réserve le droit de modifier les présentes CGU. Les utilisateurs en sont informés par email au moins 30 jours avant l&apos;entrée en vigueur des nouvelles conditions. En cas de désaccord, l&apos;utilisateur peut résilier son abonnement.</p>

        <h2>12. Droit applicable et juridiction</h2>
        <p>Les présentes CGU sont régies par le droit français. En cas de litige, les parties s&apos;efforcent de trouver une solution amiable. À défaut, le litige est porté devant les tribunaux compétents de Paris.</p>

        <h2>13. Contact</h2>
        <p>Pour toute question relative à ces CGU :</p>
        <ul>
          <li>Email : contact@copie-express.fr</li>
          <li>Courrier : [adresse à compléter]</li>
        </ul>

        <hr />
        <p><em>En utilisant le service Copie Express, l&apos;utilisateur reconnaît avoir pris connaissance des présentes conditions générales d&apos;utilisation et les accepter sans réserve.</em></p>
      </div>
    </main>
  );
}