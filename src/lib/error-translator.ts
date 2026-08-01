// Traduit les codes d'erreur backend en messages FR user-friendly
export function translateError(code: string): string {
  const messages: Record<string, string> = {
    trial_exhausted: 'Tu as utilisé tes 10 copies gratuites. Passe à un forfait pour continuer.',
    monthly_quota_exceeded: 'Quota mensuel atteint. Renouvellement automatique le mois prochain.',
    account_suspended: 'Compte suspendu. Contacte le support.',
    user_not_found: 'Utilisateur introuvable.',
    copy_not_found: 'Copie introuvable.',
    evaluation_not_found: 'Évaluation introuvable.',
    missing_params: 'Paramètres manquants.',
    no_file: 'Aucun fichier reçu.',
    no_files: 'Aucun fichier à uploader.',
    upload_failed: 'Échec de l\'upload. Réessaie.',
    subject_upload_failed: 'Échec de l\'upload du sujet.',
    grading_key_failed: 'Échec de l\'upload du barème.',
    extract_failed: 'L\'extraction a échoué. Réessaie ou contacte le support.',
    signed_url_failed: 'Erreur d\'accès au fichier.',
    invalid_signature: 'Signature Stripe invalide.',
    missing_signature: 'Signature Stripe manquante.',
    unauthorized: 'Non autorisé. Reconnecte-toi.',
  };

  return messages[code] || `Erreur : ${code}`;
}