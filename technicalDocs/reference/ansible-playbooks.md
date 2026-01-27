# Ansible Playbooks Reference

## Purpose
Document playbooks in `ansible/playbooks`.

## Prerequisites
- Familiarity with Ansible playbooks.

## Expected outcome
- You know which playbook to run for each lifecycle stage.

## `site.yml`
- **Purpose:** Provision or update all AWS resources.
- **Roles:** `s3_static_site`, `route53_hosted_zone`, `acm_certificate`, `cloudfront_distribution`, `github_deployer_role`, `route53_records`, `iam_role`, `deployment_outputs`.
- **Notes:** Resets CloudFront identifiers when `keep_cloudfront` is false to ensure fresh creation.

## `post_validation.yml`
- **Purpose:** Attach the issued ACM certificate and finalize CloudFront.
- **Roles:** `acm_certificate`, `cloudfront_distribution`, `route53_records`.
- **Notes:** Run after ACM validation is complete.

## `destroy.yml`
- **Purpose:** Tear down resources.
- **Roles:** `route53_records`, `cloudfront_distribution`, `s3_static_site`, `acm_certificate`, `route53_hosted_zone`, `github_deployer_role`, `iam_role`.
- **Notes:** Respects `keep_*` flags and sets `s3_force_destroy: true`.

## `redeploy.yml`
- **Purpose:** Destroy and then re-provision.
- **Roles:** Imports `destroy.yml` then `site.yml`.
