# ── Reuse existing networking (no new VPC, NAT gateway or load balancer) ──

data "aws_vpc" "default" {
  count   = var.vpc_id == "" ? 1 : 0
  default = true
}

data "aws_subnets" "selected" {
  count = var.subnet_id == "" ? 1 : 0

  filter {
    name   = "vpc-id"
    values = [local.vpc_id]
  }
}

locals {
  vpc_id    = var.vpc_id != "" ? var.vpc_id : data.aws_vpc.default[0].id
  subnet_id = var.subnet_id != "" ? var.subnet_id : sort(data.aws_subnets.selected[0].ids)[0]
}

# ── AMI: latest Canonical Ubuntu 24.04 LTS ──
# Chosen because Ubuntu 24.04 ships nagios4 and puppet-agent in its own
# repositories (Amazon Linux 2023 has no Nagios package).

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"] # Canonical

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd-gp3/ubuntu-noble-24.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# ── Security group: SSH from the admin only; web UI closed by default ──

resource "aws_security_group" "monitoring" {
  name        = "${var.project_name}-monitoring-sg"
  description = "Nagios monitoring host - SSH from admin only"
  vpc_id      = local.vpc_id

  ingress {
    description = "SSH (admin only)"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.admin_cidr]
  }

  dynamic "ingress" {
    for_each = var.web_allowed_cidrs
    content {
      description = "Nagios web UI (optional)"
      from_port   = 80
      to_port     = 80
      protocol    = "tcp"
      cidr_blocks = [ingress.value]
    }
  }

  egress {
    description = "All outbound (package installs, HTTP checks of the app)"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = { Name = "${var.project_name}-monitoring-sg" }
}

# ── IAM: instance role with SSM access (a no-open-port alternative to SSH) ──

resource "aws_iam_role" "monitoring" {
  name = "${var.project_name}-monitoring-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "ssm" {
  role       = aws_iam_role.monitoring.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "monitoring" {
  name = "${var.project_name}-monitoring-profile"
  role = aws_iam_role.monitoring.name
}

# ── The monitoring host ──

resource "aws_instance" "monitoring" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = var.instance_type
  subnet_id                   = local.subnet_id
  vpc_security_group_ids      = [aws_security_group.monitoring.id]
  key_name                    = var.key_name
  iam_instance_profile        = aws_iam_instance_profile.monitoring.name
  associate_public_ip_address = true

  metadata_options {
    http_endpoint = "enabled"
    http_tokens   = "required" # IMDSv2 only
  }

  root_block_device {
    volume_size = var.root_volume_size_gb
    volume_type = "gp3"
    encrypted   = true
  }

  tags = {
    Name = "${var.project_name}-monitoring"
    Role = "nagios-monitoring"
  }

  lifecycle {
    # A newer Ubuntu AMI being published must not destroy/recreate the host
    ignore_changes = [ami]
  }
}
