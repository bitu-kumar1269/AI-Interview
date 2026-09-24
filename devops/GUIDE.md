# DevOps toolchain for AI-Interviewer (INT333)

Deploys your actual monorepo (backend/ + frontend/) to AWS using the four
INT333 tools.

## How the pieces fit together

1. **Terraform** (`terraform/`) provisions one AWS EC2 instance and a
   security group.
2. **Ansible** (`ansible/`) connects over SSH, installs Node/Redis/Nginx,
   clones your repo, writes `.env` files, builds the frontend, runs the
   backend under PM2, and configures Nginx to serve the frontend + proxy
   `/api` and `/socket.io` to the backend.
3. **Puppet** (`puppet/`) demonstrates declarative config management on the
   same instance (packages/services in a desired state) - maps to Units I-II.
4. **Nagios** (`nagios/`) monitors the instance: host up, SSH up, frontend
   HTTP up, backend API up, CPU load.

## One-time setup

```bash
# On your own machine
brew install terraform ansible        # or apt install / pip install
aws configure                         # needs an AWS access key + secret

# Create an EC2 key pair named "devops-project-key" in the AWS console,
# download the .pem, then:
mv ~/Downloads/devops-project-key.pem ~/.ssh/
chmod 400 ~/.ssh/devops-project-key.pem

# Fill in your real secrets (never commit this file)
cd devops/ansible
cp vars/secrets.yml.example vars/secrets.yml
# edit vars/secrets.yml: set app_repo to your GitHub URL, fill in
# MONGO_URI, GROQ_API_KEY, OPENAI_API_KEY, JWT secrets, etc.
```

## 1. Provision the server

```bash
cd devops/terraform
terraform init
terraform apply     # type "yes"
```
Copy the `instance_public_ip` it prints.

## 2. Deploy the app

- In `devops/ansible/inventory.ini`, replace `REPLACE_WITH_TERRAFORM_OUTPUT_IP`
  with that IP.
- In `devops/ansible/vars/secrets.yml`, replace every
  `REPLACE_WITH_TERRAFORM_OUTPUT_IP` too (CLIENT_URL, BACKEND_URL, OAuth
  callback URLs, VITE_API_URL).
- Wait ~30s for the instance to finish booting, then:
```bash
cd devops/ansible
ansible-playbook -i inventory.ini deploy-app.yml
```
- Visit `http://<public IP>` - your app should be live, API calls proxied
  through Nginx to the backend, sockets working too.

## 3. Apply the Puppet manifest

```bash
ssh -i ~/.ssh/devops-project-key.pem ubuntu@<public IP>
sudo apt install -y puppet
sudo puppet apply /opt/ai-interviewer/devops/puppet/manifests/app.pp
cat /etc/motd
```

## 4. Set up Nagios

Install Nagios Core on a second small instance or locally in VirtualBox
(matches the syllabus practical), then:
```bash
sudo cp devops/nagios/objects/app_server.cfg /usr/local/nagios/etc/objects/
# add "cfg_file=/usr/local/nagios/etc/objects/app_server.cfg" to nagios.cfg
sudo systemctl restart nagios
```
Replace `REPLACE_WITH_TERRAFORM_OUTPUT_IP` in that file with the real IP.
The CPU Load check needs the NRPE agent on the app server - skip that one
block if you're short on time; PING/HTTP/SSH already prove the concept.

## What to show the teacher

- `terraform apply` output → infrastructure-as-code provisioning (CO4).
- The live app in a browser at the public IP → Ansible deployment (CO5, CO6).
- `cat /etc/motd` on the server → Puppet ran and manages state (CO1, CO2).
- Nagios web UI (`http://<nagios-ip>/nagios`) showing green checks → CO3.

## Course outcome mapping

| Tool      | Course Outcome |
|-----------|----------------|
| Puppet    | CO1, CO2       |
| Nagios    | CO3            |
| Terraform | CO4            |
| Ansible   | CO5, CO6       |
