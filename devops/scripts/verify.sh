#!/usr/bin/env bash
# Runs playbooks/verify.yml (read-only checks of services, ports, Nagios, Puppet and the app).
# shellcheck source=lib.sh
source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"
ASSUME_YES=1 exec "$(dirname "${BASH_SOURCE[0]}")/ansible-run.sh" verify "$@"
