# @summary Installs every package the monitoring host needs.
class monitoring_stack::packages {
  package { $monitoring_stack::packages:
    ensure => installed,
  }
}
