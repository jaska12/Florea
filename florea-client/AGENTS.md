# Florea Frontend Modification Instructions

## Rules

- Preserve current project architecture
- Keep GraphQL/Apollo integration
- Do not rewrite the whole app
- Improve UI incrementally

## Backend Context

Before making any changes, read:

- ../docs/ai/BACKEND_MIGRATION.md
- ../docs/ai/DECISIONS.md
- ../docs/ai/FRONTEND_MIGRATION.md
  and etc inside of ../docs/ai (the `docs/ai` folder in the repo root)

## Workflow

1. Analyze before editing.
2. Backend is running on port http://localhost:3007/graphql now.
3. Make small incremental changes.
4. Run typecheck after each phase.
5. Do not remove working logic unless replaced safely.
6. Update ../docs/ai/COMPLETED_TASKS.md after major changes.

## Package Manager

- Use Yarn for all frontend commands.
- Do not use npm or pnpm.
- Install dependencies with:

```bash
yarn
```

## Backend Names

The backend is already migrated to the product domain. Names in this client must match it exactly:

- Operations: `createProduct`, `getProduct`, `updateProduct`, `getProducts`, `getAgentProducts`, `likeTargetProduct`, `getFavorites`, `getVisited`, `getAllProductsByAdmin`, `updateProductByAdmin`, `removeProductByAdmin`.
- Types: `Product`, `Products`, `ProductInput`, `ProductUpdate`, `ProductsInquiry`, `AgentProductsInquiry`, `AllProductsInquiry`.
- Member counter: `memberProducts`.
- Group enums (like, view, comment): `PRODUCT`.
- `MemberType` stays `USER`, `AGENT`, `ADMIN`.
- Upload target folder: `product`.
- Enum values are listed in `../florea-api/AGENTS.md`.

## Validation

```bash
yarn tsc --noEmit
yarn build
```

- Run the app with `yarn dev`. It needs `.env.development` with `REACT_APP_API_URL`, `REACT_APP_API_GRAPHQL_URL` and `REACT_APP_API_WS`.
- There is no ESLint config in this project, so `yarn lint` only opens an interactive setup. Do not add a lint setup unless asked.
