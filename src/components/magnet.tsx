'use client';

import { useEffect, useRef } from 'react';

// Léger effet aimanté : à l'approche de la souris, le contenu se déplace de quelques pixels vers elle,
// puis revient en place. Ordinateur uniquement (souris), désactivé si les animations sont réduites.
export function Magnet({
  children,
  padding = 70,
  maxX = 10,
  maxY = 6,
}: {
  children: React.ReactNode;
  /** Distance (px) autour de l'élément à partir de laquelle l'effet commence. */
  padding?: number;
  maxX?: number;
  maxY?: number;
}) {
  const outerRef = useRef<HTMLSpanElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let mouseX = 0;
    let mouseY = 0;
    let active = false;

    const apply = () => {
      raf = 0;
      // On mesure l'enveloppe, qui ne bouge pas : pas d'effet de rétroaction avec le déplacement.
      const rect = outer.getBoundingClientRect();
      const dx = mouseX - (rect.left + rect.width / 2);
      const dy = mouseY - (rect.top + rect.height / 2);
      const reachX = rect.width / 2 + padding;
      const reachY = rect.height / 2 + padding;
      if (Math.abs(dx) < reachX && Math.abs(dy) < reachY) {
        active = true;
        inner.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';
        inner.style.transform = `translate3d(${((dx / reachX) * maxX).toFixed(1)}px, ${((dy / reachY) * maxY).toFixed(1)}px, 0)`;
      } else if (active) {
        active = false;
        inner.style.transition = 'transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)';
        inner.style.transform = 'translate3d(0, 0, 0)';
      }
    };
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      mouseX = -9999;
      mouseY = -9999;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [padding, maxX, maxY]);

  return (
    <span ref={outerRef} className="flex">
      <span ref={innerRef} className="flex w-full [&>*]:w-full">
        {children}
      </span>
    </span>
  );
}
