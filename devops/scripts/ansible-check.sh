#!/usr/bin/env bash
# Syntax-check (and lint, if installed) every playbook. Add --ping to also test SSH connectivity.
# shellcheck source=lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
need ansible-playbook "Install Ansible (brew install ansible)."
cd "$ROOT/ansible" || die "cannot cd to $ROOT/ansible"
tmp_inv=""; inv=(); [ -f inventory/hosts.ini ] || { tmp_inv="$(mktemp)"; printf '[monitoring]\nlocalhost\n' > "$tmp_inv"; inv=(-i "$tmp_inv"); }
trap '[ -z "$tmp_inv" ] || rm -f "$tmp_inv"' EXIT
for pb in common puppet monitoring verify site; do
  info "syntax-check playbooks/$pb.yml"
  ansible-playbook "${inv[@]}" "playbooks/$pb.yml" --syntax-check
done
if command -v ansible-lint >/dev/null 2>&1; then info "ansible-lint"; ansible-lint playbooks/ roles/
else echo "(ansible-lint not installed - skipping lint)"; fi
if [ "${1:-}" = "--ping" ]; then
  [ -f inventory/hosts.ini ] || die "inventory/hosts.ini missing - run scripts/gen-inventory.sh first."
  info "SSH connectivity"; ansible monitoring -m ansible.builtin.ping
fi
info "Ansible checks passed."
