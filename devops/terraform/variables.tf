variable "aws_region" {
  description = "AWS region to deploy into."
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Prefix used for resource names."
  type        = string
  default     = "ai-interviewer"
}

variable "environment" {
  description = "Environment tag."
  type        = string
  default     = "lab"
}

variable "instance_type" {
  description = "EC2 instance type for the Nagios monitoring host. t3.micro (1 GiB) is enough for Nagios + Apache with the swap file Ansible creates; use t3.small if it feels slow."
  type        = string
  default     = "t3.micro"
}

variable "key_name" {
  description = "Name of an EXISTING EC2 key pair (Terraform does not create it, so no private key ever touches this repo)."
  type        = string
}

variable "ssh_private_key_path" {
  description = "Local path of the private key matching key_name (used only to print ssh/inventory helper text)."
  type        = string
  default     = "~/.ssh/ai-interviewer-key.pem"
}

variable "admin_cidr" {
  description = "CIDR allowed to SSH to the host, e.g. 203.0.113.4/32. Use YOUR_IP/32, never 0.0.0.0/0."
  type        = string

  validation {
    condition     = can(cidrhost(var.admin_cidr, 0))
    error_message = "admin_cidr must be a valid CIDR."
  }
}

variable "web_allowed_cidrs" {
  description = "Optional CIDRs allowed to reach the Nagios web UI on port 80. Leave empty (recommended) and use the SSH tunnel instead."
  type        = list(string)
  default     = []
}

variable "vpc_id" {
  description = "Existing VPC to use. Empty = the account's default VPC (reused, nothing new created)."
  type        = string
  default     = ""
}

variable "subnet_id" {
  description = "Existing public subnet to use. Empty = first subnet of the chosen VPC."
  type        = string
  default     = ""
}

variable "root_volume_size_gb" {
  description = "Root EBS volume size in GB."
  type        = number
  default     = 12
}
