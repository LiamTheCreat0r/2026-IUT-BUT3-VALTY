# Revue de code — Programmation logicielle

Cours pour les étudiants de **Bachelor en informatique** sur les **revues de code** :
pourquoi elles sont indispensables, comment les mener, et comment les mettre en
pratique avec les outils réels de l'industrie (Git, GitHub, pull requests).

- **Langage des exemples :** TypeScript
- **Public :** Bachelor informatique, programmation logicielle
- **Format :** cours magistral + travaux dirigés (TD)
- **Outillage :** GitHub uniquement (branches, forks, pull requests) — aucun
  outil tiers, aucune configuration de plateforme

---

## Objectifs pédagogiques

À l'issue de ce cours, l'étudiant sera capable de :

1. **Expliquer** ce qu'est une revue de code et argumenter son importance
   (qualité, coût, partage de connaissance, sécurité).
2. **Distinguer** l'auto-revue (se relire soi-même) de la revue en équipe
   (relire le code des autres), et connaître les enjeux de chacune.
3. **Mener** une revue de code sur GitHub : ouvrir une pull request, lire un
   diff, commenter en ligne, approuver ou demander des modifications.
4. **Identifier** les problèmes courants dans du code TypeScript : typage
   faible, null/undefined, gestion d'erreurs, async/await, lisibilité,
   maintenabilité, sécurité.
5. **Communiquer** un feedback constructif : sur le code, jamais sur la
   personne ; expliquer le *pourquoi* ; reconnaître ce qui est bien fait.
6. **Définir et suivre** une checklist de revue adaptée au contexte.

## Plan du cours

### Partie cours

| Module | Titre | Contenu |
|--------|-------|---------|
| 1 | **Pourquoi relire le code ?** | Définition, chiffres, bénéfices, auto-revue vs revue d'équipe, bases du workflow GitHub |
| 2 | **Le workflow de revue** | Branches, pull requests, diff, commentaires, approbation, merge ; GitHub Flow |
| 3 | **Que chercher dans une revue** | Correctness, design, lisibilité, tests, sécurité ; ordre de priorité |
| 4 | **Communiquer une revue** | Feedback constructif, ton, taille des PR, anti-patterns de revue |
| 5 | **Revue de code en TypeScript** | Types, null/undefined, gestion d'erreurs, async/await, strict mode, ESLint |
| 6 | **Sécurité et outils** | Checklist sécurité, secrets, dépendances, revue assistée par outils et IA |

### Partie TD (travaux dirigés)

Chaque TD expose **une branche de code à revoir** (`td1`, `td2`, …). L'étudiant
forke le dépôt, crée sa branche, ouvre une **pull request** et y dépose sa
revue : annotations en ligne, puis corrections proposées en commits.

| TD | Sujet | Code à revoir |
|----|-------|---------------|
| TD 1 | Première revue guidée (fork, PR, annotations) | Branche `td1` — exemple fourni |
| TD 2 | Revue d'un code « piégé » (bugs connus) | Branche `td2` |
| TD 3 | Revue croisée : typage et gestion d'erreurs | PR d'un camarade |
| TD 4 | Revue croisée : design, lisibilité, tests | PR d'un camarade |
| TD 5 | Revue complète avec checklist | PR d'un camarade |

### Évaluation

- **Notation manuelle** : l'enseignant note chaque PR — pertinence des
  commentaires (annotations), qualité des corrections proposées, justification
  du *pourquoi*, ton et complétude.
- **Suivi des rendus** : la liste des pull requests ouvertes sur le dépôt
  indique qui a rendu. Le script `scripts/check-submissions.sh` produit le
  récapitulatif.

## Comment fonctionne le cours (workflow DIY)

Aucun outil de gestion de classe : tout se passe sur GitHub, exactement comme
dans l'industrie.

```
Enseignant                          Étudiant
──────────                          ────────
branche td1 : code à revoir  ──►    forke le dépôt
+ énoncé (td1/README.md)            crée sa branche depuis td1
                                    ouvre une PR vers la branche principale
                                    = le code à revoir apparaît dans le diff
                                    annote chaque problème (commentaires
                                    en ligne sur le diff)
                                    corrige et pousse (commits)
                                    complète le corps de la PR (modèle)
liste les PR ouvertes  ◄────────    PR ouverte = exercice rendu
note chaque PR à la main
```

### Côté enseignant (par TD)

1. Créer la branche `tdN` depuis la branche principale.
2. Y ajouter le code à revoir + l'énoncé (`tdN/README.md`), pousser la branche.
3. Annoncer le TD aux étudiants (lien du dépôt).
4. À la deadline : lister les PR avec `scripts/check-submissions.sh`, noter.

### Côté étudiant (par TD)

Détaillé dans [`td/README.md`](td/README.md) — commandes comprises.

## Structure du dépôt

```
├── README.md              ← ce fichier
├── ETUDIANTS.md           ← fiche équipe obligatoire (membres + note)
├── INSTALLATION.md        ← installation de Node.js / npm (Windows, Linux, macOS)
├── OUTILLAGE.md           ← génération des slides et PDF (Marp CLI)
├── cours/                 ← supports de cours (markdown, format slides)
│   ├── 01-pourquoi-relire-le-code.md
│   ├── 02-workflow-de-revue.md
│   └── 03-que-chercher.md              (modules 4 à 6 à rédiger)
├── td/                    ← consignes générales des TD + workflow étudiant
├── td1/                   ← (sur la branche td1) énoncé + code à revoir
├── templates/             ← checklist de revue
├── scripts/               ← outils pour l'enseignant (suivi des rendus)
└── .github/
    └── pull_request_template.md   ← modèle de PR rempli par les étudiants
```

## Licence et réutilisation

Matériel de cours librement réutilisable pour l'enseignement. Les exemples de
code sont en TypeScript et s'appuient uniquement sur des outils open source.
