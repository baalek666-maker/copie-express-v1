'use client';

import { useState } from 'react';
import { getBackendUrl } from '@/lib/backend-url';
import { translateError } from '@/lib/error-translator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, Loader2 } from 'lucide-react';

const TOPICS = [
  { value: 'question', label: 'Une question' },
  { value: 'probleme', label: 'Un problème à signaler' },
  { value: 'facture', label: 'Devis, facture, paiement par l’établissement' },
  { value: 'donnees', label: 'Mes données personnelles (RGPD)' },
  { value: 'idee', label: 'Une idée d’amélioration' },
];

export function ContactForm({ defaultTopic = 'question', defaultEmail = '' }: { defaultTopic?: string; defaultEmail?: string }) {
  const [topic, setTopic] = useState(TOPICS.some((t) => t.value === defaultTopic) ? defaultTopic : 'question');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(defaultEmail);
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // champ piège, invisible
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (message.trim().length < 10) {
      setError('Ton message est un peu court : décris ta demande en quelques mots.');
      return;
    }
    setSending(true);
    try {
      const response = await fetch(`${getBackendUrl()}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, name, email, message, website }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(translateError(data?.error));
      }
      setSent(true);
    } catch (err: any) {
      setError(err instanceof TypeError ? translateError('network') : (err?.message || translateError('contact_failed')));
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <div className="rounded-lg border border-green-300 bg-green-50 dark:bg-green-950/20 p-5 text-center space-y-2" role="status">
        <CheckCircle2 className="h-8 w-8 text-green-600 mx-auto" />
        <p className="font-medium">Message bien reçu</p>
        <p className="text-sm text-muted-foreground">On te répond à l'adresse {email}.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="contact-topic">Ta demande concerne</Label>
        <select
          id="contact-topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Ton nom <span className="font-normal text-muted-foreground">(facultatif)</span></Label>
          <Input id="contact-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={120} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contact-email">Ton adresse e-mail</Label>
          <Input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            placeholder="prenom.nom@ac-academie.fr"
            maxLength={200}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact-message">Ton message</Label>
        <textarea
          id="contact-message"
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          maxLength={5000}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          placeholder="Pour un problème : ce que tu faisais, ce qui s'est passé, sur téléphone ou ordinateur."
        />
      </div>
      {/* Champ piège pour les robots : caché aux humains et aux lecteurs d'écran */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="contact-website">Site web</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      {error && (
        <div role="alert" className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <Button type="submit" disabled={sending} size="lg" className="w-full sm:w-auto">
        {sending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {sending ? 'Envoi…' : 'Envoyer'}
      </Button>
    </form>
  );
}
