# hugo-portfolio-setup
Sets up a Hugo portfolio hosted on AWS through Ansible.

## Ansible scaffold
This repo includes an `ansible/` scaffold to provision:
- an S3 bucket for a static website
- a certificate in ACM
- a hosted zone in Route 53
- a CloudFront distribution
- an IAM role

The S3 role also enables static website hosting using `s3_website_index` and `s3_website_error`.

Edit `ansible/group_vars/all.yml` to set values and toggle `*_enabled` flags before running. The CloudFront `distribution_config` and S3 policy/access steps are placeholders to refine later.

## Prerequisites
- Python 3 + pip
- Ansible
- AWS CLI
- boto3/botocore
- Ansible collections: `amazon.aws`, `community.aws`

Example install:
```bash
pip install ansible boto3 botocore awscli
ansible-galaxy collection install -r ansible/requirements.yml
```

Verify prerequisites:
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

## AWS CLI credentials (explicit setup)
You need AWS credentials on the machine running Ansible. For this repo we use a single method: IAM user access keys.
1) AWS Console -> IAM -> Users -> Create user.
2) Do not enable "AWS Management Console access" (CLI only).
3) Attach permissions for S3, ACM, Route 53, CloudFront, and IAM (or temporary `AdministratorAccess` while testing).
    **Permissions Policy for the User:**
```
{
"Version": "2012-10-17",
"Statement": [
    {
    "Sid": "S3StaticSite",
    "Effect": "Allow",
    "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:ListBucket",
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

4) Open the user -> Security credentials -> Create access key (CLI).
5) Copy the Access Key ID and Secret Access Key.

Set the credentials on the machine that runs Ansible (use your default region, e.g. `eu-north-1`):
```bash
export AWS_ACCESS_KEY_ID=REDACTED
export AWS_SECRET_ACCESS_KEY=REDACTED
export AWS_REGION=eu-north-1
```

Validate credentials before running Ansible:
```bash
aws sts get-caller-identity
```

When finished, delete the access key in IAM.

Make sure the credentials have permissions for S3, ACM, Route 53, CloudFront, and IAM.

ACM certificates for CloudFront must be created in `us-east-1`, so the playbook uses a dedicated `acm_region` variable. Keep `acm_region: "us-east-1"` in `ansible/group_vars/all.yml`, and set your normal region in `ansible/group_vars/user.yml`.

## Configure User Inputs
Edit the user configuration file before running anything:
`ansible/group_vars/user.yml`

This is where you set:
- `domain_name`
- `aws_region`
- `bucket_subdomain`
- `github_account_name`
- `github_repo_name`
- `github_repo_branch`
- `github_deployer_enabled`

## GitHub Deployer Role (OIDC)
This repo can create a GitHub Actions OIDC role for deployments. Enable and configure it in `ansible/group_vars/user.yml`:
```yaml
github_deployer_enabled: true
github_account_name: "YOUR_GITHUB_NAME_OR_ORG"
github_repo_name: "YOUR_REPO"
github_repo_branch: "main"
```

The trust policy is generated from `github_repo_subject` (or `github_repo_subjects` if you need multiple branches). The role grants:
- S3 sync permissions to `github_deployer_s3_bucket_name`.
- CloudFront invalidation for `github_deployer_cloudfront_distribution_id` (if set).

After running the playbook, fetch the role ARN for your GitHub workflow:
```bash
aws iam get-role --role-name <role-name> --query Role.Arn --output text
```

## After The First Run
The `site.yml` playbook prints:
- The GitHub Actions repository variables to set.
- The Route 53 name servers for your hosted zone.

Set Route 53 name servers at your registrar:
1) Go to your domain registrar’s DNS settings.
2) Replace the current name servers with the Route 53 name servers printed by the playbook.
3) Wait for DNS propagation (can take minutes to hours).

Set GitHub repository variables:
1) In GitHub, open your repo → Settings → Secrets and variables → Actions → Variables.
2) Create variables matching the names printed by the playbook:
   - `AWS_REGION`
   - `AWS_ROLE_ARN` (if your workflow uses OIDC)
   - `BUCKET_NAME`
   - `CF_DISTRIBUTION_ID`
   - `SITE_BASE_URL`

After ACM validation is complete, run:
```bash
cd ansible
ansible-playbook playbooks/post_validation.yml
```

Once DNS has propagated, your GitHub Actions workflow will deploy to S3 on every push. You can trigger a deploy by committing any change and pushing to the configured branch.

## Run
```bash
cd ansible
ansible-playbook playbooks/site.yml
```

## Post-validation (ACM -> CloudFront)
CloudFront can only accept custom aliases when the ACM certificate is `ISSUED` in `us-east-1`. The first run requests the cert and creates DNS validation records; once ACM finishes validation, run this playbook to attach the custom cert + aliases:
```bash
cd ansible
ansible-playbook playbooks/post_validation.yml
```

## Destroy / Redeploy
Destroy all enabled resources (force-deletes S3 objects):
```bash
cd ansible
ansible-playbook playbooks/destroy.yml
```

Destroy then recreate in one step:
```bash
cd ansible
ansible-playbook playbooks/redeploy.yml
```
