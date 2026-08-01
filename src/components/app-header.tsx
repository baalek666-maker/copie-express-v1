'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { LogOut, User, BarChart3, Plus, Menu, X } from 'lucide-react';
import { useEffect } from 'react';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [user, setUser] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, [supabase]);

  // Ferme le menu mobile au changement de page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const navItems = user
    ? [
        { href: '/app', label: 'Évaluations', icon: BarChart3 },
        { href: '/app/new', label: 'Nouvelle', icon: Plus },
        { href: '/app/usage', label: 'Usage', icon: BarChart3 },
        { href: '/app/account', label: 'Compte', icon: User },
      ]
    : [];

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-14 items-center justify-between">
        <Link href={user ? '/app' : '/'} className="flex items-center gap-2 font-bold">
          <img src="/favicon.svg" alt="" className="h-7 w-7" />
          <span className="hidden sm:inline">Copie Express</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Déconnexion" className="hidden md:inline-flex">
              <LogOut className="h-4 w-4" />
            </Button>
          )}
          {/* Mobile hamburger */}
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              className="md:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div className="md:hidden border-t bg-background animate-fade-in">
          <nav className="container py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    active
                      ? 'bg-primary/10 text-primary font-medium'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
