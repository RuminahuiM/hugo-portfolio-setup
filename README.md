# hugo-portfolio-setup - Getting started
This project provides a full, reproducible workflow for hosting a Hugo portfolio on AWS (S3 + CloudFront + Route 53 + ACM) and deploying updates via GitHub Actions.

## What this provisions
- S3 bucket (site origin)
- CloudFront distribution (CDN)
- ACM certificate in us-east-1 (required for CloudFront)
- Route 53 hosted zone and DNS records
- GitHub Actions OIDC deployer role

Note: S3 website hosting and public access are not enabled. CloudFront accesses S3 using a private origin identity.

## Repository layout
- `ansible/`: Infrastructure provisioning and teardown.
- `hugo-site/`: Hugo site source. Edit content and config here.
- `.github/workflows/`: GitHub Actions for S3 deployment and optional theme maintenance.

## Quick overview (initial deployment flow)
1) Buy a domain from a registrar (you will point it to Route 53 later).
2) Configure your inputs in `ansible/inventory/group_vars/all/user.yml`.
3) Run `ansible-playbook playbooks/site.yml` from the `ansible/` folder.
4) Update your domain registrar with the Route 53 name servers the playbook prints.
5) Wait for ACM validation (DNS) to complete.
6) Run `ansible-playbook playbooks/post_validation.yml` to attach the cert and aliases to CloudFront.
7) Push to your GitHub repo to trigger GitHub Actions to deploy to S3.
8) After DNS propagation, your Hugo site will be reachable at your domain.

## Prerequisites
All commands below run in a terminal on the machine that will run Ansible.

Required tools:
- Python 3 + pip
- Ansible
- AWS CLI
- boto3/botocore
- Ansible collections: `amazon.aws`, `community.aws`

Install (run in terminal):
```bash
pip install ansible boto3 botocore awscli
ansible-galaxy collection install -r ansible/requirements.yml
```

Verify installs (run in terminal):
```bash
python3 --version
pip3 --version
ansible --version
aws --version
python3 - <<'PY'
import boto3, botocore
print("boto3", boto3.__version__, "botocore", botocore.__version__)
PY
ansible-galaxy collection list | grep -E 'amazon.aws|community.aws'
``` 

## AWS credentials
You need AWS credentials on the machine running Ansible. Use an IAM user with access keys.

1) AWS Console -> IAM -> Users -> Create user.
2) Do not enable AWS Management Console access (CLI only).
3) Attach permissions for S3, ACM, Route 53, CloudFront, and IAM (or temporary `AdministratorAccess` while testing).
   This IAM user is meant for one-time setup. After deployment, deactivate or delete the access key (or the user) in IAM.

Permissions policy for the user (click to expand):
<details>
<summary>IAM policy JSON</summary>

