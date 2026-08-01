'use client';

import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export function Celebration() {
  useEffect(() => {
    const end = Date.now() + 600;
    const colors = ['#E85D3D', '#FFA500', '#4CAF50', '#2196F3'];

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return null;
}