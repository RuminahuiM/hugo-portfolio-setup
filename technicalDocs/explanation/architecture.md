# Architecture Overview

## Purpose
Explain how the Hugo site, AWS resources, and GitHub Actions fit together.

## Prerequisites
- Basic AWS and CDN concepts.
- Familiarity with Hugo and GitHub Actions.

## Expected outcome
- A clear mental model of the system components and flows.

## System components
- Hugo source and content in `hugo-site/`.
- Ansible provisioning in `ansible/`.
- GitHub Actions workflows in `.github/workflows/`.
- AWS services: S3, CloudFront, ACM, Route 53, IAM (OIDC provider and role).

## High-level request flow
1. A user requests `https://<domain>`.
2. Route 53 resolves the domain to the CloudFront distribution.
3. CloudFront serves cached assets or fetches from S3 using an origin access identity.
4. S3 returns static files produced by Hugo.

## Provisioning flow
1. Run `ansible/playbooks/site.yml` from `ansible/`.
2. Roles create or update:
   - S3 bucket for site assets.
   - Route 53 hosted zone and DNS records.
   - ACM certificate in `us-east-1`.
   - CloudFront distribution.
   - GitHub OIDC provider and deployer role.
3. `deployment_outputs` prints Route 53 name servers and GitHub repo variables.
4. After ACM validation is complete, run `ansible/playbooks/post_validation.yml` to attach the issued certificate to CloudFront.

## Deployment flow
1. A push to the branch in `DEPLOY_BRANCH` triggers `.github/workflows/deployToS3.yml`.
2. GitHub Actions builds the site with Hugo and uploads the build artifact.
3. The deploy job assumes the AWS role via OIDC, syncs to S3, and invalidates CloudFront.

## State and configuration
- Ansible does not maintain local state; it relies on AWS API lookups each run.
- Configuration defaults live in `ansible/inventory/group_vars/all/all.yml`.
- Overrides live in `ansible/inventory/group_vars/all/user.yml`.
- Hugo configuration lives in `hugo-site/config/_default/`.

## Key dependencies
- CloudFront requires ACM certificates in `us-east-1`.
- Route 53 is required for automatic ACM DNS validation.
- GitHub Actions requires the OIDC provider and the role ARN output by Ansible.
