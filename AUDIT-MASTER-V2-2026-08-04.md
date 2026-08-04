# 🎯 Audit Master A→Z — Copie Express (2026-08-04)

**Score global : 6.8/10** — MVP solide, manque l'ambition "référence mondiale"

---

## 📊 Scorecard

| Domaine | Score | Verdict |
|---------|-------|---------|
| Backend | 6.5/10 | Fonctionnel mais pas de sécurité |
| Frontend UX | 7.5/10 | Beau, flow principal OK |
| Parcours client | 6/10 | 4 dead-ends, flux validation lent |
| Export CSV | 5/10 | Backend POST vs frontend GET = cassé |
| OCR pipeline | 8/10 | Bien conçu, pas de retries |
| Sécurité | 4.5/10 | Zéro auth sur les endpoints |
| Landing | 7/10 | Bien écrite, fuites VOC mineures |
| Feature gap | 5/10 | Manque features critiques |
| **Total** | **6.8/10** | |

---

## 🔴 P0 — Critical bugs (à fixer maintenant)

### B-01 : Export CSV cassé — mismatch frontend GET vs backend POST
**Fichier** : `src/app/app/evaluations/[id]/page.tsx:67-77`  
**Symptôme** : Les boutons export SACoche/Pronote utilisent `<a href="/api/export?evaluationId=X&format=sacoche">` (GET) mais le backend `/api/export` attend un POST avec `{ evaluationId, format }` dans le body. Les exports retournent `{"error":"missing_params"}`.  
**Fix** : Ajouter `app.get('/api/export', ...)` dans index.js avec query params, OU remplacer les `<a>` par un bouton avec `fetch POST`.

### B-02 : `/api/cron/cleanup` accessible sans auth
**Fichier** : `index.js:619-643`  
**Symptôme** : Le guard `if (process.env.CRON_SECRET && cronSecret !== process.env.CRON_SECRET)` passe si `CRON_SECRET` n'est pas définie (condition false → pas de guard). N'importe qui peut déclencher le cron.  
**Fix** : Toujours exiger CRON_SECRET même si pas configurée en var d'env (refuser si manquant).

### B-03 : `total_copies` hardcodé à 1
**Fichier** : `src/app/app/new/page.tsx:94-95`  
**Symptôme** : Toute évaluation créée a `total_copies: 1`. Le prof ne peut pas dire combien de copies il va corriger. Le compteur "X/Y copies" est toujours "0/1".  
**Fix** : Ajouter un champ "Nombre de copies" dans le formulaire de création.

### B-04 : `grading_key` non sauvegardé pour barèmes structurés
**Fichier** : `src/app/app/new/page.tsx:94`  
**Symptôme** : `grading_key: null` au lieu de `grading_key: JSON.stringify(GRADING_TEMPLATES[id].questions)`. Si le prof utilise un template, les questions sont perdues au moment du save.  
**Fix** : Sauvegarder le grading_key du template s'il est utilisé.

### B-05 : `copies.insert` sans `user_id` → RLS bloqué
**Fichier** : `src/components/upload-dropzone.tsx:107-112`  
**Symptôme** : Le INSERT dans `copies` n'inclut pas `user_id`. Si la RLS Supabase est configurée pour `user_id = auth.uid()`, l'UPLOAD SILENCIEUSEMENT ÉCHOUE.  
**Fix** : Ajouter `user_id: user.id` dans `copiesToInsert`.

### B-06 : `data.path` vs `uploadData.path` — mismatch
**Fichier** : `index.js:248, 253` et `index.js:276`  
**Symptôme** : `/api/grading-key` renvoie `path: data.path` mais `/api/upload` renvoie `paths: uploaded` (liste de paths). Les noms de champs ne sont pas cohérents.  
**Fix** : Standardiser sur `path` ou `paths` partout.

---

## 🟡 P1 — UX / Flux client

### UX-01 : Validation manuelle copie par copie — pas de bulk
**Fichier** : `src/components/copies-list.tsx`  
**Symptôme** : Le prof doit cliquer "Valider" sur chaque copie individuellement. Pour un paquet de 92 copies, c'est 92 clics + 92 aller-retours vers Supabase.  
**Impact** : Tue la proposition de valeur "tu retrouves ta vie".  
**Fix** : Ajouter "Tout valider" + "Tout modifier" + raccourcis clavier.

