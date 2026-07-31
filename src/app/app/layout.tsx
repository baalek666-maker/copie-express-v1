import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

import { Button } from '@/components/ui/button';
import { FileText, Upload, BarChart3, Settings, LogOut } from 'lucide-react';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: userData } = await supabase
    .from('users')
    .select('full_name, email, subscription_status, trial_copies_count')
    .eq('id', user.id)
    .single();

  const handleSignOut = async () => {
    'use server';
    const supabaseServer = createServerSupabase();
    await supabaseServer.auth.signOut();
    redirect('/');
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-secondary/30 flex flex-col p-4">
        <div className="mb-6">
          <Link href="/app" className="text-lg font-bold">Copie Express</Link>
        </div>

        <nav className="flex-1 space-y-1">
          <Link
            href="/app"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-secondary"
          >
            <FileText className="h-4 w-4" />
            Mes évaluations
          </Link>
          <Link
            href="/app/new"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-secondary"
          >
            <Upload className="h-4 w-4" />
            Nouvelle évaluation
          </Link>
          <Link
            href="/app/usage"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-secondary"
          >
            <BarChart3 className="h-4 w-4" />
            Mon usage
          </Link>
          <Link
            href="/app/account"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-secondary"
          >
            <Settings className="h-4 w-4" />
            Mon compte
          </Link>
        </nav>

        <div className="border-t pt-4 space-y-2">
          <div className="px-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{userData?.full_name || user.email}</p>
            <p className="truncate">{user.email}</p>
          </div>
          <form action={handleSignOut}>
            <Button type="submit" variant="ghost" size="sm" className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              Déconnexion
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}