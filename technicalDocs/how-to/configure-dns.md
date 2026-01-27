# Configure DNS and Certificate Validation

## Purpose
Point the domain to Route 53 and validate ACM.

## Prerequisites
- Route 53 hosted zone created by Ansible.
- Access to your domain registrar.

## Expected outcome
- DNS resolves to CloudFront and ACM validation succeeds.

## Steps

1. From `ansible/`, run the provisioning playbook to create the hosted zone.
   ```bash
   cd ansible
   ansible-playbook playbooks/site.yml
   ```

2. Copy the Route 53 name servers printed by the `deployment_outputs` role.

3. Update your registrar to use those Route 53 name servers for the domain.

4. Wait for DNS propagation (commonly up to 24 hours).

5. ACM validation records are created automatically in Route 53 by the `acm_certificate` role.

6. After the certificate is issued, finalize CloudFront from `ansible/`.
   ```bash
   cd ansible
   ansible-playbook playbooks/post_validation.yml
   ```

## Notes
- The root domain is aliased to `www` by `route53_records` (A record to `{{ s3_bucket_name }}`).
- The `www` record is aliased to CloudFront (A and AAAA records).
- If you disable `route53_enabled`, you must create the ACM DNS validation records manually.
