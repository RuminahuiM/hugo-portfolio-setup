# AWS Resources Reference

## Purpose
List AWS resources created by this project.

## Prerequisites
- Familiarity with AWS services used by static site hosting.

## Expected outcome
- You can identify the AWS resources and their relationships.

Note: Values shown use Ansible variable names in `{{ }}`. Substitute actual values from your inventory.

## S3
- **Bucket:** `{{ bucket_subdomain }}.{{ domain_name }}`
- **Region:** `{{ aws_region }}`
- **Purpose:** Origin for CloudFront; stores Hugo build output.
- **Notes:** No website hosting enabled; access controlled via CloudFront OAI.

## CloudFront
- **Distribution:** Comment set to `{{ project_name }} distribution`.
- **Origins:** S3 bucket origin with OAI enabled.
- **Aliases:** `{{ domain_name }}` and `{{ s3_bucket_name }}`.
- **Certificate:** ACM certificate in `us-east-1` when issued.

## ACM
- **Certificate:** `{{ domain_name }}` with SAN `*.{{ domain_name }}`.
- **Region:** `us-east-1` (required by CloudFront).
- **Validation:** DNS via Route 53.

## Route 53
- **Hosted zone:** `{{ domain_name }}`.
- **Records:**
  - A and AAAA alias for `{{ s3_bucket_name }}` -> CloudFront distribution.
  - A alias for root domain -> `{{ s3_bucket_name }}`.
  - ACM validation CNAME records.

## IAM (GitHub deployer)
- **OIDC provider:** `token.actions.githubusercontent.com`.
- **Role:** `{{ project_name }}-github-deployer`.
- **Policies:** Inline S3 sync and optional CloudFront invalidation.

## IAM (optional)
- **Role:** `{{ project_name }}-role` when `iam_enabled` is true.
