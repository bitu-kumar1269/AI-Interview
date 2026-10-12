variable "aws_region" {
  description = "AWS region to deploy into."
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Short project name, used as a prefix for resource names/tags."
  type        = string
  default     = "ai-interviewer"
}

variable "environment" {
  description = "Deployment environment name (e.g. dev, staging, prod)."
  type        = string
  default     = "dev"
}

variable "instance_type" {
  description = <<-EOT
    EC2 instance type. Default is a low-cost development size.
    This app runs Node.js + Socket.IO + Redis + Nginx on one box — for
    anything beyond light demo/dev traffic, consider t3.small or larger.
  EOT
  type        = string
  default     = "t3.micro"
}

variable "ssh_key_name" {
  description = "Name of an EXISTING AWS EC2 key pair (create this in the AWS Console or via `aws ec2 create-key-pair` first — Terraform does not create it for you, so your private key never has to touch this repo)."
  type        = string
}

variable "allowed_ssh_cidr" {
  description = <<-EOT
    CIDR block allowed to SSH into the instance (port 22).
    Set this to YOUR_IP/32, not 0.0.0.0/0. Find your IP with
    `curl ifconfig.me` and append /32.
    This is for YOUR manual access. The CI pipeline does not use this
    rule: deploy.yml temporarily authorizes the GitHub runner's IP on
    port 22 for the Ansible step and revokes it afterwards (always).
  EOT
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "CIDR block for the public subnet."
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "Optional availability zone override. Leave empty to use the first available AZ in the chosen region."
  type        = string
  default     = ""
}

variable "root_volume_size_gb" {
  description = "Root EBS volume size in GB."
  type        = number
  default     = 20
}
