# AGENTS.md — Conventions du projet

## Workflow de travail

- **Commit et push après chaque étape qui fonctionne.**

Cours « Revue de code » (Bachelor informatique, programmation logicielle).
Langue : français. Exemples : TypeScript.

## Format des supports de cours

- Les fichiers `cours/*.md` sont rédigés **comme des slides** : contenu bien
  **aéré**, espacé, une idée par section, listes à puces courtes.
- Les slides sont séparées par `---` ; frontmatter `marp: true`.
- **Outil de génération : Marp CLI** (slides + PDF) — commandes dans
  `OUTILLAGE.md`.
- Chaque module liste ses objectifs pédagogiques en tête de fichier.
- Un module = un fichier ; les TD = des branches `tdN` (pas de fichiers de TD
  dupliqués dans `main`).
- Les modules de cours sont **indépendants du langage** : les spécificités
  TypeScript sont regroupées dans le Module 5 (et mises en pratique en TD).

## Structure du dépôt

- `main` : contenu du cours (`cours/`, `td/` consignes, `templates/`,
  `scripts/`, et à la racine : `README.md`, `ETUDIANTS.md`, `INSTALLATION.md`).
- Branches `tdN` : énoncé + code à revoir (ex. `td1/`).
- Les étudiants travaillent en groupes, par **fork + PR vers `main`**.

## Conventions pédagogiques

- Travail par groupes ; préfixe obligatoire
  `<année>-<etablissement>-<groupe>` (groupe = nom de famille du porteur).
- Fiche `ETUDIANTS.md` à la racine : membres (nom + pseudo GitHub) et note
  (section réservée à l'enseignant).
- Notation **manuelle** des PR. Pas d'autograding ni de hooks CI pour
  l'instant — à ajouter plus tard (linter + tests sur push).
- Suivi des rendus : `scripts/check-submissions.sh` (branche par défaut :
  `main`).

## État d'avancement

- Module 1 rédigé. Modules 2-6 à rédiger (plan dans `README.md`).
- TD1 (branche `td1`) prêt. TD2-5 à créer (pattern : branche depuis `main` +
  `tdN/README.md` + code à revoir).
