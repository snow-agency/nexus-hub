# Nexus Hub — Plan de sprints détaillé (V1 — Noyau, 8 semaines)

Équipe : 1 Lead/Scrum Master, 1 Dev Backend, 2 Dev Frontend (FE1 / FE2)

**Stack technique**
- Frontend : React (Vite) + React Router + Tailwind/shadcn-ui + TanStack Query pour les appels API
- Backend : Node.js + Express + Prisma (ORM) + Postgres
- Partagé : `packages/shared-types` (types TypeScript communs front/back)

Convention : chaque tâche est une carte à créer sur le board (Jira/Trello/GitHub Projects), avec la personne assignée entre crochets.

---

## Sprint 1 — Semaine 1 : Fondations & Authentification

**Objectif du sprint** : avoir un dépôt propre, une base de données connectée, et un utilisateur capable de créer un compte et se connecter.

### Backend [Dev Backend]
- [ ] Initialiser le monorepo (`apps/web`, `apps/api`, `packages/shared-types`)
- [ ] Provisionner une base Postgres sans Docker : installation locale (Postgres.app / installeur officiel) ou service managé gratuit (Supabase, Neon, Railway) pour le dev comme pour chaque environnement partagé
- [ ] Initialiser le projet Node.js + Express (`apps/api`), structure `src/routes`, `src/controllers`, `src/middlewares`, `src/services`
- [ ] Configurer Prisma : schéma initial (`User`, `Organisation`, `Projet` — squelette minimal)
- [ ] Écrire et exécuter la première migration
- [ ] Route `auth` : endpoint `POST /auth/register` (hash du mot de passe avec bcrypt, validation email unique)
- [ ] Route `auth` : endpoint `POST /auth/login` (génération JWT)
- [ ] Middleware JWT (`requireAuth`) réutilisable pour protéger les routes
- [ ] Middleware global de gestion des erreurs (`errorHandler`) et validation des payloads (ex. zod/joi)
- [ ] `.env.example` documenté (DB_URL, JWT_SECRET, CLAUDE_API_KEY, PORT)
- [ ] README avec instructions de setup local (créer la base Postgres, renseigner `DATABASE_URL` dans `.env`, `npm install`, `npx prisma migrate dev`, `npm run dev`)

### Outillage repo [Lead / Scrum Master]
- [ ] `.gitignore` racine (node_modules, `.env`, dist/build, fichiers OS/IDE)
- [ ] Config Prettier (`.prettierrc.json`, `.prettierignore`) partagée entre `apps/web` et `apps/api`
- [ ] `eslint-config-prettier` ajouté aux deux workspaces pour éviter les conflits ESLint/Prettier
- [ ] Husky + lint-staged installés à la racine (`npm run prepare`) : hook `pre-commit` qui lance ESLint (`--fix`) et Prettier (`--write`) uniquement sur les fichiers indexés
- [ ] Test du hook : un commit avec du code mal formaté doit être automatiquement corrigé ou bloqué si erreur de lint

### Frontend — FE1 : Design system & composants de base
- [ ] Initialiser le projet React avec Vite dans `apps/web`
- [ ] Configurer Tailwind + shadcn/ui
- [ ] Définir les tokens (couleurs, typographie, espacements) dans `styles/`
- [ ] Construire les composants de base réutilisables : `Button`, `Card`, `Input`, `Label`, `Toast`
- [ ] Mettre en place le layout global (header, sidebar de navigation vide, `<Outlet />`)

