import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://copie-express-v1.vercel.app';
  const now = new Date();

  // Pages publiques
  const publicPages = [
    { path: '', priority: 1.0, changefreq: 'weekly' },
    { path: 'pricing', priority: 0.9, changefreq: 'monthly' },
    { path: 'why-us', priority: 0.8, changefreq: 'monthly' },
    { path: 'login', priority: 0.4, changefreq: 'yearly' },
    { path: 'signup', priority: 0.7, changefreq: 'monthly' },
    { path: 'contact', priority: 0.5, changefreq: 'yearly' },
    { path: 'legal/cgu', priority: 0.3, changefreq: 'yearly' },
    { path: 'legal/cgv', priority: 0.3, changefreq: 'yearly' },
    { path: 'legal/privacy', priority: 0.3, changefreq: 'yearly' },
    { path: 'legal/mentions', priority: 0.3, changefreq: 'yearly' },
  ];

  return publicPages.map((page) => ({
    url: `${baseUrl}/${page.path}`,
    lastModified: now,
    changeFrequency: page.changefreq as any,
    priority: page.priority,
  }));
}
