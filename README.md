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
- Ansible collection: `community.aws`

Example install:
```bash
pip install ansible boto3 botocore awscli
ansible-galaxy collection install -r ansible/requirements.yml
```

## AWS CLI credentials
Configure credentials with a profile:
```bash
aws configure --profile your-profile
```

Then set `aws_profile` in `ansible/group_vars/all.yml` or export `AWS_PROFILE=your-profile` before running.

Alternatively, export environment variables:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_SESSION_TOKEN` (if using temporary creds)

Make sure the credentials have permissions for S3, ACM, Route 53, CloudFront, and IAM.

## Run
```bash
cd ansible
ansible-playbook playbooks/site.yml
```
