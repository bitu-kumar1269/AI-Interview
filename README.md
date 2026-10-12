# AI Interview App

A full-stack AI interview platform for job seekers and recruiters. Candidates can create profiles, upload resumes, browse job listings, and complete AI-powered mock interviews. Admin users can manage jobs, templates, prompts, analytics, and platform settings from a dedicated admin interface.

## Tech Stack

- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- Real-time communication: Socket.IO
- AI: Groq SDK
- Storage: Cloudinary
- Caching: Redis (optional but supported)
- Auth: JWT + OAuth (Google/GitHub-style flow)

## Features

- User registration and login
- JWT-based protected routes
- Resume upload and parsing
- AI-generated interview questions
- Real-time interview session flow
- Candidate answer evaluation with AI feedback
- Job search and recommendations
- Admin dashboard for analytics, user management, and settings
- Role-based access control for admin workflows
- File/image upload support via Cloudinary
- OAuth-ready authentication integration

## Project Structure

```text
ai-interview/
├── backend/              # Express API and business logic
│   ├── src/
│   ├── uploads/
│   ├── Dockerfile
│   ├── package.json
│   └── .env
├── frontend/             # React frontend app
│   ├── src/
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   └── vite.config.js
├── terraform/            # AWS infrastructure (VPC, EC2, security group, IAM)
│   └── bootstrap/        # one-time Terraform remote-state bucket setup
├── ansible/              # EC2 configuration + app deployment (Docker Compose)
├── .github/workflows/    # CI (ci.yml) and AWS deploy (deploy.yml) pipelines
├── docker-compose.prod.yml
├── .env.example          # consolidated list of required secret names
├── package.json          # Root scripts for running both apps
├── SECURITY.md
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+
- npm or yarn
- MongoDB instance
- Redis (optional for caching/job syncing)
- Cloudinary account
- Groq API key
- Adzuna API credentials (for job search features)

## Quick Start

1. Install the root dependencies:

```bash
npm install
```

2. Install backend and frontend dependencies:

```bash
npm run install:all
```

3. Create environment files:

Create a `.env` file in the `backend` folder with the following values:

```env
NODE_ENV=development
PORT=5001
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/ai-interview
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Groq
GROQ_API_KEY=your_groq_api_key

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Redis (optional)
REDIS_ENABLED=true
REDIS_URL=redis://localhost:6379

# Adzuna (optional, required for job scraping/search)
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key

# Optional OAuth providers
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5001/api/auth/google/callback
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_CALLBACK_URL=http://localhost:5001/api/auth/github/callback
```

> Note: The frontend dev server is configured to proxy API requests to `http://localhost:5001`, so using `PORT=5001` keeps the app aligned with the current Vite proxy configuration.

4. Start the apps:

```bash
npm run dev
```

This runs both the backend and frontend concurrently.

## Development Commands

From the project root:

```bash
npm run dev            # Run frontend and backend together
npm run dev:backend    # Start backend only
npm run dev:frontend   # Start frontend only
npm start              # Start backend in production mode
```

From the backend folder:

```bash
cd backend
npm run dev
npm start
npm test
```

From the frontend folder:

```bash
cd frontend
npm run dev
npm run build
npm run preview
npm run lint
```

## Application URLs

- Frontend: http://localhost:5173
- Backend API: http://localhost:5001
- Health check: http://localhost:5001/api/health

## API Overview

The backend exposes REST APIs for:

- Authentication and user management
- Resume upload and parsing
- Jobs and recommendations
- Interview session lifecycle
- Admin tools and analytics
- OAuth login flows

## AWS Deployment

The application deploys to a single AWS EC2 instance running Docker Compose,
provisioned by Terraform and configured by Ansible, with GitHub Actions
tying it all together. MongoDB Atlas stays external (not containerized) —
only the backend, frontend (Nginx), and a Redis cache run on the instance.

```text
Developer → git push → GitHub Actions → build & push Docker images (GHCR)
                              ↓
                    Terraform (provision/update EC2 + networking)
                              ↓
                    Ansible (install Docker, deploy docker-compose.prod.yml)
                              ↓
                         App live on EC2
```

### Architecture decisions

- **No Terraform modules** — a single VPC + subnet + EC2 instance doesn't
  warrant the indirection; everything lives in `terraform/*.tf`.
- **No managed Redis / ElastiCache** — Redis runs as a sidecar container
  on the same instance. The app already degrades gracefully if Redis is
  unavailable, so this is a reasonable cost/simplicity tradeoff for a
  demo/dev deployment.
- **No managed database** — MongoDB Atlas is already external; nothing to
  migrate.
- **Nginx lives inside the frontend container**, not as a separate host
  service — it serves the built static files and reverse-proxies
  `/api/*` and `/socket.io/*` to the backend container over the internal
  Docker network. This also means the frontend is built with
  `VITE_API_URL=/api` (same-origin), which avoids CORS entirely in
  production.

### Prerequisites

- An AWS account
- An existing EC2 key pair in your target region (`aws ec2 create-key-pair
  --key-name ai-interviewer-key --query 'KeyMaterial' --output text >
  ai-interviewer-key.pem && chmod 400 ai-interviewer-key.pem`)
