---
name: tdd-agentic
description: >
  Boucle TDD agentique « think → red → green → refactor » pour tout
  développement de code (feature, bugfix, kata). Le TDD est une boucle de
  réflexion basée sur le feedback : chaque anomalie détectée pendant la
  conception du test remonte au niveau responsable — le code, la conception,
  ou la spécification. Toute ambiguïté de spécification est escaladée à
  l'humain, jamais tranchée silencieusement.
---

# TDD agentique — think / red / green / refactor

Le TDD n'est **pas** « écrire des tests d'abord ». C'est une **boucle de
réflexion** : avant même d'avoir un test rouge, la question est *« comment je
pose le code du test ? »*. Le test est un instrument de feedback immédiat sur
la conception — et, quand le feedback remonte plus haut, sur la spécification
elle-même.

## Règles d'or

1. **Jamais de code de production sans un test rouge qui le justifie.**
2. **Un cycle = un comportement = un test.** Pas de lot.
3. **Jamais d'interprétation silencieuse d'une spec ambiguë** : toute
   ambiguïté est escaladée à l'humain (voir « Escalade spécification »).
4. Chaque signal détecté pendant la boucle a un **niveau de responsabilité** :
   le code, la conception, ou la spécification. On corrige au bon niveau, on
   ne contourne pas dans le test.
5. **Pas de nouveau cycle sans passer par la phase REFACTOR** : après chaque
   vert, review du code (skill `clean-code`) et refactoring si besoin,
   **avant** d'attaquer le comportement suivant. Enchaîner les red-green
   sans jamais refactorer, c'est accumuler de la dette à chaque cycle.

## Phase 0 — SPEC : lire avant de penser

Avant tout cycle, lire la spécification du comportement visé (énoncé, ticket,
README, doc métier) et en extraire une **liste de comportements testables**.

Un comportement est testable si on peut répondre aux quatre questions :

| Question | Rubrique |
|---|---|
| Quel(s) objet(s) j'expose ? | ARRANGE |
| Quel est l'état de départ ? | ARRANGE |
| Quelle situation je déclenche ? | ACT |
| Quel comportement j'attends ? | ASSERT |

**Si une des quatre réponses manque ou admet plusieurs lectures plausibles →
escalade spécification.** On n'entre pas en phase THINK avec une spec floue.

Traiter les comportements un par un, du plus simple au plus structurant.

**Repérer au passage les comportements candidats au PBT** (voir « Property-
based testing ») : une règle qui s'énonce comme un invariant sur une
famille d'entrées (bornes, arrondi, symétrie, monotonie, structure de
données) plutôt que comme un exemple isolé.

## Phase 1 — THINK : concevoir le test avant de l'écrire

Réfléchir **avant** de coder, pour que le futur test soit rouge **pour les
bonnes raisons**. Passer chaque rubrique en revue et agir sur les signaux :

### 🎬 ARRANGE

- **Est-ce que j'expose le bon objet (la bonne surface de code) ?**
  - Dépendances exotiques ou toxiques dans le setup → signal : mieux isoler
    le code et ses responsabilités (social testing).
- **Est-ce que l'état de départ est simple et clair ?**
  - Trop de setup = dépendance aux données dans la logique = logique mal
    répartie → signal de conception.
  - ⚠ Attention aux valeurs constantes ou tirées de la configuration : les
    rendre explicites dans le test.

### 🎯 ACT

- Des **exceptions** seraient-elles levées alors que je ne les attends pas ?
  C'est du feedback immédiat 🍀 — le traiter, pas le masquer.
- Dois-je **enchaîner plus d'une action** pour obtenir un résultat ?
  → **couplage temporel** 📛, signal de conception.
