# app.pp
# Puppet manifest demonstrating configuration management (Unit I & II).
# Run on the deployed EC2 instance with: sudo puppet apply app.pp
#
# While Ansible handles the actual deployment steps, this manifest shows
# Puppet's declarative resource model: ensuring required packages exist
# and that key services (Nginx, Redis) stay running, independent of how
# they got installed. This is the piece to show for CO1/CO2.

package { 'nginx':
  ensure => installed,
}

package { 'redis-server':
  ensure => installed,
}

package { 'git':
  ensure => installed,
}

service { 'nginx':
  ensure  => running,
  enable  => true,
  require => Package['nginx'],
}

service { 'redis-server':
  ensure  => running,
  enable  => true,
  require => Package['redis-server'],
}

# Visual proof for the demo: a banner showing the box is Puppet-managed
file { '/etc/motd':
  ensure  => file,
  content => "Managed by Puppet - AI-Interviewer App Server\n",
}

# Demonstrates Facter + Puppet working together: logs each run
exec { 'log-puppet-run':
  command => "/bin/sh -c 'echo Puppet run at $(date) >> /var/log/puppet-runs.log'",
  path    => ['/bin', '/usr/bin'],
}
