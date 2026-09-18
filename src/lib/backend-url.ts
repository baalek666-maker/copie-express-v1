// Résolution de l'URL du backend.
// Garde-fou : si la variable Vercel pointe encore vers Railway (trial expiré, mort),
// on ignore et on utilise le tunnel Cloudflare du VPS.
// Le cron copie-tunnel-resync met à jour TUNNEL_URL ici puis pousse → Vercel redéploie.
export const TUNNEL_URL = 'https://configuring-are-manga-granny.trycloudflare.com';

export function getBackendUrl(): string {
  const env = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (env && !env.includes('railway.app') && env.startsWith('https://')) {
    return env;
  }
  return TUNNEL_URL;
}
