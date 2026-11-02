#!/usr/bin/env bash
# Validates the Nagios config with Nagios' own pre-flight checker (nagios4 -v).
# Works on an Ubuntu machine with the nagios4 package, otherwise falls back to Docker.
# It works on a COPY of /etc/nagios4, so it never touches a real installation.
# shellcheck source=lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

run_native() {
  need nagios4 "Install: sudo apt install nagios4 monitoring-plugins-basic monitoring-plugins-standard"
  [ -d /etc/nagios4 ] || die "/etc/nagios4 not found - is the nagios4 package installed?"
  [ "$(id -u)" -eq 0 ] || die "Run with sudo - this needs to read /etc/nagios4 (it only reads; nothing there is modified)."
  work="$(mktemp -d)"; trap 'rm -rf "$work"' EXIT
  chmod 755 "$work"                       # Nagios drops to the 'nagios' user while verifying
  cp -a /etc/nagios4 "$work/nagios4"
  # Point the copy at itself and mimic what Ansible does on the real host
  sed -i "s|/etc/nagios4|$work/nagios4|g; s|^cfg_file=.*objects/localhost.cfg|#&|" "$work/nagios4/nagios.cfg"
  cp "$ROOT/nagios/hosts.cfg"    "$work/nagios4/conf.d/ai-interviewer-hosts.cfg"
  cp "$ROOT/nagios/services.cfg" "$work/nagios4/conf.d/ai-interviewer-services.cfg"
  cp "$ROOT/nagios/commands.cfg" "$work/nagios4/conf.d/ai-interviewer-commands.cfg"
  # contacts.cfg.j2 is an Ansible template: fill the placeholders for validation
  sed -E 's/\{\{[^}]*\}\}/admin@example.com/g' "$ROOT/nagios/contacts.cfg.j2" > "$work/nagios4/conf.d/ai-interviewer-contacts.cfg"
  chmod -R a+rX "$work"                   # temp copy only; deleted on exit
  info "nagios4 -v"; nagios4 -v "$work/nagios4/nagios.cfg"
  info "check_mem.sh syntax"; bash -n "$ROOT/nagios/scripts/check_mem.sh"
  info "Nagios validation passed."
}

if [ "${1:-}" = "--inside-container" ]; then run_native; exit 0; fi
if command -v nagios4 >/dev/null 2>&1 && [ -d /etc/nagios4 ]; then run_native; exit 0; fi
need docker "No local nagios4 found. Install Docker Desktop, or run this on an Ubuntu host with the nagios4 package."
info "No local Nagios - validating inside an Ubuntu 24.04 container (first run downloads packages)."
docker run --rm -v "$ROOT:/devops:ro" ubuntu:24.04 bash -c \
  'export DEBIAN_FRONTEND=noninteractive; apt-get update -qq >/dev/null && apt-get install -y -qq nagios4 monitoring-plugins-basic monitoring-plugins-standard >/dev/null && /devops/scripts/nagios-validate.sh --inside-container'
