# Next Steps

Remaining work in priority order. State as of 2026-10-05, `main` at `5f5405e`.

## Remaining tasks

### 1. Fill the gaps in the ERD

- Enum values for `productType`, `productStatus`, `productLocation`, `productOccasion`, `productSize`.
- Seller role name in `MemberType`.
- **Verify first:** the ERD is the final version.

### 2. Extend the agent guideline files

- Add to `AGENTS.md` (both projects): the domain mapping (property → product, agent → seller), a pointer to `Florea-ERD.pdf`, and the verification commands.
- **Verify first:** step 1 is done, so the mapping can name the real enum values.

### 3. Backend domain migration, one module per task

Order follows the dependencies:

1. Enums and config
2. Member (`AGENT` → seller role, `memberProperties` → `memberProducts`)
3. Property → Product (schema, DTOs, resolver, service, collection)
4. Like, View and Comment group enums (`PROPERTY` → `PRODUCT`)
5. Board articles (categories)
6. Notices and notifications (`productId`)
7. Batch app (top products, top sellers)

**Verify before each module:** the previous module builds, typechecks, and its operations work in the GraphQL playground. Commit each module separately.

### 4. Client domain migration, in the same order

1. `libs/enums/`, `libs/types/`
2. `apollo/` queries and mutations
3. Components and pages (`property` → product, `agent` → seller)
4. Routes
5. SCSS, images, i18n text, SEO description, logos

**Verify first:** the matching backend module is finished, because the client calls the same operation names. Create the client `.env` file with the API and WebSocket URLs.

### 5. Final sweep

- Search both projects for `nestar`, `property`, `agent`.
- Update both README files and add an `.env` example.
- Run the full flow in the browser: sign up, log in, create a product, like, comment, follow, chat.

## Blockers

- **Enum values:** the product module cannot be written until the enum values are decided.

## Open questions

- What are the enum values for product type, status, location, occasion and size?
- What is the seller role called in `MemberType`?
- Does `productLocation` keep the Korean city list or change?
- Is the collection `board-articles` renamed to `boardArticles`, as the ERD name suggests?
- What are the new client route names for `/property` and `/agent`?
- Should the 3364 backend lint problems be auto-fixed in one separate formatting commit?
- Should the client get an ESLint config?
- Which package manager does the client use (both `yarn.lock` and `package-lock.json` exist)?
- Was the Nestar repo, which tracks `.env`, ever pushed publicly? If yes, the Mongo password and `SECRET_TOKEN` should be rotated.

## Not verified yet

- Backend unit and e2e tests (TODO: not run)
- Client `next build` (TODO: not run)
- Client in the browser against the Florea API (TODO)
- Batch app at runtime (TODO: built, but not started)
- `MONGO_PROD` value (TODO: not checked)
