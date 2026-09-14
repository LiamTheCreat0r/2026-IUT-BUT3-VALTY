#!/usr/bin/env bash
# Suivi des rendus : liste les PR ouvertes sur le dépôt (= qui a rendu)
# et le nombre de commentaires de revue par PR.
#
# Usage :
#   scripts/check-submissions.sh                 # dépôt et branche par défaut
#   scripts/check-submissions.sh <org/repo>      # autre dépôt
#   scripts/check-submissions.sh <org/repo> <base>  # autre branche cible
#
# Prérequis : GitHub CLI (gh) authentifié.
set -euo pipefail

REPO="${1:-IUT-BUT3-2026/revues-de-code}"
BASE="${2:-main}"

if ! command -v gh >/dev/null 2>&1; then
  echo "Erreur : le GitHub CLI 'gh' est requis (brew install gh)." >&2
  exit 1
fi

echo "== PR ouvertes vers '${BASE}' sur ${REPO} =="
gh pr list --repo "$REPO" --base "$BASE" --state open \
  --json number,author,title,updatedAt \
  --template '{{range .}}#{{.number}}  {{.author.login}}  {{.title}}  ({{timeago .updatedAt}}){{"\n"}}{{end}}'

echo
echo "== Commentaires de revue par PR =="
PRS=$(gh pr list --repo "$REPO" --base "$BASE" --state open --json number --jq '.[].number')
if [ -z "$PRS" ]; then
  echo "Aucune PR ouverte."
  exit 0
fi

for n in $PRS; do
  nb=$(gh api "repos/$REPO/pulls/$n/comments" --jq 'length' 2>/dev/null || echo "?")
  echo "PR #$n : $nb commentaire(s) en ligne"
done
