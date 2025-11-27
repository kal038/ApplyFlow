# Repository Guidelines

## Project Structure & Module Organization
- `frontend/` React + Vite + Tailwind UI; key folders: `src/components` (reusable UI), `src/pages` (routes), `src/store` (Zustand state), `src/utils` (helpers), `public/` (static assets).
- `backend-node/` Express + TypeScript API; `src/routes` → `controllers` → `services`, shared helpers in `src/utils`, types in `src/types`, middleware in `src/middleware`, and unit tests in `src/__tests__`. Built output lands in `backend-node/dist`.
- `nginx/` holds reverse-proxy config; `docker-compose.yml` wires frontend, backend, and infra locally.
- Root `Makefile` orchestrates dev setup for both apps. Avoid committing `node_modules` or local `.env` files.

## Build, Test, and Development Commands
- Full stack dev: `make dev` (installs deps if missing) to launch backend and frontend together; `make up` also opens the app URL.
- Frontend: `cd frontend && npm run dev` for Vite dev server, `npm run build` for production bundle, `npm run preview` to smoke-test the build, `npm run lint` for ESLint.
- Backend: `cd backend-node && npm run dev` (tsup watch + node), `npm run build` (tsup), `npm start` (runs built server), `npm run lint` or `lint:fix` for ESLint, `npm run test` / `test:cov` for Vitest.

## Coding Style & Naming Conventions
- TypeScript everywhere; keep strict typing and use the `@/` path alias defined in `tsconfig` instead of deep relative paths.
- React components and pages use PascalCase filenames; hooks, stores, and utilities use camelCase. Keep controllers thin and push logic into services.
- Follow ESLint defaults in each package; run lint before sending PRs. Prefer small, single-purpose modules and early returns for clarity.

## Testing Guidelines
- Backend tests live in `backend-node/src/__tests__` and run with Vitest. Add unit tests alongside new services/middleware and prefer stubbing DynamoDB/AWS calls.
- Frontend currently has no automated tests; add component tests with your preferred Vite-friendly setup when introducing complex UI or state.
- Aim for meaningful coverage on new logic and include regression tests when fixing bugs.

## Commit & Pull Request Guidelines
- Commit messages mirror current history: short, imperative summaries (e.g., `add stale job guard`, `fix auth cookie`). One focused change per commit helps reviews.
- PRs should describe intent, list key changes, and call out testing done (`npm run test`, manual flows). Attach screenshots or GIFs for UI changes and link issues if applicable.
- Note any config/env changes (e.g., new `JWT_SECRET`, table names, or ports) in the PR description.

## Security & Configuration Tips
- Backend expects env vars such as `JWT_SECRET`, `USERS_TABLE`, `JOBS_TABLE`, and optional `STALE_JOB_DAYS`; never commit secrets. Use `.env` locally and AWS/CI secrets in deployments.
- Cookies are httpOnly; ensure CORS origin values stay strict. Avoid logging sensitive payloads in controllers/services.
