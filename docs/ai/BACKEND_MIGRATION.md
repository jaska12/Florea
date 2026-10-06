# Backend Migration: Nestar → Florea

State as of 2026-10-05, after the product module migration (branch `feat/backend-product-migration`).

## Original project (Nestar)

Nestar is a real estate platform backend.

- NestJS monorepo with two apps: an API app and a batch app
- GraphQL (Apollo) API, MongoDB with Mongoose, JWT authentication
- WebSocket chat gateway (`ws`)
- API modules: `auth`, `member`, `property`, `board-article`, `comment`, `like`, `follow`, `view`
- Schemas: `Member`, `Property`, `BoardArticle`, `Comment`, `Follow`, `Like`, `View`, `Notice`, `Notification`
- Batch app: scheduled jobs for rollback, top properties and top agents

## New project (Florea)

Florea is an online gift & flower marketplace. It keeps the Nestar architecture (monorepo, GraphQL, MongoDB, JWT, WebSocket chat) and changes the domain from real estate to products sold by agents.

The target data model is `Florea-ERD.pdf` in the repo root.

## Migration goal

Turn the Nestar backend into the Florea backend in small, verifiable steps:

1. Import Nestar as an untouched baseline. **Done.**
2. Rename project and app identifiers, with no logic change. **Done.**
3. Migrate the domain, one module at a time. **In progress:** member and product done; board articles and notices/notifications remain.

## Naming changes

### Project and app identifiers

| Before | After |
|---|---|
| `apps/nestar-api` | `apps/florea-api` |
| `apps/nestar-batch` | `apps/florea-batch` |
| package name `nestar` | `florea` |
| `nest-cli.json` projects `nestar-api`, `nestar-batch` | `florea-api`, `florea-batch` |
| build output `dist/apps/nestar-*` | `dist/apps/florea-*` |
| classes `NestarBatch*` | `FloreaBatch*` |
| `Welcome to Nestar ... Server!` | `Welcome to Florea ... Server!` |

### Domain

| Before | After |
|---|---|
| `components/property/` | `components/product/` |
| `libs/dto/property/` | `libs/dto/product/` |
| `libs/enums/property.enum.ts` | `libs/enums/product.enum.ts` |
| `schemas/Property.model.ts` | `schemas/Product.model.ts` |
| `uploads/property/` | `uploads/product/` |
| `PropertyModule`, `PropertyService`, `PropertyResolver` | `ProductModule`, `ProductService`, `ProductResolver` |
| `Property`, `Properties`, `PropertyInput`, `PropertyUpdate` | `Product`, `Products`, `ProductInput`, `ProductUpdate` |
| `PropertiesInquiry`, `AgentPropertiesInquiry`, `AllPropertiesInquiry` | `ProductsInquiry`, `AgentProductsInquiry`, `AllProductsInquiry` |
| `availablePropertySorts` | `availableProductSorts` |
| `memberProperties` | `memberProducts` |
| `getFavoriteProperties`, `getVisitedProperties` | `getFavoriteProducts`, `getVisitedProducts` |
| `batchTopProperties`, `BATCH_TOP_PROPERTIES` | `batchTopProducts`, `BATCH_TOP_PRODUCTS` |

Not renamed: `MemberType.AGENT` (decision 14 in `DECISIONS.md`), so `getAgents`, `getAgentProducts`, `availableAgentSorts` and `batchTopAgents` keep "agent".

## Collections, schemas and enums

### Collections

| Before | After |
|---|---|
| `properties` | `products` |
| `board-articles` | `boardArticles` (matches the ERD) |

Unchanged: `members`, `comments`, `follows`, `likes`, `views`, `notices`, `notifications`.

Collections that exist in the dev `Florea` database (created by Mongoose when the API starts): `boardArticles`, `comments`, `follows`, `likes`, `members`, `products`, `views`. `notices` and `notifications` have schemas but no module registers them yet, so they are not created.

### `products` schema

| Change | Fields |
|---|---|
| Renamed `property*` → `product*` | Type, Status, Location, Address, Title, Price, Likes, Views, Comments, Rank, Images, Desc |
| Removed | `propertySquare`, `propertyBeds`, `propertyRooms`, `propertyBarter`, `propertyRent`, `constructedAt` |
| Added | `productOccasion` (required), `productSize` (required), `productStock` (number, required, min 0 in the input), `productSameDay` (boolean, default false), `productGiftWrap` (boolean, default false) |
| Unchanged | `memberId`, `soldAt`, `deletedAt`, timestamps |

Unique index keeps its shape: `productType` + `productLocation` + `productTitle` + `productPrice`.

### `members` schema