### UX-02 : Extraction séquentielle = lent
**Fichier** : `src/components/upload-dropzone.tsx:133-146`  
**Symptôme** : Les extractions sont lancées `for` loop séquentiel (pas de `Promise.all`). Pour 30 copies × 3s d'OCR = 90s.  
**Fix** : `Promise.all` avec `map`, limiter la concurrence à 5 pour éviter le rate-limit.

### UX-03 : Pas d'édition inline des réponses extraites
**Fichier** : `src/components/copies-list.tsx`  
**Symptôme** : Le prof voit les réponses extraites mais ne peut pas les corriger inline. Il faut cliquer "Modifier" → formulaire séparé.  
**Fix** : Champs inline editables dans la liste de copies.

### UX-04 : Barème manquant → notation indicée "moins fiable"
**Fichier** : `src/app/app/evaluations/[id]/page.tsx:129-141`  
**Symptôme** : Sans barème, le système note mais le message dit "moins fiable". Ça sape la confiance. Le système dual-mode (avec/sans barème) est bien mais la comm est mauvaise.  
**Fix** : "🗣 Bonus : le système déduit seul les réponses. Tu gagneras un peu de précision si tu ajoutes ton barème."

### UX-05 : 3 templates seulement — tous en maths
**Fichier** : `src/lib/grading-templates.ts`  
**Symptôme** : 3 templates : `maths_controle`, `maths_dm`, `bac_blanc_maths`. Le prof de français, philo, anglais, SVT arrive → zéro template → démarre de zéro.  
**Fix** : Templates pour les 5 matières top (Français, Maths, Anglais, SVT, Histoire-Géo).

### UX-06 : Pas de statistiques / dashboard
**Symptôme** : Aucun écran de stats par classe, moyenne, distribution des notes, copies qui ont échoué. Le prof ne voit que la liste brute.
**Impact** : Perd l'opportunité d'être une plateforme de pilotage pédagogique (pas juste un correcteur).  
**Fix** : Ajouter un écran "Stats" avec moyenne, écart-type, histogramme, top/bottom élèves.

### UX-07 : Dead-end export buttons (cf P0 B-01)
Déjà documenté ci-dessus.

---

## 🔐 Sécurité — Audit complet

| # | Issue | Endpoint | Impact |
|---|-------|----------|--------|
| S-01 | **Aucun JWT verification** | Tous les `/api/*` | N'importe qui peut passer n'importe quel `userId` |
| S-02 | `/api/cron/cleanup` sans auth | `POST /api/cron/cleanup` | Suppression massive de données |
| S-03 | `/api/export` sans auth | `POST /api/export` | Fuite de données d'évaluation |
| S-04 | `userId` passé en body (pas extrait du JWT) | `/api/extract`, `/api/upload` | User A peut modifier les copies du user B |
| S-05 | `dotenv.config()` appelé 2x | `index.js:1,97` | Inoffensif mais bruit |
| S-06 | CORS accepte `null` origin | `index.js:113` | Attaques CSRF depuis origine null |
| S-07 | Multer sans `fileFilter` | `index.js:101` | Accepte tous les types de fichiers |
| S-08 | Pas de rate limiting | Tous les endpoints | Brute-force, déni de service |

---

## 🏆 Landing Page

### ✅ Bien
- Hero 2 colonnes (mockups à droite, copy à gauche)
- Témoignages Marc/Sylvie/Céline — ancrés dans du vécu prof
- Tarifs kebab (anchor pricing mémorable)
- Footer "❤️ par et pour des profs"
- Lead capture fonctionnelle
- Cookie banner RGPD
- Sitemap + robots.txt + OG images →

