'use client';

import { useEffect, useState } from 'react';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { ImageIcon, Loader2, FileText } from 'lucide-react';

export function PhotoViewer({ storagePath }: { storagePath: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const purged = !storagePath || storagePath === 'purged';

  useEffect(() => {
    let cancelled = false;
    if (purged) {
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const supabase = createBrowserSupabase();
        const { data, error } = await supabase.storage
          .from('copies')
          .createSignedUrl(storagePath, 300); // 5 min

        if (cancelled) return;

        if (error) throw error;
        setUrl(data.signedUrl);
        setLoading(false);
      } catch (err: any) {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [storagePath, purged]);

  if (purged) {
    return (
      <div className="rounded-lg border bg-secondary/30 p-6 text-center">
        <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">
          Photo supprimée : les copies ne sont conservées que 30 jours.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-lg border bg-secondary/30 p-12 text-center">
        <Loader2 className="h-8 w-8 mx-auto text-muted-foreground animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Chargement de la copie…</p>
      </div>
    );
  }

  if (error || !url) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-center">
        <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">La photo ne s'affiche pas. Ferme cette fenêtre et rouvre-la.</p>
      </div>
    );
  }

  // Si c'est une image, on l'affiche. Sinon (PDF), on affiche un viewer.
  const isPdf = url.toLowerCase().includes('.pdf') || storagePath.toLowerCase().endsWith('.pdf');

  if (isPdf) {
    return (
      <div className="rounded-lg border overflow-hidden bg-secondary/30">
        <iframe
          src={url}
          title="Copie originale"
          className="w-full h-[500px]"
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block rounded-lg border overflow-hidden bg-secondary/30"
        title="Ouvrir la photo en grand"
      >
        <img
          src={url}
          alt="Copie originale"
          className="w-full h-auto max-h-[500px] object-contain"
        />
      </a>
      <p className="text-xs text-muted-foreground text-center">Touche la photo pour l'ouvrir en grand.</p>
    </div>
  );
}