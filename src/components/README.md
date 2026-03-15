# Components Directory

This directory contains all reusable UI components, organized by their scope and complexity.

## Structure

- `layout/`: Global structural components like the navigation bar, footer, and main layout wrapper.
- `features/`: Feature-specific components that are too complex to be generic.
  - `editor/`: Components used in the Portfolio Preview Editor.
  - `dashboard/`: Components used in the user dashboard and folio control.
- `templates/`: The portfolio templates that users can select and customize.
- `ui/`: Atomic UI primitives. These should be pure, highly reusable, and independent of application state.
  - `Button.tsx` (TODO)
  - `Modal.tsx`
  - `Badge.tsx`

## Guidelines
- Keep logic out of `ui/` components as much as possible.
- Use `cn()` utility for tailwind class merging.
- Prefer functional components with TypeScript interfaces for props.
