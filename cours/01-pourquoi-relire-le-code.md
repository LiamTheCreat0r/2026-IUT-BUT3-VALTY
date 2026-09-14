---
marp: true
theme: course
---

# Module 1 — Pourquoi relire le code ?

**Revue de code — Programmation logicielle** · Bachelor informatique · TypeScript

À la fin de cette séance, vous saurez :

- définir ce qu'est une revue de code et citer ses formes ;
- argumenter son importance, chiffres à l'appui ;
- distinguer **auto-revue** et **revue d'équipe** ;
- utiliser le vocabulaire de base (PR, diff, reviewer…) ;
- adopter les attitudes d'un bon relecteur.

---

## 1. Mise en situation

Cette fonction compile. Elle passe les tests.

```ts
export function applyDiscount(price: number, code: string | undefined): number {
  if (code === "PROMO10") return price * 0.9;
  if (code === "PROMO50") return price * 0.5;
  return price;
}
```

**La merge-t-on en production ?**

---

## 1. Ce qu'un relecteur voit immédiatement

- `price` peut être négatif… ou `NaN` — `NaN * 0.9` reste `NaN`
- deux codes magiques éparpillés — et `PROMO20`, il faudra le retrouver où ?
- logique métier mélangée à la logique d'application du code
- aucun test pour les cas limites (code inconnu, prix à 0…)
- le nom de la fonction ne dit rien si `code` est invalide

> **La revue rattrape ce que l'auteur ne voit plus, avant que le code n'atteigne la production.**

---

## 2. Qu'est-ce qu'une revue de code ?

> **Définition** — Lecture systématique d'un code source par une ou plusieurs personnes, **avant** son intégration à la branche principale.

Une pratique aussi vieille que l'industrie :
Michael Fagan formalise l'**inspection de code** chez IBM dès 1976.

Ce qui a changé depuis : la forme. Pas le fond —

> **Un code non relu est un code dont personne ne connaît la qualité.**

---

## 2. Les formes de revue

| Forme | Qui relit ? | Quand ? |
|-------|-------------|---------|
| **Auto-revue** | l'auteur lui-même | avant de soumettre |
| **Revue par un pair** | un ou des collègues | avant le merge |
| **Revue croisée** | deux auteurs se relisent | avant le merge |
| **Binômage** (*pair programming*) | deux personnes, même code | pendant l'écriture |
| **Inspection formelle** | réunion dédiée, rôles définis | avant une livraison majeure |

Dans ce cours : **auto-revue** et **revue par un pair via pull requests**.
C'est ce que vous ferez en TD.

---

## 3. Les chiffres — les bugs coûtent cher

> Corriger un problème logiciel **après livraison** coûte de **10 à 100 fois plus cher** que pendant le développement.
> — Boehm & Basili, *Software Defect Reduction Top 10 List* (2001)

- un bug trouvé en revue : quelques minutes à corriger ;
- le même bug en production : investigation, correctif d'urgence, re-publication, utilisateurs mécontents.

Aux États-Unis : plus de **2 000 milliards de dollars** par an
(CPSQ, 2022).

---

## 3. Les chiffres — la revue détecte les défauts

- **IBM / NASA (1970-80)** : inspections → **60-75 %** des défauts détectés
- **Cisco (2006)**, 3 500 revues : **60-70 %** des défauts trouvés en revue
- **Google (2018)**, 9 M de revues : les PR de **moins de 200-400 lignes** sont relues plus vite et plus soigneusement

La revue n'attrape pas tout.
Mais c'est le **meilleur rapport coût / efficacité** pour la qualité.

---

## 4. Les vérifications automatiques ne suffisent pas

Compilateurs et linters attrapent beaucoup d'erreurs —
mais ils ne savent pas *pourquoi* le code existe, ni ce qu'il est *censé* faire :

- logique métier incorrecte ;
- oubli (cas limite non traité, paramètre inutilisé) ;
- problème de sécurité (donnée utilisateur injectée) ;
- code illisible, cauchemar à maintenir dans 6 mois.

> **La revue est le complément humain des outils automatiques** : elle vérifie ce que la machine ne peut pas vérifier — l'intention, la pertinence, la clarté.

*(En TD, nous utiliserons TypeScript — ses pièges spécifiques seront vus au Module 5.)*

---

## 5. Six bénéfices

1. **Moins de bugs** en production — détectés à la source
2. **Partage de connaissance** — réduit le *bus factor*
3. **Propriété collective** — chacun se sent responsable de tout
4. **Barre de qualité commune** — conventions respectées *par* l'équipe
5. **Sécurité** — une paire d'yeux supplémentaire
6. **Compétences** — relire, c'est apprendre (des autres et de soi)

---

## 6. L'auto-revue — le biais de l'auteur

On voit ce qu'on a *voulu* écrire, pas ce qu'on a *réellement* écrit.

Le cerveau comble les coquilles, saute les branches évidentes,
et oublie que le lecteur ne sait pas ce qu'on sait.

