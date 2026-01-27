# Provision Infrastructure

## Purpose
Create or update AWS resources with Ansible.

## Prerequisites
- AWS credentials on the machine running Ansible.
- Inventory variables configured in `ansible/inventory/group_vars/all/user.yml`.

## Expected outcome
- The required AWS resources exist and are configured.

## Provision or update
Run from the `ansible/` directory:
```bash
ansible-playbook playbooks/site.yml
```

## Finalize after ACM validation
When the ACM certificate is issued, attach it to CloudFront:
```bash
ansible-playbook playbooks/post_validation.yml
```

## Destroy resources
Tear down resources (respecting `keep_*` flags):
```bash
ansible-playbook playbooks/destroy.yml
```

## Full redeploy
Run a destroy followed by a fresh provision:
```bash
ansible-playbook playbooks/redeploy.yml
```

## Notes
- `keep_*` flags in `ansible/inventory/group_vars/all/user.yml` control which resources are preserved on destroy.
- `*_enabled` flags in `ansible/inventory/group_vars/all/all.yml` can skip entire subsystems.
- `s3_force_destroy` must be `true` to delete non-empty buckets.
- AWS region defaults to `aws_region`; ACM for CloudFront must remain in `us-east-1`.
