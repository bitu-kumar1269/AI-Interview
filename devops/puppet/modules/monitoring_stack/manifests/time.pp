# @summary Time synchronisation: Nagios alerts are only as trustworthy as the clock.
#
# Dependency chain: Package[chrony] -> File[drop-in] ~> Service[chrony]
# (the ~> means the service restarts only when the file actually changes).
class monitoring_stack::time {
  file { '/etc/chrony/conf.d/aws-time-sync.conf':
    ensure  => file,
    owner   => 'root',
    group   => 'root',
    mode    => '0644',
    content => epp('monitoring_stack/aws-time-sync.conf.epp', {
      'time_server' => $monitoring_stack::time_server,
    }),
    require => Package['chrony'],
    notify  => Service['chrony'],
  }

  service { 'chrony':
    ensure  => running,
    enable  => true,
    require => Package['chrony'],
  }
}
