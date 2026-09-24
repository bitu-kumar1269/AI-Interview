variable "aws_region" {
  description = "AWS region to deploy into"
  type        = string
  default     = "ap-south-1" # change to whatever region your AWS account/free-tier is in
}

variable "instance_type" {
  description = "EC2 instance size"
  type        = string
  default     = "t2.micro" # free-tier eligible
}

variable "key_name" {
  description = "Name of an existing EC2 key pair in your AWS account (used for SSH)"
  type        = string
  default     = "devops-project-key" # create this key pair in the AWS console first, download the .pem
}

variable "backend_port" {
  description = "Port your Express backend listens on"
  type        = number
  default     = 5000
}
