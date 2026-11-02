#!/usr/bin/env bash
# Terraform formatting + validation. Needs no AWS credentials.
# shellcheck source=lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
need "$TF_BIN" "Install Terraform (brew install terraform) or set TF_BIN=tofu."
cd "$ROOT/terraform" || die "cannot cd to $ROOT/terraform"
info "fmt -check";  "$TF_BIN" fmt -check -recursive
info "init (no backend, no credentials needed)"; "$TF_BIN" init -backend=false -input=false
info "validate";    "$TF_BIN" validate
info "Terraform validation passed."