```json
{
"Version": "2012-10-17",
"Statement": [
    {
    "Sid": "S3StaticSite",
    "Effect": "Allow",
    "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:DeleteObject",
        "s3:DeleteObjectVersion",
        "s3:ListBucket",
        "s3:ListBucketVersions",
        "s3:GetBucketLocation",
        "s3:GetBucketPolicy",
        "s3:GetBucketWebsite",
        "s3:GetBucketTagging",
        "s3:GetBucketVersioning",
        "s3:GetBucketRequestPayment",
        "s3:GetBucketPublicAccessBlock",
        "s3:GetBucketOwnershipControls",
        "s3:GetBucketAcl",
        "s3:GetBucketObjectLockConfiguration",
        "s3:GetInventoryConfiguration",
        "s3:PutBucketWebsite",
        "s3:PutBucketPolicy",
        "s3:PutBucketPublicAccessBlock",
        "s3:PutBucketTagging",
        "s3:PutBucketAcl"
    ],
    "Resource": "*"
    },
    {
    "Sid": "ACM",
    "Effect": "Allow",
    "Action": [
        "acm:RequestCertificate",
        "acm:DescribeCertificate",
        "acm:DeleteCertificate",
        "acm:ListCertificates",
        "acm:ListTagsForCertificate",
        "acm:AddTagsToCertificate",
        "acm:RemoveTagsFromCertificate"
    ],
    "Resource": "*"
    },
    {
    "Sid": "Route53",
    "Effect": "Allow",
    "Action": [
        "route53:CreateHostedZone",
        "route53:DeleteHostedZone",
        "route53:GetHostedZone",
        "route53:UpdateHostedZoneComment",
        "route53:ListHostedZones",
        "route53:ListResourceRecordSets",
        "route53:ChangeResourceRecordSets",
        "route53:GetChange",
        "route53:GetDNSSEC",
        "route53:EnableHostedZoneDNSSEC",
        "route53:DisableHostedZoneDNSSEC",
        "route53:ListTagsForResource",
        "route53:ChangeTagsForResource"
    ],
    "Resource": "*"
    },
    {
    "Sid": "CloudFront",
    "Effect": "Allow",
    "Action": [
        "cloudfront:CreateDistribution",
        "cloudfront:UpdateDistribution",
        "cloudfront:GetDistribution",
        "cloudfront:GetDistributionConfig",
        "cloudfront:DeleteDistribution",
        "cloudfront:ListDistributions",
        "cloudfront:CreateCloudFrontOriginAccessIdentity",
        "cloudfront:GetCloudFrontOriginAccessIdentity",
        "cloudfront:ListCloudFrontOriginAccessIdentities",
        "cloudfront:DeleteCloudFrontOriginAccessIdentity",
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:TagResource",
        "cloudfront:UntagResource",
        "cloudfront:ListTagsForResource"
    ],
    "Resource": "*"
    },
    {
    "Sid": "GitHubOIDCProvider",
    "Effect": "Allow",
    "Action": [
        "iam:CreateOpenIDConnectProvider",
        "iam:DeleteOpenIDConnectProvider",
        "iam:GetOpenIDConnectProvider"
    ],
    "Resource": "*"
    },
    {
    "Sid": "STS",
    "Effect": "Allow",
    "Action": [
        "sts:GetCallerIdentity"
    ],
    "Resource": "*"
    },
    {
    "Sid": "IAMRole",
    "Effect": "Allow",
    "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:UpdateRoleDescription",
        "iam:UpdateAssumeRolePolicy",
        "iam:AttachRolePolicy",
        "iam:DetachRolePolicy",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:TagRole",
        "iam:UntagRole",
        "iam:ListAttachedRolePolicies",
        "iam:ListRolePolicies"
    ],
    "Resource": "*"
    }
]
}
```

</details>

4) IAM user -> Security credentials -> Create access key (CLI).
5) Export the credentials in the same terminal session you will run Ansible:
```bash
export AWS_ACCESS_KEY_ID=YOURKEYID
export AWS_SECRET_ACCESS_KEY=YOURACCESSKEY
export AWS_REGION=YOURAWSREGION
```

Validate credentials (run this once; it should print your AWS account ID):
```bash
aws sts get-caller-identity
```

## Configure user inputs
Defaults live in `ansible/inventory/group_vars/all/all.yml`.
Your overrides live in `ansible/inventory/group_vars/all/user.yml`.

If you are starting fresh, copy the example file into the correct location:
```bash
cp ansible/inventory/group_vars/user.example.yml ansible/inventory/group_vars/all/user.yml
```
Then open `ansible/inventory/group_vars/all/user.yml` and edit the values you need.
`user.yml` is git-ignored so local values do not get committed.

Common settings (plain English):
- `domain_name`: your root domain, e.g. `example.com`.
- `aws_region`: region for S3 and Route 53 resources, e.g. `eu-north-1`.
- `bucket_subdomain`: usually `www` so the bucket becomes `www.domain_name`.
- `github_*`: settings for GitHub Actions OIDC (required).

## Branch workflow - Recomendation
Keep `main` as the default template branch. Create a separate branch (for example `public`) where you edit your content and configuration.
Later for Github Actions set `DEPLOY_BRANCH` to that branch, and push updates there to trigger deployment.

## Hugo site source
The Hugo site lives in `hugo-site/`. Edit content/config there, commit, and push.
GitHub Actions workflows live in `.github/workflows/` and build the site from `hugo-site/`.

## Keep flags (redeploy and destroy)
Keep flags control what gets deleted during destroy/redeploy.
- `true` means keep the existing resource.
- `false` means delete and recreate that resource.

Defaults:
- `keep_acm: true` (avoid waiting for new certificate validation)
- `keep_route53: true` (avoid new name servers)
- Others default to `false` (recreate on redeploy)

You can override any of these per run with `-e`, for example:
```bash
ansible-playbook playbooks/redeploy.yml -e '{"keep_acm": false, "keep_route53": false}'
```

