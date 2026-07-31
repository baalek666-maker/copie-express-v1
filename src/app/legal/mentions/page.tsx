export const dynamic = 'force-static';

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto p-8">
        <a href="/" className="text-sm text-muted-foreground hover:text-foreground">← Retour</a>
        <h1>Mentions Légales — Copie Express</h1>
        <p><strong>Dernière mise à jour :</strong> 30 juillet 2026</p>

        <h2>Éditeur du site</h2>
        <p><strong>Copie Express</strong><br />
        Auto-entreprise en cours d&apos;immatriculation<br />
        Siège social : [à compléter]<br />
        Email : contact@copie-express.fr<br />
        Numéro SIRET : [à compléter après immatriculation]<br />
        Numéro de TVA intracommunautaire : non applicable (auto-entreprise)</p>

        <h2>Directeur de la publication</h2>
        <p>[À compléter]</p>

        <h2>Hébergeur</h2>
        <p><strong>Vercel Inc.</strong><br />
        340 S Lemon Ave #4133<br />
        Walnut, CA 91789<br />
        USA</p>
        <p>Site web : vercel.com</p>

        <h2>Propriété intellectuelle</h2>
        <p>L&apos;ensemble des éléments du site (textes, images, logos, code source, design) est la propriété exclusive de Copie Express et est protégé par le droit d&apos;auteur.</p>
        <p>Toute reproduction, représentation ou diffusion, totale ou partielle, est interdite sans autorisation écrite préalable.</p>

        <h2>Données personnelles</h2>
        <p>Le traitement des données personnelles est détaillé dans notre <a href="/legal/privacy" className="underline">Politique de Confidentialité</a>.</p>
        <p>Vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et de portabilité de vos données. Pour exercer ces droits : dpo@copie-express.fr</p>

        <h2>Cookies</h2>
        <p>Le site utilise uniquement des cookies strictement nécessaires à l&apos;authentification. Aucun cookie publicitaire ou tracker tiers.</p>

        <h2>Limitation de responsabilité</h2>
        <p>Copie Express s&apos;efforce d&apos;assurer l&apos;exactitude des informations diffusées sur le site, mais ne peut garantir leur exhaustivité ou leur absence d&apos;erreur.</p>
        <p>Copie Express ne saurait être tenu responsable de l&apos;usage fait des informations présentes sur le site, ni des conséquences de cet usage.</p>

        <h2>Droit applicable</h2>
        <p>Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.</p>

        <h2>Contact</h2>
        <p>Pour toute demande : contact@copie-express.fr</p>
      </div>
    </main>
  );
}