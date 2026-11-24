// Traduit les codes d'erreur du serveur en messages clairs pour l'enseignant.
// Aucun code technique ne doit arriver à l'écran : tout code inconnu donne le message générique.

const MESSAGES: Record<string, string> = {
  // Forfait
  trial_exhausted: 'Tu as utilisé tes 5 copies gratuites. Choisis un forfait pour continuer.',
  monthly_quota_exceeded: 'Tu as atteint le nombre de copies de ton forfait pour ce mois-ci. Le compteur repart à zéro le 1er du mois.',
  quota_insufficient: 'Il ne te reste pas assez de copies pour ce dépôt.',
  account_suspended: 'Ton compte est suspendu. Écris-nous depuis la page Contact.',
  already_subscribed: 'Tu as déjà un forfait actif.',
  no_subscription: 'Aucun abonnement en cours sur ce compte.',
  // Fichiers
  no_file: 'Aucun fichier reçu. Réessaie.',
  no_files: 'Aucun fichier reçu. Réessaie.',
  file_too_large: 'Un fichier dépasse 50 Mo. Réduis-le ou découpe-le, puis réessaie.',
  file_type_not_allowed: 'Ce type de fichier n’est pas accepté. Utilise une photo (JPEG, PNG), un PDF ou un document Word, Excel, PowerPoint.',
  too_many_files: 'Trop de fichiers à la fois : 100 au maximum.',
  upload_failed: 'L’envoi a échoué. Vérifie ta connexion et réessaie.',
  subject_upload_failed: 'L’envoi du sujet a échoué. Réessaie.',
  document_unreadable: 'Le document est illisible. Reprends la photo bien à plat, avec plus de lumière.',
  // Lecture
  engine_unavailable: 'La lecture des copies est momentanément indisponible. Tes fichiers sont conservés : relance la lecture un peu plus tard.',
  engine_busy: 'Le service est très sollicité. Relance la lecture dans une minute.',
  engine_error: 'La lecture a échoué. Relance-la ; si ça continue, écris-nous depuis la page Contact.',
  extract_failed: 'La lecture a échoué. Relance-la ; si ça continue, écris-nous depuis la page Contact.',
  copy_unreadable: 'Cette copie est illisible. Reprends la photo bien à plat, avec plus de lumière.',
  copy_not_found: 'Copie introuvable.',
  copy_purged: 'La photo de cette copie a été supprimée (conservation limitée à 30 jours).',
  copy_already_validated: 'Cette copie est déjà validée.',
  already_processing: 'Cette copie est déjà en cours de lecture.',
  signed_url_failed: 'Impossible d’ouvrir le fichier. Réessaie.',
  // Barème
  no_subject: 'Dépose d’abord le sujet, puis génère le barème.',
  bareme_generation_failed: 'Le barème n’a pas pu être préparé à partir de ce sujet. Dépose une photo plus nette ou le corrigé.',
  bareme_auto_failed: 'Le barème n’a pas pu être préparé. Réessaie.',
  bareme_auto_save_failed: 'Le barème n’a pas pu être enregistré. Réessaie.',
  grading_key_failed: 'L’envoi du corrigé a échoué. Réessaie.',
  // Export
  no_validated_copies: 'Aucune copie validée à exporter pour l’instant.',
  export_failed: 'L’export a échoué. Réessaie.',
  invalid_format: 'Format d’export inconnu.',
  // Paiement
  checkout_failed: 'Le paiement n’a pas pu démarrer. Réessaie dans un instant.',
  payment_not_configured: 'Le paiement n’est pas disponible pour le moment.',
  unknown_plan: 'Forfait inconnu.',
  cancel_failed: 'La résiliation n’a pas abouti. Réessaie ou écris-nous depuis la page Contact.',
  resume_failed: 'La reprise de l’abonnement n’a pas abouti. Réessaie.',
  // Compte
  unauthorized: 'Ta session a expiré. Reconnecte-toi.',
  invalid_token: 'Ta session a expiré. Reconnecte-toi.',
  user_mismatch: 'Ta session a expiré. Reconnecte-toi.',
  evaluation_not_found: 'Évaluation introuvable.',
  user_not_found: 'Compte introuvable. Reconnecte-toi.',
  confirmation_required: 'Confirmation manquante.',
  account_delete_failed: 'La suppression du compte a échoué. Écris-nous depuis la page Contact.',
  // Contact
  invalid_contact: 'Indique une adresse e-mail valide et un message d’au moins 10 caractères.',
  contact_failed: 'Ton message n’a pas pu être envoyé. Réessaie dans un instant.',
  // Divers
  too_many_requests: 'Trop de demandes en peu de temps. Patiente quelques minutes puis réessaie.',
  missing_params: 'Demande incomplète. Recharge la page et réessaie.',
  network: 'Connexion impossible. Vérifie ton accès à Internet et réessaie.',
};

const GENERIC = 'Une erreur est survenue. Réessaie ; si ça continue, écris-nous depuis la page Contact.';

export function translateError(code: string | null | undefined): string {
  if (!code) return GENERIC;
  return MESSAGES[code] || GENERIC;
}
