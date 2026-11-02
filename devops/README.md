# AI-Interviewer — DevOps Automation Lab
**Terraform · Ansible · Puppet · Nagios**

## 1. Problem statement and objectives
The AI-Interviewer application (React frontend + Node/Express backend, deployed on Render) has no
infrastructure-as-code, no configuration management and no monitoring. This lab adds all three
**around** the existing application, using the four tools required by the assignment:

| Tool | Role in this project |
|---|---|
| **Terraform** | Provisions the infrastructure: one EC2 monitoring host, security group, IAM role |
| **Ansible** | Initial setup, orchestration, Nagios configuration, verification |
| **Puppet** | Ongoing enforcement of packages, services and time-sync config |
| **Nagios** | Monitors the host and the live application, alerts on problems |

**Scope:** only DevOps files live in `devops/`. The application's source code (`frontend/`, `backend/`)
is not modified by this lab. The existing `/api/health` endpoint is used as-is.

## 2. Architecture

```
  Your laptop                                   AWS (ap-south-1)
 ┌──────────────┐  terraform apply   ┌────────────────────────────────────────┐
 │  Terraform   │ ─────────────────▶ │  EC2  Ubuntu 24.04  "monitor-host"     │
 └──────┬───────┘                    │  SG: SSH from admin IP only            │
        │ outputs (IP) ──────────┐   │                                        │
        ▼                        │   │  ┌─────────┐  installs/enforces        │
 ┌──────────────┐  SSH           │   │  │ Puppet  │──▶ nagios4, apache2,      │
 │   Ansible    │ ───────────────┼──▶│  │ (apply) │    plugins, chrony        │
 │ site.yml     │  1 common      │   │  └─────────┘                           │
 │              │  2 puppet      │   │  ┌─────────┐                           │
 │              │  3 monitoring  │   │  │ Nagios  │──checks──┐                │
 │              │  4 verify      │   │  └─────────┘          │                │
 └──────────────┘                    └───────────────────────┼────────────────┘
                                                             ▼ HTTPS 443
                                     ┌────────────────────────────────────────┐
                                     │ Existing app on Render (NOT modified)  │
                                     │  • frontend  • backend /api/health     │
                                     └────────────────────────────────────────┘
 You ──ssh -L 8080:localhost:80──▶ monitor-host ──▶ Nagios web UI (login required)
```

**Why the app is not redeployed:** it already runs on Render, and the AWS app stack in the repo-root
`terraform/` + `ansible/` has not been deployed. A monitoring host is the cheapest design that
demonstrates all four tools, and it monitors the real, live application.

### Ownership (no resource is managed by two tools)
| Resource | Owner |
|---|---|
| EC2, security group, IAM role | **Terraform** |
| OS baseline (packages, timezone, swap, sysctl), installing `puppet-agent` | **Ansible** |
| Nagios object files (`conf.d`), web login file + Apache auth, mail relay, custom plugin | **Ansible** |
| Packages `nagios4`, `apache2`, plugins, `chrony`, `msmtp`; services apache2/nagios4/chrony; chrony config; stopping the unused puppet daemon | **Puppet** |
| Alerting and service-state visibility | **Nagios** |

## 3. Directory structure
```
devops/
├── terraform/   versions.tf providers.tf variables.tf main.tf outputs.tf
│                terraform.tfvars.example  backend.s3.tf.example
├── ansible/     ansible.cfg
│   ├── inventory/ hosts.ini.example  group_vars/all/{main.yml,vault.yml.example}
│   ├── playbooks/ site.yml common.yml puppet.yml monitoring.yml verify.yml
│   └── roles/     common/  puppet/  nagios/
├── puppet/      manifests/site.pp   modules/monitoring_stack/{manifests,templates}
├── nagios/      hosts.cfg services.cfg commands.cfg contacts.cfg.j2  scripts/check_mem.sh
├── scripts/     tf-validate tf-plan gen-inventory ansible-check ansible-run verify
│                puppet-validate nagios-validate (+ lib.sh)
└── docs/        viva-questions.md
```
The repo-root `terraform/`, `ansible/` and `docker-compose.prod.yml` belong to a **separate** task
(deploying the app itself to AWS with Docker) and are untouched by this lab.

