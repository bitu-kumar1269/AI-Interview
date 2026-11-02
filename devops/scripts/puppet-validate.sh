#!/usr/bin/env bash
# Validates the Puppet code: syntax, templates, style, and a dry-run (--noop). Changes nothing.
# shellcheck source=lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
need puppet "Install Puppet (brew install --cask puppet-agent, or apt install puppet-agent on Ubuntu)."
cd "$ROOT/puppet" || die "cannot cd to $ROOT/puppet"
info "parser validate"
puppet parser validate manifests/site.pp modules/*/manifests/*.pp
info "epp validate"
puppet epp validate modules/*/templates/*.epp
if command -v puppet-lint >/dev/null 2>&1; then info "puppet-lint"; puppet-lint manifests modules
else echo "(puppet-lint not installed - skipping style check)"; fi
info "dry run: puppet apply --noop (exit 0 = compliant, 2 = changes WOULD be made)"
set +e; puppet apply --noop --detailed-exitcodes --modulepath=modules manifests/site.pp; rc=$?; set -e
case "$rc" in 0|2) info "Puppet validation passed (noop exit code $rc).";; *) die "Puppet noop run failed with exit code $rc.";; esac
