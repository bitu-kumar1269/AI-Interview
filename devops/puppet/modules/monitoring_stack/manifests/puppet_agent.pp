# @summary This lab runs Puppet masterless (puppet apply), so the packaged
# agent daemon - which would try to contact a Puppet server - is kept off.
class monitoring_stack::puppet_agent {
  service { 'puppet':
    ensure => stopped,
    enable => false,
  }
}
