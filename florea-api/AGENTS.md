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
- The catalog module is `product` (`components/product`, `libs/dto/product`, `libs/enums/product.enum.ts`, `schemas/Product.model.ts`).
- Keep shared modules reusable: auth, member, like, view, comment, follow, board article, notification, order, notice, ai, socket.
- API is GraphQL (Apollo), database is MongoDB (Mongoose), auth is JWT.

## Domain Rules

- Use Florea/product terminology for the main catalog entity.
- Do not reintroduce property or real-estate fields (rooms, beds, square, barter, rent).
- Keep `MemberType.USER`, `MemberType.AGENT` and `MemberType.ADMIN` unchanged.
- Product ownership continues to use `MemberType.AGENT` unless a later migration explicitly changes it.
- Product fields follow `Florea-ERD.pdf`: `productType`, `productStatus`, `productLocation`, `productAddress`, `productTitle`, `productPrice`, `productOccasion`, `productSize`, `productStock`, `productImages`, `productDesc`, `productSameDay`, `productGiftWrap`, plus the counters `productViews`, `productLikes`, `productComments`, `productRank`.
- Product enum values are:
  - `ProductType`: `BOUQUET`, `FLOWER_BOX`, `PLANT`, `GIFT_BOX`, `SWEET`, `TOY`
  - `ProductOccasion`: `BIRTHDAY`, `WEDDING`, `ANNIVERSARY`, `LOVE`, `CONGRATS`, `SYMPATHY`
  - `ProductSize`: `SMALL`, `MEDIUM`, `LARGE`
  - `ProductStatus`: `ACTIVE`, `SOLD`, `DELETE`
  - `ProductLocation`: keep the current location values until a later migration explicitly changes them.

## Packages

- The backend uses npm. The image build on the server runs `npm ci`, which refuses a lock file that is not exactly in sync.
- npm on Windows can drop lock entries that only Linux needs (it happened with `@emnapi/core` and `@emnapi/runtime`, COMPLETED_TASKS.md, 47). After `npm install` or `npm uninstall`, look at `git diff package-lock.json`: it should show the package you added or removed and nothing else. If other entries disappeared, put them back from the previous lock file.

## AI Rules

- Only `components/ai/ai.client.ts` talks to the AI provider (the OpenAI API). The key comes from `OPENAI_API_KEY` in `.env`; never log it, return it or put it in a DTO.
- A product, price or stock level shown to a member comes from the database. The model returns ids and text; check every id against what was sent.
- Tests never call the API: mock `AiClient` (service tests) or `AiService` (resolver tests).
- Before changing the request, read the current SDK documentation and model list; model ids and parameters change.

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
npm run build
```

`npm run build` builds both `florea-api` and `florea-batch`.

To debug with breakpoints in VS Code, open the repo root and run the `Debug Florea API` (or `Debug Florea Batch`) configuration from `../.vscode/launch.json`. It runs `npm run start:debug`.

`npm run lint` runs ESLint with `--fix`, so use it only when file rewriting is acceptable. To check without rewriting files:

```bash
npx eslint "{src,apps,libs,test}/**/*.ts"
```

The lint baseline is 3497 problems: 3336 inherited from Nestar, plus the notification, order and notice modules, the socket changes and three lines of the AI task (see `../docs/ai/COMPLETED_TASKS.md`, 32, 33, 35, 38, 45 and 46). A change must not increase it.
