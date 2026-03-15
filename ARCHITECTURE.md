# Project Architecture & Organization

Welcome to the Folio codebase! This document explains how the project is structured to help you find your way around easily.

## Directory Structure

### `/src/pages`
Contains the top-level page components. Each file represents a route in the application.
- `Dashboard.tsx`: The main user home.
- `PreviewEditor.tsx`: The core portfolio builder interface.
- `FolioControl.tsx`: Management of published sites and domains.

### `/src/components`
Organized by scope:
- `layout/`: Global layout components (TopNav, Dock, Sidebar).
- `features/`: Complex components specific to a feature (e.g., `editor/`, `dashboard/`).
- `templates/`: The actual portfolio templates that users can choose from.
- `ui/`: Reusable, low-level UI primitives (Buttons, Inputs, Modals).

### `/src/store`
State management using **Zustand**. 
- `useStore.ts`: The central store for user data, selected templates, and app state.

### `/src/lib`
Utility functions, shared constants, and third-party library initializations (e.g., `utils.ts` for Tailwind merging).

### `/src/services`
Logic for interacting with external APIs (GitHub, Firebase).

## Design Principles
1. **Atomic UI**: Keep UI components in `src/components/ui` pure and reusable.
2. **Feature Isolation**: Logic related to the editor should stay within the `editor` feature folder.
3. **Responsive First**: Use Tailwind's mobile-first utilities (`sm:`, `md:`, `lg:`).
4. **Type Safety**: Always define interfaces for component props and store state.

## Getting Started
To add a new feature:
1. Define any new state in `src/store/useStore.ts`.
2. Create reusable UI components in `src/components/ui`.
3. Build the feature components in `src/components/features/[feature-name]`.
4. Add a new page in `src/pages` and register it in `src/App.tsx`.
