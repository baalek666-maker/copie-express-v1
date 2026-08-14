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

    // Direct REST call to Supabase Admin API — no SDK issues
    const res = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      const msg = typeof data?.msg === 'string' ? data.msg : JSON.stringify(data);
      if (msg.includes('already been registered') || msg.includes('already exists')) {
        return NextResponse.json({ error: 'Un compte existe deja avec cet email.' }, { status: 409 });
      }
      return NextResponse.json({ error: msg }, { status: res.status });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: String(err?.message || err || 'Erreur inconnue') }, { status: 500 });
  }
}