- Mon action renvoie-t-elle un **résultat immédiat** ?
  ⚠ Tester `void` est impossible 📛 — il faut un minimum de valeur de
  retour. Sinon, revoir la conception (ou l'API spécifiée → escalade).

### ✅ ASSERT

- Mes assertions ont-elles un **sens métier** / correspondent-elles au
  comportement attendu ? Si l'assert est informulable en termes métier →
  escalade spécification.
- Est-ce que je vérifie un **effet connexe ou décalé** ? → mauvaise cible.
- Suis-je en train de faire un **test d'intégration** sans le vouloir ?
  « Je teste A mais je dois vérifier B » 📛 → un couplage est mis en
  évidence, signal de conception.

### Table de routage des signaux

| Signal détecté en THINK | Niveau responsable | Action |
|---|---|---|
| Dépendance toxique, trop de setup, couplage temporel, void, « teste A vérifie B » | Conception | Ajuster la conception ciblée **avant** d'écrire le test (ou noter le refactor pour la phase 4 si le harnais existe déjà) |
| Comportement attendu absent, contradictoire, ou à interprétations multiples | Spécification | **Escalade spécification** (stop sur ce comportement) |
| Simple choix de nommage / structure du test | Test | Décider et avancer |

## Phase 2 — RED : rouge pour les bonnes raisons

1. Écrire **un seul** test (ARRANGE / ACT / ASSERT tels que conçus en THINK).
2. L'**exécuter** — obligatoire, ne jamais supposer le résultat.
3. Vérifier qu'il est rouge **pour la bonne raison** :
   - ✅ échec d'**assertion**, avec un message d'échec lisible ;
   - ❌ erreur de compilation, exception imprévue, erreur de setup →
     retour en THINK, ce n'est pas un vrai rouge.
4. Un test **vert du premier coup** est suspect : soit le comportement existe
   déjà (le vérifier, puis passer au comportement suivant), soit le test ne
   teste rien (le corriger).

## Property-based testing (PBT) : compléter, pas remplacer

Certains comportements ne s'énoncent pas naturellement comme un exemple
(« pour l'entrée X, j'attends Y ») mais comme un **invariant valable sur
toute une famille d'entrées** : arrondi, bornes (min/max), symétrie entre
deux opérations inverses, monotonie, structure de données préservée. Le
PBT (avec une bibliothèque de type `fast-check` en TS/JS) génère un grand
nombre d'entrées et vérifie l'invariant sur chacune, avec réduction
automatique (« shrinking ») du plus petit contre-exemple en cas d'échec.

**Quand l'envisager** — pendant la phase 0/1, un signal fait candidat au
PBT :
- une règle numérique avec bornes, arrondi, ou facteur (plafond de santé,
  modificateur de dégâts, calcul de remise…) ;
- une paire d'opérations censées être inverses ou cohérentes entre elles
  (soigner puis blesser, sérialiser puis désérialiser…) ;
- un invariant qui doit tenir **quel que soit** l'ordre de grandeur de
  l'entrée (montants négatifs, très grands, zéro) — les cas limites que
  des exemples ponctuels oublient facilement.

**Comment l'intégrer à la boucle** — le PBT ne remplace pas les phases,
il les traverse différemment :
- Le PBT **complète** les tests exemple, il ne les remplace pas : garder
  1-2 exemples nommés pour documenter le cas nominal (lisibles, servent
  de doc vivante), ajouter les property tests dans un fichier séparé
  (`*.properties.test.ts`) pour ne pas alourdir la suite exemple.
- **RED reste RED** : un property test doit d'abord échouer pour la bonne
  raison avant d'écrire le code qui le satisfait — mêmes règles que la
  phase 2. fast-check réduit alors le contre-exemple au cas le plus
  simple qui viole la propriété : c'est ce cas qui pilote GREEN.
- **⚠ Un property test qui passe dès le premier lancement sur du code
  déjà existant n'est pas un cycle RED.** C'est une **caractérisation**
  (le PBT valide un comportement déjà correct sur un grand espace
  d'entrées, ce qui a sa valeur : garantie étendue, régression future) —
  à signaler comme telle, jamais présentée comme un rouge qu'elle n'a pas
  été. Ne pas simuler un rouge artificiel pour se conformer à la forme du
  cycle.
- **GREEN reste minimal** : le code doit satisfaire la propriété, pas
  plus — pas de sur-généralisation au prétexte que « le PBT explore tout
  l'espace ».
- **REFACTOR s'applique pareil** aux property tests : dédupliquer les
  générateurs (`fc.integer(...)`) communs à plusieurs propriétés, nommer
  les plages avec les mêmes constantes que le code de production.

**Ce que le PBT révèle souvent** — les montants/paramètres qui devraient
être positifs mais dont aucune garde n'existe (0, négatif), les valeurs
extrêmes qui contournent un plafond, les combinaisons de règles qui
s'annulent ou se cumulent de façon inattendue. Un signal découvert ainsi
suit la même table de routage que dans la phase 1 : bug de conception à
corriger tout de suite s'il est clair, ou escalade si l'effet observable
attendu n'est pas spécifié.

## Phase 3 — GREEN : le code minimal

1. Écrire le **code minimal** qui fait passer le test. Rien de plus :
   pas de généralisation anticipée, pas de cas non testés « au passage ».
   Tout surplus (même « par courtoisie », comme un message d'erreur
   signifiant quand le test n'exige que `toThrow()`) est du code non
   testé — il sera détecté par le **mutation testing** (voir plus bas).
2. Exécuter **toute la suite** : le nouveau test passe, aucune régression.
3. Si un autre test casse : c'est du feedback — comprendre avant de corriger.

## Phase 4 — REFACTOR : sous harnais vert

⚠ **Phase obligatoire à chaque cycle** — pas une option. Avant de repartir
sur un nouveau red-green, **reviewer** le code produit (checklist du skill
`clean-code`) et refactorer ce qui doit l'être. « Rien à refactorer » est
une **conclusion explicite après revue**, jamais un saut silencieux.

1. Uniquement quand **tout est vert**.
2. Petits pas ; relancer la suite **après chaque pas**.
3. Refactorer le **code de production ET les tests** (lisibilité,
   duplication, nommage métier) en appliquant le skill **`clean-code`**
   (`.claude/skills/clean-code/SKILL.md`) : un smell à la fois, dans
   l'ordre nommer → constantes → gardes → extraire/encapsuler →
   fonctionnel, arrêt dès que c'est « assez bien ».
4. Traiter les signaux de conception notés en THINK (couplages mis en
   évidence). Si le refactor nécessaire change un comportement spécifié →
   **escalade spécification**, pas de décision unilatérale.

Puis — et seulement une fois la revue faite et le harnais toujours vert —
retour en **Phase 0/1** pour le comportement suivant, jusqu'à épuisement de
la liste.

## Mutation testing : le vérificateur mécanique de GREEN

La minimalité de GREEN (« code minimal, rien de plus ») est la seule
contrainte de la boucle sans contrôle mécanique : RED est vérifié par
l'exécution du test, REFACTOR par la checklist `clean-code` — GREEN ne
repose que sur la discipline de l'agent. Le **mutation testing** (Stryker
en TS/JS) ferme cette boucle : il mute le code de production et vérifie
qu'au moins un test échoue. **Un mutant survivant = un morceau de code de
production qu'aucun test n'exige** — la définition exacte de ce que la
règle d'or n°1 interdit.

**Quand le lancer** : en fin de story (ou avant un merge), pas à chaque
cycle — son coût d'exécution croît avec le projet.

**⚠ La cible n'est PAS un score de 100%** — c'est « **aucun survivant non
justifié** ». Chaque mutant survivant reçoit un verdict explicite, jamais
un silence :

| Verdict sur le mutant survivant | Niveau responsable | Action |
|---|---|---|
| Le code muté est du surplus jamais exigé par un test | GREEN a trop écrit | Supprimer le surplus (revenir au code minimal) |
| Le comportement est voulu mais l'assertion trop faible (ex. `toThrow()` nu qui accepte n'importe quelle exception) | Test | Renforcer l'assertion : type d'erreur, valeur exacte, invariant |
| Le détail muté est hors contrat (non spécifié — ex. texte d'un message d'erreur) | Spécification | **Escalade ou acceptation consignée** dans le journal de décisions : le figer dans un test verrouillerait un détail que personne n'a décidé |
| Mutant équivalent (ne change pas le comportement observable) | Bruit | Le marquer comme tel et passer — ne pas s'acharner |

**Interdits :**
- tuer un mutant en verrouillant un détail non spécifié « pour faire
  monter le score » ;
- ignorer silencieusement un survivant sans verdict ;
- viser 100% comme une fin en soi.

## Escalade spécification (supervision humaine)

La boucle de réflexion remonte **jusqu'aux spécifications** quand celles-ci
sont ambiguës ou incomplètes. C'est l'humain qui tranche, jamais l'agent.

**Déclencheurs :**
- comportement attendu non défini pour un cas d'entrée ;
- deux interprétations plausibles de la spec ;
- specs contradictoires entre elles (ou avec le code existant) ;
- cas limite non couvert (vide, null, bornes, erreurs) ;
- assertion impossible à formuler en termes métier ;
- API spécifiée intestable (void sans effet observable).

**Procédure :**
1. **Formuler la question précisément** : le comportement concerné, l'extrait
   de spec en cause, le cas d'entrée problématique.
2. **Proposer 2 à 3 interprétations candidates**, chacune avec ses
   conséquences (sur le code, les tests, les autres comportements).
3. **Recommander** une interprétation, en justifiant.
4. **Soumettre à l'humain** :
   - session interactive → poser la question (AskUserQuestion), une décision
     à la fois ;
   - session autonome → **stopper le comportement bloqué**, avancer sur les
     comportements non ambigus, et lister toutes les questions en attente
     dans le rapport final.
5. **Consigner la décision** de l'humain dans un journal des décisions de
   spécification (`SPEC-DECISIONS.md` à côté de la spec, ou la section
   prévue par le projet) : question, options, décision, date.
6. **Mettre à jour la spécification** si l'humain le valide, puis reprendre
   la boucle en Phase 0 sur ce comportement.

**Interdits absolus :**
- trancher silencieusement une ambiguïté « parce que c'est probablement ça » ;
- implémenter « les deux au cas où » ;
- affaiblir ou supprimer une assertion pour contourner l'ambiguïté ;
- modifier la spec sans validation humaine.


