#!/usr/bin/env bash
set -euo pipefail

# quality-report.sh — Lance tests unitaires, knip et/ou Stryker
# et produit un rapport compact (optimisé pour consommation LLM)
#
# Usage:
#   ./scripts/quality-report.sh [OPTIONS]
#
# Options:
#   -t, --tests       Lancer les tests unitaires (vitest)
#   -k, --knip        Lancer knip (dead code)
#   -m, --mutations   Lancer les tests de mutation (stryker)
#   -c, --coverage    Ajouter la couverture de code aux tests
#   -a, --all         Tout lancer (équivaut à -t -c -k -m)
#   -v, --verbose     Afficher les logs complets (défaut: résumé uniquement)
#   -o, --output FILE Écrire le rapport dans un fichier
#   -h, --help        Afficher l'aide

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

# Couleurs (désactivées si pas de terminal)
if [[ -t 1 ]]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[0;33m'
  CYAN='\033[0;36m'
  BOLD='\033[1m'
  RESET='\033[0m'
else
  RED='' GREEN='' YELLOW='' CYAN='' BOLD='' RESET=''
fi

# Defaults
RUN_TESTS=false
RUN_COVERAGE=false
RUN_KNIP=false
RUN_MUTATIONS=false
VERBOSE=false
OUTPUT_FILE=""

usage() {
  echo "Usage: $0 [OPTIONS]"
  echo ""
  echo "Options:"
  echo "  -t, --tests       Tests unitaires (vitest)"
  echo "  -c, --coverage    Ajouter la couverture de code aux tests"
  echo "  -k, --knip        Dead code (knip)"
  echo "  -m, --mutations   Tests de mutation (stryker)"
  echo "  -a, --all         Tout lancer (-t -c -k -m)"
  echo "  -v, --verbose     Logs complets"
  echo "  -o, --output FILE Écrire dans un fichier"
  echo "  -h, --help        Aide"
  exit 0
}

# Parse args
while [[ $# -gt 0 ]]; do
  case $1 in
    -t|--tests)      RUN_TESTS=true; shift ;;
    -c|--coverage)   RUN_COVERAGE=true; shift ;;
    -k|--knip)       RUN_KNIP=true; shift ;;
    -m|--mutations)   RUN_MUTATIONS=true; shift ;;
    -a|--all)        RUN_TESTS=true; RUN_COVERAGE=true; RUN_KNIP=true; RUN_MUTATIONS=true; shift ;;
    -v|--verbose)    VERBOSE=true; shift ;;
    -o|--output)     OUTPUT_FILE="$2"; shift 2 ;;
    -h|--help)       usage ;;
    *) echo "Option inconnue: $1"; usage ;;
  esac
done

# Au moins une option requise
# -c implique -t (pas de couverture sans tests)
if $RUN_COVERAGE && ! $RUN_TESTS; then
  RUN_TESTS=true
fi

if ! $RUN_TESTS && ! $RUN_KNIP && ! $RUN_MUTATIONS; then
  echo "Erreur: spécifiez au moins une option (-t, -c, -k, -m ou -a)"
  echo ""
  usage
fi

# Rapport
REPORT=""
TOTAL_PASS=0
TOTAL_FAIL=0
SEPARATOR="━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

append() {
  REPORT+="$1"$'\n'
}

append ""
append "${BOLD}╔═══════════════════════════════════════════╗${RESET}"
append "${BOLD}║         RAPPORT QUALITÉ — sebc.dev        ║${RESET}"
append "${BOLD}╚═══════════════════════════════════════════╝${RESET}"
append ""
append "Date: $(date '+%Y-%m-%d %H:%M:%S')"
append ""

# ─── Tests unitaires (Vitest) ───────────────────────────────────────

run_tests() {
  local header="TESTS UNITAIRES (Vitest)"
  $RUN_COVERAGE && header="TESTS UNITAIRES + COUVERTURE (Vitest)"

  append "${SEPARATOR}"
  append "${CYAN}${BOLD}▸ $header${RESET}"
  append "${SEPARATOR}"

  local tmpfile
  tmpfile=$(mktemp)

  local vitest_args="run --reporter=verbose"
  $RUN_COVERAGE && vitest_args="run --coverage --reporter=verbose"

  local exit_code=0
  npx vitest $vitest_args 2>&1 > "$tmpfile" || exit_code=$?

  if $VERBOSE; then
    append ""
    append "$(cat "$tmpfile")"
    append ""
  fi

  # Extraire le résumé des tests
  local test_summary
  test_summary=$(grep -E "^[[:space:]]*(Tests|Test Files)" "$tmpfile" 2>/dev/null || true)

  # Extraire les tests échoués
  local failed_tests
  failed_tests=$(grep -E "^[[:space:]]*×|FAIL" "$tmpfile" 2>/dev/null || true)

  if [[ $exit_code -eq 0 ]]; then
    append "${GREEN}✓ PASS${RESET}"
    ((TOTAL_PASS++))
  else
    append "${RED}✗ FAIL (exit code: $exit_code)${RESET}"
    ((TOTAL_FAIL++))
  fi

  if [[ -n "$test_summary" ]]; then
    append ""
    append "Résumé:"
    append "$test_summary"
  fi

  if [[ -n "$failed_tests" ]]; then
    append ""
    append "${RED}Tests échoués:${RESET}"
    append "$failed_tests"
  fi

  # Couverture (uniquement si demandée)
  if $RUN_COVERAGE; then
    local coverage_summary
    coverage_summary=$(grep -E "^(All files|---|[[:space:]]+src/)" "$tmpfile" 2>/dev/null | head -20 || true)

    if [[ -n "$coverage_summary" ]]; then
      append ""
      append "Couverture:"
      append "$coverage_summary"
    fi
  fi

  append ""
  rm -f "$tmpfile"
}

