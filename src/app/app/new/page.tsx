'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, FileText, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { GRADING_TEMPLATES } from '@/lib/grading-templates';
import { FadeIn } from '@/components/fade-in';
import { toast } from 'sonner';

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
  const [totalCopies, setTotalCopies] = useState('');

  const filteredTemplates = GRADING_TEMPLATES.filter(
    (t) => (!subject || t.subject === subject) && (!classLevel || t.classLevel === classLevel)
  );

  const useTemplate = (templateId: string) => {
    const template = GRADING_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;
    setTitle(template.title);
    setSubject(template.subject);
    setClassLevel(template.classLevel);
    toast.success('Modèle appliqué', {
      description: 'Titre, matière et niveau sont remplis. Tu peux les modifier.',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Ta session a expiré. Reconnecte-toi.'); setLoading(false); return; }

    const { data, error } = await supabase
      .from('evaluations')
      .insert({
        title: title.trim(),
        subject,
        class_level: classLevel,
        user_id: user.id,
        // champ facultatif : absent, la base applique sa valeur par défaut (la colonne refuse « null »)
        ...(parseInt(totalCopies, 10) > 0 ? { total_copies: Math.min(500, parseInt(totalCopies, 10)) } : {}),
        grading_scale: [],
        status: 'draft',
      })
      .select()
      .single();

    if (error || !data) {
      const message = 'L’évaluation n’a pas pu être créée. Vérifie ta connexion et réessaie.';
      toast.error(message);
      setError(message);
      setLoading(false);
      return;
    }

    toast.success('Évaluation créée');
    router.push(`/app/evaluations/${data.id}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <FadeIn>
        <div>
          <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" /> Mes évaluations
          </Link>
        </div>
      </FadeIn>

      <FadeIn delay={50}>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Nouvelle évaluation</h1>
          <p className="text-muted-foreground mt-1">
            Un titre, une matière, un niveau. Tu déposes le sujet et les copies juste après.
          </p>
        </div>
      </FadeIn>

      {/* Templates */}
      {filteredTemplates.length > 0 && (
        <FadeIn delay={100}>
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Partir d'un modèle
              </CardTitle>
              <CardDescription>
                Un clic remplit le titre, la matière et le niveau.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {filteredTemplates.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => useTemplate(t.id)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-background border hover:border-primary hover:bg-primary/5 transition-colors duration-200 ease-out text-sm"
                  >
                    <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                    {t.title}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      )}

      <FadeIn delay={150}>
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

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                <div className="space-y-2">
                  <Label htmlFor="totalCopies">Nombre de copies <span className="font-normal text-muted-foreground">(facultatif)</span></Label>
                  <Input
                    id="totalCopies"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="500"
                    placeholder="Ex : 30"
                    value={totalCopies}
                    onChange={(e) => setTotalCopies(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {error && (
            <div role="alert" className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={loading || !title.trim() || !subject || !classLevel} size="lg" className="shadow-lg shadow-primary/20">
              {loading ? (
                'Création…'
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-1" />
                  Créer l'évaluation
                </>
              )}
            </Button>
            <Button type="button" variant="outline" size="lg" asChild>
              <Link href="/app">Annuler</Link>
            </Button>
          </div>
          {!title.trim() || !subject || !classLevel ? (
            <p className="text-xs text-center text-muted-foreground">
              Indique le titre, la matière et le niveau pour continuer.
            </p>
          ) : null}

          <p className="text-xs text-center text-muted-foreground">
            À l'étape suivante, tu pourras ajouter le sujet et un barème pour des notes proposées plus justes.
          </p>
        </form>
      </FadeIn>
    </div>
  );
}