- Terraform >= 1.5 (for local runs; GitHub Actions installs it automatically for CI)
- Ansible (for local runs)
- A GitHub repository with Actions enabled

### 1. AWS IAM role for GitHub Actions (OIDC)

GitHub Actions authenticates to AWS using OpenID Connect — no long-lived
access keys are stored anywhere.

1. In AWS IAM, create an OIDC identity provider for
   `https://token.actions.githubusercontent.com` (audience `sts.amazonaws.com`),
   if one doesn't already exist in your account.
2. Create an IAM role with a trust policy restricted to your repo:

```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Principal": { "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com" },
    "Action": "sts:AssumeRoleWithWebIdentity",
    "Condition": {
      "StringEquals": { "token.actions.githubusercontent.com:aud": "sts.amazonaws.com" },
      "StringLike": {
        "token.actions.githubusercontent.com:sub": [
          "repo:<your-github-username>/<your-repo>:environment:production",
          "repo:<your-github-username>/<your-repo>:ref:refs/heads/main"
        ]
      }
    }
  }]
}
```

3. Attach a policy scoped to what Terraform actually needs. The trust
   policy above lists **two** subjects on purpose: the `terraform` job runs
   in the `production` GitHub Environment (GitHub then issues the token with
   an `environment:production` subject, not a branch subject), while the
   `ansible-deploy` job has no environment and uses the branch subject.
   Permissions needed: `ec2:*`; IAM: `iam:CreateRole`, `iam:GetRole`,
   `iam:TagRole`, `iam:PassRole`, `iam:ListRolePolicies`,
   `iam:ListAttachedRolePolicies`, `iam:CreateInstanceProfile`,
   `iam:GetInstanceProfile`, `iam:TagInstanceProfile`,
   `iam:AddRoleToInstanceProfile` (scoped to the `ai-interviewer-*`
   role/profile ARNs); and for the S3 backend: `s3:ListBucket`,
   `s3:GetObject`, `s3:PutObject` on the state bucket and
   `dynamodb:GetItem`/`PutItem`/`DeleteItem` on the lock table only.
   Add the matching `iam:Delete*`/`RemoveRoleFromInstanceProfile` actions
   only if you want to run `terraform destroy` with this role (better done
   manually with your own credentials). Avoid `AdministratorAccess`.
   This list is derived from the resources in `terraform/main.tf`; if
   `terraform apply` still reports `AccessDenied`, the error names the exact
   missing action — add it rather than widening to `*`.
4. Copy the role's ARN — you'll need it as a GitHub Secret below.

### 2. Terraform state backend (required for CI)

The deploy pipeline uses an S3 remote backend. This is **required**, not
optional: with local state, every GitHub Actions run would start with empty
state and try to create a second copy of the whole infrastructure. Create
the bucket + lock table once, from your own machine:

```bash
cd terraform/bootstrap
terraform init
terraform apply -var="bucket_name=ai-interviewer-tfstate-<pick-a-unique-suffix>"
```

Then add that bucket name as the `TF_STATE_BUCKET` GitHub Secret (below).
The workflow passes it to `terraform init` via `-backend-config`; nothing
needs editing in `versions.tf`. (If you changed `lock_table_name` from its
default, update `TF_LOCK_TABLE` at the top of `deploy.yml` to match.)

To run Terraform locally against the same state:

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars   # fill in real values
terraform init \
  -backend-config="bucket=<your-bucket>" \
  -backend-config="key=ai-interviewer/terraform.tfstate" \
  -backend-config="region=ap-south-1" \
  -backend-config="dynamodb_table=ai-interviewer-tf-lock" \
  -backend-config="encrypt=true"
terraform plan
```

Note: Terraform state can contain sensitive infrastructure details even
though no application secrets are intentionally stored in it — keep the
bucket private (the bootstrap config blocks all public access).

### SSH access from CI

Port 22 is restricted to your own IP (`ALLOWED_SSH_CIDR`) for manual
access. GitHub-hosted runners have a different IP on every run, so rather
than opening SSH to the world, the deploy workflow temporarily authorizes
the current runner's IP on the security group right before Ansible runs and
revokes it in an `if: always()` step afterwards — even if the deploy fails.
The IAM role therefore needs `ec2:AuthorizeSecurityGroupIngress` and
`ec2:RevokeSecurityGroupIngress` (covered by `ec2:*` in the policy above).
Because Terraform manages the security group's inline rules, a rule that
somehow outlives a failed run is cleaned up by the next `terraform apply`.

### 3. GitHub Secrets required

Set these under **Settings → Secrets and variables → Actions**:

| Secret | Purpose |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | IAM role ARN from step 1 |
| `EC2_KEY_PAIR_NAME` | Name of your existing EC2 key pair |
| `EC2_SSH_PRIVATE_KEY` | Contents of the matching `.pem` private key |
| `ALLOWED_SSH_CIDR` | Your IP in CIDR form, e.g. `203.0.113.4/32` |
| `TF_STATE_BUCKET` | S3 bucket name created by `terraform/bootstrap` (step 2) |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | Auth token secrets |
| `GROQ_API_KEY` / `OPENAI_API_KEY` | AI provider keys |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | File storage |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth (optional — leave blank if unused) |
| `ADZUNA_APP_ID` / `ADZUNA_APP_KEY` | Job search feature |

Also create a GitHub **Environment** named `production` (Settings →
Environments) and add required reviewers, so `terraform apply` needs a
manual approval click before it runs against real infrastructure.

### 4. First deployment

```bash
git push origin main
```

This triggers `.github/workflows/deploy.yml`, which:
1. Builds and pushes both Docker images to GHCR, tagged with the git SHA
2. Runs `terraform plan` then `apply` (pauses for approval if the
   `production` environment has required reviewers configured)
3. Runs the Ansible playbook against the new EC2 instance
4. Hits `/api/health` to confirm the app actually came up

### 5. Subsequent deployments

Same command — `git push origin main`. Terraform only changes what
actually changed (usually nothing, since the instance already exists);
Ansible re-renders `backend.env` and runs `docker compose up -d`, which
only recreates containers whose image tag or config actually changed.

### 6. Accessing the live application

After deployment, get the public IP:

```bash
cd terraform && terraform output ec2_public_ip
```

Open `http://<that-ip>` in a browser. (No domain/HTTPS is configured by
default — see "Domain + HTTPS" below for the optional next step.)

