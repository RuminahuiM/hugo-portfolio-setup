# Manual Deploy

## Purpose
Build the site locally and upload it to S3 without CI.

## Prerequisites
- Local Hugo installation.
- AWS CLI configured with credentials that can write to the bucket and invalidate CloudFront.

## Expected outcome
- The site is updated in S3 and CloudFront cache is refreshed.

## Steps

1. Build the site.
   ```bash
   hugo --minify --source hugo-site --baseURL "https://<domain>/"
   ```

2. Sync the build output to S3.
   ```bash
   aws s3 sync hugo-site/public/ s3://<bucket-name> --delete --cache-control max-age=31536000
   ```

3. Invalidate CloudFront cache.
   ```bash
   aws cloudfront create-invalidation --distribution-id <distribution-id> --paths "/*"
   ```

## Notes
- Use the same `baseURL` as `SITE_BASE_URL` to avoid broken asset paths.
- If you do not have CloudFront permissions, you can skip invalidation and wait for cache expiry.
