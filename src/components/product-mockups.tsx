// Mockups HTML/CSS de l'interface — reproduisent fidèlement l'UI shadcn/ui de l'app
// Pas de dépendances externes, juste Tailwind + lucide-react
// Utilisés comme aperçu produit sur la landing page

import { FileText, Camera, BarChart3, CheckCircle2, Clock, Sparkles, Upload, ArrowRight, Search } from 'lucide-react';

export function DashboardMockup() {
  return (
    <div className="rounded-xl border bg-card shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-card border-b px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-xs font-bold">
            C
          </div>
          <span className="text-sm font-semibold">Copie Express</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-yellow-400" />
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <div className="h-2 w-2 rounded-full bg-red-500" />
        </div>
      </div>

      <div className="p-4 bg-secondary/20 space-y-3">
        <div>
          <h3 className="text-base font-bold">Mes évaluations</h3>
          <p className="text-xs text-muted-foreground">3 évaluations · 47 / 90 copies validées</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-card rounded-lg p-2.5 border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <p className="text-[10px] text-muted-foreground relative flex items-center gap-1">
              <Clock className="h-2.5 w-2.5" /> Temps gagné
            </p>
            <p className="text-base font-bold text-primary relative">2h 21min</p>
          </div>
          <div className="bg-card rounded-lg p-2.5 border">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <BarChart3 className="h-2.5 w-2.5" /> Mon forfait
            </p>
            <p className="text-xs font-semibold">Découverte</p>
            <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-orange-500" style={{ width: '70%' }} />
            </div>
            <p className="text-[9px] text-muted-foreground mt-0.5">7/10 copies</p>
          </div>
          <div className="bg-card rounded-lg p-2.5 border">
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <FileText className="h-2.5 w-2.5" /> Copies traitées
            </p>
            <p className="text-base font-bold">47</p>
            <p className="text-[9px] text-muted-foreground">Suppression auto 30j</p>
          </div>
        </div>

        {/* Evaluation cards */}
        <div className="space-y-1.5">
          {[
            { title: 'Brevet blanc - Maths', progress: 100, status: 'Terminée', color: 'bg-green-500' },
            { title: 'Contrôle SVT chapitre 4', progress: 85, status: 'En cours', color: 'bg-primary' },
            { title: 'Bac blanc français', progress: 30, status: 'En cours', color: 'bg-primary' },
          ].map((e, i) => (
            <div key={i} className="bg-card rounded-lg p-2.5 border hover:shadow-md transition-shadow flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <FileText className="h-3.5 w-3.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{e.title}</p>
                <div className="mt-1 h-1 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${e.color}`} style={{ width: `${e.progress}%` }} />
                </div>
              </div>
              {e.status === 'Terminée' ? (
                <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 shrink-0">
                  <CheckCircle2 className="h-2.5 w-2.5" /> OK
                </span>
              ) : (
                <span className="text-[10px] bg-secondary text-muted-foreground px-1.5 py-0.5 rounded font-medium shrink-0">
                  {e.progress}%
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function UploadMockup() {
  return (
    <div className="rounded-xl border bg-card shadow-2xl overflow-hidden">
      <div className="bg-card border-b px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-xs font-bold">
            C
          </div>
          <span className="text-sm font-semibold">Brevet blanc - Maths</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-yellow-400" />
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <div className="h-2 w-2 rounded-full bg-red-500" />
        </div>
      </div>

      <div className="p-4 bg-secondary/20 space-y-3">
        {/* Dropzone */}
        <div className="border-2 border-dashed border-primary/50 bg-primary/5 rounded-xl p-5 text-center">
          <div className="flex justify-center mb-2">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-4 w-4 text-primary" />
            </div>
          </div>
          <p className="text-xs font-medium">
            Glisse tes photos ici, ou <span className="text-primary underline">clique pour parcourir</span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            Photo, scan, PDF, Word · Max 100 fichiers · 50MB/fichier
          </p>
        </div>

        {/* File list */}
        <div className="space-y-1">
          {[
            { name: 'copie_eleve_01.jpg', size: '2.3 MB', status: 'done' },
            { name: 'copie_eleve_02.jpg', size: '2.1 MB', status: 'done' },
            { name: 'copie_eleve_03.jpg', size: '2.4 MB', status: 'extracting' },
          ].map((f, i) => (
            <div key={i} className="bg-card rounded p-1.5 border flex items-center gap-2 text-xs">
              <div className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center shrink-0">
                <Camera className="h-3 w-3 text-blue-600" />
              </div>
              <span className="flex-1 truncate text-xs">{f.name}</span>
              <span className="text-[10px] text-muted-foreground">{f.size}</span>
              {f.status === 'done' ? (
                <CheckCircle2 className="h-3 w-3 text-green-600" />
              ) : (
                <div className="flex items-center gap-1 text-[10px] text-primary">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span>Extract...</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress */}
        <div className="space-y-1">
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-orange-500" style={{ width: '67%' }} />
          </div>
          <p className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Sparkles className="h-2.5 w-2.5 text-primary" />
            Extraction des réponses... 67%
          </p>
        </div>
      </div>
    </div>
  );
}

export function CopiesMockup() {
  return (
    <div className="rounded-xl border bg-card shadow-2xl overflow-hidden">
      <div className="bg-card border-b px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white text-xs font-bold">
            C
          </div>
          <span className="text-sm font-semibold">Copies - 30 résultats</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full bg-yellow-400" />
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <div className="h-2 w-2 rounded-full bg-red-500" />
        </div>
      </div>

      <div className="p-4 bg-secondary/20 space-y-2">
        {[
          { name: 'Élève 01', score: 17, max: 20, color: 'text-green-600', validated: true },
          { name: 'Élève 02', score: 14, max: 20, color: 'text-amber-600', validated: false },
          { name: 'Élève 03', score: 19, max: 20, color: 'text-green-600', validated: true },
          { name: 'Élève 04', score: 8, max: 20, color: 'text-red-600', validated: false },
        ].map((c, i) => (
          <div key={i} className="bg-card rounded-lg p-2 border flex items-center gap-3">
            {/* Mini photo placeholder */}
            <div className="h-12 w-9 bg-secondary rounded flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium">{c.name}</p>
              <p className="text-[10px] text-muted-foreground">
                {c.validated ? 'Validé' : 'À valider'}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-base font-bold ${c.color}`}>
                {c.score}<span className="text-[10px] text-muted-foreground">/{c.max}</span>
              </p>
              {c.validated && (
                <span className="text-[9px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                  ✓ Validé
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MobileMockup() {
  return (
    <div className="rounded-[2rem] border-[8px] border-zinc-900 bg-zinc-900 shadow-2xl overflow-hidden mx-auto" style={{ width: '280px', height: '560px' }}>
      <div className="bg-card h-full rounded-[1.4rem] overflow-hidden">
        {/* Status bar */}
        <div className="bg-card px-4 py-1 flex items-center justify-between text-[10px] font-medium">
          <span>9:41</span>
          <span>●●● 5G 100%</span>
        </div>

        <div className="p-3 space-y-2.5 bg-secondary/20 h-full">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold">Mes évaluations</h3>
            <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center">
              <Upload className="h-3.5 w-3.5 text-primary-foreground" />
            </div>
          </div>

          {/* Mobile stat */}
          <div className="bg-card rounded-lg p-2 border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
            <p className="text-[9px] text-muted-foreground relative flex items-center gap-1">
              <Clock className="h-2 w-2" /> Temps économisé
            </p>
            <p className="text-base font-bold text-primary relative">2h 21min</p>
          </div>

          {/* Cards */}
          <div className="space-y-1.5">
            {[
              { title: 'Brevet blanc', sub: 'Maths · 3ème', status: 'Terminée', color: 'bg-green-500', progress: 100 },
              { title: 'Bac blanc', sub: 'Français · 1ère', status: '85%', color: 'bg-primary', progress: 85 },
            ].map((e, i) => (
              <div key={i} className="bg-card rounded-lg p-2 border">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold truncate">{e.title}</p>
                    <p className="text-[9px] text-muted-foreground truncate">{e.sub}</p>
                  </div>
                  <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded font-medium shrink-0">
                    {e.status}
                  </span>
                </div>
                <div className="mt-1.5 h-1 bg-secondary rounded-full overflow-hidden">
                  <div className={`h-full ${e.color}`} style={{ width: `${e.progress}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA mobile */}
          <button className="w-full bg-primary text-primary-foreground rounded-lg p-2 text-xs font-medium flex items-center justify-center gap-1.5">
            <Camera className="h-3 w-3" />
            Scanner une copie
          </button>
        </div>
      </div>
    </div>
  );
}