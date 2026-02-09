#!/usr/bin/env bash
set -euo pipefail

# quality-report.sh — Compact quality report optimized for LLM consumption (minimal tokens)
#
# Usage: ./scripts/quality-report.sh [OPTIONS]
#   -t  tests only (no coverage)    -c  tests + coverage (-c implies -t)
#   -k  knip (dead code)            -m  mutation testing (stryker)
#   -a  all (-t -c -k -m)           -v  verbose (full tool output)
#   -o FILE  write to file (ANSI stripped)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

RUN_TESTS=false RUN_COVERAGE=false RUN_KNIP=false RUN_MUTATIONS=false VERBOSE=false OUTPUT_FILE=""

while [[ $# -gt 0 ]]; do
  case $1 in
    -t|--tests)     RUN_TESTS=true; shift ;;
    -c|--coverage)  RUN_COVERAGE=true; shift ;;
    -k|--knip)      RUN_KNIP=true; shift ;;
    -m|--mutations) RUN_MUTATIONS=true; shift ;;
    -a|--all)       RUN_TESTS=true; RUN_COVERAGE=true; RUN_KNIP=true; RUN_MUTATIONS=true; shift ;;
    -v|--verbose)   VERBOSE=true; shift ;;
    -o|--output)    OUTPUT_FILE="$2"; shift 2 ;;
    -h|--help)      echo "-t tests  -c coverage  -k knip  -m mutations  -a all  -v verbose  -o file"; exit 0 ;;
    *) echo "Unknown: $1"; exit 1 ;;
  esac
done

$RUN_COVERAGE && RUN_TESTS=true

if ! $RUN_TESTS && ! $RUN_KNIP && ! $RUN_MUTATIONS; then
  echo "Specify at least: -t, -c, -k, -m, or -a"; exit 1
fi

REPORT="" CHECKS_RUN=0 CHECKS_FAIL=0
append() { REPORT+="$1"$'\n'; }

append "QUALITY REPORT — sebc.dev — $(date '+%Y-%m-%d %H:%M')"

# ── Tests (Vitest) ──────────────────────────────────────────

