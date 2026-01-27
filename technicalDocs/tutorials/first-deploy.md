# First Deployment Tutorial

## Purpose
Walk through the first end-to-end deployment of the Hugo portfolio.

## Prerequisites
- AWS account with IAM permissions for S3, CloudFront, Route 53, ACM, and IAM.
- A registered domain name you can delegate to Route 53.
- Local tools: Python 3, Ansible, AWS CLI.

## Expected outcome
- AWS resources are provisioned.
- GitHub Actions variables are set.
- The site is reachable over HTTPS.

## Steps

1. Install dependencies and Ansible collections.
   ```bash
   pip install ansible boto3 botocore awscli
   ansible-galaxy collection install -r ansible/requirements.yml
   ```

2. Configure inventory overrides in `ansible/inventory/group_vars/all/user.yml`.
   Set at least:
   - `project_name`
   - `domain_name`
   - `aws_region`
   - `bucket_subdomain`
   - `github_deployer_enabled: true`
   - `github_account_name`, `github_repo_name`, `github_repo_branch`

   This repo assumes GitHub Actions deployment; keep the GitHub deployer enabled.

3. Provision AWS resources.
   ```bash
   cd ansible
   ansible-playbook playbooks/site.yml
   ```

4. Update your registrar with the Route 53 name servers printed by Ansible.

5. Wait for ACM to issue the certificate (in `us-east-1`).
   You can check in the AWS Console or via CLI.

6. Finalize CloudFront with the issued certificate.
   ```bash
   cd ansible
   ansible-playbook playbooks/post_validation.yml
   ```

7. Set GitHub Actions repository variables from the Ansible output.
   Required variables for `.github/workflows/deployToS3.yml`:
   - `AWS_REGION`
   - `DEPLOY_BRANCH`
   - `AWS_ROLE_ARN`
   - `BUCKET_NAME`
   - `CF_DISTRIBUTION_ID`
   - `SITE_BASE_URL`
   - `HUGO_VERSION` (set manually, for example `0.123.8`)

   Keep `DEPLOY_BRANCH` aligned with `github_repo_branch` in `user.yml`.

8. Push to the branch set in `DEPLOY_BRANCH` to trigger the workflow.

9. Verify the site over HTTPS at `https://<domain>`.
