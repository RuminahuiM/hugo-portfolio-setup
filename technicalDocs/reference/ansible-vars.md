# Ansible Inventory Variables

## Purpose
Reference the variables defined in `ansible/inventory/group_vars`.

## Prerequisites
- Familiarity with YAML and Ansible variable precedence.

## Expected outcome
- You can update or override variables confidently.

## Where to edit
- Defaults: `ansible/inventory/group_vars/all/all.yml`
- Local overrides: `ansible/inventory/group_vars/all/user.yml`

## Core settings
| Variable | Default | Description |
| --- | --- | --- |
| `project_name` | `hugo-portfolio` | Base name for resource naming. |
| `domain_name` | `example.com` | Apex domain for Route 53 and ACM. |
| `aws_region` | `eu-north-1` | Primary region for S3 and Route 53. |
| `acm_region` | `us-east-1` | Region for ACM used by CloudFront. |
| `common_tags` | `Project`, `ManagedBy` | Tags applied to supported resources. |

## Keep flags
| Variable | Default | Description |
| --- | --- | --- |
| `keep_acm` | `true` | Preserve ACM certificates on destroy. |
| `keep_route53` | `true` | Preserve Route 53 zone on destroy. |
| `keep_s3` | `false` | Preserve S3 bucket on destroy. |
| `keep_cloudfront` | `false` | Preserve CloudFront distribution on destroy. |
| `keep_github_deployer` | `false` | Preserve GitHub deployer role on destroy. |
| `keep_iam_role` | `false` | Preserve IAM role on destroy. |

## S3 settings
| Variable | Default | Description |
| --- | --- | --- |
| `s3_enabled` | `true` | Enable S3 provisioning. |
| `bucket_subdomain` | `www` | Subdomain used for the bucket name. |
| `s3_bucket_name` | `{{ bucket_subdomain }}.{{ domain_name }}` | Bucket name for site assets. |
| `s3_apply_tags` | `true` | Apply `common_tags` to the bucket. |
| `s3_website_index` | `index.html` | Reserved for future website hosting settings. |
| `s3_website_error` | `404.html` | Reserved for future website hosting settings. |
| `s3_force_destroy` | `false` | Force delete non-empty bucket when destroying. |

## ACM settings
| Variable | Default | Description |
| --- | --- | --- |
| `acm_enabled` | `true` | Enable ACM certificate provisioning. |
| `acm_domain_name` | `{{ domain_name }}` | Primary certificate domain. |
| `acm_subject_alternative_names` | `*.{{ domain_name }}` | SANs for the certificate. |
| `acm_validation_method` | `DNS` | Validation method. |

## Route 53 settings
| Variable | Default | Description |
| --- | --- | --- |
| `route53_enabled` | `true` | Enable Route 53 provisioning. |
| `route53_zone_name` | `{{ domain_name }}` | Hosted zone name. |
| `route53_comment` | `Managed by Ansible` | Hosted zone comment. |
| `route53_private_zone` | `false` | Private zone flag. |
| `route53_vpc_id` | empty | VPC id for private zones. |
| `route53_vpc_region` | `us-east-1` | VPC region for private zones. |

## CloudFront settings
| Variable | Default | Description |
| --- | --- | --- |
| `cloudfront_enabled` | `true` | Enable CloudFront provisioning. |
| `cloudfront_caller_reference` | `{{ project_name }}-cf` | Caller reference for distribution creation. |
| `cloudfront_comment` | `{{ project_name }} distribution` | Distribution comment used for lookups. |
| `cloudfront_default_root_object` | `index.html` | Default root object. |
| `cloudfront_price_class` | `PriceClass_100` | Price class. |
| `cloudfront_aliases` | `{{ domain_name }}`, `{{ s3_bucket_name }}` | Aliases for the distribution. |
| `cloudfront_hosted_zone_id` | `Z2FDTNDATAQYW2` | Hosted zone id for CloudFront alias records. |
| `cloudfront_origin_id` | `{{ project_name }}-origin` | Origin id. |
| `cloudfront_origin_domain_name` | `{{ s3_bucket_name }}.s3.{{ aws_region }}.amazonaws.com` | S3 origin domain. |
| `cloudfront_certificate_arn` | empty | Unused by current roles; viewer certificate uses `acm_certificate_arn`. |
| `cloudfront_origins` | list | Origin definitions, enables OAI for S3. |
| `cloudfront_default_cache_behavior` | object | Cache behavior defaults. |
| `cloudfront_viewer_certificate` | object | Uses `acm_certificate_arn` and TLS settings. |

## GitHub deployer settings
| Variable | Default | Description |
| --- | --- | --- |
| `github_deployer_enabled` | `false` | Enable GitHub OIDC deployer role; required for CI deploys in this repo. |
| `github_account_name` | empty | GitHub org or user. |
| `github_repo_name` | empty | Repo name. |
| `github_repo_branch` | `main` | Branch allowed to deploy. |
| `github_repo_subject` | `repo:<org>/<repo>:ref:refs/heads/<branch>` | OIDC subject. |
| `github_repo_subjects` | empty list | Override for multiple subjects. |
| `github_oidc_provider_url` | `https://token.actions.githubusercontent.com` | OIDC provider URL. |
| `github_oidc_audience` | `sts.amazonaws.com` | OIDC audience. |
| `github_oidc_thumbprints` | list | Thumbprints for GitHub OIDC. |
| `github_deployer_role_name` | `{{ project_name }}-github-deployer` | Role name. |
| `github_deployer_role_description` | text | Role description. |
| `github_deployer_managed_policies` | empty list | Managed policies to attach. |
| `github_deployer_s3_bucket_name` | `{{ s3_bucket_name }}` | Bucket used by deployer. |
| `github_deployer_cloudfront_distribution_id` | from fact | Distribution id for invalidation. |

Note: GitHub Actions deployment is mandatory here; set `github_deployer_enabled: true` in `user.yml`.

## IAM role settings
| Variable | Default | Description |
| --- | --- | --- |
| `iam_enabled` | `false` | Enable generic IAM role provisioning. |
| `iam_role_name` | `{{ project_name }}-role` | Role name. |
| `iam_role_description` | `Role managed by Ansible` | Role description. |
| `iam_role_assume_policy` | JSON | Trust policy. |
| `iam_role_managed_policies` | empty list | Managed policies to attach. |
| `iam_role_inline_policies` | empty map | Inline policies. |

## Runtime facts
These are set by playbooks and roles and should not be edited directly:
- `acm_certificate_arn`, `acm_certificate_ready`
- `cloudfront_distribution_id`, `cloudfront_domain_name`
- `route53_zone_id`, `route53_name_servers`
- `aws_account_id`, `github_deployer_role_arn`

## Example override
`ansible/inventory/group_vars/all/user.yml`:
```yaml
project_name: "hugo-portfolio"
domain_name: "example.com"
aws_region: "eu-north-1"
bucket_subdomain: "www"

github_deployer_enabled: true
github_account_name: "your-org"
github_repo_name: "your-repo"
github_repo_branch: "main"
```
