#!/usr/bin/env bash
# Runs a playbook against the monitoring host.
# Usage: scripts/ansible-run.sh [playbook-name] [extra ansible-playbook args]
#   scripts/ansible-run.sh                 # site.yml (everything)
#   scripts/ansible-run.sh puppet --check  # dry run of one playbook
# Set ASSUME_YES=1 to skip the confirmation prompt. ANSIBLE_VAULT_PASSWORD_FILE avoids the vault prompt.
# shellcheck source=lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
need ansible-playbook "Install Ansible (brew install ansible)."
pb="${1:-site}"; [ $# -gt 0 ] && shift
cd "$ROOT/ansible" || die "cannot cd to $ROOT/ansible"
[ -f "playbooks/$pb.yml" ] || die "playbooks/$pb.yml does not exist."
[ -f inventory/hosts.ini ] || die "inventory/hosts.ini missing - run scripts/gen-inventory.sh first."
[ -f inventory/group_vars/all/vault.yml ] || die "inventory/group_vars/all/vault.yml missing - copy vault.yml.example, set the password, run 'ansible-vault encrypt' on it."
confirm "Run playbooks/$pb.yml against the hosts in inventory/hosts.ini?"
ansible-playbook "playbooks/$pb.yml" "$(vault_args)" "$@"
