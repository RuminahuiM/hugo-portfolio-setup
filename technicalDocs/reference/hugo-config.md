# Hugo Configuration Reference

## Purpose
Reference configuration in `hugo-site/config/_default`.

## Prerequisites
- Familiarity with Hugo configuration files.

## Expected outcome
- You know where to change site settings, theme options, and content behavior.

## Key files
- `hugo-site/config/_default/config.toml`
  - Core site settings: `baseurl`, `title`, `languageCode`, `pagination`.
  - `uglyurls` is false to work with CloudFront.
- `hugo-site/config/_default/params.toml`
  - Theme-specific settings for sidebar, widgets, comments, and social links.
- `hugo-site/config/_default/menu.toml`
  - Social links (GitHub, LinkedIn) and optional main menu.
- `hugo-site/config/_default/module.toml`
  - Theme module import: `github.com/CaiJimmy/hugo-theme-stack/v3`.
- `hugo-site/config/_default/markup.toml`
  - Markdown rendering, syntax highlighting, and table of contents settings.
- `hugo-site/config/_default/permalinks.toml`
  - URL patterns for posts and pages.
- `hugo-site/config/_default/related.toml`
  - Related content weights and indices.
- `hugo-site/config/_default/_languages.toml`
  - Template for multilingual support; rename to `languages.toml` to enable.

## Content and assets
- `hugo-site/content/` holds pages and posts.
- `hugo-site/static/` is served as-is (images, icons, files).
- `hugo-site/assets/` holds assets processed by Hugo Pipes.

## Deployment note
Keep `baseurl` aligned with `SITE_BASE_URL` used in `.github/workflows/deployToS3.yml`.
