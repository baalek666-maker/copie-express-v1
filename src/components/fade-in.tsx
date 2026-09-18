'use client';

import { useEffect, useRef, useState } from 'react';

// Reveal au scroll (fade + rise) : le bloc apparaît quand il entre dans le viewport.
// Utilisé sur tous les blocs de la landing — aucun autre réglage nécessaire.
// Respecte prefers-reduced-motion et reste visible si IntersectionObserver manque.
export function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fallback : navigateur sans IntersectionObserver → visible tout de suite
    if (!('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setTimeout(() => setVisible(true), delay);
            io.disconnect();
            return;
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`reveal-rise ${visible ? 'revealed' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
