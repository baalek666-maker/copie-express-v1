'use client';

import { useEffect } from 'react';

// Smooth scroll type Lenis (inspiré ed.ai) — inerte sur mobile tactile par défaut
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    let raf: number;
    let lenis: any = null;

    (async () => {
      const mod = await import('lenis');
      const Lenis = mod.default;
      lenis = new Lenis({ duration: 1.1, smoothWheel: true });
      const loop = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    })();

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return null;
}