# ─── Knip (dead code) ──────────────────────────────────────────────

run_knip() {
  append "${SEPARATOR}"
  append "${CYAN}${BOLD}▸ DEAD CODE (Knip)${RESET}"
  append "${SEPARATOR}"

  local tmpfile
  tmpfile=$(mktemp)

  local exit_code=0
  npx knip 2>&1 > "$tmpfile" || exit_code=$?

  if $VERBOSE; then
    append ""
    append "$(cat "$tmpfile")"
    append ""
  fi

  local line_count
  line_count=$(wc -l < "$tmpfile")

  if [[ $exit_code -eq 0 ]]; then
    append "${GREEN}✓ PASS — Aucun dead code détecté${RESET}"
    ((TOTAL_PASS++))
  else
    append "${RED}✗ FAIL — Problèmes détectés${RESET}"
    ((TOTAL_FAIL++))

    # Résumé par catégorie
    local unused_files unused_deps unused_exports unused_types
    unused_files=$(grep -c "Unused files" "$tmpfile" 2>/dev/null || echo "0")
    unused_deps=$(grep -c "Unused dependencies" "$tmpfile" 2>/dev/null || echo "0")
    unused_exports=$(grep -c "Unused exports" "$tmpfile" 2>/dev/null || echo "0")
    unused_types=$(grep -c "Unused exported types" "$tmpfile" 2>/dev/null || echo "0")

    # Extraire les sections avec leurs contenus (compact)
    append ""
    # Afficher les 50 premières lignes max pour rester compact
    head -50 "$tmpfile" | while IFS= read -r line; do
      append "  $line"
    done

    if [[ $line_count -gt 50 ]]; then
      append "  ... ($(( line_count - 50 )) lignes supplémentaires, utilisez -v pour tout voir)"
    fi
  fi

  append ""
  rm -f "$tmpfile"
}

# ─── Stryker (mutation testing) ─────────────────────────────────────

run_mutations() {
  append "${SEPARATOR}"
  append "${CYAN}${BOLD}▸ TESTS DE MUTATION (Stryker)${RESET}"
  append "${SEPARATOR}"

  local tmpfile
  tmpfile=$(mktemp)

  local exit_code=0
  npx stryker run 2>&1 > "$tmpfile" || exit_code=$?

  if $VERBOSE; then
    append ""
    append "$(cat "$tmpfile")"
    append ""
  fi

  # Extraire le score de mutation
  local mutation_score
  mutation_score=$(grep -oP "Mutation score:?\s*\K[\d.]+%" "$tmpfile" 2>/dev/null || true)

  # Extraire le résumé (killed, survived, etc.)
  local mutation_summary
  mutation_summary=$(grep -iE "(killed|survived|timeout|no coverage|mutants)" "$tmpfile" 2>/dev/null | tail -5 || true)

  # Mutants survivants (les plus importants à corriger)
  local survived
  survived=$(grep -A2 "Survived" "$tmpfile" 2>/dev/null | head -30 || true)

  if [[ $exit_code -eq 0 ]]; then
    append "${GREEN}✓ PASS${RESET}"
    ((TOTAL_PASS++))
  else
    append "${YELLOW}⚠ FAIL (exit code: $exit_code)${RESET}"
    ((TOTAL_FAIL++))
  fi

  if [[ -n "$mutation_score" ]]; then
    append ""
    append "Score de mutation: ${BOLD}$mutation_score${RESET}"
  fi

  if [[ -n "$mutation_summary" ]]; then
    append ""
    append "Résumé:"
    append "$mutation_summary"
  fi

  if [[ -n "$survived" ]] && [[ $exit_code -ne 0 ]]; then
    append ""
    append "${YELLOW}Mutants survivants (à investiguer):${RESET}"
    append "$survived"
  fi

  # Rappel du rapport HTML
  if [[ -d "reports/mutation" ]]; then
    append ""
    append "Rapport HTML: reports/mutation/html/index.html"
  fi

  append ""
  rm -f "$tmpfile"
}

# ─── Exécution ──────────────────────────────────────────────────────

$RUN_TESTS && run_tests
$RUN_KNIP && run_knip
$RUN_MUTATIONS && run_mutations

# ─── Résumé final ───────────────────────────────────────────────────

append "${SEPARATOR}"
append "${BOLD}RÉSUMÉ${RESET}"
append "${SEPARATOR}"
append ""
append "  ${GREEN}✓ Pass: $TOTAL_PASS${RESET}    ${RED}✗ Fail: $TOTAL_FAIL${RESET}"
append ""

if [[ $TOTAL_FAIL -eq 0 ]]; then
  append "${GREEN}${BOLD}Tout est OK ✓${RESET}"
else
  append "${RED}${BOLD}$TOTAL_FAIL vérification(s) en échec${RESET}"
fi

append ""

# ─── Output ─────────────────────────────────────────────────────────

if [[ -n "$OUTPUT_FILE" ]]; then
  # Strip ANSI pour le fichier
  echo -e "$REPORT" | sed 's/\x1b\[[0-9;]*m//g' > "$OUTPUT_FILE"
  echo "Rapport écrit dans: $OUTPUT_FILE"
else
  echo -e "$REPORT"
fi

# Exit code non-zero si au moins un échec
[[ $TOTAL_FAIL -eq 0 ]]
