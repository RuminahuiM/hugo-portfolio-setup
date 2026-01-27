# Security Model

## Purpose
Describe security assumptions and controls for infrastructure and CI.

## Prerequisites
- Basic understanding of IAM, OIDC, and S3 access patterns.

## Expected outcome
- You know which identities can do what and where secrets live.

## Identities and access
- Local operator: uses AWS access keys to run Ansible.
- GitHub Actions: uses OIDC to assume the GitHub deployer role.
- CloudFront: uses an origin access identity (OAI) to read from S3.

## IAM and OIDC
- The deployer role trust policy allows `sts:AssumeRoleWithWebIdentity` for the configured GitHub repo and branch.
- Inline policies grant S3 sync and optional CloudFront invalidation.
- The OIDC provider is `token.actions.githubusercontent.com`.

## S3 access model
- The S3 bucket is used as a private origin (no public website hosting).
- `cloudfront_distribution` applies a bucket policy granting the OAI `s3:GetObject` access.
- `s3_static_site` does not set public access block or bucket policy; confirm account or bucket settings match your policy.

## Secrets and configuration
- AWS access keys are only needed on the machine that runs Ansible.
- GitHub Actions uses OIDC and repo variables (not secrets) for region, bucket, and role ARN.
- No credentials are stored in the repo.

## Assumptions and gaps
- No WAF, rate limiting, or security headers are configured.
- Logging for CloudFront and S3 is not enabled by default.
- Review bucket public access settings and logging for production usage.
