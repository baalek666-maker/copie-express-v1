'use client';

import { useState } from 'react';
import { backendFetch } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Format = 'pronote' | 'sacoche';

const LABELS: Record<Format, string> = { pronote: 'Pronote', sacoche: 'SACoche' };

function slug(title: string) {
  return title
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 50) || 'evaluation';
}

export function ExportButtons({ evaluationId, title }: { evaluationId: string; title: string }) {
  const [busy, setBusy] = useState<Format | null>(null);

  const download = async (format: Format) => {
    setBusy(format);
    try {
      const response = await backendFetch(`/api/export?evaluationId=${evaluationId}&format=${format}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${slug(title)}-${format}.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      toast.success(`Fichier ${LABELS[format]} téléchargé`, {
        description: 'Il contient les copies validées, classées par nom.',
      });
    } catch (err: any) {
      toast.error('Export impossible', { description: err?.message });
    } finally {
      setBusy(null);
    }
  };

  return (
    <>
      {(['pronote', 'sacoche'] as Format[]).map((format) => (
        <Button key={format} variant="outline" size="sm" onClick={() => download(format)} disabled={busy !== null}>
          {busy === format ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
          Export {LABELS[format]}
        </Button>
      ))}
    </>
  );
}
