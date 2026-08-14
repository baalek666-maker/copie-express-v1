'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Gift, Users, Share2, Copy, Check, Mail, MessageCircle } from 'lucide-react';

export default function ReferralPage() {
  const [copied, setCopied] = useState(false);
  const referralCode = 'CE-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  const referralLink = `https://copie-express-v1.vercel.app/signup?ref=${referralCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
          <Gift className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Parraine un collègue</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Tu connais un prof qui passe aussi 3h sur SACoche ? Offre-lui 1 mois gratuit,
          et gagne 1 mois gratuit pour toi aussi.
        </p>
      </div>

      {/* Comment ça marche */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Share2 className="h-5 w-5 text-primary" />
              1. Tu partages
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Envoie ton lien unique à un collègue. Il s'inscrit avec ton lien.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              2. Il teste
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Il crée son compte, upload ses premières copies, et découvre la magie.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              3. Vous gagnez
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Vous gagnez tous les deux 1 mois gratuit sur votre forfait.
          </CardContent>
        </Card>
      </div>

      {/* Ton lien unique */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>Ton lien de parrainage unique</CardTitle>
          <CardDescription>
            Partage-le par email, WhatsApp, ou en salle des profs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 p-3 bg-muted rounded-lg font-mono text-sm break-all">
              {referralLink}
            </div>
            <Button onClick={copyToClipboard} variant="outline" className="shrink-0">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">{copied ? 'Copié !' : 'Copier'}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="secondary">{referralCode}</Badge>
            <span>· Partagé 0 fois</span>
            <span>· 0 mois gagnés</span>
          </div>
        </CardContent>
      </Card>

      {/* Partage rapide */}
      <Card>
        <CardHeader>
          <CardTitle>Partage rapide</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <a href={`mailto:?subject=Rejoins Copie Express&body=Salut ! J'utilise Copie Express pour corriger mes copies 10x plus vite. Inscris-toi avec mon lien et on gagne 1 mois gratuit chacun : ${referralLink}`}>
              <Mail className="h-4 w-4 mr-2" />
              Email
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href={`https://wa.me/?text=Salut ! J'utilise Copie Express pour corriger mes copies 10x plus vite. Inscris-toi avec mon lien et on gagne 1 mois gratuit chacun : ${referralLink}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp
            </a>
          </Button>
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copier le texte
          </Button>
        </CardContent>
      </Card>

      {/* FAQ Parrainage */}
      <Card>
        <CardHeader>
          <CardTitle>Questions fréquentes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div>
            <p className="font-medium text-foreground">Quand est-ce que je reçois mon mois gratuit ?</p>
            <p>Dès que ton filleul a validé sa première copie (pas juste créé un compte). On vérifie que c'est un vrai prof, pas un bot.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Y a-t-il une limite ?</p>
            <p>Non ! Tu peux parrainer autant de collègues que tu veux. 1 mois gratuit par filleul actif, à vie.</p>
          </div>
          <div>
            <p className="font-medium text-foreground">Ça marche si mon collègue est déjà inscrit ?</p>
            <p>Non, le lien doit être utilisé lors de la création du compte. S'il a déjà un compte, il peut toujours s'inscrire avec un autre email.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}