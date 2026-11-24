// Adresse du serveur de traitement.
// TUNNEL_URL est mise à jour par ~/copie-tunnel-resync.sh quand le tunnel change (puis Vercel redéploie).
export const TUNNEL_URL = 'https://about-dad-taking-remote.trycloudflare.com';

export function getBackendUrl(): string {
  const env = process.env.NEXT_PUBLIC_BACKEND_URL;
  // Une adresse de tunnel temporaire dans la configuration serait périmée au premier redémarrage :
  // seule TUNNEL_URL ci-dessus est tenue à jour.
  if (env && !env.includes('railway.app') && !env.includes('trycloudflare.com')) {
    if (env.startsWith('https://')) return env;
    // Développement local uniquement
    if (process.env.NODE_ENV !== 'production' && env.startsWith('http://localhost')) return env;
  }
  return TUNNEL_URL;
}
