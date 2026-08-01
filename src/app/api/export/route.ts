import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const evaluationId = searchParams.get('evaluationId');
  const format = searchParams.get('format');

  if (!evaluationId || !format) {
    return NextResponse.json({ error: 'missing_params' }, { status: 400 });
  }

  // Vérifier l'auth
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  // Proxy vers Express
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://copie-express-v1-production.up.railway.app';
  const response = await fetch(`${backendUrl}/api/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ evaluationId, format }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'export_failed' }, { status: 500 });
  }

  const result = await response.json();

  if (!result.success || !result.preview) {
    return NextResponse.json({ error: 'export_failed' }, { status: 500 });
  }

  // Récupère le preview CSV généré par le backend
  // Le backend retourne { success, filename, preview } où preview = 3 premières lignes
  // Mais on a besoin du CSV complet → on doit le récupérer depuis Supabase storage
  const { data: fileData, error: storageError } = await supabase.storage
    .from('exports')
    .download(result.filename);

  if (storageError || !fileData) {
    // Fallback : utilise le preview comme contenu
    // Mais le preview est tronqué, donc on retourne le preview pour ne pas planter
    return NextResponse.json({ error: 'export_failed' }, { status: 500 });
  }

  const csvContent = await fileData.text();
  const filename = `${format}_${evaluationId}_${Date.now()}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
