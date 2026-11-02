output "instance_id" {
  description = "EC2 instance ID."
  value       = aws_instance.monitoring.id
}

output "public_ip" {
  description = "Public IP of the monitoring host (changes if the instance is stopped/started - no Elastic IP is used, to avoid its hourly charge)."
  value       = aws_instance.monitoring.public_ip
}

output "public_dns" {
  description = "Public DNS name."
  value       = aws_instance.monitoring.public_dns
}

output "security_group_id" {
  description = "Security group ID."
  value       = aws_security_group.monitoring.id
}

output "ssh_command" {
  description = "Command to SSH into the host."
  value       = "ssh -i ${var.ssh_private_key_path} ubuntu@${aws_instance.monitoring.public_ip}"
}

output "nagios_tunnel_command" {
  description = "Secure access to the Nagios web UI via SSH tunnel, then open http://localhost:8080/nagios4/"
  value       = "ssh -i ${var.ssh_private_key_path} -N -L 8080:localhost:80 ubuntu@${aws_instance.monitoring.public_ip}"
}

# Consumed by scripts/gen-inventory.sh -> ansible/inventory/hosts.ini
output "ansible_inventory" {
  description = "Ready-to-use Ansible inventory (the Terraform -> Ansible hand-off)."
  value       = <<-EOT
    [monitoring]
    monitor-host ansible_host=${aws_instance.monitoring.public_ip} ansible_user=ubuntu ansible_ssh_private_key_file=${var.ssh_private_key_path}
  EOT
}
