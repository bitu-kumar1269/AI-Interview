# terraform/bootstrap — ONE-TIME setup for remote Terraform state.
#
# This is deliberately a SEPARATE, tiny Terraform config from the main
# one. Run this once, manually, with local state, BEFORE the main config
# is initialized with its S3 backend. Trying to have the main config
# create its own remote state bucket would be a circular dependency
# (it would need the bucket to exist before it could even initialize).
#
# Usage (one-time):
#   cd terraform/bootstrap
#   terraform init
#   terraform apply -var="bucket_name=ai-interviewer-tfstate-<pick-a-unique-suffix>"
#
# Then add the bucket name as the TF_STATE_BUCKET GitHub Secret. The
# deploy workflow passes it to `terraform init` via -backend-config, so
# nothing needs to be edited or uncommented in ../versions.tf.
# (For local runs against the same state, see README.md.)

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "bucket_name" {
  description = "Globally-unique S3 bucket name for Terraform state."
  type        = string
}

variable "lock_table_name" {
  description = "DynamoDB table name for Terraform state locking."
  type        = string
  default     = "ai-interviewer-tf-lock"
}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "tfstate" {
  bucket = var.bucket_name

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "tfstate" {
  bucket                  = aws_s3_bucket.tfstate.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_dynamodb_table" "tf_lock" {
  name         = var.lock_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }
}

output "bucket_name" {
  value = aws_s3_bucket.tfstate.bucket
}

output "lock_table_name" {
  value = aws_dynamodb_table.tf_lock.name
}
