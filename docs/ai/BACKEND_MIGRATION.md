# Backend Migration: Nestar → Florea

State as of 2026-10-05, branch `main` at commit `5f5405e`.

## Original project (Nestar)

Nestar is a real estate platform backend.

- NestJS monorepo with two apps: an API app and a batch app
- GraphQL (Apollo) API, MongoDB with Mongoose, JWT authentication
- WebSocket chat gateway (`ws`)
- API modules: `auth`, `member`, `property`, `board-article`, `comment`, `like`, `follow`, `view`
- Schemas: `Member`, `Property`, `BoardArticle`, `Comment`, `Follow`, `Like`, `View`, `Notice`, `Notification`
- Batch app: scheduled jobs for rollback, top properties and top agents

## New project (Florea)

Florea is an online gift & flower marketplace. It keeps the Nestar architecture (monorepo, GraphQL, MongoDB, JWT, WebSocket chat) and changes the domain from real estate to products sold by sellers.

The target data model is `Florea-ERD.pdf` in the repo root.

## Migration goal

Turn the Nestar backend into the Florea backend in small, verifiable steps:

1. Import Nestar as an untouched baseline. **Done.**
2. Rename project and app identifiers, with no logic change. **Done.**
3. Migrate the domain (property → product and related changes), one module at a time. **TODO.**

## Naming changes

### Done

| Before | After |
|---|---|
| `apps/nestar-api` | `apps/florea-api` |
| `apps/nestar-batch` | `apps/florea-batch` |
| package name `nestar` | `florea` (`package.json`, `package-lock.json`) |
| `nest-cli.json` projects `nestar-api`, `nestar-batch` | `florea-api`, `florea-batch` |
| build output `dist/apps/nestar-*` | `dist/apps/florea-*` |
| scripts `start:dev:batch`, `start:prod`, `start:prod:batch`, `test:e2e` | point at the `florea-*` paths |
| batch imports `apps/nestar-api/src/...` | `apps/florea-api/src/...` |
| `nestar-batch.{controller,controller.spec,module,service}.ts` | `florea-batch.*` |
| classes `NestarBatchController`, `NestarBatchService`, `NestarBatchModule` | `FloreaBatch*` |
| `Welcome to Nestar API Server!` | `Welcome to Florea API Server!` |
| `Welcome to Nestar BATCH Server!` | `Welcome to Florea BATCH Server!` |

### Planned, not done

| Before | After | Status |
|---|---|---|
| property (module, schema, DTOs, enums, resolvers) | product | TODO |
| `MemberType.AGENT` | seller-type role | TODO (exact enum value not decided) |
| collection `properties` | `products` | TODO |
| `getAgents`, `getAgentProperties` and other operation names | TODO | TODO |

## Collections, schemas and enums

**Nothing has changed yet.** The code still has the Nestar schemas and enums.

Current collections in code: `members`, `properties`, `board-articles`, `comments`, `follows`, `likes`, `views`, `notices`, `notifications`.

Current enums that will need to change:

- `MemberType`: `USER`, `AGENT`, `ADMIN`
- `PropertyType`: `APARTMENT`, `VILLA`, `HOUSE`
- `PropertyStatus`: `HOLD`, `ACTIVE`, `SOLD`, `DELETE`
- `PropertyLocation`: `SEOUL`, `BUSAN`, `INCHEON`, `DAEGU`, `GYEONGJU`, `GWANGJU`, `CHONJU`, `DAEJON`, `JEJU`

### Target from `Florea-ERD.pdf`

Collections: `members`, `products`, `views`, `likes`, `follows`, `comments`, `boardArticles`, `notices`, `notifications`.

`products` fields: `productType`, `productStatus`, `productLocation`, `productAddress`, `productTitle`, `productPrice`, `productOccasion`, `productSize`, `productStock`, `productViews`, `productLikes`, `productComments`, `productRank`, `productImages`, `productDesc`, `productSameDay`, `productGiftWrap`, `memberId`, `soldAt`, `deletedAt`, `createdAt`, `updatedAt`.

`members` has `memberProducts` (in place of the property counter). `notifications` has `productId` (in place of the property reference).

TODO:

- Enum values for `productType`, `productStatus`, `productLocation`, `productOccasion`, `productSize` (the ERD shows only that they are enums)
- Whether the ERD name `boardArticles` means the collection is renamed from `board-articles`
- Exact field-by-field diff between `Property.model.ts` and the `products` table

## GraphQL / API changes

**None yet.** All operations are unchanged from Nestar, including the property and agent operations (`createProperty`, `getProperty`, `getProperties`, `getAgentProperties`, `getAgents`, `likeTargetProperty`, `getFavorites`, `getVisited`, and the admin variants).

## What stayed unchanged

- All resolvers, services, DTOs, guards and decorators
- All Mongoose schemas and collection names
- All GraphQL operation names and types
- The WebSocket gateway behavior
- Env variable names: `PORT_API`, `PORT_BATCH`, `MONGO_DEV`, `MONGO_PROD`, `SECRET_TOKEN`
- Batch job logic

## Current status

| Check | Result |
|---|---|
| Typecheck `florea-api` | no errors |
| Typecheck `florea-batch` | no errors |
| Build `florea-api` | compiled successfully |
| Build `florea-batch` | compiled successfully |
| Lint (without `--fix`) | 3364 problems (3343 errors, 21 warnings), identical before and after the rename |
| Smoke run | server started, `/graphql` returned 200, `/` returned `Welcome to Florea API Server!` |
| Smoke run on the `Florea` database | `MongoDB is connected into development db`, `/graphql` returned 200 |
| Unit / e2e tests | TODO (not run) |

## Known issues

- **Lint:** 3364 problems inherited from the Nestar code; 3152 are auto-fixable formatting. Not fixed, to keep the rename diff readable.
- **`.env`:** local and untracked. `MONGO_DEV` now points at a separate `Florea` database (changed by the project owner); the API starts and connects to it. `MONGO_PROD` is TODO (not checked).
- **Empty database:** the `Florea` database is new, so it has no members or other data yet.
- **Uploads:** `uploads/member`, `uploads/property`, `uploads/article` exist as empty folders. The `property` upload target is still named after the old domain.
