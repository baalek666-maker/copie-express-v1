'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Copy, Check, Mail, MessageCircle, Users } from 'lucide-react';

const SHARE_LINK = 'https://copie-express-v1.vercel.app/?source=collegue';
const SHARE_TEXT = `Salut ! J'utilise Copie Express pour mes contrôles : je prends les copies en photo, l'outil propose une note par copie, je vérifie et j'exporte vers Pronote. Les 5 premières copies sont offertes, sans carte bancaire : ${SHARE_LINK}`;

export default function ReferralPage() {
  const [copied, setCopied] = useState<'link' | 'text' | null>(null);

  const copy = async (what: 'link' | 'text') => {
    try {
      await navigator.clipboard.writeText(what === 'link' ? SHARE_LINK : SHARE_TEXT);
      setCopied(what);
      toast.success(what === 'link' ? 'Lien copié' : 'Message copié');
      setTimeout(() => setCopied(null), 2000);
    } catch {
      toast.error('Copie impossible depuis ce navigateur. Sélectionne le texte à la main.');
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
          <Users className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Recommander à un collègue</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Un collègue croule sous les copies ? Envoie-lui le lien : ses 5 premières copies sont offertes, sans carte bancaire.
        </p>
      </div>

      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="text-base">Le lien à partager</CardTitle>
          <CardDescription>Par e-mail, par messagerie, ou affiché en salle des profs.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">{SHARE_LINK}</div>
            <Button onClick={() => copy('link')} variant="outline" className="shrink-0">
              {copied === 'link' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">{copied === 'link' ? 'Copié' : 'Copier'}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Un message prêt à envoyer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground rounded-lg bg-muted p-3">{SHARE_TEXT}</p>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" asChild>
              <a href={`mailto:?subject=${encodeURIComponent('Un outil pour corriger les copies')}&body=${encodeURIComponent(SHARE_TEXT)}`}>
                <Mail className="h-4 w-4 mr-2" />
                E-mail
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-4 w-4 mr-2" />
                WhatsApp
              </a>
            </Button>
            <Button variant="outline" onClick={() => copy('text')}>
              {copied === 'text' ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Copier le message
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
