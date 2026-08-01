import { redirect } from 'next/navigation';
import { createServerSupabase } from '@/lib/supabase';
import { AppHeader } from '@/components/app-header';

export const dynamic = 'force-dynamic';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <main className="animate-fade-in">{children}</main>
    </div>
  );
}