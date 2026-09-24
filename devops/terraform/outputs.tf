output "instance_public_ip" {
  description = "Public IP of the EC2 instance - use this for SSH, Ansible, and to demo the app"
  value       = aws_instance.app_server.public_ip
}

output "instance_id" {
  value = aws_instance.app_server.id
}
