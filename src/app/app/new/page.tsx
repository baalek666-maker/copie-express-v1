'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const MATIERES = [
  { value: 'maths', label: 'Mathématiques' },
  { value: 'physique', label: 'Physique-Chimie' },
  { value: 'svt', label: 'SVT' },
  { value: 'francais', label: 'Français' },
  { value: 'histoire', label: 'Histoire-Géographie' },
  { value: 'anglais', label: 'Anglais' },
  { value: 'allemand', label: 'Allemand' },
  { value: 'espagnol', label: 'Espagnol' },
  { value: 'italien', label: 'Italien' },
  { value: 'philo', label: 'Philosophie' },
  { value: 'ses', label: 'SES' },
  { value: 'techno', label: 'Technologie' },
  { value: 'arts-plastiques', label: 'Arts plastiques' },
  { value: 'musique', label: 'Éducation musicale' },
  { value: 'eps', label: 'EPS' },
];

const NIVEAUX = [
  { value: 'cp', label: 'CP' },
  { value: 'ce1', label: 'CE1' },
  { value: 'ce2', label: 'CE2' },
  { value: 'cm1', label: 'CM1' },
  { value: 'cm2', label: 'CM2' },
  { value: 'college-6e', label: '6ème' },
  { value: 'college-5e', label: '5ème' },
  { value: 'college-4e', label: '4ème' },
  { value: 'college-3e', label: '3ème (Brevet)' },
  { value: 'lycee-2nde', label: '2nde' },
  { value: 'lycee-1ere', label: '1ère' },
  { value: 'lycee-terminale', label: 'Terminale (Bac)' },
  { value: 'lycee-pro', label: 'Lycée pro' },
  { value: 'bts', label: 'BTS' },
  { value: 'prepa', label: 'Prépa' },
];

export default function NewEvaluationPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [classLevel, setClassLevel] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Non connecté'); setLoading(false); return; }

    const { data, error } = await supabase
      .from('evaluations')
      .insert({
        user_id: user.id,
        title,
        subject,
        class_level: classLevel,
        total_copies: 0,  // Sera calculé depuis les uploads
        grading_scale: [{ id: 'q1', label: 'Question 1', max_points: 1 }],  // Schéma minimal
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push(`/app/evaluations/${data.id}`);
  };

  return (
    <div className="p-8 max-w-xl mx-auto space-y-6">
      <div>
        <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Mes évaluations
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Nouvelle évaluation</h1>
        <p className="text-muted-foreground mt-1">
          3 infos, c'est tout. Tu pourras uploader le sujet et les copies à l'étape suivante.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>De quel contrôle s'agit-il ?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                placeholder="Ex : Contrôle de maths - chapitre 3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Matière</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue placeholder="Choisis" />
                  </SelectTrigger>
                  <SelectContent>
                    {MATIERES.map((m) => (
                      <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classLevel">Niveau</Label>
                <Select value={classLevel} onValueChange={setClassLevel}>
                  <SelectTrigger id="classLevel">
                    <SelectValue placeholder="Choisis" />
                  </SelectTrigger>
                  <SelectContent>
                    {NIVEAUX.map((n) => (
                      <SelectItem key={n.value} value={n.value}>{n.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading || !title.trim() || !subject || !classLevel}>
            {loading ? 'Création...' : 'Créer →'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/app">Annuler</Link>
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          💡 Pas de barème à définir maintenant. Mistral compte automatiquement le nombre de réponses correctes.
        </p>
      </form>
    </div>
  );
}