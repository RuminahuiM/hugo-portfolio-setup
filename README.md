# hugo-portfolio-setup
Sets up a Hugo portfolio hosted on AWS through Ansible.

## Ansible scaffold
This repo includes an `ansible/` scaffold to provision:
- an S3 bucket for a static website
- a certificate in ACM
- a hosted zone in Route 53
- a CloudFront distribution
- an IAM role

Edit `ansible/group_vars/all.yml` to set values and toggle `*_enabled` flags before running. The CloudFront `distribution_config` and S3 website/policy steps are placeholders to refine later.

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

## AWS CLI credentials (explicit setup)
You need AWS credentials on the machine running Ansible. For this repo we use a single method: IAM user access keys.
1) AWS Console -> IAM -> Users -> Create user.
2) Do not enable "AWS Management Console access" (CLI only).
3) Attach permissions for S3, ACM, Route 53, CloudFront, and IAM (or temporary `AdministratorAccess` while testing).
4) Open the user -> Security credentials -> Create access key (CLI).
5) Copy the Access Key ID and Secret Access Key.

Set the credentials on the machine that runs Ansible (use your default region, e.g. `eu-north-1`):
```bash
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
export AWS_REGION=eu-north-1
```

Validate credentials before running Ansible:
```bash
aws sts get-caller-identity
```

When finished, delete the access key in IAM.

Make sure the credentials have permissions for S3, ACM, Route 53, CloudFront, and IAM.

ACM certificates for CloudFront must be created in `us-east-1`, so the playbook uses a dedicated `acm_region` variable. Set your default region in `ansible/group_vars/all.yml`, and keep `acm_region: "us-east-1"`.

## Run
```bash
cd ansible
ansible-playbook playbooks/site.yml
```
