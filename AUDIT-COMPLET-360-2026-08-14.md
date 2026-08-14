# 🔍 Audit Complet 360° — Copie Express
**Date :** 2026-08-14
**Projet :** SaaS Correction de Copies pour Profs
**Version :** post-refonte auth Email/MDP, Pricing 4 tiers, Stack Next.js 15 + Supabase + Express (Railway) + Mistral OCR

---

## 🎯 SCORE GLOBAL : 7.1 / 10

| Domaine | Score | Statut |
|---------|-------|--------|
| **Stack & Code Quality** | 7.5/10 | 🟡 Bon |
| **Sécurité Backend** | 6.5/10 | 🟠 Moyen |
| **UX / UI / Design System** | 8.0/10 | 🟢 Très bon (animations Emil Kowalski appliquées) |
| **Authentification** | 8.5/10 | 🟢 Excellent (Email/MDP fix, reset password, API signup robuste) |
| **Gameplay / Valeur Utilisateur** | 7.0/10 | 🟡 Bon (features demandées présentes, mais gamification limitée) |
| **Prix / Monétisation** | 5.5/10 | 🔴 Critique (Landing désynchronisée du Pricing) |
| **Rétention** | 6.0/10 | 🟠 Moyen (hooks présents mais manques liens users) |
| **Perf & Build** | 8.5/10 | 🟢 Excellent (bundle 416KB, 1.63s build) |
| **SEO / Growth/Spread** | 4.0/10 | 🔴 Critique (meta OK mais pas de blog, pas de referral, pas de analytics trackés) |

**Verdict** : Produit techniquement solide, UX premium, mais **des syncs critiques manquent** et **la croissance passe par des features marketing inexistantes**.

---

## 🚨 P0 — CRITIQUES (immédiat)

### 1. **Pricing Landing ↔ Pricing App Désynchronisé**
- **Landing** affiche `10€ (Mensuel)`, `99€ (Annuel)`, `149€ (Expert)`
- **App (`/pricing`)** affiche `Gratuit (5c)`, `5€ (Petit)`, `15€ (Standard)`, `99€ (Annuel)`
- **Impact** : Crédibilité zéro. Le prospect voit deux prix différents.
- **Fix** : Modifier Landing `page.tsx` section Pricing pour matcher `/pricing` (4 offres).

### 2. **Dead End Billing**
- **Landing** CTA "Expert Bac/Brevet" → `/app/billing?plan=expert`
- **`billing/page.tsx`** a `planNames = { monthly, yearly, expert }` mais landing envoie `plan=expert`.
- **Erreur** : L'utilisateur voit "Passer au forfait Forfait" au lieu de "Expert".
- **Fix** : Ajouter `expert` dans `planNames` OU changer le lien landing vers `plan=expert_yearly` (selon DB).

### 3. **Endpoints API 404**
- **Live check** : `/api/extract`, `/api/upload`, `/api/grading-key`, `/api/subject`, `/api/cron/cleanup`, `/api/stripe/webhook` renvoient **404**
- **Analyse** : Ces endpoints sont définis dans `index.js` mais répondent 404 en prod sur Railway.
- **Hypothèse** : Express monte sur un préfixe `/api/` ? Ou les routes sont mal exportées ?
- **Impact** : L'app est **non fonctionnelle** côté backend (upload/extract/export).
- **Fix** : Lire Railway logs, vérifier préfixe de route. Redéployer si besoin.

---

## 🟠 P1 — IMPORTANTS (bloquent rétention/growth)

### 4. **Pas de Referral Program**
- **Pourquoi** : Les profs parlent aux profs. C'est la croissance organique n°1.
- **Où** : Landing + Settings + Dashboard.
- **Inspiration** : "Parraine 1 ami, gagne 1 mois gratuits" (Dropbox model).

### 5. **Pas d'Onboarding Post-Login**
- **Actuel** : Signup → Login → Empty Dashboard.
- **Fix** : Wizard 3 étapes (Crée ta 1ère éval → Upload tes copies → Exporte CSV). Le but est d'activer l'utilisateur en < 5 min.

