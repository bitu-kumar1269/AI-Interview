# @summary Keeps the web server and Nagios daemon enabled and running.
class monitoring_stack::services {
  service { $monitoring_stack::services:
    ensure => running,
    enable => true,
  }

  # Each service needs its package installed first
  Package['apache2'] -> Service['apache2']
  Package['nagios4'] -> Service['nagios4']
}
