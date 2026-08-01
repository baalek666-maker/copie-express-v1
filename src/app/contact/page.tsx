import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, MessageCircle, Clock } from 'lucide-react';
import { FadeIn } from '@/components/fade-in';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-secondary/30">
      <div className="max-w-2xl mx-auto p-6 md:p-12 space-y-8">
        <FadeIn>
          <div>
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
              <ArrowLeft className="h-3 w-3" /> Retour à l'accueil
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Contacte-nous</h1>
            <p className="text-muted-foreground mt-2">
              Une question, un bug, une suggestion ? On répond vite.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={100}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </CardTitle>
              <CardDescription>
                Pour toute question — le plus simple et le plus rapide.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="mailto:contact@copie-express.fr"
                className="flex items-center gap-2 text-primary hover:underline font-medium"
              >
                <Mail className="h-4 w-4" />
                contact@copie-express.fr
              </a>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Réponse sous 24h en moyenne
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={200}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                Avant de nous écrire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>
                Pour un bug : décris ce que tu faisais avant le bug, et envoie une capture d'écran si possible.
              </p>
              <p>
                Pour une demande de fonctionnalité : dis-nous quel est ton besoin concret.
              </p>
              <p>
                Pour une question sur les tarifs : consulte d'abord notre <Link href="/pricing" className="text-primary hover:underline">page tarifs</Link>.
              </p>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="text-center">
            <Button asChild variant="outline">
              <Link href="/pricing">Voir les tarifs</Link>
            </Button>
          </div>
        </FadeIn>
      </div>
    </main>
  );
}
