terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state in S3 (partial configuration).
  #
  # The bucket/key/region/lock-table values are NOT hardcoded here — they
  # are supplied at `terraform init` time via -backend-config flags
  # (see .github/workflows/deploy.yml and README.md).
  #
  # Remote state is REQUIRED for the CI pipeline: without it, every
  # GitHub Actions run would start with empty state and try to create a
  # second copy of the whole infrastructure. Bootstrap the bucket once
  # with terraform/bootstrap (see README.md "Terraform state backend").
  backend "s3" {}
}
