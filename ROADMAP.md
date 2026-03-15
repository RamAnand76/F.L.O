# Project Roadmap & Publishing Strategy

This document outlines the current state and future plans for the portfolio publishing mechanism.

## Current State (MVP)
The application currently supports a **GitHub-centric** workflow for the MVP stage.

### GitHub Pages Integration
- **Mechanism**: Automated repository creation and deployment via GitHub Pages.
- **Custom Domains**: Supported via `CNAME` file injection and GitHub API configuration.
- **Status**: Implementation in progress.

## Future Strategy (Post-MVP)
As the platform scales, we plan to integrate more robust hosting solutions.

### Vercel Integration
- **Why**: Better DX, automated SSL management, superior edge performance, and seamless custom domain verification.
- **Workflow**:
  - Connect Vercel via OAuth.
  - Deploy via Vercel API (sending file bundles).
  - Automated DNS verification challenges for custom domains.

### Advanced Features
- **Wildcard Subdomains**: `*.folio.com` for instant dynamic publishing without build steps.
- **Analytics**: Integrated visitor tracking for published portfolios.
- **A/B Testing**: Allow users to test different templates on live domains.

---
*Note: This roadmap is a living document and will be updated as we evolve the product.*
