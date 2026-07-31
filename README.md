# Copie Express V1 — MVP

SaaS d'assistance à la saisie de copies d'évaluations scolaires, ciblé profs de **maths / physique / SVT** en collège et lycée.

**Live** : https://baalek666-maker.github.io/copie-express/ (LP marketing)

**Spec complète** : voir `ARCHITECTURE_V2.md` (repo `copie-express`)

---

## 🎯 Statut

**Squelette Next.js + Express créé.** À toi de finaliser :

1. ✅ Repo créé
2. ✅ Code source du squelette poussé
3. ⏳ **À faire de ton côté** : créer les comptes externes + ajouter les clés API dans `.env`

---

## 🚀 Setup en 5 étapes (2-3h de ton temps)

### Étape 1 — Créer un projet Supabase (10 min)

1. Aller sur https://supabase.com → Sign up (gratuit)
2. New project :
   - **Name** : `copie-express-prod`
   - **Database Password** : note-le quelque part
   - **Region** : **Frankfurt (EU Central)** ⚠️ IMPORTANT pour RGPD
3. Attendre 2 min que le projet soit créé
4. Aller dans **SQL Editor** → New query → copier-coller le contenu de `supabase/schema.sql` → Run
5. Aller dans **Storage** → New bucket :
   - Name : `copies`, **Private**
   - New bucket : `exports`, **Private**
6. Settings > API : copier `URL` + `anon public key` + `service_role key` (⚠️ garder service_role SECRET)

### Étape 2 — Créer un compte Mistral AI (10 min)

1. https://console.mistral.ai → Sign up
2. **API Keys** → Create new key → copier
3. Free tier = quelques millions de tokens gratuits pour commencer

### Étape 3 — Créer un compte Resend (10 min)

1. https://resend.com → Sign up
2. **API Keys** → Create → copier
3. Tu peux utiliser le domaine `onboarding@resend.dev` par défaut, ou configurer ton domaine plus tard

### Étape 4 — Créer un compte Vercel (10 min)

1. https://vercel.com → Sign up with GitHub
2. **Import Project** → choisis `copie-express-v1`
3. Configure les variables d'environnement (voir section suivante)
4. Deploy

### Étape 5 — Stripe (PLUS TARD, quand tu veux prendre des paiements)

Pas urgent pour le MVP. Tu le feras quand le produit marche.

---

## 🔐 Variables d'environnement

Copier `.env.example` → `.env.local` (frontend) et `.env` (backend) :

```env
# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# === Mistral AI ===
MISTRAL_API_KEY=xxx

# === Stripe (à ajouter plus tard) ===
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_PRICE_MONTHLY=price_xxx
STRIPE_PRICE_YEARLY=price_xxx
STRIPE_PRICE_EXPERT=price_xxx

# === Resend ===
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@copie-express.fr

# === App ===
NEXT_PUBLIC_APP_URL=http://localhost:3000
PORT=4000
NODE_ENV=development
```

⚠️ **JAMAIS commit `.env` ou `.env.local`** (déjà dans `.gitignore`).

---

## 💻 Lancer en local

```bash
# Installer les dépendances
npm install

# Lancer le frontend (port 3000) + backend Express (port 4000)
npm run dev:all
```

Ouvre http://localhost:3000

---

## 📁 Structure du repo

```
copie-express-v1/
├── src/
│   ├── app/                  # Pages Next.js (App Router)
│   │   ├── layout.tsx
│   │   ├── page.tsx          # Landing
│   │   ├── globals.css
│   │   ├── login/
│   │   ├── pricing/
│   │   └── app/              # Dashboard prof (auth requise)
│   ├── components/           # Composants shadcn/ui
│   └── lib/
│       ├── supabase.ts       # Client Supabase (browser + server)
│       ├── mistral.ts        # OCR + extraction
│       ├── stripe.ts         # Paiement
│       └── utils.ts          # cn(), formatPrice(), etc.
├── server/
│   └── index.js              # Express backend (uploads, extraction long, exports, cron RGPD)
├── supabase/
│   └── schema.sql            # Schéma DB complet + RLS + triggers
├── .env.example              # Template des variables d'env
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md                 # Ce fichier
```

---

## ✅ Ce qui est CODÉ (squelette fonctionnel)

### Frontend (Next.js)
- [x] Layout racine
- [x] Landing page d'accueil
- [x] shadcn/ui config (Tailwind + couleurs)
- [ ] Pages login/signup (à coder)
- [ ] Dashboard prof (à coder)
- [ ] Upload UI (à coder)
- [ ] Validation UI (à coder)

### Backend (Express)
- [x] POST /api/upload (upload photos vers Supabase Storage)
- [x] POST /api/extract (Mistral OCR + LLM extraction)
- [x] POST /api/export (génère CSV SACoche/Pronote)
- [x] POST /api/stripe/webhook (à activer quand tu auras Stripe)
- [x] POST /api/cron/cleanup (suppression RGPD à 30j)
- [x] GET /api/health (health check)

### Libs (intégrations)
- [x] src/lib/supabase.ts (createServerClient + createBrowserClient)
- [x] src/lib/mistral.ts (runOCR + extractAnswers)
- [x] src/lib/stripe.ts (PLANS + createCheckoutSession)
- [x] src/lib/utils.ts (cn + formatPrice + generateStudentCode)

### Database
- [x] Tables : users, evaluations, copies, exports
- [x] Indexes
- [x] RLS (Row Level Security)
- [x] Triggers updated_at

### Pages LP marketing (déjà live, dans le repo `copie-express`)
- [x] /index.html (LP principale)
- [x] /expert.html (LP Expert)
- [x] /legal/ (mentions, CGU, CGV)

---

## ⏳ Ce qui reste à faire

### Priorité 1 (S1-S2)
- [ ] Créer comptes externes (cf. section Setup)
- [ ] Lancer en local et vérifier que ça tourne
- [ ] Implémenter auth flow (login, signup, magic link)
- [ ] Page /app/onboarding (académie, matière, niveau)

### Priorité 2 (S3-S4)
- [ ] Intégration Stripe (checkout + webhook + customer portal)
- [ ] Page /pricing avec les 3 tiers
- [ ] Gestion des abonnements

### Priorité 3 (S5-S6)
- [ ] UI upload drag-drop
- [ ] UI validation copies
- [ ] Export CSV fonctionnel

### Priorité 4 (S7-S8)
- [ ] RGPD : bandeau consentement, delete account
- [ ] Cron suppression 30j (GitHub Action ou Railway cron)
- [ ] Onboarding vidéo Loom
- [ ] Beta privée 20 profs
- [ ] **LANCEMENT**

---

## 🆘 Aide / Debug

### Erreurs fréquentes

**"Cannot find module '@supabase/ssr'"**
→ Tu as pas lancé `npm install`

**"MISTRAL_API_KEY is undefined"**
→ Ton `.env.local` n'est pas créé. Copie `.env.example` → `.env.local`.

**"RLS policy violation"**
→ Tu testes sans être connecté. Connecte-toi d'abord.

**"Storage bucket not found"**
→ Tu as oublié de créer les buckets `copies` et `exports` dans Supabase.

---

## 📚 Documentation

- **Spec technique complète** : https://github.com/baalek666-maker/copie-express/blob/main/docs/ARCHITECTURE_V2.md
- **LP marketing** : https://baalek666-maker.github.io/copie-express/
- **VMF** : https://github.com/baalek666-maker/copie-express/tree/main/03_marketing

---

**Bon dev ! 🚀**