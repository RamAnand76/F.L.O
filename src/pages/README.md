# Pages Directory

This directory contains the main route components of the application.

## Pages

- `Auth.tsx`: Login and registration flow.
- `ConnectGithub.tsx`: Initial GitHub OAuth and data fetching.
- `Dashboard.tsx`: Overview of the user's account and quick actions.
- `FolioControl.tsx`: Interface for selecting repositories and managing skills.
- `PreviewEditor.tsx`: The main builder where users customize their portfolio.
- `Profile.tsx`: User settings and account management.
- `Templates.tsx`: Gallery of available portfolio templates.

## Guidelines
- Pages should primarily handle data fetching and coordinate feature components.
- Avoid putting large amounts of JSX directly in the page; extract logic into `src/components/features`.
- Use `motion/react` for page-level entrance and exit animations.
