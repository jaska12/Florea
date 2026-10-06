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

### 2. Check the client in a browser **← next**

- Start the backend (`npm run start:dev` in `florea-api`) and the client (`npm run dev` in `florea-client`).
- Click through: sign up, log in, add a product (as `AGENT`), product list with filters, product detail, like, comment, favorites, recently visited, my products, admin product list, chat.
- Test accounts in the dev database: `floreatest` (AGENT), `floreauser` (USER), `floreaadm` (ADMIN).

### 2a. Client content and assets

1. Product type images for the header filter (`public/img/banner/types/`).
2. Icons on the cards (bed, room, expand) and the sample photos in `public/img/product/`.
3. Real-estate text: FAQ, about page, footer, mypage article sample, SEO description, `kr` / `ru` translations.
4. Currency symbol.

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
- Which currency does Florea show (prices currently use `$`)?
- Should the 3364 backend lint problems be auto-fixed in one separate formatting commit?
- Should the client get an ESLint config?
- Which package manager does the client use (both `yarn.lock` and `package-lock.json` exist)?
- Was the Nestar repo, which tracks `.env`, ever pushed publicly? If yes, the Mongo password and `SECRET_TOKEN` should be rotated.

## Not verified yet

- Backend unit and e2e tests (TODO: not run)
- Client click-through in a browser (TODO)
- Batch app at runtime (TODO: built, but not started)
- `MONGO_PROD` value (TODO: not checked)
