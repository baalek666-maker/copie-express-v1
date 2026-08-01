'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, BarChart3, Settings, LogOut } from 'lucide-react';

const actions = [
  { id: 'new', label: 'Nouvelle évaluation', icon: Plus, href: '/app/new', keywords: ['creer', 'create', 'new'] },
  { id: 'list', label: 'Mes évaluations', icon: FileText, href: '/app', keywords: ['liste', 'evaluations', 'mes'] },
  { id: 'usage', label: 'Mon usage', icon: BarChart3, href: '/app/usage', keywords: ['usage', 'stats', 'statistiques'] },
  { id: 'account', label: 'Mon compte', icon: Settings, href: '/app/account', keywords: ['compte', 'profil', 'account'] },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Focus l'input à l'ouverture
  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const filtered = useMemo(() => {
    if (!query.trim()) return actions;
    const q = query.toLowerCase();
    return actions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.keywords.some((k) => k.includes(q))
    );
  }, [query]);

  const select = (action: typeof actions[number]) => {
    router.push(action.href);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-32 animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-card rounded-xl shadow-2xl border w-full max-w-md mx-4 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-3 border-b">
          <input
            ref={inputRef}
            placeholder="Tape une commande… (Cmd+K)"
            className="w-full px-3 py-2 bg-transparent outline-none text-sm"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIdx(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIdx((i) => Math.min(i + 1, filtered.length - 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIdx((i) => Math.max(i - 1, 0));
              } else if (e.key === 'Enter' && filtered[selectedIdx]) {
                e.preventDefault();
                select(filtered[selectedIdx]);
              }
            }}
          />
        </div>
        <div className="p-2 max-h-80 overflow-auto scrollbar-thin">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              Aucune commande pour "{query}"
            </p>
          ) : (
            filtered.map((action, idx) => {
              const Icon = action.icon;
              const isSelected = idx === selectedIdx;
              return (
                <button
                  key={action.id}
                  onClick={() => select(action)}
                  onMouseEnter={() => setSelectedIdx(idx)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors ${
                    isSelected ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1 text-sm">{action.label}</span>
                  {isSelected && (
                    <kbd className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded">
                      ↵
                    </kbd>
                  )}
                </button>
              );
            })
          )}
        </div>
        <div className="border-t p-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span><kbd className="px-1 bg-muted rounded">↑↓</kbd> Naviguer</span>
          <span><kbd className="px-1 bg-muted rounded">↵</kbd> Ouvrir</span>
          <span><kbd className="px-1 bg-muted rounded">Esc</kbd> Fermer</span>
        </div>
      </div>
    </div>
  );
}