### 6. **VOC Violations (Textes IA/Automatique)**
- **La règle** : Ne jamais dire "IA", "OCR", "Automatique" aux profs.
- **Violations trouvées** :
  - FAQ Item 1 : "Est-ce vraiment sans IA ?" → **Remplacer par** "Comment ça marche sans scanner ?" et tourner l'explication sur la "reconnaissance d'écriture dédiée".
  - Step 2 Landing : "Le système **extrait**..." → Garder (pas trop technique).
  - `app/evaluations/[id]` : "La correction **automatique**..." → **Fix** → "Le **barème** est moins précis."

### 7. **Analytics Invisible**
- Pas de tracking de page view, de conversion, de drop-off.
- Ajouter Plausible (déjà configuré ?) ou PostHog simple events (page_view, signup, upload, export).

### 8. **Manque de Comparaison Table**
- La question des profs : "Pourquoi vous plutôt que SACoche ?"
- **Fix** : Ajouter un tableau comparatif sur `/why-us` ou `/pricing` (Fonctions vs SACoche vs Pronote vs Nous).

---

## 🟢 P2 — AMÉLIORATIONS (valeur/UX)

### 9. **Arborescence Mobile**
- 57 usages de `md:` vs 11 `sm:` seulement.
- Le dashboard est utilisable mais pas **mobile-first**. Les profs uploadent souvent via téléphone (canapé).
- **Fix** : Vérifier `upload-dropzone` sur mobile, augmenter les zones tactiles (`min-h-[44px]`).

### 10. **Stats Épargnants**
- Page Stats existe mais basique.
- Ajouter : "Temps économisé cette semaine" (calc : copies × 1min/copie vs temps saisie manuelle estimée à 2min), et confetti sur objectifs.

### 11. **Dark Mode Incomplet**
- Présent (`theme-toggle.tsx`) mais vérifier tous les gradients (Landing a des fonds clairs partout).
- Assurer que le passage ne casse pas les contrastes (WCAG min 4.

### 12. **Empty States Améliorés**
- Dashboard : illustration présente, bon CTA fixé.
- Stats/Usage : vérifier que les empty states ont aussi des liens directs vers l'action, pas juste du texte.

---

## 📊 P3 — POLISH & LONG TERM

### 13. **Blog/SEO Manquant**
- Pas de `/blog`. C'est essentiel pour capter les recherches "correction copie rapide", "RGPD prof note".
- Créer 5 articles longs traitant des pain points (vecu prof, légalité, outils).

### 14. **Sécurité Hardening**
- Rate Limiting manquant sur `/api/*` (risque de brute force).
- Multer sans fileFilter (types MIME non bloqués).
- Ajouter Helmet pour les headers de sécurité.

### 15. **Gamification**
- Streak de connexion, badges (Early adopter, Validateur x100), leaderboard (optionnel/soft).

---

## 🗺️ PLAN D'ACTION RECOMMANDÉ (Aujourd'hui)

### Phase 1 : Blocage Commercial (2h)
1. **[FIX IMMEDIAT]** Pricing Landing Page → remplacer section Pricing pour matcher les 4 tiers réels.
2. **[FIX IMMEDIAT]** Fixer lien `Expert` dans Billing page.
3. **[DIAGNOSTIC]** Backend 404 — lire logs Railway, hotfix si nécessaire.

### Phase 2 : Growth & Activation (3h)
4. **[FEATURE]** Referral banner (Parraine 1 ami, gagne 1 mois).
5. **[FEATURE]** Wizard onboarding post-login.
6. **[CONTENT]** Fixer VOC violations (FAQ, textes Landing).
7. **[TRACKING]** Ajouter calls `plausible.event(...)` sur signup/upload/export.

### Phase 3 : UX Excellence (2h)
8. **[POLISH]** Améliorer empty states (ajouter CTA contextual).
9. **[POLISH]** Audit mobile des composants touch-targets.
10. **[DESIGN]** Vérifier contrastes Dark Mode sur gradients.

---

## 🧠 VISION 6 MOIS (Haut Niveau)
- **B2B** : Offre "Établissement" pour chef d'établissement (licences multi-profs, facture unique).
- **Mobile Native** : PWA ou React Native small wrapper (l'upload de photo est le killer feature).
- **API Publique** : Laisser Pronote/SACoche s'intégrer à toi (devenir le standard technique de la saisie).

**Résumé pour l'audio** : Technique OK, UX Top, mais faut réparer le pipeline de paiement tout de suite (Billing 404 + désync prix) puis booster la viralité (Referral + Analytics).
