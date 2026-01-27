# Update Site Content Tutorial

## Purpose
Make a content change and publish it.

## Prerequisites
- The site has been deployed at least once.
- GitHub Actions variables are configured for the deploy workflow.

## Expected outcome
- New content appears on the public site.

## Steps

1. Edit or add content under `hugo-site/content/`.

2. Preview locally with Hugo.
   ```bash
   hugo server --source hugo-site --baseURL http://localhost:1313/
   ```

3. Commit and push to the branch configured in `DEPLOY_BRANCH`.

4. Confirm `.github/workflows/deployToS3.yml` completes successfully.

5. Verify the update in the browser. If changes are not visible, wait for cache or invalidate CloudFront.