## 4. Prerequisites
- An AWS account and an IAM user with EC2/IAM permissions for Terraform (credentials via `aws configure`, never in code)
- macOS/Linux with: `terraform` (>= 1.5), `ansible`, `awscli`; optional for offline validation: `puppet`, `puppet-lint`, Docker
- An EC2 key pair in the target region:
  ```bash
  aws ec2 create-key-pair --region ap-south-1 --key-name ai-interviewer-key \
    --query KeyMaterial --output text > ~/.ssh/ai-interviewer-key.pem && chmod 400 ~/.ssh/ai-interviewer-key.pem
  ```
- The account's **default VPC** must exist (or set `vpc_id`/`subnet_id`): `aws ec2 describe-vpcs --filters Name=isDefault,Values=true`

## 5. Variables and credentials
| What | Where | Notes |
|---|---|---|
| AWS credentials | `aws configure` / `AWS_PROFILE` | never stored in the repo |
| `key_name`, `admin_cidr`, … | `terraform/terraform.tfvars` (copy from `.example`) | gitignored. `admin_cidr` = `YOUR_IP/32` (`curl -s https://checkip.amazonaws.com`); `0.0.0.0/0` is rejected by validation |
| Nagios web password, SMTP password | `ansible/inventory/group_vars/all/vault.yml` | copy from `.example`, then `ansible-vault encrypt` |
| Alert e-mail, SMTP host/user | `ansible/inventory/group_vars/all/main.yml` | e-mail only works once `smtp_user` + vault `smtp_password` are set |

## 6. Exact commands
```bash
cd devops

# 1. Validate everything OFFLINE (no AWS needed, changes nothing)
scripts/tf-validate.sh
scripts/puppet-validate.sh
sudo scripts/nagios-validate.sh        # or without sudo if Docker is installed
scripts/ansible-check.sh

# 2. Terraform: plan, review, then apply YOURSELF  (creates billable resources)
cp terraform/terraform.tfvars.example terraform/terraform.tfvars   # edit it
scripts/tf-plan.sh
(cd terraform && terraform apply tfplan)           # <- approval point

# 3. Terraform -> Ansible hand-off
scripts/gen-inventory.sh                            # writes ansible/inventory/hosts.ini

# 4. Secrets
cp ansible/inventory/group_vars/all/vault.yml.example ansible/inventory/group_vars/all/vault.yml
$EDITOR ansible/inventory/group_vars/all/vault.yml
ansible-vault encrypt ansible/inventory/group_vars/all/vault.yml

# 5. Check SSH connectivity (the instance needs ~1-2 minutes after apply)
scripts/ansible-check.sh --ping

# 6. Configure everything: common -> puppet -> monitoring -> verify
scripts/ansible-run.sh                              # run again: should report changed=0

# 7. Verify at any time (read-only)
scripts/verify.sh

# 8. Open the Nagios UI through an SSH tunnel (nothing is exposed publicly)
terraform -chdir=terraform output -raw nagios_tunnel_command   # run the printed command
# then browse to http://localhost:8080/nagios4/   user: nagiosadmin, password: from vault.yml
```
Individual stages: `scripts/ansible-run.sh common|puppet|monitoring|verify`, add `--check` for a dry run.

## 7. Terraform → Ansible integration
`outputs.tf` exposes an `ansible_inventory` output (a ready-made inventory with the instance's public IP,
user and key path). `scripts/gen-inventory.sh` writes it to `ansible/inventory/hosts.ini`. The script
**validates the content** and refuses to overwrite the inventory if Terraform has no real output yet.
The public IP changes if the instance is stopped/started (no Elastic IP is used, to avoid its hourly
charge) — re-run `gen-inventory.sh` afterwards.

## 8. Puppet
Masterless (`puppet apply`) — no Puppet server to pay for. Module `monitoring_stack`:
- `packages.pp` — nagios4, apache2, monitoring plugins, msmtp, chrony
- `time.pp` — `Package[chrony] → File[drop-in from EPP template] ~> Service[chrony]`
- `services.pp` — apache2 and nagios4 enabled + running (each requires its package)
- `puppet_agent.pp` — keeps the packaged agent daemon off (masterless)
- guarded by a fact check: `fail()`s on a non-Ubuntu OS

Ansible runs it once and installs a `puppet-apply.timer` (every 30 min) for continuous enforcement.
```bash
scripts/puppet-validate.sh      # parser validate + epp validate + puppet-lint + noop dry run
```