run_tests() {
  local tmp
  tmp=$(mktemp)
  local args="run --reporter=verbose"
  $RUN_COVERAGE && args="run --coverage --reporter=verbose"

  local rc=0
  # shellcheck disable=SC2086
  npx vitest $args > "$tmp" 2>&1 || rc=$?

  # Known Vite issue: "close timed out" exits non-zero even when tests pass
  [[ $rc -ne 0 ]] && grep -q "Tests closed successfully" "$tmp" 2>/dev/null && rc=0

  $VERBOSE && { append ""; append "[VITEST RAW]"; append "$(cat "$tmp")"; append "[/VITEST RAW]"; }

  ((CHECKS_RUN++)) || true
  local label="TESTS"
  $RUN_COVERAGE && label="TESTS + COVERAGE"

  append ""
  if [[ $rc -eq 0 ]]; then
    append "[$label] PASS"
  else
    append "[$label] FAIL"
    ((CHECKS_FAIL++)) || true
  fi

  # Summary counts
  local counts
  counts=$(grep -E "^\s*(Test Files|Tests\s|Duration)" "$tmp" | sed 's/^[[:space:]]*/  /' | grep -v "Tests closed" || true)
  [[ -n "$counts" ]] && append "$counts"

  # Per-file results (use awk to avoid pipe/grep-c issues)
  local per_file
  per_file=$(awk '
    /✓/ || /×/ {
      match($0, /src\/[^ ]+\.test\.ts/, m)
      if (m[0] != "") {
        if (/✓/) pass[m[0]]++
        if (/×/) fail[m[0]]++
      }
    }
    END {
      for (f in pass) if (!(f in seen)) { seen[f]=1; files[++n]=f }
      for (f in fail) if (!(f in seen)) { seen[f]=1; files[++n]=f }
      asort(files)
      for (i=1; i<=length(files); i++) {
        f = files[i]; p = (f in pass) ? pass[f] : 0; x = (f in fail) ? fail[f] : 0
        if (x > 0) printf "    FAIL %s (%d passed, %d failed)\n", f, p, x
        else printf "    OK   %s (%d passed)\n", f, p
      }
    }
  ' "$tmp" || true)
  if [[ -n "$per_file" ]]; then
    append "  Per file:"
    append "$per_file"
  fi

  # Failed tests — names + assertion details
  local failures
  failures=$(grep -E "^\s*×" "$tmp" 2>/dev/null | sed 's/^[[:space:]]*/    /' || true)
  if [[ -n "$failures" ]]; then
    append "  Failures:"
    append "$failures"
    local errors
    errors=$(grep -E "(Expected|Received|AssertionError|expect\()" "$tmp" \
      | head -20 | sed 's/^[[:space:]]*/      /' || true)
    [[ -n "$errors" ]] && append "$errors"
  fi

  # Coverage
  if $RUN_COVERAGE; then
    append "  Coverage:"

    # All files summary
    local all_cov
    all_cov=$(grep "^All files" "$tmp" || true)
    if [[ -n "$all_cov" ]]; then
      local s b fn l
      s=$(echo "$all_cov" | awk -F'|' '{gsub(/ /,"",$2); print $2}')
      b=$(echo "$all_cov" | awk -F'|' '{gsub(/ /,"",$3); print $3}')
      fn=$(echo "$all_cov" | awk -F'|' '{gsub(/ /,"",$4); print $4}')
      l=$(echo "$all_cov" | awk -F'|' '{gsub(/ /,"",$5); print $5}')
      append "    All: ${s}% stmt | ${b}% branch | ${fn}% func | ${l}% line"
    fi

    # Parse coverage table: tested files (stmts>0) with uncovered lines + count untested
    local cov_result
    cov_result=$(awk -F'|' '
      /^-+\|/ { sep++; next }
      sep >= 1 && NF >= 5 {
        name = $1; gsub(/^[ ]+|[ ]+$/, "", name)
        if (name == "File" || name == "All files") next
        if (name !~ /\./) next
        stmts = $2 + 0
        if (stmts == 0) { untested++; next }
        branch = $3 + 0; funcs = $4 + 0; lines = $5 + 0
        uncov = ""; if (NF >= 6) { uncov = $6; gsub(/^[ ]+|[ ]+$/, "", uncov) }
        gsub(/^\.+/, "", name)
        printf "      %-22s %5g%% stmt | %5g%% branch | %5g%% func | %5g%% line", name, stmts, branch, funcs, lines
        if (uncov != "") printf " | uncovered: L%s", uncov
        printf "\n"
      }
      END { printf "UNTESTED:%d\n", untested + 0 }
    ' "$tmp" || true)

    local tested untested_n
    tested=$(echo "$cov_result" | grep -v "^UNTESTED:" || true)
    untested_n=$(echo "$cov_result" | grep -oP '(?<=UNTESTED:)\d+' || echo 0)

    if [[ -n "$tested" ]]; then
      append "    Tested:"
      append "$tested"
    fi
    [[ "$untested_n" -gt 0 ]] && append "    Untested: ${untested_n} files (components, layouts, pages)"
  fi

  rm -f "$tmp"
}

# ── Knip (dead code) ────────────────────────────────────────

run_knip() {
  local tmp
  tmp=$(mktemp)

  local rc=0
  npx knip > "$tmp" 2>&1 || rc=$?

  $VERBOSE && { append ""; append "[KNIP RAW]"; append "$(cat "$tmp")"; append "[/KNIP RAW]"; }

  ((CHECKS_RUN++)) || true
  append ""

  if [[ $rc -eq 0 ]]; then
    append "[KNIP] PASS — no dead code"
  else
    append "[KNIP] FAIL — dead code detected"
    ((CHECKS_FAIL++)) || true

    # Show full knip output (compact, all actionable)
    local content
    content=$(sed 's/^/    /' "$tmp" || true)
    local line_count
    line_count=$(wc -l < "$tmp")

    if [[ $line_count -le 60 ]]; then
      append "$content"
    else
      append "$(head -60 "$tmp" | sed 's/^/    /')"
      append "    ... (+$(( line_count - 60 )) more lines, use -v for full output)"
    fi
  fi

  rm -f "$tmp"
}

# ── Stryker (mutation testing) ──────────────────────────────

run_mutations() {
  local tmp
  tmp=$(mktemp)

  local rc=0
  npx stryker run > "$tmp" 2>&1 || rc=$?

  $VERBOSE && { append ""; append "[STRYKER RAW]"; append "$(cat "$tmp")"; append "[/STRYKER RAW]"; }

  ((CHECKS_RUN++)) || true
  append ""

  if [[ $rc -eq 0 ]]; then
    append "[MUTATIONS] PASS"
  else
    append "[MUTATIONS] FAIL"
    ((CHECKS_FAIL++)) || true
  fi

  # Mutation score
  local score
  score=$(grep -oP "Mutation score:?\s*\K[\d.]+%" "$tmp" || true)
  [[ -n "$score" ]] && append "  Score: $score"

  # Summary stats
  local stats
  stats=$(grep -iE "^\s*(Killed|Survived|Timeout|No coverage|NoCoverage)" "$tmp" | head -10 | sed 's/^[[:space:]]*/    /' || true)
  if [[ -n "$stats" ]]; then
    append "  Stats:"
    append "$stats"
  fi

  # Survived mutants — the actionable items
  local survived
  survived=$(grep -B1 -A2 "Survived" "$tmp" | grep -vE "^(--|Survived)" | head -30 | sed 's/^[[:space:]]*/    /' || true)
  if [[ -n "$survived" ]]; then
    append "  Survived mutants (action needed):"
    append "$survived"
  fi

  [[ -d "reports/mutation" ]] && append "  HTML report: reports/mutation/html/index.html"

  rm -f "$tmp"
}

# ── Run ─────────────────────────────────────────────────────

$RUN_TESTS && run_tests
$RUN_KNIP && run_knip
$RUN_MUTATIONS && run_mutations

# ── Result ──────────────────────────────────────────────────

append ""
passed=$((CHECKS_RUN - CHECKS_FAIL))
if [[ $CHECKS_FAIL -eq 0 ]]; then
  append "RESULT: ${CHECKS_RUN}/${CHECKS_RUN} passed"
else
  append "RESULT: ${passed}/${CHECKS_RUN} passed, ${CHECKS_FAIL} failed"
fi

# ── Output ──────────────────────────────────────────────────

if [[ -n "$OUTPUT_FILE" ]]; then
  echo "$REPORT" | sed 's/\x1b\[[0-9;]*m//g' > "$OUTPUT_FILE"
  echo "Written to: $OUTPUT_FILE"
else
  echo "$REPORT"
fi

[[ $CHECKS_FAIL -eq 0 ]]
