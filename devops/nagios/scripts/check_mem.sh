#!/usr/bin/env bash
# check_mem - Nagios plugin: memory usage in percent (based on MemAvailable).
#
# Usage:   check_mem -w <warn_pct_used> -c <crit_pct_used>
# Example: check_mem -w 80 -c 90
# Exit:    0 OK | 1 WARNING | 2 CRITICAL | 3 UNKNOWN
#
# For safe demonstrations, MEMINFO_FILE can point at a fake meminfo file.

set -u
readonly OK=0 WARNING=1 CRITICAL=2 UNKNOWN=3
warn=80
crit=90

usage() {
  echo "Usage: ${0##*/} -w <warn_pct_used> -c <crit_pct_used>"
  exit "$UNKNOWN"
}

while getopts "w:c:h" opt; do
  case "$opt" in
    w) warn="$OPTARG" ;;
    c) crit="$OPTARG" ;;
    *) usage ;;
  esac
done

is_int() { [[ "$1" =~ ^[0-9]+$ ]]; }
if ! is_int "$warn" || ! is_int "$crit" || [ "$warn" -ge "$crit" ] || [ "$crit" -gt 100 ]; then
  echo "MEMORY UNKNOWN - thresholds must be integers with warn < crit <= 100"
  exit "$UNKNOWN"
fi

meminfo="${MEMINFO_FILE:-/proc/meminfo}"
total_kb=$(awk '/^MemTotal:/ {print $2}' "$meminfo" 2>/dev/null)
avail_kb=$(awk '/^MemAvailable:/ {print $2}' "$meminfo" 2>/dev/null)

if ! is_int "${total_kb:-}" || ! is_int "${avail_kb:-}" || [ "$total_kb" -eq 0 ]; then
  echo "MEMORY UNKNOWN - could not read MemTotal/MemAvailable from $meminfo"
  exit "$UNKNOWN"
fi

used_pct=$(awk -v t="$total_kb" -v a="$avail_kb" 'BEGIN { printf "%.1f", (t - a) * 100 / t }')
used_mb=$(( (total_kb - avail_kb) / 1024 ))
total_mb=$(( total_kb / 1024 ))
perf="mem_used_pct=${used_pct}%;${warn};${crit};0;100"

over() { awk -v u="$used_pct" -v l="$1" 'BEGIN { exit !(u >= l) }'; }

if over "$crit"; then
  echo "MEMORY CRITICAL - ${used_pct}% used (${used_mb} MB of ${total_mb} MB) | ${perf}"
  exit "$CRITICAL"
elif over "$warn"; then
  echo "MEMORY WARNING - ${used_pct}% used (${used_mb} MB of ${total_mb} MB) | ${perf}"
  exit "$WARNING"
fi
echo "MEMORY OK - ${used_pct}% used (${used_mb} MB of ${total_mb} MB) | ${perf}"
exit "$OK"
