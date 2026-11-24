import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';
import { getBackendUrl } from '@/lib/backend-url';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const evaluationId = searchParams.get('evaluationId');
  const format = searchParams.get('format');

  if (!evaluationId || !format) {
    return NextResponse.json({ error: 'missing_params' }, { status: 400 });
  }
  if (!['sacoche', 'pronote'].includes(format)) {
    return NextResponse.json({ error: 'invalid_format' }, { status: 400 });
  }

  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: { session } } = await supabase.auth.getSession();
  if (!user || !session?.access_token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Le serveur de traitement vérifie lui-même le jeton et la propriété de l'évaluation
  const response = await fetch(`${getBackendUrl()}/api/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ evaluationId, format }),
    cache: 'no-store',
  });

  if (!response.ok) {
    // Pas de JSON brut à l'écran : retour sur l'évaluation
    return NextResponse.redirect(new URL(`/app/evaluations/${evaluationId}?export=erreur`, request.url));
  }

  // Octets transmis tels quels : le marqueur d'encodage en tête de fichier doit rester (accents dans Excel)
  const csvContent = await response.arrayBuffer();
  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${format}_${evaluationId}.csv"`,
    },
  });
}
