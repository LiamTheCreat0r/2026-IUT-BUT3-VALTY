---
marp: true
theme: course
---

# TDD agentique

**think → red → green → refactor, avec supervision humaine**

Skill `tdd-agentic` — présentation

---

## Le point de départ : le TDD n'est pas « tests d'abord »

Le TDD est un **procédé basé sur le feedback**.

Avant même d'avoir un test rouge, la question est :

> **Comment je pose le code du test ?**

- Quel(s) objet(s) j'expose ? → ARRANGE
- Quel est l'état de départ ? → ARRANGE
- Quelle situation je déclenche ? → ACT
- Quel comportement j'attends ? → ASSERT

> C'est une **boucle de réflexion**, pas une discipline mécanique.

---

## Pourquoi un skill pour les agents ?

Un agent qui code vite peut :

- écrire test **et** code en même temps → jamais de vrai rouge ;
- deviner un comportement quand la spec est floue ;
- enchaîner les cycles sans jamais nettoyer le code produit.

**Le skill `tdd-agentic` impose la discipline** que l'expérience donne à
un développeur humain — et ajoute une règle qu'aucun humain ne suit
naturellement : **remonter à la spec** au lieu de deviner.

---

## La boucle en 5 phases

```
0. SPEC       lire la spec, extraire les comportements testables

1. THINK      concevoir le test avant de l'écrire

2. RED        écrire un seul test, l'exécuter, vérifier le rouge

3. GREEN      code minimal qui fait passer le test

4. REFACTOR   review + nettoyage — OBLIGATOIRE avant le cycle suivant
```

---

## Phase 0 — SPEC : lire avant de penser

Un comportement est **testable** seulement si on peut répondre aux
4 questions :

| Question | Rubrique |
|---|---|
| Quel(s) objet(s) j'expose ? | ARRANGE |
| Quel est l'état de départ ? | ARRANGE |
| Quelle situation je déclenche ? | ACT |
| Quel comportement j'attends ? | ASSERT |

**Une réponse manque ou admet plusieurs lectures → escalade.**
On n'entre pas en THINK avec une spec floue.

---

## Phase 1 — THINK : le test doit être rouge pour les bonnes raisons

**ARRANGE** — bon objet exposé ? état de départ simple ?
→ trop de setup = logique mal répartie

**ACT** — exception inattendue ? plus d'une action pour un résultat ?
→ couplage temporel 📛 ; `void` intestable 📛

**ASSERT** — sens métier ? effet connexe ? « je teste A mais je vérifie
B » ? → couplage mis en évidence 📛

> Chaque signal a un niveau de responsabilité : **test, conception, ou
> spécification** — jamais contourné dans le test lui-même.

---

## Phases 2-3 — RED puis GREEN

**RED**
- un seul test, **exécuté** — jamais supposé ;
- rouge pour la bonne raison : échec d'**assertion**, pas erreur de
  compilation ni exception imprévue ;
- vert du premier coup = suspect.

**GREEN**
- code **minimal** — rien de plus, pas de généralisation anticipée ;
- toute la suite relancée : nouveau test vert, zéro régression.

---

## Phase 4 — REFACTOR : obligatoire, jamais optionnel

⚠ **Pas de nouveau cycle sans passer par cette phase.**

- review du code produit (skill `clean-code`) ;
- « rien à refactorer » = conclusion **explicite après revue**, jamais
  un saut silencieux ;
- petits pas, suite relancée après chaque pas ;
- signaux de conception notés en THINK → traités ici.

> Enchaîner les red-green sans jamais refactorer, c'est accumuler de la
> dette à **chaque** cycle.

---

## L'escalade spécification — le cœur du skill

Quand une ambiguïté bloque l'ASSERT : **l'agent ne tranche pas seul.**

**Déclencheurs**
- comportement non défini pour un cas d'entrée ;
- deux interprétations plausibles ;
- specs contradictoires ; cas limite non couvert ;
- assertion informulable en langage métier.

**Interdits absolus**
- trancher silencieusement « parce que c'est probablement ça » ;
- implémenter « les deux au cas où » ;
- affaiblir un assert pour contourner l'ambiguïté ;
- modifier la spec sans validation humaine.

---

## La procédure d'escalade

1. **Formuler** la question précisément (comportement, extrait de spec,
   cas d'entrée) ;
2. **Proposer** 2-3 interprétations candidates avec leurs conséquences ;
3. **Recommander** une option, en justifiant ;
4. **Soumettre à l'humain** — question directe en session interactive,
   ou blocage + rapport en session autonome ;
5. **Consigner** la décision dans un journal (`SPEC-DECISIONS.md`) ;
6. **Reprendre** la boucle en phase 0 sur ce comportement.

---

## Exemple réel — kata RPG Combat

*« A Character cannot Deal Damage to itself »*

L'agent ne peut pas écrire l'ASSERT : la spec dit **que** c'est interdit,
pas ce qui est **observable**.

| # | Interprétation | Conséquence |
|---|---|---|
| A | No-op silencieux | masque l'erreur d'appel |
| B | Lève une exception | feedback immédiat, recommandé |
| C | Retourne un statut | change la signature existante |

→ Escalade posée, développement des comportements non ambigus poursuivi
en attendant la décision humaine.

---

## Ce que ça change concrètement

- **Zéro comportement deviné** : chaque zone grise de la spec devient
  une question écrite, traçable, décidée par un humain.
- **Zéro dette accumulée en silence** : le refactor n'est plus une étape
  qu'on saute sous pression.
- **Un journal vivant** (`SPEC-DECISIONS.md`) : la spec s'enrichit des
  décisions prises, au lieu de rester ambiguë pour toujours.
- Deux skills complémentaires : `tdd-agentic` (la boucle) +
  `clean-code` (le contenu de la phase REFACTOR).

---

## Questions ?

`.claude/skills/tdd-agentic/SKILL.md`
`.claude/skills/clean-code/SKILL.md`