## 9. Nagios
| Target | Check | Warning / Critical | Interval |
|---|---|---|---|
| monitor-host | SSH (port 22) | down | 5 min |
| | CPU load (1/5/15 min) | 1.5,1.2,1.0 / 3.0,2.5,2.0 (sized for 2 vCPUs) | 5 min |
| | Memory used (custom plugin) | 80% / 90% | 5 min |
| | Disk free on `/` | <20% / <10% | 5 min |
| | Nagios process | daemon dead / stale status | 5 min |
| | Web UI port 80 | closed | 5 min |
| | Web UI requires login | anything other than HTTP 401 | 5 min |
| app-frontend | HTTPS response time | 5 s / 15 s (timeout 30 s) | 5 min |
| | TLS certificate | 14 / 7 days to expiry | 12 h |
| | Port 443 | closed | 5 min |
| app-backend | `/api/health` (body must match `"success": true`) | 5 s / 15 s | 5 min |
| | TLS certificate, port 443 | as above | 12 h / 5 min |

- **Soft/hard states:** a problem notifies only after 3 consecutive failures (`max_check_attempts 3`).
- **Notifications:** contact `ai-admin`, group `ai-admins`; host options `d,u,r`, service options `w,u,c,r` (includes **recovery**).
  E-mail is sent through `msmtp` once SMTP credentials are provided; until then states are still visible in the UI and logs.
- **Secure UI access:** Apache listens on `127.0.0.1` only and the security group has no port 80 rule → use the SSH tunnel.
  **Important:** Ubuntu's stock Nagios config has *no login at all* (any private-IP client gets full access and `cmd.cgi` is
  `Require all granted`). The `nagios` role adds an Apache Digest-auth drop-in for the whole UI and sets
  `use_authentication=1`. The "Web UI requires login" check keeps proving it stays that way.
- **Render free tier** sleeps after ~15 min idle and can take ~30 s to wake, which can produce a transient CRITICAL; thresholds are
  deliberately generous and 3 attempts are required. Side effect: the 5-minute health checks also keep the app awake.
- **CPU:** measured as load average (the standard Nagios CPU metric), not percent utilisation.

### Demonstrate OK → WARNING → CRITICAL safely (no stress-testing a 1 GiB host)
Change thresholds or targets in `nagios/services.cfg`, redeploy, and watch the state change; then revert:
```bash
# WARNING/CRITICAL for memory: set  check_mem_local!5!10  (warn at 5%, crit at 10% used)
# CRITICAL for the backend:   set  check_app_health!/api/does-not-exist!5!15!30   (404)
scripts/ansible-run.sh monitoring      # validates, then reloads Nagios
# …screenshot the UI…  revert the file, then:
scripts/ansible-run.sh monitoring
```

## 10. Testing status — what was and was not verified
Verified (executed on Ubuntu 24.04 with the real tools; outputs were observed, not assumed):

| Item | Result |
|---|---|
| `tofu fmt -check` on all Terraform (OpenTofu 1.8.5) | pass |
| Terraform variable/resource/local cross-reference check | pass |
| `ansible-playbook --syntax-check` (all 5 playbooks) | pass |
| `ansible-lint` (strictest "production" profile) | 0 failures |
| `puppet parser validate`, `puppet epp validate`, `puppet-lint` | pass |
| `puppet apply --noop` then real apply, run twice | 1st run changed resources; **2nd run exit 0 (idempotent)** |
| Puppet drift test (deleted a managed file) | Puppet restored it and refreshed the service |
| `nagios4 -v` on the deployed config | 13 services, 3 hosts, **0 warnings, 0 errors** |
| Custom `check_mem` plugin | OK / WARNING / CRITICAL / UNKNOWN all exercised |
| `check_http` health logic vs a local test app | OK / WARNING (slow) / CRITICAL (slow) / CRITICAL (bad body) |
| Ansible `common`, `puppet`, `nagios` roles run against a real Ubuntu 24.04 host (the sandbox) | 1st run changes, **2nd run `changed=0`** |
| Config-validation gate precedes the Nagios reload handler | confirmed from task/handler order |
| Nagios daemon running my checks; Apache Digest login | no creds → 401, wrong password → 401, correct → 200 |
| Helper scripts incl. failure paths (`shellcheck` clean) | pass |

