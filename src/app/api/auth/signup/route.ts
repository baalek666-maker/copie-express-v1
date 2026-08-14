import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit faire au moins 6 caracteres.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceKey) {
      return NextResponse.json({ error: 'Configuration serveur manquante.' }, { status: 500 });
    }

    const headers = {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    };

    // 1. Try to create the user
    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password, email_confirm: true }),
    });

    const createData = await createRes.json();

    if (createRes.ok) {
      // 2. User created → sign in immediately to get session tokens
      const signInRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || serviceKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const signInData = await signInRes.json();

      if (signInRes.ok && signInData.access_token) {
        return NextResponse.json({
          success: true,
          session: {
            access_token: signInData.access_token,
            refresh_token: signInData.refresh_token,
          },
        });
      }

      // User created but sign-in failed — still return success, client will try to login
      return NextResponse.json({ success: true, needsManualLogin: true });
    }

    // Handle error
    const msg = typeof createData?.msg === 'string' ? createData.msg : JSON.stringify(createData);

    if (msg.includes('duplicate key') || msg.includes('already exists') || msg.includes('already been registered')) {
      // User exists but maybe not visible in admin list (orphaned) — try to sign in with existing password
      const signInRes = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || serviceKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const signInData = await signInRes.json();

      if (signInRes.ok && signInData.access_token) {
        // User already exists and password is correct — return session
        return NextResponse.json({
          success: true,
          session: {
            access_token: signInData.access_token,
            refresh_token: signInData.refresh_token,
          },
        });
      }

      // User exists but password is wrong
      return NextResponse.json({ error: 'Un compte existe deja avec cet email. Mot de passe incorrect.' }, { status: 409 });
    }

    return NextResponse.json({ error: msg }, { status: createRes.status });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err || 'Erreur inconnue') }, { status: 500 });
  }
}