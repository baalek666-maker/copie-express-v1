import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

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

  // Vérifier l'auth
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Proxy vers Express backend — le backend retourne directement le CSV
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://copie-express-v1-production.up.railway.app';
  const response = await fetch(`${backendUrl}/api/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evaluationId, format }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({ error: 'export_failed' }));
    return NextResponse.json(errBody, { status: response.status });
  }

  // Le backend renvoie directement le CSV → on le stream tel quel
  const csvContent = await response.text();
  const filename = `${format}_${evaluationId}_${Date.now()}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}