> **Règle d'or** — Se relire en prenant le point de vue de quelqu'un qui ne connaît pas le code.

---

## 6. L'auto-revue — la technique

1. Relire le **diff**, pas le fichier — c'est exactement ce que verront les collègues
2. Chaque ligne ajoutée est-elle nécessaire ? Chaque suppression justifiée ?
3. Les tests testent le **comportement**, pas l'implémentation ?
4. S'exécuter les cas limites : vide, nul, énorme, inattendu ?
5. Linter, compilateur, formateur — **avant** de faire perdre du temps aux autres

---

## 6. L'auto-revue — 5 réflexes (indépendants du langage)

1. Les **entrées** sont-elles validées ? (valeurs négatives, vides, extrêmes)
2. Les **erreurs** sont-elles gérées ? (pas d'échec silencieux)
3. Le code est-il lisible **hors de son contexte** ?
4. Les **tests** couvrent-ils les cas limites, pas seulement le chemin heureux ?
5. Les **noms** disent-ils l'intention, pas l'implémentation ?

---

## 7. La revue en équipe

Deux perspectives, une rencontre :

| | L'auteur | Le relecteur |
|---|---|---|
| Connaît | l'intention, le contexte | ce qui est écrit |
| Est aveugle à | ses propres erreurs | … rien : regard neuf |

> **La revue est une collaboration, pas un examen.**
> Une conversation technique, pas un jugement.

---

## 7. Les rôles dans le workflow GitHub

| Rôle | Action |
|------|--------|
| **Auteur** | crée la PR, décrit quoi et pourquoi, répond aux commentaires |
| **Relecteur** (*reviewer*) | lit le diff, commente, approuve ou demande des modifications |
| **Intégrateur** (*maintainer*) | merge quand les conditions sont réunies |

---

## 7. Le cycle de base d'une PR

```
1. branche feature ──► commit ──► push ──► pull request
2. CI : tests automatiques (GitHub Actions)
3. le relecteur commente en ligne
4. l'auteur corrige (nouveaux commits)
5. approbation  —  ou  demande de modifications
6. merge ──► le code entre dans la branche principale
```

Détail du workflow complet : **Module 2**.

---

## 8. Le vocabulaire à connaître

| Terme | Définition |
|-------|------------|
| **PR** | demande d'intégration d'une branche, avec description et discussion |
| **Diff** | lignes ajoutées / supprimées entre deux versions |
| **Reviewer** | personne qui relit la PR |
| **Inline comment** | commentaire posé sur une ligne du diff |
| **Approve** | validation de la PR |
| **Request changes** | modifications demandées |
| **Merge** | intégration dans la branche principale |
| **CI** | tests exécutés automatiquement à chaque push |

---

## 9. Les attitudes d'un bon relecteur — 1/2

1. **Commenter le code, pas la personne**
   — « cette boucle est inefficace », pas « tu écris des boucles inefficaces »
2. **Expliquer le pourquoi**
   — « `x` est ambigu : prix HT ou TTC ? » plutôt que « renomme `x` »
3. **Suggérer, ne pas imposer**
   — « On pourrait… », « As-tu envisagé… ? »
4. **Dire aussi ce qui est bien**
   — un nom bien choisi, un test malin : c'est aussi de l'information

---

## 9. Les attitudes d'un bon relecteur — 2/2

5. **Se concentrer sur l'essentiel**
   — d'abord les bugs, puis le design, enfin le style (le linter s'en charge)
6. **Respecter le temps de l'autre**
   — une revue qui traîne vaut presque une revue qui n'existe pas
7. **Rester humble**
   — « je me trompe peut-être, mais… » fait partie de la compétence

---

## 10. Questions de compréhension — 1/2

1. Pourquoi les vérifications automatiques (compilateur, linter) ne
   rendent-elles pas la revue inutile ? Deux catégories de problèmes
   qu'elles ne détectent pas ?
2. Citez trois bénéfices autres que la réduction des bugs.
3. Quelle est la limite structurelle de l'auto-revue ?
4. Pourquoi relire un *diff* plutôt que le fichier complet ?

---

## 10. Questions de compréhension — 2/2

5. Dans `applyDiscount`, listez au moins trois problèmes pour un relecteur.
6. Classez ces commentaires du plus au moins constructif, en justifiant :
   - « `x` c'est nul comme nom »
   - « `priceAfterTax` serait plus clair : `price` peut être HT ou TTC »
   - « Le calcul de la remise devrait être isolé pour être testable »
7. Expliquez la revue croisée et pourquoi elle est adaptée à l'apprentissage.

---

## Pour aller plus loin

- **Module 2** — le workflow complet de la revue sur GitHub
- **Module 3** — que chercher dans une revue (dans l'ordre de priorité)
- **Module 5** — les pièges TypeScript à traquer en revue

Références : Boehm & Basili (2001) · SmartBear/Cisco (2006) ·
Google (2018) · Fagan (1976)
