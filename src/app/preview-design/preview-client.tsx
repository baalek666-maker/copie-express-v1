'use client';

import { useEffect, useState } from 'react';
import { Figtree, Inter } from 'next/font/google';

const figtree = Figtree({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-figtree' });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

// Wrapper client : fonts Figtree/Inter, smooth-scroll Lenis, reveals, header qui se condense au scroll
export function PreviewDesignClient({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Lenis smooth scroll (desktop uniquement)
    let raf = 0;
    let lenis: any = null;
    if (!window.matchMedia('(pointer: coarse)').matches) {
      import('lenis').then((mod) => {
        lenis = new mod.default({ duration: 1.15 });
        const loop = (t: number) => { lenis?.raf(t); raf = requestAnimationFrame(loop); };
        raf = requestAnimationFrame(loop);
      });
    }

    // Header condensé au scroll
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });

    // Reveal au scroll
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          const delay = Number((e.target as HTMLElement).dataset.delay || 0);
          setTimeout(() => e.target.classList.add('revealed'), delay);
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.15 }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

    return () => {
      cancelAnimationFrame(raf);
      lenis?.destroy();
      window.removeEventListener('scroll', onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <div
      className={`${figtree.variable} ${inter.variable} font-[family-name:var(--font-inter)] bg-white text-[#1a1626] ${scrolled ? 'header-scrolled' : ''}`}
    >
      {children}
    </div>
  );
}
