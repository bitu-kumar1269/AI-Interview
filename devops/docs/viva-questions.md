# Viva questions and answers

## A. Infrastructure as Code and Terraform
**Q1. What is Infrastructure as Code and why use it?**
Describing infrastructure in version-controlled files instead of clicking in a console. It is reproducible, reviewable (diffs/PRs), repeatable across environments, and documents itself. Here, one `terraform apply` recreates the monitoring host exactly.

**Q2. Declarative vs imperative?**
Terraform is *declarative*: you state the desired end state and it computes the steps. A shell script is *imperative*: you list steps. Declarative tools can compare desired vs actual and only change the difference.

**Q3. What do `init`, `plan`, `apply`, `destroy` do?**
`init` downloads providers/configures the backend. `plan` shows what would change without changing anything. `apply` performs the changes. `destroy` removes everything the state tracks. In this lab `plan` is scripted; `apply`/`destroy` are always manual.

**Q4. What is Terraform state and why protect it?**
A file mapping your configuration to real resources. It can contain sensitive infrastructure details, so it is gitignored; for teams it belongs in a remote, versioned, encrypted backend with locking (see `backend.s3.tf.example`).

**Q5. How does Terraform hand information to Ansible here?**
The `ansible_inventory` output contains the instance's public IP, user and key path; `scripts/gen-inventory.sh` writes it to `inventory/hosts.ini`. The script validates the content because Terraform can print a warning and still exit 0 — I hit exactly that bug while testing.

**Q6. Which design choices cut cost and risk?**
Reuses the default VPC (no new network), no NAT gateway/load balancer/Elastic IP, `t3.micro`, SSH restricted to one CIDR (validation rejects `0.0.0.0/0`), IMDSv2 required, encrypted volume, `ignore_changes = [ami]` so a new AMI never forces a rebuild.

## B. Ansible
**Q7. What is Ansible and why agentless?**
A configuration-management/orchestration tool that connects over SSH and runs modules; nothing to install on the target except Python. Simple to bootstrap a fresh EC2 instance.

**Q8. What is idempotency? Show it.**
Running a task repeatedly leaves the system in the same state and reports no change after the first run. I ran each role twice: run 1 changed resources, run 2 reported `changed=0`.

**Q9. What are handlers?**
Tasks that run only when notified by a change, and once at the end of the play. Example: reload Nagios only if a config file actually changed.

**Q10. How do you protect a bad config from breaking monitoring?**
The role runs `nagios4 -v` *before* the reload handler. If validation fails the play stops and the handler never runs, so the running daemon keeps its old config. I confirmed the task/handler order from the run log.

**Q11. How are secrets handled?**
Ansible Vault encrypts `vault.yml`; tasks that render secrets use `no_log: true`; the vault file is gitignored; the rendered `msmtprc` is `0600`.

**Q12. Roles vs playbooks?**
Playbooks orchestrate; roles package reusable tasks/templates/handlers (`common`, `puppet`, `nagios`). `site.yml` imports the playbooks in dependency order.

**Q13. Why `ansible-lint`?**
Static analysis for best practices (FQCN modules, explicit `changed_when`, file modes, naming). It also caught real issues, e.g. an undeclared collection dependency and a `systemctl` shell-out that should use the `systemd` module.

## C. Puppet
**Q14. What is Puppet and how does it differ from Ansible?**
Puppet is declarative with a resource/catalog model and is designed for *continuous enforcement* (re-applies and repairs drift). Ansible is procedural/ordered and push-based, ideal for orchestration. Here Ansible bootstraps and Puppet keeps selected resources compliant.

**Q15. Masterless vs master/agent?**
Masterless uses `puppet apply` locally: no server to run or secure, cheaper for a one-host lab. Master/agent centralises catalogs, Hiera data and reporting at scale.

**Q16. Explain the resource dependency chain in your module.**
`Package[chrony] -> File[chrony drop-in] ~> Service[chrony]`. `->` means ordering; `~>` means the service refreshes (restarts) only when the file changes. I demonstrated it: deleting the file made Puppet restore it and trigger a refresh.

**Q17. How do you avoid Puppet and Ansible fighting?**
A strict ownership table: Puppet owns packages/services/chrony; Ansible owns Nagios object files, login, mail relay, `puppet-agent` itself. No resource appears in both.

**Q18. How did you validate Puppet?**
`puppet parser validate`, `puppet epp validate`, `puppet-lint`, `puppet apply --noop` (dry run), then a real apply twice (second run exit code 0 = idempotent).

**Q19. What do the exit codes of `--detailed-exitcodes` mean?**
0 = no changes, 2 = changes made/would be made, 4 = failures, 6 = changes and failures. Ansible maps `rc==2` to "changed".

## D. Nagios and monitoring
**Q20. What is Nagios? Active vs passive checks?**
A monitoring engine that runs plugins on a schedule and tracks state (OK/WARNING/CRITICAL/UNKNOWN). Active checks are initiated by Nagios (all of mine); passive checks are submitted by external systems.

**Q21. Soft vs hard states?**
A failure is a *soft* state until `max_check_attempts` consecutive failures, then *hard* — only hard state changes send notifications. This suppresses flapping and Render cold-start blips.

**Q22. How do plugins communicate?**
By exit code (0/1/2/3) and one line of text, optionally with `| perfdata`. My `check_mem` plugin was tested in all four states.

**Q23. What do you monitor and why those thresholds?**
Host: SSH, load, memory, disk, Nagios process, UI port. App: HTTPS reachability/latency, `/api/health`, TLS certificate expiry. Thresholds are sized for a 2-vCPU, 1 GiB host; app timeouts are generous because Render's free tier sleeps.

**Q24. Why is the health check a regex, not an exact string?**
Testing showed an exact `"success":true` match fails on `"success": true` (a space). A whitespace-tolerant regex avoids false alarms from JSON formatting changes.

**Q25. A security finding from your testing?**
Ubuntu's default Nagios Apache config has *no login* — private-IP clients get full access and `cmd.cgi` is `Require all granted`; my first version wrote a password file that nothing used. My own "Web UI requires login" check caught it (HTTP 200 instead of 401). The role now adds a Digest-auth drop-in and `use_authentication=1`; verified 401/401/200.

**Q26. How are alerts and recovery handled?**
Contact `ai-admin` receives host `d,u,r` and service `w,u,c,r` notifications (`r` = recovery) via the `msmtp` relay once SMTP credentials are set.

## E. Integration and general
**Q27. Walk through the end-to-end flow.**
Terraform creates the host → output feeds the inventory → Ansible sets the baseline, installs Puppet → Puppet installs/enforces Nagios packages and services → Ansible deploys and validates Nagios config → Nagios monitors host + live app → `verify.yml` asserts it all.

**Q28. Configuration management vs provisioning?**
Provisioning creates infrastructure (Terraform); configuration management sets up and maintains what runs on it (Ansible/Puppet).

**Q29. What was not tested and why?**
`terraform validate/plan/apply` against AWS, Ansible over SSH to EC2, and checks against the live Render URLs — they need AWS credentials/network I did not have. They are listed in the README and must be run by you.

**Q30. Limitations / improvements?**
Single host (no HA), masterless Puppet, load-average CPU metric, public IP changes on stop/start, remote state and TLS/domain not set up, no graphing.
