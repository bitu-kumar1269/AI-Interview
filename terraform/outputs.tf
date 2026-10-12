output "ec2_public_ip" {
  description = "Elastic IP address of the application server."
  value       = aws_eip.app.public_ip
}

output "ec2_public_dns" {
  description = "Public DNS name of the EC2 instance."
  value       = aws_instance.app.public_dns
}

output "vpc_id" {
  description = "ID of the created VPC."
  value       = aws_vpc.main.id
}

output "security_group_id" {
  description = "ID of the application security group."
  value       = aws_security_group.app.id
}

output "instance_id" {
  description = "ID of the EC2 instance (useful for SSM, CloudWatch, etc.)."
  value       = aws_instance.app.id
}