- `memberProperties` → `memberProducts`.

### Enums

| Enum | Values |
|---|---|
| `ProductType` (was `PropertyType`: APARTMENT, VILLA, HOUSE) | BOUQUET, FLOWER_BOX, PLANT, GIFT_BOX, SWEET, TOY |
| `ProductStatus` (was `PropertyStatus`: HOLD, ACTIVE, SOLD, DELETE) | ACTIVE, SOLD, DELETE |
| `ProductLocation` | SEOUL, BUSAN, INCHEON, DAEGU, GYEONGJU, GWANGJU, CHONJU, DAEJON, JEJU (unchanged values) |
| `ProductOccasion` (new) | BIRTHDAY, WEDDING, ANNIVERSARY, LOVE, CONGRATS, SYMPATHY |
| `ProductSize` (new) | SMALL, MEDIUM, LARGE |
| `LikeGroup`, `ViewGroup`, `CommentGroup`, `NotificationGroup` | `PROPERTY` → `PRODUCT` |

### Not changed yet (TODO)

- `BoardArticleCategory`: still FREE, RECOMMEND, NEWS, HUMOR. Florea values not decided.
- `Notification.model.ts`: the code uses a generic `notificationRefId`; the ERD shows `productId` and `articleId`. There is no notification service yet. TODO: decide which shape to keep.

## GraphQL / API changes

| Before | After |
|---|---|
| `createProperty`, `getProperty`, `updateProperty` | `createProduct`, `getProduct`, `updateProduct` |
| `getProperties`, `getAgentProperties` | `getProducts`, `getAgentProducts` |
| `likeTargetProperty` | `likeTargetProduct` |
| `getAllPropertiesByAdmin`, `updatePropertyByAdmin`, `removePropertyByAdmin` | `getAllProductsByAdmin`, `updateProductByAdmin`, `removeProductByAdmin` |
| `getFavorites`, `getVisited` | same names, now return `Products` |
| argument `propertyId` | `productId` |

Search input `PISearch`:

- Removed: `roomsList`, `bedsList`, `squaresRange`
- Added: `occasionList`, `sizeList`
- Kept: `memberId`, `locationList`, `typeList`, `pricesRange`, `periodsRange`, `text`, `options`
- `options` now accepts `productSameDay`, `productGiftWrap`

`Member` type: `memberProperties` → `memberProducts`.

## What stayed unchanged

- Business logic in the services: status transitions, `soldAt` / `deletedAt`, the member product counter, like and view flow, rank formulas
- Roles: `AGENT` creates and updates products, `ADMIN` manages them
- `MemberType`, auth, guards, decorators, socket gateway, follow, board article, comment logic
- Env variable names: `PORT_API`, `PORT_BATCH`, `MONGO_DEV`, `MONGO_PROD`, `SECRET_TOKEN`
- `productStock` is only a stored field. No rule was added for it (for example, no automatic `SOLD` at zero), because the ERD has no order system.

## Current status

| Check | Result |
|---|---|
| Typecheck `florea-api` | no errors |
| Typecheck `florea-batch` | no errors |
| Build `florea-api` | compiled successfully |
| Build `florea-batch` | compiled successfully |
| Lint (without `--fix`) | 3336 problems (3315 errors, 21 warnings); baseline was 3364 |
| Leftover `propert` in `apps/` | none |
| GraphQL schema | 9 product operations, no property operations |
| Flow test on the dev `Florea` database | passed (see below) |
| Full operation test (51 checks) | all passed: member, product, article, comment, follow, uploader, websocket, admin operations, role rejections |
| Unit / e2e tests | TODO (not run) |
| Batch app at runtime | TODO (built, not started) |

Flow test, run against the running API: signup as `AGENT` → `createProduct` → old enum value `APARTMENT` rejected → `getProduct` (view counted) → `getProducts` filtered by occasion, size and options → `likeTargetProduct` → `getFavorites` → `getVisited` → `updateProduct` → `getAgentProducts` → `createComment` with group `PRODUCT`. Final counters: views 1, likes 1, comments 1, `memberProducts` 1.

## Known issues

- **Test data:** the tests left records in the dev `Florea` database: members `floreatest` (AGENT), `floreauser` (USER), `floreaadm` (ADMIN) and a few generated `u...` users, several test products (`Test ...`, `Counter test ...`), plus likes, views, comments. Delete them in Compass if not wanted.
- **Client out of sync:** the client still calls the property operations and fields, so it does not work against this backend until the frontend migration.
- **Lint:** 3346 problems inherited from the Nestar code, mostly auto-fixable formatting. Not fixed.
- **`MONGO_PROD`:** TODO (not checked).