**Not verified — requires your AWS account, credentials or a real EC2 host:**
- `terraform validate` against the real AWS provider (the registry was unreachable from my sandbox), `terraform plan` and `apply`
- Ansible over **SSH** to a real EC2 instance, the `systemd` timer tasks, and `verify.yml` (which asserts SSH/systemd state)
- Nagios checks against the live Render URLs (the sandbox had no outbound DNS to them)
- E-mail alert delivery; the Docker fallback in `nagios-validate.sh`
- That the Amazon Time Sync address `169.254.169.123` is reachable (EC2-only)

## 11. Evidence to capture for the viva
Capture only real output from your own runs:
1. `scripts/tf-validate.sh` success; `scripts/tf-plan.sh` plan summary (resources to add)
2. `terraform apply` output + `terraform output`; AWS Console: the EC2 instance, security group rules (only SSH from your IP), IAM role
3. `scripts/gen-inventory.sh` output; `scripts/ansible-check.sh --ping` → `pong`
4. `scripts/ansible-run.sh` recap on the **first** run, then on the **second** run showing `changed=0` (idempotency)
5. Puppet: `scripts/puppet-validate.sh`; on the host `sudo puppet apply --noop …` then delete `/etc/chrony/conf.d/aws-time-sync.conf` and re-apply (drift repair)
6. `scripts/verify.sh` — all assertions green
7. Nagios UI via the tunnel: the login prompt, **Hosts**, **Services** (all OK) and **Tactical Overview**
8. A forced **WARNING/CRITICAL** (section 9) and the later **recovery**; the notification e-mail if configured
9. `curl -i http://localhost:8080/nagios4/` without credentials → `401` (security proof)

## 12. Common errors
| Symptom | Cause / fix |
|---|---|
| `terraform plan`: "no default VPC" | Create one (`aws ec2 create-default-vpc`) or set `vpc_id` + `subnet_id` |
| `InvalidKeyPair.NotFound` | `key_name` must exist in the same region |
| Ansible `UNREACHABLE` right after apply | Instance still booting — wait 1–2 min; `wait_for_connection` also retries |
| Ansible can't SSH later | Your IP changed → update `admin_cidr`, `terraform apply`, re-run `gen-inventory.sh` (public IP may also change) |
| "nagios_admin_password is empty" | Create + encrypt `vault.yml`; run with `--ask-vault-pass` (the scripts do) |
| apt/dpkg lock on the first run | cloud-init is still updating — just re-run (idempotent) |
| `nagios4 -v` fails in the play | The play stops **before** the reload, so monitoring keeps running the old config. Read the error, fix the `.cfg`, re-run |
| Backend check CRITICAL "Name or service not known" | Host cannot resolve/reach the URL — check egress/DNS; or Render is waking up |
| Can't log in to the UI | Username must be `nagiosadmin` (the name authorised in `cgi.cfg`); realm `Nagios4`; re-run the `monitoring` playbook to reset the password |

## 13. Security and cost
- No credentials, keys or secrets in Git (`devops/.gitignore`: state, `*.tfvars`, `vault.yml`, `*.pem`, `hosts.ini`); Terraform state may contain sensitive infrastructure details — keep it private
- SSH only from `admin_cidr` (never `0.0.0.0/0` — enforced by validation); no web port open; IMDSv2 required; encrypted root volume; SSM role available as a no-open-port alternative
- Nagios UI: localhost bind + Digest login; secrets via Ansible Vault with `no_log`
- **Cost (you must approve before `terraform apply`):** 1× `t3.micro`, a 12 GB gp3 volume, and a public IPv4 address (AWS charges hourly for public IPv4 since 2024). No NAT gateway, load balancer, Elastic IP or managed service. Check the current AWS pricing/Free-Tier terms for your account. Destroy when not in use.

## 14. Cleanup
```bash
terraform -chdir=terraform destroy      # removes EC2, security group, IAM role (asks for confirmation)
```
Nothing here runs `destroy`/`apply` automatically; both are manual, explicit steps.

## 15. Limitations and future work
- One host, no high availability; the Nagios host itself is not monitored from outside
- Masterless Puppet (no Puppet server / Hiera / reporting); CPU via load average only
- External-only application monitoring (no NRPE/agent on the app host, since the app runs on a managed platform)
- Plain HTTP between you and Nagios is protected only by the SSH tunnel; add a domain + TLS for direct access
- Future: remote Terraform state (S3, `backend.s3.tf.example`), Nagios graphing (PNP4Nagios), Slack/PagerDuty alerts, CI running the `scripts/*-validate.sh`
