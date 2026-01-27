# GitHub Actions Workflows

## Purpose
Reference workflows in `.github/workflows`.

## Prerequisites
- Familiarity with GitHub Actions.

## Expected outcome
- You know what each workflow does and how to configure it.

## Repository variables used by deployToS3
| Variable | Purpose |
| --- | --- |
| `AWS_REGION` | AWS region for S3 and CloudFront. |
| `DEPLOY_BRANCH` | Branch that triggers deployment. |
| `AWS_ROLE_ARN` | OIDC role to assume. |
| `BUCKET_NAME` | S3 bucket name. |
| `CF_DISTRIBUTION_ID` | CloudFront distribution id. |
| `SITE_BASE_URL` | Base URL used by Hugo. |
| `HUGO_VERSION` | Hugo version to install. |

## `deployToS3.yml`
- **Triggers:** Push to any branch, manual dispatch.
- **Gating:** Jobs run only when `github.ref_name == vars.DEPLOY_BRANCH`.
- **Build:** Installs Hugo, builds from `hugo-site/`, uploads artifact.
- **Deploy:** Assumes AWS role via OIDC, syncs to S3, invalidates CloudFront.

## `deploy.yml`
- **Purpose:** Deploys to GitHub Pages on the `gh-pages` branch.
- **Triggers:** Push and pull request on `main`.
- **Notes:** Not used for S3 deployments; disable if not needed.

## `update-theme.yml`
- **Purpose:** Updates the Hugo theme module daily.
- **Triggers:** Scheduled and manual dispatch.
- **Notes:** Runs `hugo mod get -u` and commits changes.
