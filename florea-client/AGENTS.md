Go outside of this project and read `../docs/ai` first!

# Florea Frontend Modification Instructions

This client project is being migrated from nestar-next to florea-next. Florea is an online gift & flower marketplace.

## Rules

- Preserve current project architecture.
- Keep GraphQL/Apollo integration.
- Do not rewrite the whole app.
- Improve UI incrementally.

## Backend Context

Before making any changes, read:

- `../docs/ai/BACKEND_MIGRATION.md`
- `../docs/ai/DECISIONS.md`
- `../docs/ai/FRONTEND_MIGRATION.md`
- `../docs/ai/COMPLETED_TASKS.md`
- `../docs/ai/NEXT_STEPS.md`
- `../florea-api/AGENTS.md` (domain rules and enum values)

The backend is already migrated to the product domain. Operation names, types, fields and enum values in this client must match it exactly:

- Operations: `createProduct`, `getProduct`, `updateProduct`, `getProducts`, `getAgentProducts`, `likeTargetProduct`, `getFavorites`, `getVisited`, `getAllProductsByAdmin`, `updateProductByAdmin`, `removeProductByAdmin`.
- Types: `Product`, `Products`, `ProductInput`, `ProductUpdate`, `ProductsInquiry`, `AgentProductsInquiry`, `AllProductsInquiry`.
- Member counter: `memberProducts`.
- Group enums (like, view, comment): `PRODUCT`.
- `MemberType` stays `USER`, `AGENT`, `ADMIN`.
- Upload target folder: `product`.

## Project Shape

- Next.js (Pages Router), React and TypeScript.
- Apollo Client for GraphQL; reactive variables `userVar` and `socketVar` in `apollo/store.ts`.
- Queries and mutations live in `apollo/user/` and `apollo/admin/`.
- Types live in `libs/types/`, enums in `libs/enums/`, shared config in `libs/config.ts`.
- Components live in `libs/components/`, pages in `pages/`.
- Styling with SCSS (`scss/pc`, `scss/mobile`) and Material-UI.
- Real-time chat uses the WebSocket link in `apollo/client.ts`.

## Workflow

1. Analyze before editing.
2. Backend is running on port http://localhost:3007/graphql now. Use its schema as the source of truth.
3. Make small incremental changes, in this order: enums and types, Apollo operations, components and pages, routes, then styles, images and text.
4. Run typecheck after each phase.
5. Do not remove working logic unless replaced safely.
6. Update `../docs/ai/COMPLETED_TASKS.md` after major changes.

## Validation

```bash
npx tsc --noEmit
```

- Install dependencies with `npm ci --legacy-peer-deps` (plain `npm ci` fails on a peer-dependency conflict).
- Run the app with `npm run dev`. It needs `.env.development` with `REACT_APP_API_URL`, `REACT_APP_API_GRAPHQL_URL` and `REACT_APP_API_WS`.
- There is no ESLint config in this project, so `npm run lint` only opens an interactive setup. Do not add a lint setup unless asked.
