'use client';

import Script from 'next/script';

export function PlausibleAnalytics() {
  if (process.env.NODE_ENV !== 'production') return null;

  return (
    <Script
      id="plausible"
      strategy="afterInteractive"
      data-domain="copie-express-v1.vercel.app"
      src="https://plausible.io/js/script.js"
    />
  );
}
