'use client';

import { useEffect, useRef } from 'react';

// Bande de texte qui glisse avec le défilement de la page : la première ligne part à gauche,
// la seconde à droite. Purement décorative (le contenu est repris en texte pour les lecteurs d'écran).
// Sans mouvement si l'utilisateur a demandé à réduire les animations.
const EVALUATIONS = [
  'Brevet blanc',
  'Contrôle de maths',
  'Bac blanc',
  'Évaluation de SVT',
  'Physique-Chimie',
  'Français',
  'Histoire-Géographie',
  'Anglais',
  'Allemand',
];

const RESULTATS = [
  'Export Pronote',
  'Export SACoche',
  'Barème à partir du sujet',
  'Bilan par élève',
  'Photos ou PDF',
  'Tu valides chaque note',
];

const REPEAT = 3; // la ligne est trois fois plus large que son contenu : jamais de vide à l'écran
const SPEED = 0.22; // pixels de glissement par pixel de défilement

function Row({
  items,
  rowRef,
  className,
  startShifted = false,
}: {
  items: string[];
  rowRef: React.RefObject<HTMLDivElement>;
  className: string;
  startShifted?: boolean;
}) {
  const all = Array.from({ length: REPEAT }, () => items).flat();
  return (
    <div
      ref={rowRef}
      className={`flex w-max items-center whitespace-nowrap will-change-transform ${className}`}
      style={startShifted ? { transform: `translate3d(${-100 / REPEAT}%, 0, 0)` } : undefined}
    >
      {all.map((label, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5 md:px-8">{label}</span>
          <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary/70" />
        </span>
      ))}
    </div>
  );
}

export function ScrollMarquee() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const top = topRef.current;
    const bottom = bottomRef.current;
    if (!wrap || !top || !bottom) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    let inView = true;

    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 quand la bande entre par le bas de l'écran, maximum quand elle sort par le haut
      const progress = Math.min(Math.max(vh - rect.top, 0), vh + rect.height);
      const x = Math.round(progress * SPEED * 10) / 10;
      top.style.transform = `translate3d(${-x}px, 0, 0)`;
      bottom.style.transform = `translate3d(calc(${-100 / REPEAT}% + ${x}px), 0, 0)`;
    };
    const schedule = () => {
      if (inView && !raf) raf = requestAnimationFrame(update);
    };

    let io: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          inView = entries[0]?.isIntersecting ?? true;
          schedule();
        },
        { rootMargin: '15% 0px' }
      );
      io.observe(wrap);
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();

    return () => {
      io?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="py-8 md:py-12 overflow-hidden" aria-label="Ce que tu peux corriger avec Copie Express">
      <p className="sr-only">
        {EVALUATIONS.join(', ')}. {RESULTATS.join(', ')}.
      </p>
      <div
        ref={wrapRef}
        aria-hidden="true"
        className="space-y-3 md:space-y-5 select-none [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <Row
          items={EVALUATIONS}
          rowRef={topRef}
          className="text-2xl sm:text-3xl md:text-5xl font-semibold tracking-tight text-foreground/85"
        />
        <Row
          items={RESULTATS}
          rowRef={bottomRef}
          startShifted
          className="text-2xl sm:text-3xl md:text-5xl font-serif italic text-muted-foreground"
        />
      </div>
    </section>
  );
}
