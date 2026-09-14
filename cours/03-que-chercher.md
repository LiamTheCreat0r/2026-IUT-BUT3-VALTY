---
marp: true
theme: course
---

# Module 3 — Que chercher dans une revue ? La conception

**Revue de code — Programmation logicielle** · Bachelor informatique

À la fin de cette séance, vous saurez :

- hiérarchiser une revue : bugs → **conception** → lisibilité → style ;
- reconnaître les **code smells** les plus fréquents ;
- appliquer le **design simple** (KISS, YAGNI) ;
- connaître les règles d'**Object Calisthenics** ;
- repérer les **patterns** et les **anti-patterns** courants ;
- évaluer la **testabilité** d'un code (sans parler des tests eux-mêmes).

Les exemples sont donnés dans **plusieurs langages** :
les principes sont universels.

---

## 1. Les 4 niveaux d'une revue

```
1. Comportement et logique   (bugs, cas limites)      ← Module 1
2. CONCEPTION                (design, patterns, …)    ← ce module
3. Lisibilité                (noms, clarté)
4. Style                     (formatage → le linter s'en charge)
```

On traite les niveaux **dans cet ordre** : d'abord ce qui casse,
ensuite ce qui coûte cher à maintenir.

> Un bug est corrigé une fois. Une mauvaise conception se paie tous les jours.

---

## 2. Le design simple — 4 règles

> *Kent Beck* — un code bien conçu, c'est un code qui respecte 4 règles, dans l'ordre :