## Initial deploy (normal run)
Run this from the `ansible/` directory:
```bash
cd ansible
ansible-playbook playbooks/site.yml
```
This creates S3, Route 53, ACM, CloudFront, and (optionally) the GitHub OIDC role.

On the first run:
- ACM is requested and DNS validation records are created in Route 53.
- CloudFront is created with the default certificate until ACM is issued.

## After the first run
The playbook prints:
- GitHub Actions repository variables to set.
- Route 53 name servers for your hosted zone.

Update your domain registrar to use the printed Route 53 name servers (DNS propagation can take minutes to hours).

Set GitHub repository variables:
1) GitHub repo -> Settings -> Secrets and variables -> Actions -> Variables.
2) Add the variables printed by the playbook (all are required for deployments):
   - `AWS_REGION`
   - `DEPLOY_BRANCH`
   - `AWS_ROLE_ARN`
   - `BUCKET_NAME`
   - `CF_DISTRIBUTION_ID`
   - `SITE_BASE_URL`

## Post-validation (attach ACM to CloudFront)
CloudFront can only use a custom certificate and aliases after the ACM cert is `ISSUED` in `us-east-1`.
Once validation is complete (check AWS Certificate Manager), run:
```bash
cd ansible
ansible-playbook playbooks/post_validation.yml
```

## Deploy the site
Push changes to your repo on the branch named in `DEPLOY_BRANCH`.
The workflow only runs when the branch name matches.

## Redeploy and destroy use cases
All commands run from `ansible/`.

Default redeploy (keeps ACM and Route 53):
```bash
ansible-playbook playbooks/redeploy.yml
```
Use this when you changed config and want to recreate S3/CloudFront quickly.

Full redeploy (also recreates ACM and Route 53):
```bash
ansible-playbook playbooks/redeploy.yml -e '{"keep_acm": false, "keep_route53": false}'
```
Use this only if you want a brand new certificate and hosted zone.
Note: recreating the hosted zone changes name servers, so you must update the registrar again. You will have to wait for DNS propagation and certificate validation again. Afterwards run the post_validation playbook again.

Destroy only (uses keep flags in `user.yml`):
```bash
ansible-playbook playbooks/destroy.yml
```
Use this if you want to tear down most resources but keep ACM/Route 53 by default.

Full destroy (remove ACM and Route 53 too):
```bash
ansible-playbook playbooks/destroy.yml -e '{"keep_acm": false, "keep_route53": false}'
```
Use this when you want everything removed.

## GitHub deployer role (OIDC)
Enable it in `ansible/inventory/group_vars/all/user.yml`:
```yaml
github_deployer_enabled: true
github_account_name: "YOUR_GITHUB_NAME_OR_ORG"
github_repo_name: "YOUR_REPO"
github_repo_branch: "main"
```

The role grants:
- S3 sync permissions to `github_deployer_s3_bucket_name`.
- CloudFront invalidation for `github_deployer_cloudfront_distribution_id` (if set).

Make sure `github_repo_branch` matches `DEPLOY_BRANCH`, otherwise OIDC assumes a different branch than the workflow uses.

If you change `github_account_name`, `github_repo_name`, or `github_repo_branch`, redeploy the GitHub role:
```bash
ansible-playbook playbooks/redeploy.yml -e '{"keep_s3": true, "keep_cloudfront": true, "keep_acm": true, "keep_route53": true, "keep_iam_role": true, "keep_github_deployer": false}'
```

## Operational notes
- If you destroy ACM (`keep_acm: false`), the CloudFront distribution is deleted first to free the certificate. This can take time.
- If S3 deletion fails with `AccessDenied`, ensure `s3:ListBucketVersions` and `s3:DeleteObjectVersion` are included in the IAM policy.

## Troubleshooting
- OIDC assume role fails: verify `github_account_name`, `github_repo_name`, and `github_repo_branch` in `user.yml` match the GitHub repo and branch exactly (case sensitive). Then redeploy the GitHub role.
- Artifact upload fails with `Zone.Identifier`: remove the file and ensure `*:Zone.Identifier` is in `.gitignore`.
- CloudFront delete takes a long time: AWS can take several minutes to disable and remove a distribution.
- Certificate not attached: wait for ACM status `ISSUED`, then run `playbooks/post_validation.yml`.

