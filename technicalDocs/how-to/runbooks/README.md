# Runbooks

## Purpose
Provide short, repeatable procedures for operations and incidents.

## Prerequisites
- Access to AWS and GitHub for the environment.

## Expected outcome
- Operators can resolve common issues quickly and consistently.

## Runbook template
Use this template for new runbooks:

```
# <Runbook Title>

## Purpose
<Why this runbook exists>

## Prerequisites
- <Access required>
- <Tools required>

## Expected outcome
<What success looks like>

## Steps
1. <Step>
2. <Step>

## Rollback
<If needed>

## Verification
<How to confirm the fix>
```

## Suggested runbooks
- rotate-aws-credentials.md
- renew-acm-certificate.md
- invalidate-cloudfront-cache.md
- rollback-deploy.md
- teardown-infrastructure.md
