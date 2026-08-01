'use client';

import { useEffect } from 'react';

export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore dans les inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) {
        return;
      }

      const key = e.key.toLowerCase();
      const combo = [
        e.metaKey || e.ctrlKey ? 'mod' : '',
        e.shiftKey ? 'shift' : '',
        key,
      ].filter(Boolean).join('+');

      if (handlers[combo]) {
        e.preventDefault();
        handlers[combo]();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handlers]);
}