# Next Steps

Remaining work in priority order. State as of 2026-10-05, `main` at `5f5405e`.

## Remaining tasks

### 1. Backend domain migration, one module per task

Use the `backend-migration` skill (`florea-api/skills/backend-migration/SKILL.md`), then review with `product-logic`.

Order follows the dependencies:

1. ~~Member (`memberProperties` → `memberProducts`)~~ done
2. ~~Property → Product, group enums, batch app~~ done
3. Board articles (categories) **← next, needs the category values**
4. Notices and notifications (keep `notificationRefId` or switch to the ERD's `productId` / `articleId`)

**Verify before each module:** the previous module builds, typechecks, and its operations work in the GraphQL playground. Commit each module separately.

### 2. Client domain migration, in the same order

1. `libs/enums/`, `libs/types/`
2. `apollo/` queries and mutations
3. Components and pages (`property` → product)
4. Routes
5. SCSS, images, i18n text, SEO description, logos

**Verify first:** the matching backend module is finished, because the client calls the same operation names. Create the client `.env` file with the API and WebSocket URLs.

### 3. Final sweep

- Search both projects for `nestar` and `property`.
- Update both README files and add an `.env` example.
- Run the full flow in the browser: sign up, log in, create a product, like, comment, follow, chat.

## Blockers

- **Board article categories:** the Florea values are not decided (current: FREE, RECOMMEND, NEWS, HUMOR).

## Open questions

- Does `productLocation` keep the Korean city list or change?
- What are the Florea board article categories?
- Notifications: generic `notificationRefId` (current code) or `productId` / `articleId` (ERD)?
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
- Admin product operations (TODO: no admin account in the dev database)
- `MONGO_PROD` value (TODO: not checked)
