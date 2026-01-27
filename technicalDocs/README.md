# Technical Documentation

## Purpose
Provide the source of truth for technical documentation for the Hugo portfolio setup (Ansible provisioning, AWS hosting, GitHub Actions deployment, and Hugo site content).

## Prerequisites
- Basic CLI usage and Git familiarity.
- Basic AWS concepts (S3, CloudFront, Route 53, ACM, IAM).

## Expected outcome
- You can find how to deploy, operate, and modify the system.
- You can add or update docs consistently.

## Documentation model
This repo follows the Diataxis model:
- Tutorials: learning oriented, step by step walkthroughs.
- How-to guides: task oriented instructions for specific outcomes.
- Reference: factual, complete descriptions of interfaces and configuration.
- Explanation: background, architecture, and rationale.

Troubleshooting is separate for quick lookup.

## Doc map
- `explanation/` - architecture, security, and rationale.
- `tutorials/` - guided, learning oriented paths.
- `how-to/` - task guides and operational runbooks.
- `reference/` - configuration, roles, workflows, and AWS resources.
- `troubleshooting/` - symptoms, causes, and fixes.

## Writing conventions
- Start each doc with Purpose, Prerequisites, and Expected outcome.
- Use numbered steps for actions.
- Put commands in code blocks.
- Link to repo files with relative paths.
- Prefer accuracy over completeness; note unknowns explicitly.

## Sources and standards
- Diataxis documentation framework: https://diataxis.fr/
- Write the Docs guide: https://www.writethedocs.org/guide/
- Google developer documentation style guide: https://developers.google.com/style
- The Good Docs Project: https://thegooddocsproject.dev/
