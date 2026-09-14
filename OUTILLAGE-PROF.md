# OUTILLAGE — génération des slides et PDF

Les supports de cours (`cours/*.md`) sont rédigés **comme des slides**
(contenu aéré, séparé par `---`) et générés avec **Marp CLI**.

## Installation (une seule fois)

```sh
npm install -g @marp-team/marp-cli
```

## Commandes (depuis la racine du dépôt)

```sh
# Aperçu en direct — se recharge à chaque sauvegarde
marp --watch cours/01-pourquoi-relire-le-code.md

# Export PDF (une slide par page)
marp cours/01-pourquoi-relire-le-code.md --pdf

# Export HTML autonome (à déposer sur Moodle / un serveur)
marp cours/01-pourquoi-relire-le-code.md --html

# Export PowerPoint (si besoin)
marp cours/01-pourquoi-relire-le-code.md --pptx

# Tous les modules d'un coup
for f in cours/*.md; do marp "$f" --pdf; done
```

## Conventions d'écriture (format slides)

- **Frontmatter** en tête de chaque fichier :

  ```markdown
  ---
  marp: true
  theme: default
  ---
  ```

- **Une slide = un bloc séparé par `---`.**
- Une idée par slide, listes à puces courtes, beaucoup d'espace.
- Code TypeScript en ` ```ts ` : coloration automatique.
- Les questions de compréhension d'un module peuvent tenir sur plusieurs
  slides (`10. Questions — 1/2`, `— 2/2`).

## Notes

- L'export PDF télécharge un Chrome headless la première fois (lent, une fois
  seulement).
- Le même fichier reste lisible sur GitHub : le frontmatter y est ignoré et
  les séparateurs `---` apparaissent comme de simples filets horizontaux.
