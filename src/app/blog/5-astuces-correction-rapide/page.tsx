import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "5 astuces pour ne pas passer son dimanche à corriger des copies",
  description: "5 habitudes de profs qui corrigent 2× plus vite. Organisation, concentration, barème clair, et un outil pour automatiser la saisie.",
};

export default function Article5Astuces() {
  return (
    <article className="prose prose-lg max-w-3xl mx-auto px-6 py-12">
      <h1>5 astuces pour ne pas passer son dimanche à corriger des copies</h1>
      <p className="text-xl text-muted-foreground">
        On a demandé à des profs chevronnés leurs meilleures techniques pour corriger sans y passer le week-end. Voici les 5 qui marchent vraiment.
      </p>

      <h2>1. Corrige par question, pas par copie</h2>
      <p>
        Tu prends la question 1, tu corriges toutes les copies sur cette question.
        Puis la question 2. Puis la question 3. C&apos;est 40% plus rapide que de corriger
        chaque copie intégralement. Ton cerveau se souvient de la réponse attendue et
        passe en mode automatique.
      </p>
      <h2>2. Utilise un barème clair, AVANT de commencer</h2>
      <p>
        Un barème mal défini, c&apos;est toi qui hésites à chaque copie. « 1 point ou 0,5 ? »
        « Est-ce que je pénalise l&apos;orthographe ? » Définis ton barème une fois pour toutes,
        puis applique-le mécaniquement.
      </p>
      <h2>3. Arrête de tout saisir à la main</h2>
      <p>
        La saisie de notes, c&apos;est la partie chronophage. 2 minutes par copie × 90 copies
        = 3 heures perdues. Utilise un outil qui lit les copies et propose les notes.
        Tu valides en 1 clic. Tu exportes en CSV.
      </p>
      <h2>4. Corrige par blocs de 25 minutes</h2>
      <p>
        Technique Pomodoro, mais adaptée aux copies. 25 minutes de correction → 5 minutes
        de pause. Ton cerveau reste frais, tu fais moins d&apos;erreurs, et le tas de copies
        ne te paraît pas insurmontable.
      </p>
      <h2>5. Ne corrige pas tout</h2>
      <p>
        Toutes les évaluations ne méritent pas une correction détaillée. Pour les exercices
        d&apos;entraînement, une correction collective en classe est parfois plus efficace
        qu&apos;une correction individuelle. Réserve ton énergie pour les évaluations sommatives
        qui comptent vraiment.
      </p>
    </article>
  );
}