# Ticket 001: Project Scaffolding & Setup

## Status: READY
## Blocked By: None

## Description
Set up the React Client-Side Rendered (CSR) project with TypeScript, Vite, Tailwind CSS, Vitest, and React Testing Library.

## Acceptance Criteria
- `package.json` with scripts: `dev`, `build`, `preview`, `test`.
- Vite configured with `@vitejs/plugin-react`.
- TypeScript configured (`tsconfig.json`, `tsconfig.node.json`, `tsconfig.app.json` or unified).
- Tailwind CSS configured (`tailwind.config.js`, `postcss.config.js`, `src/index.css`).
- Vitest configured (`vitest.config.ts`, `vitest.setup.ts`) with jsdom environment and `@testing-library/jest-dom`.
- `index.html` configured for CSR mounting to `#root`.
- Running `npm run build` and `npm test` succeeds.
