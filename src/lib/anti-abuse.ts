// Filtre des adresses e-mail jetables à l'inscription.
// Les plafonds par forfait sont dans plan.ts (affichage) et index.js (contrôle).

// === ADRESSES JETABLES (refusées à l'inscription) ===
// Top 50 des services d'email temporaire les plus utilisés
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'yopmail.com', 'tempmail.com', 'temp-mail.org', 'guerrillamail.com',
  'mailinator.com', '10minutemail.com', 'throwawaymail.com', 'fakeinbox.com',
  'trashmail.com', 'getairmail.com', 'sharklasers.com', 'spam4.me',
  'maildrop.cc', 'dispostable.com', 'mintemail.com', 'mohmal.com',
  'tempinbox.com', 'tempmailaddress.com', 'byom.de', 'mt2014.com',
  'mt2015.com', 'thankyou2010.com', 'wuzup.net', 'wuzupmail.net',
  'zoemail.org', 'spamfree24.org', 'mailcatch.com', 'mailnesia.com',
  'mailtemp.info', 'no-spam.ws', 'noclickemail.com', 'objectmail.com',
  'one-time.email', 'proxymail.eu', 'rcpt.at', 'reallymymail.com',
  'rmqkr.net', 'rppkn.com', 'rtrtr.com', 's0ny.net', 'safetymail.info',
  'sandelf.de', 'saynotospams.com', 'schafmail.de', 'schrott-email.de',
  'secretemail.de', 'sendspamhere.com', 'sharedmailbox.org', 'shieldedmail.com',
  'shieldemail.com', 'shitmail.me', 'shitware.nl', 'shmeriously.com',
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return true;
  return DISPOSABLE_EMAIL_DOMAINS.has(domain);
}
