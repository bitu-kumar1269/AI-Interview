#!/usr/bin/env bash
# Terraform -> Ansible hand-off: writes ansible/inventory/hosts.ini from Terraform outputs.
# shellcheck source=lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
need "$TF_BIN"
out="$ROOT/ansible/inventory/hosts.ini"
# NOTE: some Terraform/OpenTofu versions print "No outputs found" as a WARNING on stdout
# and still exit 0, so the exit code alone is not trustworthy - validate the content.
content="$("$TF_BIN" -chdir="$ROOT/terraform" output -no-color -raw ansible_inventory 2>/dev/null)" || content=""
if ! grep -q '^\[monitoring\]' <<<"$content" \
   || ! grep -Eq 'ansible_host=[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' <<<"$content"; then
  die "Terraform has no valid 'ansible_inventory' output yet. Run 'terraform apply' first (inventory/hosts.ini was NOT touched)."
fi
printf '%s\n' "$content" > "$out"
info "Wrote $out"; cat "$out"
