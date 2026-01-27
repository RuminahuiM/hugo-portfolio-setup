# Ansible Roles Reference

## Purpose
Document each role in `ansible/roles`.

## Prerequisites
- Familiarity with Ansible roles and variables.

## Expected outcome
- You know what each role does and which inputs or outputs it uses.

## `s3_static_site`
- **Purpose:** Create or delete the S3 bucket used as the site origin.
- **Key inputs:** `s3_enabled`, `s3_state`, `s3_bucket_name`, `aws_region`, `s3_apply_tags`, `common_tags`, `s3_force_destroy`.
- **Outputs:** none.
- **Notes:** Does not configure bucket policy or public access block. Bucket policy is applied later by `cloudfront_distribution`.

## `route53_hosted_zone`
- **Purpose:** Create or delete the Route 53 hosted zone.
- **Key inputs:** `route53_enabled`, `route53_state`, `route53_zone_name`, `route53_comment`, `route53_private_zone`.
- **Outputs:** `route53_zone_id`, `route53_name_servers`.

## `acm_certificate`
- **Purpose:** Request or delete the ACM certificate used by CloudFront.
- **Key inputs:** `acm_enabled`, `acm_state`, `acm_region`, `acm_domain_name`, `acm_subject_alternative_names`, `acm_validation_method`.
- **Outputs:** `acm_certificate_arn`, `acm_validation_records`, `acm_certificate_status`, `acm_certificate_ready`.
- **Notes:** Uses AWS CLI commands; creates DNS validation records in Route 53 when enabled.

## `cloudfront_distribution`
- **Purpose:** Create, update, disable, or delete the CloudFront distribution.
- **Key inputs:** `cloudfront_enabled`, `cloudfront_state`, `cloudfront_aliases`, `cloudfront_origins`, `cloudfront_default_cache_behavior`, `cloudfront_viewer_certificate`.
- **Outputs:** `cloudfront_distribution_id`, `cloudfront_domain_name`, `cloudfront_oai_arn`.
- **Notes:** Applies the S3 bucket policy that grants OAI read access.

## `github_deployer_role`
- **Purpose:** Create the GitHub OIDC provider and deployer IAM role.
- **Key inputs:** `github_deployer_enabled`, `github_*` variables, `aws_account_id`.
- **Outputs:** `aws_account_id`, `github_oidc_provider_arn`.
- **Notes:** Inline policies allow S3 sync and CloudFront invalidation when a distribution id is available.

## `route53_records`
- **Purpose:** Create or delete DNS records for CloudFront and the root alias.
- **Key inputs:** `route53_enabled`, `route53_state`, `route53_zone_name`, `cloudfront_domain_name`.
- **Outputs:** `route53_zone_id` when looked up.
- **Notes:** Creates A and AAAA alias records for `www` and aliases the root domain to `www`.

## `iam_role`
- **Purpose:** Create a generic IAM role with provided policies.
- **Key inputs:** `iam_enabled`, `iam_role_name`, `iam_role_assume_policy`, `iam_role_managed_policies`, `iam_role_inline_policies`.
- **Outputs:** none.

## `deployment_outputs`
- **Purpose:** Print useful outputs for post-provisioning steps.
- **Key inputs:** `github_deployer_enabled`, `route53_enabled`, `cloudfront_enabled`.
- **Outputs:** `aws_account_id`, `github_deployer_role_arn`, `cloudfront_distribution_id`, `route53_name_servers`.
- **Notes:** Prints GitHub Actions variable values and Route 53 name servers.
