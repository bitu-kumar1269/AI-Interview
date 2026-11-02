provider "aws" {
  region = var.aws_region

  # Credentials are NEVER set here. Terraform uses the standard AWS
  # credential chain (aws configure / AWS_PROFILE / environment variables).
  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
      Purpose     = "devops-assignment-monitoring-lab"
    }
  }
}
