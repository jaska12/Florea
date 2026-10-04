# Florea Backend Agent Instruction

Florea is an online gift & flower marketplace. This backend is being migrated from the Nestar real-estate platform.

## Read First

Before any backend work, read these files (paths are relative to this folder):

- `../docs/ai/BACKEND_MIGRATION.md`
- `../docs/ai/DECISIONS.md`
- `../docs/ai/COMPLETED_TASKS.md`
- `../docs/ai/NEXT_STEPS.md`
- `../Florea-ERD.pdf` (target data model)

Use those files as the source of truth for AI Agent related migration history, accepted decisions, remaining work and validation status.

## Project Shape

- Backend apps are `florea-api` and `florea-batch`.
- Keep the existing NestJS resolver/service/module pattern based on MVC and DI.
- Keep DTOs and enums under `apps/florea-api/src/libs`, and schemas under `apps/florea-api/src/schemas`.
- Keep shared modules reusable: auth, member, like, view, comment, follow, board article, socket.
- API is GraphQL (Apollo), database is MongoDB (Mongoose), auth is JWT.

## Domain Rules

- Use Florea/product terminology for the main catalog entity.
- Do not reintroduce property or real-estate fields (rooms, beds, square, barter, rent).
- Keep `MemberType.USER`, `MemberType.AGENT` and `MemberType.ADMIN` unchanged.
- Product ownership continues to use `MemberType.AGENT` unless a later migration explicitly changes it.
- Product fields follow `Florea-ERD.pdf`: `productType`, `productStatus`, `productLocation`, `productAddress`, `productTitle`, `productPrice`, `productOccasion`, `productSize`, `productStock`, `productImages`, `productDesc`, `productSameDay`, `productGiftWrap`, plus the counters `productViews`, `productLikes`, `productComments`, `productRank`.
- Product enum values are:
  - `ProductType`: `BOUQUET`, `FLOWER`, `PLANT`, `GIFT_BOX`, `SWEET`, `TOY`, `OTHER`
  - `ProductOccasion`: `BIRTHDAY`, `WEDDING`, `ANNIVERSARY`, `LOVE`, `CONGRATS`, `SYMPATHY`, `OTHER`
  - `ProductSize`: `SMALL`, `MEDIUM`, `LARGE`, `DELUXE`
  - `ProductStatus`: `HOLD`, `ACTIVE`, `SOLD`, `DELETE` (same values as the current `PropertyStatus`)
  - `ProductLocation`: keep the current location values until a later migration explicitly changes them.

## Workflow

1. Analyze before editing.
2. Keep changes small and consistent with existing project patterns.
3. Migrate one module per task, and commit each module separately.
4. Do not remove working logic unless it is replaced safely.
5. Update `../docs/ai/COMPLETED_TASKS.md` after major completed work.
6. Add or update focused tests when behavior changes.
7. Never commit `.env` or print its values.

## Validation

Use these checks for backend work:

```bash
npx tsc -p apps/florea-api/tsconfig.app.json --noEmit
npx tsc -p apps/florea-batch/tsconfig.app.json --noEmit
npx nest build florea-api
npx nest build florea-batch
```

`npm run lint` runs ESLint with `--fix`, so use it only when file rewriting is acceptable. To check without rewriting files:

```bash
npx eslint "{src,apps,libs,test}/**/*.ts"
```

The lint baseline is 3364 problems inherited from Nestar. A change must not increase it.
