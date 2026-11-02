# Masterless entry point. Ansible (roles/puppet) runs:
#   puppet apply manifests/site.pp --modulepath=modules
node default {
  include monitoring_stack
}
