# Troubleshooting

## Purpose
Provide fixes for common deployment and infrastructure issues.

## Prerequisites
- Access to AWS Console or CLI.
- Access to GitHub Actions logs.

## Expected outcome
- You can resolve common failures quickly.

## ACM certificate stays in PENDING_VALIDATION
- **Symptoms:** CloudFront uses the default certificate; HTTPS not trusted for custom domain.
- **Cause:** DNS validation records are missing or DNS delegation is not complete.
- **Fix:** Confirm registrar uses Route 53 name servers, then from `ansible/` rerun `ansible-playbook playbooks/site.yml`.

## CloudFront returns 403 AccessDenied
- **Symptoms:** Browser shows AccessDenied from CloudFront.
- **Cause:** S3 bucket policy missing or OAI not applied.
- **Fix:** From `ansible/`, rerun `ansible-playbook playbooks/site.yml` and confirm `cloudfront_distribution` applied the bucket policy.

## CloudFront returns 404 Not Found
- **Symptoms:** Root path shows 404 or missing assets.
- **Cause:** Site not deployed, wrong `baseURL`, or missing `index.html`.
- **Fix:** Verify S3 contents, confirm `SITE_BASE_URL`, and redeploy.

## GitHub Actions fails to assume role
- **Symptoms:** `AccessDenied` or `Not authorized to perform sts:AssumeRoleWithWebIdentity`.
- **Cause:** `AWS_ROLE_ARN` is wrong or OIDC trust policy does not match repo and branch.
- **Fix:** Confirm `github_account_name`, `github_repo_name`, `github_repo_branch`, and `github_deployer_enabled: true` in `user.yml`, then rerun `ansible-playbook playbooks/site.yml` from `ansible/`.

## S3 sync fails in GitHub Actions
- **Symptoms:** `AccessDenied` during `aws s3 sync`.
- **Cause:** Missing S3 permissions in the deployer role.
- **Fix:** Ensure `github_deployer_enabled: true` and rerun `ansible-playbook playbooks/site.yml` from `ansible/`.

## DNS does not resolve to CloudFront
- **Symptoms:** Domain does not resolve or points to old hosting.
- **Cause:** Registrar still points to old name servers.
- **Fix:** Update registrar to Route 53 name servers and wait for propagation.

## Hugo build fails in CI
- **Symptoms:** Build step fails in `.github/workflows/deployToS3.yml`.
- **Cause:** Incorrect `HUGO_VERSION` or module download errors.
- **Fix:** Set `HUGO_VERSION` to a supported value and rerun; check `hugo-site/go.mod` and `go.sum`.
