import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

// Pont upgrade : les boutons pricing pointent ici.
// - Connecté   → /app/billing?plan=X (page forfait)
// - Non connecté → /login?plan=X (le login-form enchaîne vers billing après connexion)
export async function GET(req: NextRequest) {
  const plan = req.nextUrl.searchParams.get('plan') || '';
  const supabase = createServerSupabase();
  const { data: { session } } = await supabase.auth.getSession();

  const dest = session
    ? `/app/billing${plan ? `?plan=${encodeURIComponent(plan)}` : ''}`
    : `/login${plan ? `?plan=${encodeURIComponent(plan)}` : ''}`;

  return NextResponse.redirect(new URL(dest, req.nextUrl.origin));
}
