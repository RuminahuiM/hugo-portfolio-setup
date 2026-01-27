# Deploy with GitHub Actions

## Purpose
Build and upload the Hugo site via CI.

## Prerequisites
- GitHub repo variables set (see below).
- GitHub OIDC provider and deployer role created by Ansible (`github_deployer_enabled: true`).
- The deploy branch exists.

## Expected outcome
- A push to the deploy branch builds the site and syncs it to S3.

## Required repository variables
Set these under GitHub Settings -> Secrets and variables -> Actions -> Variables:
- `AWS_REGION` (for example `eu-north-1`)
- `DEPLOY_BRANCH` (must match the branch that triggers deploys)
- `AWS_ROLE_ARN` (from Ansible output)
- `BUCKET_NAME` (from Ansible output)
- `CF_DISTRIBUTION_ID` (from Ansible output)
- `SITE_BASE_URL` (from Ansible output)
- `HUGO_VERSION` (set manually, for example `0.123.8`)

## Deploy flow
1. Push to `DEPLOY_BRANCH`.
2. `.github/workflows/deployToS3.yml` builds the site and uploads the artifact.
3. The deploy job assumes the AWS role via OIDC and syncs to S3.
4. CloudFront is invalidated to refresh cached content.

## Notes
- The workflow runs for all branches, but jobs only execute when `github.ref_name == vars.DEPLOY_BRANCH`.
- `.github/workflows/deploy.yml` is a separate GitHub Pages workflow; disable it if you only deploy to S3.
- Ensure `DEPLOY_BRANCH` matches `github_repo_branch` in `user.yml` so the OIDC trust policy allows deployments.
