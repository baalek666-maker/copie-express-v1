'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserSupabase } from '@/lib/supabase-browser';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Question {
  id: string;
  label: string;
  max_points: number;
  correct_answer: string;
}

export default function NewEvaluationPage() {
  const router = useRouter();
  const supabase = createBrowserSupabase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('controle');
  const [subject, setSubject] = useState('maths');
  const [classLevel, setClassLevel] = useState('college');
  const [totalCopies, setTotalCopies] = useState(30);
  const [questions, setQuestions] = useState<Question[]>([
    { id: 'q1', label: 'Exercice 1', max_points: 5, correct_answer: '' },
  ]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: `q${questions.length + 1}`,
        label: `Exercice ${questions.length + 1}`,
        max_points: 5,
        correct_answer: '',
      },
    ]);
  };

  const removeQuestion = (id: string) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof Question, value: string | number) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError('Non connecté'); setLoading(false); return; }

    const totalPoints = questions.reduce((sum, q) => sum + Number(q.max_points), 0);
    const correctAnswers: Record<string, string> = {};
    for (const q of questions) {
      if (q.correct_answer.trim()) correctAnswers[q.id] = q.correct_answer.trim();
    }

    const { data, error } = await supabase
      .from('evaluations')
      .insert({
        user_id: user.id,
        title,
        type,
        subject,
        class_level: classLevel,
        total_copies: totalCopies,
        grading_scale: questions.map((q) => ({
          id: q.id,
          label: q.label,
          max_points: Number(q.max_points),
        })),
        correct_answers: Object.keys(correctAnswers).length > 0 ? correctAnswers : null,
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
    <div className="p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-3 w-3" /> Mes évaluations
        </Link>
      </div>

      <div>
        <h1 className="text-3xl font-bold">Nouvelle évaluation</h1>
        <p className="text-muted-foreground mt-1">
          Définis le barème. Tu pourras uploader les copies à l'étape suivante.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre de l'évaluation</Label>
              <Input
                id="title"
                placeholder="Ex : Brevet blanc de maths - mars 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="controle">Contrôle</SelectItem>
                    <SelectItem value="brevet_blanc">Brevet blanc</SelectItem>
                    <SelectItem value="bac_blanc">Bac blanc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Matière</Label>
                <Select value={subject} onValueChange={setSubject}>
                  <SelectTrigger id="subject">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maths">Maths</SelectItem>
                    <SelectItem value="physique">Physique</SelectItem>
                    <SelectItem value="svt">SVT</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="classLevel">Niveau</Label>
                <Select value={classLevel} onValueChange={setClassLevel}>
                  <SelectTrigger id="classLevel">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="college">Collège</SelectItem>
                    <SelectItem value="lycee-general">Lycée général</SelectItem>
                    <SelectItem value="lycee-pro">Lycée pro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCopies">Nombre de copies à corriger</Label>
              <Input
                id="totalCopies"
                type="number"
                min="1"
                max="2000"
                value={totalCopies}
                onChange={(e) => setTotalCopies(Number(e.target.value))}
                required
              />
              <p className="text-xs text-muted-foreground">
                Estimation indicative. Tu pourras uploader plus ou moins que ce nombre.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Barème</CardTitle>
            <CardDescription>
              Définis les exercices. Note totale = somme des points.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {questions.map((q, idx) => (
              <div key={q.id} className="grid grid-cols-12 gap-3 items-end p-3 rounded-lg border bg-secondary/20">
                <div className="col-span-1 text-sm font-medium text-muted-foreground pb-2">
                  #{idx + 1}
                </div>
                <div className="col-span-4 space-y-1">
                  <Label className="text-xs">Nom de l'exercice</Label>
                  <Input
                    value={q.label}
                    onChange={(e) => updateQuestion(q.id, 'label', e.target.value)}
                    placeholder="Exercice 1"
                  />
                </div>
                <div className="col-span-2 space-y-1">
                  <Label className="text-xs">Points</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={q.max_points}
                    onChange={(e) => updateQuestion(q.id, 'max_points', Number(e.target.value))}
                  />
                </div>
                <div className="col-span-4 space-y-1">
                  <Label className="text-xs">Réponse attendue (optionnel)</Label>
                  <Input
                    value={q.correct_answer}
                    onChange={(e) => updateQuestion(q.id, 'correct_answer', e.target.value)}
                    placeholder="Ex : 42"
                  />
                </div>
                <div className="col-span-1 pb-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(q.id)}
                    disabled={questions.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            <Button type="button" variant="outline" onClick={addQuestion} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un exercice
            </Button>

            <div className="rounded-md bg-muted p-3 text-sm">
              Total : <strong>{questions.reduce((sum, q) => sum + Number(q.max_points), 0)} points</strong> sur{' '}
              {questions.length} exercice{questions.length > 1 ? 's' : ''}
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading || !title.trim()}>
            {loading ? 'Création...' : 'Créer et uploader les copies →'}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/app">Annuler</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}