1. **Passe les tests** (il fait ce qu'il doit faire) ;
2. **Exprime l'intention** (on comprend pourquoi il existe) ;
3. **Ne duplique pas** (chaque connaissance existe une seule fois) ;
4. **Est minimal** (rien d'inutile — KISS, YAGNI).

KISS : *Keep It Simple* — YAGNI : *You Ain't Gonna Need It*.

> En revue : « ce code est-il **plus compliqué** que nécessaire ? »

---

## 2. Design simple — le sur-engineering

```ts
// ❌ YAGNI : on prévoit des choses dont personne n'a besoin
interface Config { retryCount: number; cacheTTL: number; /* … */ }
const config: Config = { retryCount: 3, cacheTTL: 60 };
```

```python
# ✅ Ce dont on a vraiment besoin, rien de plus
CONFIG = {"retry": 3}
```

> Le code « au cas où » devient du code mort… ou pire, du code buggé que personne ne teste.

---

## 3. Les code smells — c'est quoi ?

> **Définition** — Un *code smell* est un symptôme dans le code qui suggère un problème plus profond de conception.

Ce n'est pas une erreur (ça compile, ça marche) —
c'est un signal que le code **coûtera cher à maintenir**.

Les smells ne se détectent ni au compilateur, ni au linter :
**c'est le rôle du relecteur.**

---

## 3. Smell n°1 — la duplication (DRY)

La même logique recopiée à plusieurs endroits.

```ts
// ❌ TypeScript
const total1 = sousTotal + (sousTotal * 0.2);
// … 50 lignes plus loin
const total2 = sousTotal2 + (sousTotal2 * 0.2);
```

```python
# ✅ Python — une seule source de vérité
def appliquer_tva(ht: float) -> float:
    return ht * 1.2

total1 = appliquer_tva(sous_total)
total2 = appliquer_tva(sous_total2)
```

> Dupliquer = corriger deux fois chaque bug. DRY : *Don't Repeat Yourself*.

---

## 3. Smell n°2 — fonction trop longue

Une fonction qui fait tout : calcul, affichage, sauvegarde…

```python
# ❌ Python : 3 responsabilités en une
def traiter_commande(commande):
    total = sum(p.prix for p in commande)
    print(f"Total : {total}")
    sauvegarder(commande)
```

```ts
// ✅ TypeScript : une fonction = une responsabilité
function calculerTotal(commande: Commande): number { /* … */ }
function afficherTotal(total: number): void { /* … */ }
function sauvegarderCommande(commande: Commande): void { /* … */ }
```

> 10 lignes par fonction, une seule raison de changer.

---

## 3. Smell n°3 — trop de paramètres

Plus de 3-4 paramètres → difficile à lire, à appeler, à tester.

```ts
// ❌ TypeScript
createUser(name, email, isAdmin, isActive, sendWelcomeMail, plan);
```

```ts
// ✅ Regrouper ce qui va ensemble
createUser({ name, email, role: "admin", notify: true });
```

---

## 3. Smell n°3 — les mêmes principes en Python

```python
# ✅ Python — mêmes principes
creer_utilisateur(nom, email, role="admin", notifier=True)
```

> Le **booléen en paramètre** est un signal : deux comportements dans une seule fonction.

---

## 3. Smell n°4 — les valeurs magiques

Des nombres ou chaînes en dur, sans signification.

```ts
// ❌ TypeScript
if (age < 18) { /* … */ }
```

```python
# ✅ Python — le nom dit l'intention
AGE_MAJORITE = 18

if age < AGE_MAJORITE:
    ...
```

```ts
// ✅ TypeScript — même principe, même syntaxe
const MAJORITE = 18;
if (age < MAJORITE) { /* … */ }
```

---

## 3. Smell n°5 — les commentaires « quoi »

Le code raconte *quoi* ; le commentaire doit dire *pourquoi*.

```ts
// ❌ TypeScript : le commentaire répète le code
x = x + 1;  // incrémente x

// ✅ Le pourquoi
total = total + remise;  // la remise s'applique avant les frais de port
```

```python
# ❌
resultat = donnees[0]  # prend le premier élément
```

> Un commentaire qui explique le code = code mal nommé.
> Un commentaire qui explique la décision = précieux.

---

## 3. Smell n°6 — le code mort

Du code que plus personne n'utilise.

```ts
// ❌ TypeScript : jamais appelé nulle part
function legacyImport(): void { /* … */ }
```

- fonctions inutilisées, paramètres jamais lus, variables assignées jamais utilisées ;
- du code commenté (c'est ce que dit git, lui) ;
- des branches « au cas où » (YAGNI).

> Le code mort est du poids mort : on le lit, on hésite, on n'ose pas le supprimer.

---

## 4. Les noms — la base de tout

Nommer, c'est **documenter** — et ça n'a pas de prix en revue.

```ts
// ❌ TypeScript
const d = new Date();
let x = getData(d);
```

```ts
// ✅ TypeScript — même exigence
const aujourdhui = new Date();
const rapports = genererRapports(aujourdhui);
```

---

## 4. Les noms — même principe en Python

```python
# ✅ Python — l'intention est lisible sans commentaire
aujourdhui = date.today()
rapports = generer_rapports(aujourdhui)
```

> Un bon nom répond : *quoi ?* (variable), *pourquoi ?* (fonction), *dans quel but ?* (paramètre).

---

## 5. Une responsabilité par fonction

Une fonction qui a **plusieurs raisons de changer** est fragile.

```ts
// ❌ TypeScript : le calcul ET la validation mélangés
function prixAvecRemise(panier: Panier, code: string): number {
  if (code.length !== 6) throw new Error("code invalide");
  return panier.total() * 0.9;
}
```

```ts
// ✅ Séparer les préoccupations
function validerCode(code: string): void { /* … */ }
function appliquerRemise(total: number, code: string): number { /* … */ }
```

> En revue : « cette fonction peut-elle changer pour **deux raisons différentes** ? »


---

## 6. Refactoring — étape 1 : nommer

**Smell corrigé : les abréviations.** La logique est identique — on ne change rien d'autre.

```ts
function calculateTotal(cart: { items: Item[] }): number {
  let total = 0;
  for (const item of cart.items) {
    if (item.quantity > 0) {
      if (item.price > 0) {
        total += item.price * item.quantity;
      } else {
        throw new Error("bad item");
      }
    }
  }
  if (total > 100) {
    return total * 0.9;
  } else {
    return total;
  }
}
```

> Le code est déjà plus lisible — la structure, elle, n'a pas bougé.

---

## 6. Refactoring — étape 2 : nommer les valeurs

**Smell corrigé : les valeurs magiques.** On extrait les constantes.

```ts
const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.9;

function calculateTotal(cart: { items: Item[] }): number {
  let total = 0;
  for (const item of cart.items) {
    if (item.quantity > 0) {
      if (item.price > 0) {
        total += item.price * item.quantity;
      } else {
        throw new Error("bad item");
      }
    }
  }
  if (total > DISCOUNT_THRESHOLD) {
    return total * DISCOUNT_RATE;
  } else {
    return total;
  }
}
```

> Le *quoi* (seuil, taux) devient explicite — et modifiable en un seul endroit.

---

## 6. Refactoring — étape 3 : les gardes

**Smell corrigé : les `else`** — et par la même occasion, l'indentation chute de 3 niveaux à 1.

```ts
const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.9;

function calculateTotal(cart: { items: Item[] }): number {
  let total = 0;
  for (const item of cart.items) {
    if (item.quantity <= 0 || item.price <= 0) {
      throw new Error("bad item");
    }
    total += item.price * item.quantity;
  }
  if (total > DISCOUNT_THRESHOLD) return total * DISCOUNT_RATE;
  return total;
}
```

> Le cas invalide est écarté **en tête** (garde) ; le reste du code suit le chemin normal.

---

## 6. Refactoring — étape 4 : extraire et encapsuler

**Smell corrigé : trop de responsabilités + primitifs nus.** Chaque rôle sort dans une fonction ; la structure porte la logique.

```ts
type Money = number;   // primitif enveloppé

class CartItem {
  constructor(
    private readonly name: string,
    private readonly price: Money,
    private readonly quantity: number,
  ) {}

  subtotal(): Money {
    return this.price * this.quantity;
  }
}

function calculateTotal(cart: CartItem[]): Money {
  let total = 0;
  for (const item of cart) {
    total += item.subtotal();
  }
  return applyDiscount(total);
}

function applyDiscount(total: Money): Money {
  if (total > DISCOUNT_THRESHOLD) return total * DISCOUNT_RATE;
  return total;
}
```

- une **responsabilité par fonction** (`subtotal`, `applyDiscount`) ;
- les **primitifs enveloppés** (`Money`, `CartItem`) ;
- noms complets, constantes, gardes — les étapes précédentes sont conservées.

---

## 6. « Tell, Don't Ask » — le principe derrière l'étape 4

*The Pragmatic Programmer* (Hunt & Thomas) :

> **Ne demande pas à l'objet ses données pour décider à sa place — dis-lui de faire.**

Avant (étape 3) — on **demande**, on décide à sa place :

```ts
total += item.price * item.quantity;   // ask : on récupère les données…
```

Après (étape 4) — on **dit** :

```ts
total += item.subtotal();              // tell : on demande le résultat
```

---

## 6. « Tell, Don't Ask » — pourquoi c'est important

- la logique vit **là où sont les données** (dans `CartItem`) ;
- si le calcul change (arrondi, TVA), on modifie **un seul endroit** ;
- le code appelant ne connaît pas les détails internes de l'objet.

> En revue : repérez les chaînes qui « demandent » (`item.price * item.quantity`) — c'est souvent un *ask* qui devrait être un *tell*.


---

## 7. Object Calisthenics — les 9 règles

*Jeff Bay* — un exercice de style pour forcer un code sain :

1. un seul niveau d'indentation par fonction ;
2. pas de mot-clé `else` ;
3. envelopper les primitifs (chaînes, nombres) dans des types ;
4. collections de première classe (pas de tableaux nus partout) ;
5. un seul point (`.`) par ligne ;
6. pas d'abréviations ;
7. tout garder petit (fonctions, classes, fichiers) ;
8. pas plus de deux attributs par classe ;
9. pas de getters/setters systématiques => tell, don't ask !

---

## 7. Object Calisthenics — sans les règles (dirty)

```ts
// ❌ Sans calisthenics
function calc(cart: { items: Item[] }): number {
  let t = 0;
  for (const it of cart.items) {
    if (it.q > 0) {
      if (it.p > 0) {
        t += it.p * it.q;
      } else {
        throw new Error("bad item");
      }
    }
  }
  if (t > 100) {
    return t * 0.9;
  } else {
    return t;
  }
}
```

---

## 7. Dirty — ce qu'un relecteur calisthenics voit

Ce qu'un relecteur calisthenics voit d'un coup :

- **3 niveaux d'indentation** (boucle + deux `if`) ;
- deux **`else`** ;
- **abréviations** : `calc`, `t`, `it`, `p`, `q` ;
- **valeurs magiques** : `100`, `0.9` ;
- tout dans **une seule fonction** qui calcule ET applique la remise.

---

## 7. Object Calisthenics — avec les règles (clean)

```ts
// ✅ Avec calisthenics
type Money = number;   // primitif enveloppé

class CartItem {
  constructor(
    private readonly name: string,
    private readonly price: Money,
    private readonly quantity: number,
  ) {}

  subtotal(): Money {
    return this.price * this.quantity;
  }
}

function calculateTotal(cart: CartItem[]): Money {
  let total = 0;
  for (const item of cart) {
    total += item.subtotal();
  }
  return applyDiscount(total);
}

function applyDiscount(total: Money): Money {
  if (total > DISCOUNT_THRESHOLD) return total * DISCOUNT_RATE;
  return total;
}

const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.9;
```

- noms **complets** — pas d'abréviations ;
- **constantes nommées** — pas de valeurs magiques ;
- pas de **`else`** — retours anticipés ;
- **un niveau d'indentation**, fonctions courtes ;
- primitifs **enveloppés** (`Money`, `CartItem`).

---

## 7. Object Calisthenics — le style fonctionnel (1/2)

**Un pas de plus : la boucle + l'état mutable** — remplacés par `filter` / `map` / `reduce`.

```ts
class CartItem {
  // … (étape 4) + un prédicat, qui « dit » sans exposer ses données :
  isInStock(): boolean {
    return this.quantity > 0;
  }
}

function calculateTotal(cart: CartItem[]): Money {
  const total = cart
    .filter((item) => item.isInStock())            // filter : on ne garde que les articles en stock
    .map((item) => item.subtotal())                // map : chaque article → son sous-total
    .reduce((sum, subtotal) => sum + subtotal, 0); // reduce : on agrège en un total
  return applyDiscount(total);
}
```

- le `for` et le `let total = 0` **mutable** disparaissent ;
- chaque étape est **nommée** : on lit le *quoi* sans suivre l'état qui change.

---

## 7. Object Calisthenics — le style fonctionnel : pourquoi c'est mieux (2/2)

- `isInStock()` est un **prédicat** (Tell, Don't Ask) — pas un getter ;
- moins d'**état mutable** → moins de surprises pour le relecteur ;
- la chaîne se **lit comme une phrase** : on filtre, on transforme, on agrège ;
- chaque transformation est **isolée** — donc facile à comprendre et à vérifier.

> Les mêmes `filter` / `map` / `reduce` existent en Python, Java, JavaScript… — encore une fois, les principes sont universels.

---

## 7. Object Calisthenics — le chemin parcouru

| Étape | Smell corrigé | Résultat |
|-------|---------------|----------|
| 1 | abréviations | noms complets |
| 2 | valeurs magiques | constantes nommées |
| 3 | `else` + indentation | gardes, chemin normal |
| 4 | responsabilités + primitifs nus | fonctions courtes, types enveloppés |
| 5 | boucle + état mutable | `filter` / `map` / `reduce` — style fonctionnel |

> **Un refactoring se fait un smell à la fois.** À chaque étape, le code compile, fonctionne, et les tests passent. On s'arrête dès que le code est « assez bien » pour être relu.

---

## 7. Object Calisthenics — 3 règles illustrées

**Pas de `else`** — le retour anticipé simplifie :

```ts
// ❌
function statut(age: number): string {
  if (age >= 18) { return "majeur"; } else { return "mineur"; }
}
// ✅
function statut(age: number): string {
  if (age >= 18) return "majeur";
  return "mineur";
}
```

**Pas d'abréviations** : `calcTot()` → `calculerTotal()`.
**Un niveau d'indentation** : sortir les boucles imbriquées dans des fonctions nommées.

---

## 8. Les patterns — c'est quoi ?

> **Définition** — Un *design pattern* est une **solution éprouvée** à un problème de conception récurrent, décrite avec un nom, un problème et une solution.

- ce sont des **conventions nommées** : dire « c'est un Strategy » résume toute une solution ;
- les reconnaître en revue, c'est comprendre l'intention de l'auteur ;
- **attention** : un pattern inutile est un sur-engineering (YAGNI).

---

## 8. Pattern : Strategy — remplacer les if/else

```ts
// ❌ TypeScript — une cascade de conditions qui grossira
if (code === "PROMO10") { return prix * 0.9; }
if (code === "PROMO50") { return prix * 0.5; }
```

```python
# ✅ Python — une table de stratégies
strategies = {"PROMO10": lambda p: p * 0.9, "PROMO50": lambda p: p * 0.5}

def prix_final(prix: float, code: str) -> float:
    return strategies.get(code, lambda p: p)(prix)
```

---

## 8. Pattern : Strategy — même idée en TypeScript

```ts
// ✅ TypeScript — même idée avec un objet
const STRATEGIES: Record<string, (p: number) => number> = {
  PROMO10: (p) => p * 0.9,
  PROMO50: (p) => p * 0.5,
};
```

> Ajouter un code promo = ajouter une entrée. Sans toucher à la fonction.

---

## 8. Quelques patterns à reconnaître

| Pattern | Problème résolu | Indice en revue |
|---------|-----------------|-----------------|
| **Factory** | construire des objets selon un contexte | `create…()`, `build…()` |
| **Observer** | notifier des dépendants sans les connaître | abonnements, `listen()` |
| **Adapter** | brancher deux interfaces incompatibles | classes `…Adapter` |
| **Decorator** | enrichir sans modifier | enveloppes, `with…()` |
| **Strategy** | varier un comportement | tables de fonctions, `switch` remplacé |

> Savoir les nommer, c'est pouvoir discuter de la solution en un mot.

---

## 8. Les anti-patterns à signaler

| Anti-pattern | Symptôme |
|--------------|----------|
| **God Object** | une classe/fonction qui sait tout, fait tout |
| **Spaghetti** | enchaînements illisibles, sauts de responsabilité |
| **Golden Hammer** | « tout est un clou » : le même outil partout |
| **Copier-coller** | la duplication élevée en art |
| **Optimisation prématurée** | complexité ajoutée sans mesure de besoin |

> En revue, nommer l'anti-pattern aide à discuter — sans juger la personne.

---

## 9. La testabilité — concevoir pour pouvoir tester

*(Les tests eux-mêmes sont vus dans un autre cours. Ici : concevoir pour qu'ils soient possibles.)*

Un code **testable** est :

- **déterministe** : mêmes entrées → mêmes sorties ;
- **découplé** : on peut remplacer l'infrastructure (base de données, réseau, horloge) ;
- **sans état global** caché.

> Si c'est dur à tester, c'est souvent mal conçu — le signal vaut pour les deux.

---

## 9. Dépendances injectées, pas créées en dur

```ts
// ❌ TypeScript — impossible à tester sans vraie base
class Facture {
  constructor() { this.db = new Database(); }
}
```

```ts
// ✅ La dépendance est fournie de l'extérieur
class Facture {
  constructor(private db: Database) {}
}
```

```python
# ✅ Python — même principe
class Facture:
    def __init__(self, db):   # on reçoit, on ne crée pas
        self.db = db
```

---

## 9. Fonctions pures, effets de bord maîtrisés

```ts
// ❌ TypeScript — effet de bord caché (état global modifié)
let solde = 0;
function ajouterAuSolde(montant: number): void {
  solde += montant;
}
```

```ts
// ✅ Fonction pure : entrée → sortie, sans surprise
function nouveauSolde(solde: number, montant: number): number {
  return solde + montant;
}
```

```python
# ✅ Python — même principe
def nouveau_solde(solde: float, montant: float) -> float:
    return solde + montant
```

---

## 10. Récapitulatif — la checklist « conception » du relecteur

- [ ] le code est-il **plus simple** que nécessaire ? (KISS, YAGNI)
- [ ] pas de **duplication** ? (DRY)
- [ ] fonctions **courtes**, une responsabilité ?
- [ ] pas de **valeurs magiques** ?
- [ ] les **noms** disent l'intention ?
- [ ] pas de **code mort** ?
- [ ] la structure suit-elle un **pattern connu** (sans sur-ingénierie) ?
- [ ] le code est-il **testable** (dépendances injectées, pas d'effets de bord cachés) ?

---

## 11. Questions de compréhension

1. Dans quel ordre traiter les 4 niveaux d'une revue ? Pourquoi ?
2. Citez les 4 règles du design simple (Beck).
3. Donnez trois code smells et, pour chacun, un exemple de votre cru.
4. Pourquoi un commentaire « quoi » est-il un signal de mauvaise conception ?
5. Qu'est-ce qu'un design pattern ? Pourquoi les nommer aide-t-il la revue ?
6. Citez deux règles d'Object Calisthenics et expliquez leur intérêt.
7. Pourquoi une dépendance créée en dur (`new Database()`) gêne-t-elle la testabilité ?
8. Prenez le code de votre dernier projet : trouvez-y deux smells vus aujourd'hui.

---

## Pour aller plus loin

- **Module 4** — communiquer une revue : ton, feedback constructif, anti-patterns de communication
- **Module 5** — les pièges TypeScript à traquer en revue
- **TD** — application directe : les smells de ce module sont volontairement présents dans `td1`