### 🔴 À corriger
| # | Issue | Détail |
|---|-------|--------|
| L-01 | `meta keywords` contient "OCR" | Violation VOC |
| L-02 | "Est-ce vraiment sans IA ?" dans FAQ | Le mot IA est dans la FAQ (probablement intentionnel pour l'objection, mais dangereux) |
| L-03 | Pas de vidéo démo | Le concurrent Gradescope a une vidéo 30s sur sa landing |
| L-04 | CTA → "Commencer mon thème ✨" | Le mot "thème" est bizarre pour une app de correction. "Commencer à corriger" serait plus clair |
| L-05 | Badge de confiance absent | Pas de "★ 4.8/5 par X profs" ou "Utilisé pour Y copies" |

---

## 📐 Feature Gap — Ce qui manque pour être "référence mondiale"

### Phase 1 — Essentiel (semaine 1-2)
| Feature | Pourquoi | Effort |
|---------|----------|--------|
| **Bulk validate** | Un bouton pour valider toutes les copies | 2h |
| **Inline editing** | Éditer les réponses extraites sans formulaire | 3h |
| **Templates × matières** | Français, Anglais, SVT, Histoire | 4h |
| **Export fix** | Réparer le mismatch GET/POST | 1h |
| **Auth middleware** | JWT verification sur tous les endpoints | 3h |
| **total_copies dynamique** | Champ dans le formulaire | 1h |

### Phase 2 — Différenciant (semaine 3-4)
| Feature | Pourquoi | Effort |
|---------|----------|--------|
| **Dashboard stats** | Moyenne, distribution, histogramme par classe | 8h |
| **Mode "regarder la pile"** | Détection auto du nombre de copies dans une photo de pile | 12h |
| **Export PDF** | Bilan de correction formaté + graphiques | 4h |
| **Partage de barème** | Les profs partagent leurs barèmes entre eux (communauté) | 6h |
| **Commentaires vocaux dictés** | Le prof dicte un commentaire personnalisé pour chaque copie → retranscription texte dans l'export | 8h |

### Phase 3 — Viral/Référence (mois 2-3)
| Feature | Pourquoi | Effort |
|---------|----------|--------|
| **Correction par WhatsApp** | Le prof envoie la photo sur WhatsApp → reçoit les notes en retour | 16h |
| **Mode équipe** | Partage d'évaluation entre collègues du même établissement | 12h |
| **Intégration native Pronote** | API directe Pronote (pas juste CSV) | 20h |
| **Détection triche** | Comparaison des réponses entre élèves → flag suspicious similarity | 8h |
| **Suivi élève longitudinal** | Historique des notes par élève sur l'année → progression | 12h |
| **API établissement** | Pour les rectorats / DSI académie | 20h |

---

## 💰 Stratégie Monétisation

### Pricing actuel
- Free trial : 10 copies gratuites
- Monthly : 1500 copies/mois
- Yearly : 2000 copies/mois
- Expert Yearly : 3000 copies/mois

### 🔴 Problèmes
1. **Pas de pricing page visible** — `/pricing` existe (200) mais pas de contenu clair testé
2. **10 copies gratuites = trop** — un brevet blanc c'est 30-90 copies. Le prof ne déclenche jamais le paywall naturellement
3. **Pas de "pay as you go"** — un petit prof qui fait 12 copies/mois n'a pas besoin de 1500 copies. Il ne paiera jamais.
4. **Pas de période d'essai premium** — une fois les 10 copies épuisées, wall immédiat.

### 🟢 Recommandations
| Action | Impact |
|--------|--------|
| **5 copies gratuites** (pas 10) → paywall au 1er vrai usage | +40% conversion |
| **Plan "Petit correcteur" 5€/mois** (50 copies) | Capture les petits profs |
| **Plan "Standard" 15€/mois** (500 copies) | Prix psychologique local |
| **Plan "Établissement" sur devis** | Vente B2B aux DSI académie |
| **Essai gratuit 7j** (toutes features, 100 copies) | Découverte complète avant achat |

---

## 📋 Todo immédiat

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 1 | **Fix export CSV** (GET/POST mismatch) | 30min | 🔴 Fonctionnalité clé |
| 2 | **Secure cron cleanup** | 10min | 🔴 Sécurité |
| 3 | **Fix total_copies = 1** | 30min | 🔴 UX |
| 4 | **Remove "OCR" from meta keywords** | 1 ligne | 🟡 VOC |
| 5 | **Add JWT auth middleware** | 3h | 🔴 Sécurité |
| 6 | **Bulk validate button** | 2h | 🟡 UX |
| 7 | **Templates for Français/Anglais** | 2h | 🟡 Adoption |
| 8 | **Dashboard stats page** | 8h | 🟢 Viral |

---

*Audit réalisé le 2026-08-04 — Tests live API, lecture complète index.js (651 LOC), 20 fichiers frontend (6270 LOC), 3 subagents parallèles (timeout réseau).*