### Frontend — FE2 : Squelette de routes & pages d'authentification
- [ ] Installer et configurer `react-router-dom` : routes `/login`, `/register`, `/onboarding`, `/dashboard`, `/projet/:id`, `/organisation`, `/finance`
- [ ] Composant `ProtectedRoute` (redirige vers `/login` si non authentifié)
- [ ] Page de connexion (formulaire email/mot de passe, appel à `POST /auth/login`)
- [ ] Page d'inscription (formulaire email/mot de passe, appel à `POST /auth/register`)
- [ ] Gestion du token JWT côté client (stockage, contexte d'authentification `AuthContext`)
- [ ] Fichier `lib/api.ts` : client HTTP de base (axios ou fetch wrapper + intercepteur d'erreurs) et setup TanStack Query

**Livrable de fin de semaine** : un utilisateur peut s'inscrire, se connecter, et arriver sur un dashboard vide protégé par authentification.

---

## Sprint 2 — Semaine 2 : Onboarding de bout en bout

**Objectif du sprint** : après inscription, l'utilisateur répond à des questions ciblées et arrive directement sur un projet créé automatiquement.

### Backend [Dev Backend]
- [ ] Définir le schéma Prisma `Projet` complet (nom, secteur, pays, stade, budget initial, objectif)
- [ ] Endpoint `POST /onboarding` : reçoit les réponses (secteur, pays, stade), détecte la phase du projet
- [ ] Logique de détection de phase (règles simples : ex. stade "idée" vs "MVP" vs "growth")
- [ ] Création automatique du projet avec structure pré-remplie selon la phase détectée
- [ ] Lier le projet créé à l'utilisateur (relation `User` ↔ `Projet`)
- [ ] Tests unitaires sur la logique de détection de phase

### Frontend — FE1 : Formulaire d'onboarding
- [ ] Écran multi-étapes : secteur d'activité, pays, stade du projet
- [ ] Validation des champs à chaque étape
- [ ] Indicateur de progression (étape 1/3, 2/3, 3/3)
- [ ] Appel à `POST /onboarding` à la soumission finale

### Frontend — FE2 : Redirection & état de chargement
- [ ] Écran de transition/chargement pendant la création du projet
- [ ] Redirection automatique vers `/projet/:id` après création (via `useNavigate`)
- [ ] Gestion des erreurs (ex. échec de création → message clair + retry)
- [ ] Tests manuels du parcours complet inscription → onboarding → projet

**Livrable de fin de semaine** : parcours complet fonctionnel de l'inscription jusqu'à l'arrivée sur la fiche projet.

---

## Sprint 3 — Semaine 3 : Mon Projet & Organisation (version minimale)

**Objectif du sprint** : l'utilisateur peut consulter/modifier son projet et gérer une liste de tâches simple.

### Backend [Dev Backend]
- [ ] CRUD complet `Projet` : `GET /projet/:id`, `PATCH /projet/:id` (nom, secteur, budget, objectif)
- [ ] Schéma Prisma `Tache` (titre, statut `todo`/`done`, projetId, dates)
- [ ] CRUD `Tache` : `POST /taches`, `GET /taches?projetId=`, `PATCH /taches/:id`, `DELETE /taches/:id`
- [ ] Validation des permissions (une tâche/projet n'est modifiable que par son propriétaire)
- [ ] Tests d'intégration sur les endpoints CRUD

### Frontend — FE1 : Module "Mon Projet"
- [ ] Page fiche projet : affichage des informations (nom, secteur, budget, objectif)
- [ ] Formulaire d'édition inline ou modale
- [ ] Appel `PATCH /projet/:id` avec feedback de sauvegarde (toast succès/erreur)

### Frontend — FE2 : Module "Organisation"
- [ ] Liste de tâches avec deux colonnes ou filtres : à faire / fait
- [ ] Modale d'ajout de tâche (titre uniquement pour la V1)
- [ ] Action de changement de statut (checkbox ou bouton toggle)
- [ ] Action de suppression d'une tâche
- [ ] Appels aux endpoints CRUD tâches

**Livrable de fin de semaine** : fiche projet éditable + liste de tâches fonctionnelle (créer, cocher, supprimer).

---

## Sprint 4 — Semaine 4 : Module Finance & premier Dashboard

**Objectif du sprint** : suivi budget/dépenses opérationnel, et première version du tableau de bord.

### Backend [Dev Backend]
- [ ] Schéma Prisma `Transaction` (montant, type `budget`/`depense`, description, date, projetId)
- [ ] CRUD `Transaction` : `POST /transactions`, `GET /transactions?projetId=`, `DELETE /transactions/:id`
- [ ] Logique de calcul : solde restant = budget total − somme des dépenses
- [ ] Logique de calcul : pourcentage consommé
- [ ] Endpoint `GET /dashboard/:projetId` : agrège progression + données de base (préparation pour signaux/Next Action plus tard)
- [ ] Tests unitaires sur les calculs financiers (cas limites : budget à 0, dépenses > budget)

### Frontend — FE1 : Module Finance
- [ ] Formulaire de saisie budget initial
- [ ] Formulaire d'ajout de dépense (montant, description)
- [ ] Affichage du solde restant et du pourcentage consommé (barre de progression)
- [ ] Liste des transactions récentes

### Frontend — FE2 : Premier Dashboard
- [ ] Layout des 3 blocs : Progression / Points de vigilance / Next Action (contenu statique ou placeholder pour les 2 derniers)
- [ ] Bloc Progression connecté à `GET /dashboard/:projetId`
- [ ] Design responsive du dashboard (mobile-first)

**Livrable de fin de semaine** : module Finance fonctionnel + dashboard affichant au minimum la progression réelle.

---

## Sprint 5 — Semaine 5 : Moteur de détection

**Objectif du sprint** : le système détecte automatiquement des signaux à partir des données existantes (aucune UI nouvelle).

### Backend [Dev Backend]
- [ ] Schéma Prisma `Signal` (type, sévérité, message, projetId, résolu:boolean, date)
- [ ] Définir la liste des règles de détection V1 (ex. : budget consommé > 80%, aucune tâche complétée depuis X jours, tâches en retard)
- [ ] Service `rulesEngine` (`src/services/rulesEngine.js`) : évalue les règles à chaque mutation utile (création transaction, changement statut tâche, etc.)
- [ ] Déclenchement de l'évaluation via hooks/events après les opérations CRUD concernées
- [ ] Enregistrement des signaux détectés en base
- [ ] Endpoint `GET /signaux?projetId=` (pour debug/QA, pas encore affiché en UI)
- [ ] Tests unitaires par règle de détection (un test par règle minimum)

### Frontend — FE1 : QA & corrections
- [ ] Passer en revue les Sprints 1 à 4 : recenser les bugs (formulaire, navigation, erreurs API)
- [ ] Corriger les bugs identifiés
- [ ] Vérifier la cohérence visuelle entre tous les écrans livrés

### Frontend — FE2 : Responsive & préparation Next Action
- [ ] Audit et correction du responsive mobile sur les écrans existants (onboarding, projet, organisation, finance, dashboard)
- [ ] Maquette statique du composant "Carte Next Action" (priorité, raison, échéance, impact, bouton) — sans données réelles
- [ ] Tests d'accessibilité de base (contraste, navigation clavier)

**Livrable de fin de semaine** : signaux détectés et stockés en base (vérifiable via l'endpoint de debug) ; écrans existants nettoyés et responsive.

---

## Sprint 6 — Semaine 6 : Arbitrage & formulation IA

**Objectif du sprint** : le système choisit le signal prioritaire et génère une recommandation via l'API Claude (aucune UI nouvelle).

### Backend [Dev Backend]
- [ ] Règle d'arbitrage : logique de priorisation entre signaux actifs (ex. sévérité + ancienneté + type)
- [ ] Service `ai-assistant` (`src/services/aiAssistant.js`) : configuration du client API Claude (clé, modèle, gestion des erreurs/timeouts)
- [ ] Conception du prompt : transformer un signal + contexte projet en recommandation actionnable (raison, échéance, impact)
- [ ] Endpoint `GET /next-action/:projetId` (v1 interne, pas encore branché au frontend) : sélectionne le signal prioritaire, appelle Claude, retourne la recommandation formatée
- [ ] Gestion des cas limites : aucun signal actif, échec de l'appel API (fallback ou message par défaut)
- [ ] Logging des appels IA (coût/latence) pour suivi

### Frontend — FE1 : Intégration du composant Next Action (mode mock)
- [ ] Finaliser le composant "Carte Next Action" en dur (props typées, prêt à recevoir des données réelles)
- [ ] Bouton "faire maintenant" (comportement à définir : redirection vers la tâche/action concernée)

### Frontend — FE2 : Finitions & tests
- [ ] Finitions visuelles restantes sur Finance et Organisation
- [ ] Tests cross-navigateurs (Chrome, Firefox, Safari)
- [ ] Rédaction de cas de test manuels pour la recette de fin de projet

**Livrable de fin de semaine** : endpoint Next Action fonctionnel en interne (testable via Postman/Insomnia) ; composant carte prêt côté frontend.

---

## Sprint 7 — Semaine 7 : Intégration complète de Next Action

**Objectif du sprint** : la recommandation IA s'affiche réellement dans le dashboard et est actionnable.

### Backend [Dev Backend]
- [ ] Stabiliser l'endpoint `GET /next-action/:projetId` (temps de réponse, gestion d'erreurs propre pour le frontend)
- [ ] Ajouter la mise en cache légère si pertinent (éviter un appel Claude à chaque chargement de dashboard)
- [ ] Tests d'intégration bout en bout (signal → arbitrage → appel IA → réponse formatée)

### Frontend — FE1 : Branchement Next Action
- [ ] Connecter la carte Next Action à `GET /next-action/:projetId`
- [ ] Gérer les états : chargement, aucune recommandation, erreur
- [ ] Implémenter l'action du bouton "faire maintenant"

### Frontend — FE2 : Finitions Dashboard
- [ ] Polish visuel des 3 blocs du dashboard (alignement, espacement, animations légères)
- [ ] Vérification de la cohérence de la navigation générale de l'application
- [ ] Tests manuels du parcours complet (inscription → onboarding → usage → Next Action)

**Livrable de fin de semaine** : dashboard complet avec Next Action réelle, cliquable, connectée de bout en bout.

---

## Sprint 8 — Semaine 8 : Stabilisation avant test terrain

**Objectif du sprint** : application stable, testée, prête à être mise entre les mains d'utilisateurs réels.

### Backend [Dev Backend]
- [ ] Correction des bugs remontés par les tests des semaines précédentes
- [ ] Tests de charge légers (endpoints CRUD + endpoint Next Action)
- [ ] Revue de sécurité de base (validation des inputs, permissions, secrets non exposés)
- [ ] Préparation de l'environnement de déploiement (variables d'environnement de prod, script de déploiement/CI)
- [ ] Mise en place d'un monitoring minimal (logs d'erreurs)

### Frontend — FE1 : Corrections & mobile
- [ ] Correction des bugs identifiés
- [ ] Tests approfondis sur mobile (iOS/Android via navigateur)
- [ ] Vérification des formulaires sur petits écrans

### Frontend — FE2 : Ajustements & recette
- [ ] Ajustements d'affichage restants (typographie, couleurs, espacements)
- [ ] Tests cross-navigateurs finaux
- [ ] Recette complète du parcours utilisateur avec la checklist de tests manuels préparée au Sprint 6

### Équipe (tous)
- [ ] Session de bug bash collective (1-2h) en fin de semaine
- [ ] Revue finale avec le Scrum Master : validation de la portée V1 (voir tableau "On développe / On ne développe pas encore" du plan technique)

**Livrable de fin de semaine** : application stable, sans bug bloquant connu, déployée sur un environnement accessible pour le test terrain.

---

## Rappel de portée (à ne pas dépasser en V1)

Ne pas développer avant V1.5 : Business Model Canvas, Kanban complet, catégories de dépenses, graphiques, Stratégie, Mon équipe, Performance, Réseau — même si une tâche semble "facile à ajouter en cours de route".
