export const dynamic = 'force-static';

export default function CGVPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-8">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Retour</a>
        <h1>Conditions Générales de Vente — Copie Express</h1>
        <p><strong>Dernière mise à jour :</strong> 30 juillet 2026</p>

        <h2>1. Objet</h2>
        <p>Les présentes Conditions Générales de Vente (CGV) régissent la vente des services d&apos;abonnement Copie Express aux enseignants et établissements scolaires. Elles complètent les Conditions Générales d&apos;Utilisation (CGU).</p>

        <h2>2. Prestations vendues</h2>
        <p>Copie Express propose les services suivants :</p>
        <ul>
          <li><strong>Forfait Découverte (gratuit)</strong> : 10 copies offertes, sans engagement</li>
          <li><strong>Forfait Mensuel</strong> : 10 € TTC / mois, sans engagement</li>
          <li><strong>Forfait Annuel Standard</strong> : 99 € TTC / an, soit l&apos;équivalent de 8,25 € / mois</li>
          <li><strong>Forfait Expert Bac/Brevet</strong> : 149 € TTC / an, avec fonctionnalités avancées</li>
        </ul>
        <p>Les prix sont indiqués TTC. TVA non applicable, article 293 B du CGI (auto-entreprise en cours d&apos;immatriculation).</p>

        <h2>3. Commande</h2>
        <p>La commande s&apos;effectue en ligne depuis le site copie-express.fr. L&apos;utilisateur sélectionne le forfait souhaité, fournit ses informations de paiement via Stripe, et valide sa commande. Un email de confirmation est envoyé dans les minutes qui suivent.</p>

        <h2>4. Paiement</h2>
        <p>Le paiement s&apos;effectue exclusivement par carte bancaire via le service sécurisé Stripe (chiffrement PCI-DSS niveau 1). Aucune information bancaire n&apos;est stockée sur les serveurs de Copie Express.</p>
        <p>Les paiements sont sécurisés par 3D Secure si demandé par la banque du client.</p>

        <h2>5. Livraison du service</h2>
        <p>Le service est livré immédiatement après validation du paiement. L&apos;accès à l&apos;espace utilisateur et aux fonctionnalités est instantané.</p>

        <h2>6. Droit de rétractation</h2>
        <p>Conformément aux articles L221-18 et suivants du Code de la consommation, l&apos;utilisateur dispose d&apos;un délai de 14 jours à compter de la souscription pour exercer son droit de rétractation, sans justification et sans pénalité.</p>
        <p>Ce droit peut être exercé par email à contact@copie-express.fr. Le remboursement est effectué sous 14 jours via le même moyen de paiement.</p>
        <p><strong>Exception :</strong> Si l&apos;utilisateur a explicitement demandé à commencer à utiliser le service pendant le délai de rétractation et a renoncé à son droit de rétractation, le service commencé reste dû au prorata.</p>

        <h2>7. Renouvellement et résiliation</h2>
        <h3>Renouvellement automatique</h3>
        <p>Les abonnements se renouvellent automatiquement à échéance (mensuelle ou annuelle). Le paiement est prélevé automatiquement sur la carte enregistrée.</p>
        <h3>Résiliation</h3>
        <p>L&apos;utilisateur peut résilier son abonnement à tout moment depuis son espace personnel (section Mon compte &gt; Gérer mon abonnement). La résiliation prend effet à la fin de la période en cours. Aucun remboursement au prorata n&apos;est effectué pour les périodes entamées.</p>

        <h2>8. Suspension du service</h2>
        <p>En cas de non-paiement, le service peut être suspendu après un email de relance resté sans réponse pendant 7 jours. La résiliation définitive intervient après 30 jours.</p>

        <h2>9. Évolutions tarifaires</h2>
        <p>Copie Express se réserve le droit de modifier ses tarifs. Les utilisateurs en sont informés par email au moins 30 jours avant l&apos;entrée en vigueur des nouveaux tarifs. En cas de désaccord, l&apos;utilisateur peut résilier son abonnement avant la date d&apos;effet.</p>
        <p>Les tarifs applicables sont ceux en vigueur au moment de la souscription initiale, sauf modification acceptée explicitement par l&apos;utilisateur.</p>

        <h2>10. Service client</h2>
        <p>Pour toute question ou réclamation :</p>
        <ul>
          <li>Email : contact@copie-express.fr</li>
          <li>Délai de réponse : sous 48 heures ouvrées</li>
        </ul>

        <h2>11. Médiation de la consommation</h2>
        <p>En cas de litige non résolu amiablement, l&apos;utilisateur peut recourir gratuitement au service de médiation suivant :</p>
        <p>À compléter après immatriculation de l&apos;auto-entreprise.</p>

        <h2>12. Droit applicable</h2>
        <p>Les présentes CGV sont régies par le droit français. Tout litige sera de la compétence des tribunaux de Paris.</p>

        <h2>13. Contact</h2>
        <p>Copie Express — auto-entreprise en cours d&apos;immatriculation<br />
        Email : contact@copie-express.fr</p>
      </div>
    </main>
  );
}