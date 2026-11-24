import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, MessageCircle } from 'lucide-react';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = {
  title: 'Nous écrire',
  description: 'Une question, un problème, une demande de devis ou une demande sur tes données : écris à l’équipe Copie Express.',
  alternates: { canonical: '/contact' },
};

const TOPIC_BY_PARAM: Record<string, string> = {
  facture: 'facture',
  donnees: 'donnees',
  probleme: 'probleme',
  idee: 'idee',
};

export default function ContactPage({ searchParams }: { searchParams: { sujet?: string } }) {
  const defaultTopic = TOPIC_BY_PARAM[searchParams.sujet || ''] || 'question';

  return (
    <main className="min-h-screen bg-secondary/30">
      <div className="max-w-2xl mx-auto p-4 sm:p-6 md:p-12 space-y-8">
        <div>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-4 py-1">
            <ArrowLeft className="h-3 w-3" /> Retour à l'accueil
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Nous écrire</h1>
          <p className="text-muted-foreground mt-2">
            Une question, un problème, une idée ? Écris-nous ici, on te répond par e-mail.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              Ton message
            </CardTitle>
            <CardDescription>
              Ce formulaire sert aussi aux demandes sur tes données personnelles (accès, rectification, suppression).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm defaultTopic={defaultTopic} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageCircle className="h-4 w-4 text-primary" />
              Peut-être déjà la réponse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Le parcours complet est expliqué dans le <Link href="/guide" className="text-primary hover:underline">guide enseignant</Link>.
            </p>
            <p>
              Les forfaits et leurs limites sont sur la <Link href="/pricing" className="text-primary hover:underline">page tarifs</Link>.
            </p>
            <p>
              Résilier un abonnement ou supprimer ton compte se fait directement depuis <Link href="/app/account" className="text-primary hover:underline">ton compte</Link>.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
