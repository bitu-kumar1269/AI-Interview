#!/usr/bin/env bash
# Generates a plan. NEVER applies. Needs AWS credentials + terraform/terraform.tfvars.
# shellcheck source=lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
need "$TF_BIN"; need aws "Install the AWS CLI (brew install awscli) and run 'aws configure'."
[ -f "$ROOT/terraform/terraform.tfvars" ] || die "terraform/terraform.tfvars not found. Copy terraform.tfvars.example and fill it in."
aws sts get-caller-identity >/dev/null 2>&1 || die "AWS credentials are missing or invalid. Run 'aws configure' (or set AWS_PROFILE)."
info "AWS identity: $(aws sts get-caller-identity --query Arn --output text)"
cd "$ROOT/terraform" || die "cannot cd to $ROOT/terraform"
"$TF_BIN" init -input=false
"$TF_BIN" plan -input=false -out=tfplan
info "Plan saved to terraform/tfplan. Review it, then apply YOURSELF with:"
echo "    cd terraform && $TF_BIN apply tfplan"
