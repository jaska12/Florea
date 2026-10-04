# Florea Client Agent Instruction

Florea is an online gift & flower marketplace. This client is being migrated from the Nestar real-estate platform.

## Read First

Before any frontend work, read these files (paths are relative to this folder):

- `../docs/ai/FRONTEND_MIGRATION.md`
- `../docs/ai/DECISIONS.md`
- `../docs/ai/COMPLETED_TASKS.md`
- `../docs/ai/NEXT_STEPS.md`
- `../florea-api/AGENTS.md` (domain rules and enum values)

Use those files as the source of truth for AI Agent related migration history, accepted decisions, remaining work and validation status.

## Project Shape

- Next.js (Pages Router), React and TypeScript.
- Apollo Client for GraphQL; reactive variables `userVar` and `socketVar`.
- Styling with SCSS (PC and mobile layouts) and Material-UI.
- Reusable UI components live in `libs/components/`.
- GraphQL queries and mutations live in `apollo/user/` and `apollo/admin/`.
- Shared types live in `libs/types/`, enums in `libs/enums/`.
- Real-time chat uses the WebSocket link in `apollo/client.ts`.

## Domain Rules

- Use Florea/product terminology for the main catalog entity in UI text, types, components and routes.
- Do not reintroduce property or real-estate fields.
- Enum values and field names must match the backend exactly; take them from `../florea-api/AGENTS.md`.
- Change a query, mutation or type only after the matching backend module is migrated.

## Workflow

1. Analyze before editing.
2. Keep changes small and consistent with existing project patterns.
3. Migrate in this order: enums and types, Apollo operations, components and pages, routes, then styles, images and text.
4. Do not remove working logic unless it is replaced safely.
5. Update `../docs/ai/COMPLETED_TASKS.md` after major completed work.

## Validation

Use this check for frontend work:

```bash
npx tsc --noEmit
```

Install dependencies with `npm ci --legacy-peer-deps` (plain `npm ci` fails on a peer-dependency conflict).

There is no ESLint config in this project, so `npm run lint` only opens an interactive setup. Do not add a lint setup unless asked.
