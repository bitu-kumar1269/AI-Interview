#!/usr/bin/env bash
# Shared helpers. Sourced by the other scripts - not run directly.
set -euo pipefail

# shellcheck disable=SC2034  # ROOT is used by the scripts that source this file
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TF_BIN="${TF_BIN:-terraform}" # set TF_BIN=tofu to use OpenTofu instead

die()  { echo "ERROR: $*" >&2; exit 1; }
info() { echo "==> $*"; }
need() { command -v "$1" >/dev/null 2>&1 || die "'$1' is required but not installed. ${2:-}"; }

confirm() {
  # confirm "question" - skipped when ASSUME_YES=1
  [ "${ASSUME_YES:-0}" = "1" ] && return 0
  read -r -p "$1 [y/N] " answer
  [[ "$answer" =~ ^[Yy]$ ]] || die "Aborted by user."
}

# Adds the right vault flag for ansible-playbook (password file if provided, else prompt)
vault_args() {
  if [ -n "${ANSIBLE_VAULT_PASSWORD_FILE:-}" ]; then
    echo "--vault-password-file=${ANSIBLE_VAULT_PASSWORD_FILE}"
  else
    echo "--ask-vault-pass"
  fi
}