### 7. Checking logs / SSH / restarting

```bash
# SSH in
ssh -i ai-interviewer-key.pem ec2-user@<EC2_PUBLIC_IP>

# Once connected:
cd /opt/ai-interviewer
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml restart backend
```

### 8. Rollback

Images are tagged with the git SHA, not just `latest`. To roll back:

```bash
ssh -i ai-interviewer-key.pem ec2-user@<EC2_PUBLIC_IP>
cd /opt/ai-interviewer
BACKEND_IMAGE=ghcr.io/<owner>/ai-interviewer-backend:<previous-sha> \
FRONTEND_IMAGE=ghcr.io/<owner>/ai-interviewer-frontend:<previous-sha> \
  docker compose -f docker-compose.prod.yml up -d
```

Find previous SHAs in your GitHub Actions run history or `git log`.

### 9. Destroying the dev infrastructure

**Never automated in CI.** To tear down manually when you're done:

```bash
cd terraform
terraform destroy
```

This does NOT touch MongoDB Atlas (external) or your Cloudinary account —
only the AWS resources Terraform created.

### 10. Domain + HTTPS (optional, not configured yet)

No domain is assumed or fabricated. To add one later:
1. Point an A record at the Elastic IP from `terraform output ec2_public_ip`.
2. Add a Certbot step (e.g. via an Ansible task using the `certbot`
   package with the Nginx plugin, or a host-level Nginx in front of the
   frontend container) to obtain a Let's Encrypt certificate.
3. Update `CLIENT_URL`, `BACKEND_URL`, and `GOOGLE_CALLBACK_URL` to the
   `https://` domain everywhere they're referenced (GitHub Secrets /
   `ansible/group_vars`).

This isn't wired in by default since fabricating a domain isn't useful —
the app is fully reachable via the EC2 public IP without it.

### 11. Troubleshooting

| Symptom | Likely cause |
|---|---|
| `terraform apply` fails on IAM permissions | The OIDC role's policy is missing a required `iam:*` or `ec2:*` action — check the error for the exact action name |
| Ansible can't SSH | `ALLOWED_SSH_CIDR` doesn't match the GitHub Actions runner's IP, or `EC2_SSH_PRIVATE_KEY` doesn't match `EC2_KEY_PAIR_NAME` |
| Health check fails after deploy | SSH in and check `docker compose logs backend` — usually a missing/wrong secret in `group_vars`/GitHub Secrets |
| CORS errors in the browser | `CLIENT_URL` doesn't match the actual URL you're visiting from — note that with the Nginx same-origin proxy setup, this should rarely come up in production |
| OAuth redirect fails | `GOOGLE_CALLBACK_URL` must exactly match what's registered in Google Cloud Console, including the real EC2 IP or domain |

### 12. AWS cost considerations

This intentionally uses a minimal footprint for a student/demo project:

- **1x EC2 instance** (`t3.micro` by default — eligible for the AWS Free
  Tier in your first 12 months; check current Free Tier terms as they
  change over time) — bump to `t3.small` or larger if you see memory
  pressure running Node + Redis + Nginx together
- **1x Elastic IP** — free while attached to a running instance; AWS
  charges a small hourly fee if it's ever left unattached
- **No NAT Gateway, no Load Balancer, no managed database/Redis** —
  these are the typical sources of unexpected AWS bills and are
  deliberately not used here
- **S3 + DynamoDB for Terraform state** (if you set it up) — negligible
  cost (a few KB of data, pay-per-request DynamoDB billing)

Always double-check current AWS pricing/Free Tier terms yourself before
leaving this running unattended.

## Security

Please review the security policy in [SECURITY.md](SECURITY.md) before deploying the application to production.

## License

This project is currently intended for internal or project-specific use. Add an explicit license if you plan to distribute or open-source the codebase.
