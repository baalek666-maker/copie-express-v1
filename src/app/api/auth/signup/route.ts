import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit faire au moins 6 caractères.' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Create user with email_confirm: true → no confirmation email needed
    const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (error) {
      if (error.message?.includes('already been registered')) {
        return NextResponse.json({ error: 'Un compte existe déjà avec cet email.' }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Generate a session for the new user so the client can use it directly
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password,
      options: { data: { email_verified: true } },
    });

    // Generate session by signing in as the user with the service key
    // We use a different approach: sign in with the service key on behalf of the user
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // User created but can't sign in yet — return user info, client will signInWithPassword
      return NextResponse.json({
        success: true,
        userId: newUser.user?.id,
        needsManualLogin: true,
      });
    }

    return NextResponse.json({
      success: true,
      userId: newUser.user?.id,
      session: {
        access_token: signInData.session?.access_token,
        refresh_token: signInData.session?.refresh_token,
        expires_at: signInData.session?.expires_at,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Erreur interne.' }, { status: 500 });
  }
}