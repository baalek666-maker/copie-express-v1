import { NextResponse } from 'next/server';
import { isDisposableEmail } from '@/lib/anti-abuse';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

async function signIn(supabaseUrl: string, anonKey: string, email: string, password: string) {
  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'apikey': anonKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json().catch(() => ({}));
  if (response.ok && data.access_token) {
    return { access_token: data.access_token as string, refresh_token: data.refresh_token as string };
  }
  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    if (!email || !password) {
      return NextResponse.json({ error: 'Indique ton adresse e-mail et un mot de passe.' }, { status: 400 });
    }
    if (!EMAIL_RE.test(email) || email.length > 200) {
      return NextResponse.json({ error: 'Cette adresse e-mail ne semble pas valide.' }, { status: 400 });
    }
    if (isDisposableEmail(email)) {
      return NextResponse.json({ error: 'Les adresses e-mail temporaires ne sont pas acceptées. Utilise ton adresse habituelle.' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Le mot de passe doit faire au moins 6 caractères.' }, { status: 400 });
    }
    if (password.length > 200) {
      return NextResponse.json({ error: 'Ce mot de passe est trop long.' }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceKey || !anonKey) {
      console.error('[signup] configuration serveur incomplète');
      return NextResponse.json({ error: 'L’inscription est momentanément indisponible. Réessaie plus tard.' }, { status: 500 });
    }

    // 1. Création du compte (adresse confirmée d'office : pas d'e-mail de confirmation)
    const createRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'apikey': serviceKey,
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, email_confirm: true }),
    });
    const createData = await createRes.json().catch(() => ({}));

    if (createRes.ok) {
      // 2. Connexion immédiate
      const session = await signIn(supabaseUrl, anonKey, email, password);
      if (session) return NextResponse.json({ success: true, session });
      return NextResponse.json({ success: true, needsManualLogin: true });
    }

    const detail = typeof createData?.msg === 'string' ? createData.msg : JSON.stringify(createData);

    if (/duplicate key|already exists|already been registered/i.test(detail)) {
      // Le compte existe déjà : si le mot de passe est le bon, on connecte
      const session = await signIn(supabaseUrl, anonKey, email, password);
      if (session) return NextResponse.json({ success: true, session });
      return NextResponse.json(
        { error: 'Un compte existe déjà avec cette adresse. Connecte-toi, ou utilise « Mot de passe oublié ».' },
        { status: 409 }
      );
    }

    console.error('[signup] création refusée :', createRes.status, detail.slice(0, 300));
    return NextResponse.json({ error: 'Le compte n’a pas pu être créé. Réessaie dans un instant.' }, { status: 502 });
  } catch (err: any) {
    console.error('[signup]', err?.message || err);
    return NextResponse.json({ error: 'Le compte n’a pas pu être créé. Réessaie dans un instant.' }, { status: 500 });
  }
}
