# @summary Enforces the monitoring host's packages, services and time sync.
#
# OWNERSHIP (so Puppet and Ansible never fight over a resource):
#   Puppet  : monitoring packages, apache2/nagios4/chrony service state,
#             the chrony drop-in config, disabling the unused puppet agent daemon.
#   Ansible : installing puppet-agent itself, Nagios object files in conf.d,
#             the Nagios web login file, msmtp credentials, OS baseline, swap.
#
# @param packages    Packages that must be installed.
# @param services    Services that must be enabled and running (chrony is
#                    handled in monitoring_stack::time together with its config).
# @param time_server NTP source written to the chrony drop-in. The default is
#                    the Amazon Time Sync Service (link-local, EC2 only).
class monitoring_stack (
  Array[String] $packages    = [
    'apache2',
    'nagios4',
    'monitoring-plugins-basic',
    'monitoring-plugins-standard',
    'msmtp-mta',
    'bsd-mailx',
    'chrony',
  ],
  Array[String] $services    = ['apache2', 'nagios4'],
  String        $time_server = '169.254.169.123',
) {
  if $facts['os']['name'] != 'Ubuntu' {
    fail("monitoring_stack supports Ubuntu only (found ${facts['os']['name']})")
  }

  contain monitoring_stack::packages
  contain monitoring_stack::time
  contain monitoring_stack::services
  contain monitoring_stack::puppet_agent

  # Packages first, then config, then services
  Class['monitoring_stack::packages']
  -> Class['monitoring_stack::time']
  -> Class['monitoring_stack::services']
}
