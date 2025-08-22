# Copilot / AI agent instructions for ApplyFlow

Goal: help an AI coding agent be immediately productive editing, testing, and extending this repo.

Quick overview

- Monorepo-like layout: `frontend/` (React + Vite + Tailwind + Zustand) and `backend-node/` (Express + TypeScript + Passport JWT + DynamoDB). Top-level `docker-compose.yml` and `nginx/` for deployment.
- API surface: backend serves endpoints under `/api/v1/*` (see `backend-node/src/routes/*`). Frontend uses relative fetches (e.g. `fetch('/api/v1/jobs')`) and expects a dev proxy or VITE_API_URL.

Key files to inspect before changes

- Backend
  - `backend-node/src/app.ts` — Express app and route registrations
  - `backend-node/src/routes/jobs.ts` and `backend-node/src/controllers/jobsController.ts` — job CRUD controllers (Zod validation live here)
  - `backend-node/src/types/job.ts` — Zod schemas used to validate input/output
  - `backend-node/src/config/passport.ts` — JWT cookie extraction and auth strategy (JWT stored in httpOnly cookie)
  - `backend-node/Dockerfile`, `docker-compose.yml` — containerization
- Frontend
  - `frontend/src/pages/DashboardPage.tsx` — main UI, toggles between table/cards, owns selection state and bulk actions
  - `frontend/src/components/app/JobTable.tsx` — table rendering, row selection, integrates with react-table
  - `frontend/src/components/app/JobCard.tsx` & `JobCards` pattern — card rendering; selection is controlled by parent
  - `frontend/src/components/app/JobFormModal.tsx` — add/edit modal used by DashboardPage
  - `frontend/src/store/useJobStore.ts` — Zustand store: fetchJobs, addJob (optimistic), deleteJob (optimistic), updateJob, moveJob
  - `frontend/src/store/useAuthStore.ts` — auth actions (login/signup/logout), persisted state
  - `frontend/src/App.tsx` — bootstraps routes and API health check

How AI should respond:

- Only give relevant file structures and at most boilerplate for the features that need to be implemented
- Then give an overview of tasks that need to be completed in order for requested feature to be implemented

Important architectural patterns & conventions

- Auth: JWTs are signed server-side and set as httpOnly cookies on login. Passport JWT strategy pulls cookie and populates `req.user`. Frontend sends requests with `credentials: 'include'` where needed.
- Validation: backend uses Zod schemas (`backend-node/src/types/job.ts`) to validate inputs and responses. Controllers call `schema.parse(...)` before returning data.
- Frontend state: Zustand stores in `frontend/src/store/*` hold app state; prefer using store actions for data mutations (add/update/delete) rather than local-only changes.
- Optimistic updates: `useJobStore.addJob` and `deleteJob` use optimistic UI updates. New jobs may be created with temporary IDs client-side and replaced after server response (repo already contains optimistic patterns).
- Selection model: parent (DashboardPage) owns `selectedJobIds` and passes `isSelected` and `onToggleSelect` to card/table children. JobTable also supports `onSelectionChange` and `selectedIds` props to remain controlled.
- UI theming: Tailwind CSS with design tokens in `frontend/src/index.css` and `tailwind.config.js`.
- Drag & drop: dnd-kit is preferred (repo already includes dnd-kit entries in package.json). Use `moveJob` in the store to make client-side reorders; persist if needed.

Developer workflows (how to run/build/test)

- Frontend dev (Vite):
  - cd frontend
  - npm install
  - npm run dev
  - open http://localhost:5173 (Vite default)
- Backend dev (Express/TS):
  - cd backend-node
  - npm install
  - npm run dev # uses tsup + node to watch and restart
  - backend typically listens on port defined in `server.ts` (check file) or 3030 in Dockerfile
- Full stack: run frontend + backend in two terminals; or use `docker-compose.yml` to start containers.
- Lint & tests:
  - Frontend: `npm run lint` inside `frontend/` (ESLint + Tailwind rules)
  - Backend: `npm run lint` and tests with `npm test` (vitest) in `backend-node/`

How requests are routed in dev

- Frontend uses relative fetches like `/api/v1/jobs`.
- Check `frontend/vite.config.ts` for a `server.proxy` entry. If missing, the dev server will request same origin (Vite) and fail; preferred solutions:
  - Add a proxy in `vite.config.ts` pointing `/api` to `http://localhost:<backend-port>`
  - Or use `VITE_API_URL` environment variable and update fetch calls to prefix with it

Common pitfalls and debugging tips

- "state.jobs is not iterable" — ensure `useJobStore.jobs` is initialized to `[]` and guard against API responses that return `null` or unexpected shapes; `Array.isArray` check used in store.
- Zod errors in controllers — use `error.issues` (not `error.errors`) when formatting ZodError responses.
- Expired JWTs — frontend must handle 401s: either implement refresh-token flow or handle 401 globally (api wrapper that calls logout and redirects to /login). See `frontend/src/utils/apiFetch` suggestion in PRs.
- Dev proxy misconfiguration — look at Network tab to confirm actual host/port. If calls hit Vite origin, add proxy.
- Optimistic updates: the UI may show temporary jobs with `temp-<ts>` ids until a refresh; this is intentional. If persisting ordering/server-side IDs is required, call the API after reordering.

Patterns to follow when modifying code

- Use existing store actions (useJobStore) to mutate jobs — keeps UI consistent and centralizes optimistic behaviour.
- Validate controller responses with Zod before sending to client (`jobResponseSchema` / `jobsResponseSchema`). Keep error handling consistent (400 for Zod issues). See `backend-node/src/controllers/jobsController.ts`.
- Keep selection state in parent (DashboardPage) so bulk actions (clear/delete) work across table and card views.
- When adding new endpoints, follow route -> controller -> service -> utils layering used across `backend-node/`.

Files/places to update for common tasks

- Add proxy: `frontend/vite.config.ts`
- Persist order: add `order` field to job schema (`backend-node/src/types/job.ts`), update store `moveJob` to call `updateJob` for persistence.
- Global API wrapper: add `frontend/src/utils/apiFetch.ts` to centralize credentials and 401 handling.
- Tests: backend controller tests live under `backend-node/src/__tests__` (use vitest); frontend unit tests use vitest config in project root.

If you change behavior or response shapes

- Update `backend-node/src/types/job.ts` Zod schemas and corresponding `frontend/src/types` if used.
- Update controllers to `schema.parse()` outputs so frontend receives validated shapes.

Commit message style

- Use conventional commit messages: `feat(...)`, `fix(...)`, `chore(...)`, `test(...)`.

If anything above is unclear or missing, tell me which area you want expanded (dev flow, auth, Zod schemas, optimistic updates, or DnD persistence) and I will iterate.
