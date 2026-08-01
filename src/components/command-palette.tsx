'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Plus, BarChart3, Settings, LogOut, Upload } from 'lucide-react';

const actions = [
  { id: 'new', label: 'Nouvelle évaluation', icon: Plus, shortcut: 'N', href: '/app/new' },
  { id: 'list', label: 'Mes évaluations', icon: FileText, shortcut: 'E', href: '/app' },
  { id: 'usage', label: 'Mon usage', icon: BarChart3, shortcut: 'U', href: '/app/usage' },
  { id: 'account', label: 'Mon compte', icon: Settings, shortcut: 'A', href: '/app/account' },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
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
            autoFocus
            placeholder="Tape une commande… (Cmd+K)"
            className="w-full px-3 py-2 bg-transparent outline-none text-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const first = actions[0];
                router.push(first.href);
                setOpen(false);
              }
            }}
          />
        </div>
        <div className="p-2 max-h-80 overflow-auto scrollbar-thin">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => {
                  router.push(action.href);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-secondary text-left transition-colors"
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-sm">{action.label}</span>
                <kbd className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {action.shortcut}
                </kbd>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}