'use client';

import { useEffect } from 'react';

// 1) Smooth scroll Lenis — desktop uniquement, aucun effet sur mobile tactile.
// 2) Détection scroll → condense le header .header-shell de la landing.
// Ne change ni couleurs ni layout : uniquement l'inertie molette + l'ombre header.
export function SmoothScroll() {
  useEffect(() => {
    let raf = 0;
    let lenis: any = null;

    if (!window.matchMedia('(pointer: coarse)').matches) {
      import('lenis').then((mod) => {
        lenis = new mod.default({ duration: 1.15 });
        const loop = (t: number) => {
          lenis?.raf(t);
          raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
      });
    }

    const onScroll = () => {
      const shell = document.querySelector('.header-shell');
      if (shell) {
        (shell as HTMLElement).dataset.scrolled = String(window.scrollY > 24);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
