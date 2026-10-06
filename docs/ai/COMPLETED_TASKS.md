# Completed Tasks

In the order they were done. State as of 2026-10-05, `main` at `5f5405e`.

## Checklist

- [x] 1. Recommend migration steps
- [x] 2. Import the Nestar backend as a baseline
- [x] 3. Fix the socket gateway build errors
- [x] 4. Replace the ER model and squash history (project owner)
- [x] 5. Rename layer: backend
- [x] 6. Rename layer: client
- [x] 7. Add agent guideline files and merge to `main` (project owner)
- [x] 8. Write migration docs (this folder)
- [x] 9. Switch the backend to a Florea database (project owner)
- [x] 10. Fix stale agent guideline files
- [x] 11. Restructure agent guidelines and add skills
- [x] 12. Backend member module: `memberProperties` → `memberProducts`
- [x] 13. Backend product module: property → product
- [x] 14. Align database collections with the ERD
- [x] 15. Revise product enum values to the owner's migration plan
- [x] 16. VS Code debug configuration and build script
- [x] 17. Full API operation test and product counter fix
- [x] 18. Frontend agent guidelines, skills and env file
- [x] 19. Frontend product migration (data layer, components, pages, routes)
- [x] 20. Frontend AGENTS.md aligned with the owner's version; Yarn as the only package manager
- [x] 21. Frontend design skills
- [x] 22. Florea logo, favicon and app icons
- [x] 23. Logo hover animation
- [x] 24. Homepage three.js carousel images

## 1. Recommend migration steps

- Reviewed the repo: `florea-api/` was an empty NestJS scaffold, `florea-client/` was the Nestar client.
- Produced a 7-step migration outline (baseline, ER model alignment, `AGENTS.md`, backend modules, verification, client, final sweep).
- Files touched: none.

## 2. Import the Nestar backend as a baseline

- Source: local `../nestar` project.
- Replaced the scaffold (`src/`, `test/`) with `apps/nestar-api` and `apps/nestar-batch`, plus `nest-cli.json`, `package.json`, `package-lock.json`, `tsconfig.json`, `tsconfig.build.json`, `eslint.config.mjs`, `.prettierrc`, `.gitignore`, `README.md`.
- Added empty `uploads/member`, `uploads/property`, `uploads/article` with `.gitkeep`.
- `.env` copied locally only (untracked).
- Results:
  - `npm ci`: installed
  - Build `nestar-batch`: OK
  - Build `nestar-api`: **failed** with 2 type errors in `socket.gateway.ts` (fixed in task 3)

## 3. Fix the socket gateway build errors

- File: `apps/nestar-api/src/socket/socket.gateway.ts` (now `apps/florea-api/...`).
- Change: guest members typed as `Member | null` (5 lines). No behavior change.
- Results:
  - Build `nestar-api`: OK
  - Smoke run: server started, `/graphql` returned 200

## 4. Replace the ER model and squash history (project owner)

- `Florea-ER-Model.pdf` and `florea-er-model.md` removed, `Florea-ERD.pdf` added.
- History rewritten into a single commit on `main`: `ec67111 Add Florea ERD and project baseline`. It contains the baseline import and the socket fix.

## 5. Rename layer: backend

- Commit: `5e36d89 refactor(api): rename Nestar apps and identifiers to Florea` (100 files, 82 lines changed; mostly folder moves).
- Files touched:
  - `apps/nestar-api/**` → `apps/florea-api/**`
  - `apps/nestar-batch/**` → `apps/florea-batch/**`
  - `apps/florea-batch/src/florea-batch.{controller,controller.spec,module,service}.ts`
  - `apps/florea-batch/src/batch.module.ts`, `batch.service.ts`
  - `apps/florea-batch/test/app.e2e-spec.ts`
  - `apps/florea-api/src/app.service.ts`
  - `apps/*/tsconfig.app.json`
  - `nest-cli.json`, `package.json`, `package-lock.json`
- Results:

| Check | Result |
|---|---|
| Typecheck `florea-api` | no errors |
| Typecheck `florea-batch` | no errors |
| Lint before rename | 3364 problems (3343 errors, 21 warnings) |
| Lint after rename | 3364 problems (3343 errors, 21 warnings) |
| Build `florea-api` | compiled successfully |
| Build `florea-batch` | compiled successfully |
| Smoke run | `/graphql` 200, `/` returned `Welcome to Florea API Server!` |

## 6. Rename layer: client

- Commit: `0442d14 refactor(client): rename Nestar branding and package name to Florea` (16 files, 30 lines changed).
- Files touched:
  - `package.json`, `package-lock.json`, `.gitignore`
  - `pages/_document.tsx`, `pages/account/join.tsx`, `pages/community/index.tsx`
  - `libs/components/Footer.tsx`
  - `libs/components/layout/LayoutBasic.tsx`, `LayoutFull.tsx`, `LayoutHome.tsx`
  - `libs/components/member/MemberFollowers.tsx`, `MemberFollowings.tsx`, `MemberProperties.tsx`
  - `libs/components/mypage/MyFavorites.tsx`, `MyProperties.tsx`, `RecentlyVisited.tsx`
- Results:

| Check | Result |
|---|---|
| Install | `yarn install` failed (network); `npm ci --legacy-peer-deps` succeeded |
| Typecheck (`tsc --noEmit`) | no errors |
| Lint | not runnable (no ESLint config) |
| Build | TODO (not run) |
| Leftover "nestar" strings | only in `CHANGELOG.md` (upstream links) |

## 7. Add agent guideline files and merge to `main` (project owner)

- Commit: `5f5405e Add AGENTS.md and SKILLS.md guidelines for Florea backend and frontend`.
- Files: `florea-api/AGENTS.md`, `florea-api/SKILLS.md`, `florea-client/AGENTS.md`, `florea-client/SKILLS.md`.
- The rename commits and this commit are on `main` and pushed to `origin/main`.
- Lint / typecheck / build: not applicable (documentation only).

## 8. Write migration docs

- Files: `docs/ai/BACKEND_MIGRATION.md`, `docs/ai/FRONTEND_MIGRATION.md`, `docs/ai/DECISIONS.md`, `docs/ai/COMPLETED_TASKS.md`, `docs/ai/NEXT_STEPS.md`, `docs/ai/PROMPTS.md` (first written in `docs/`, moved to `docs/ai/` in task 11).
- No source code changed.

## 9. Switch the backend to a Florea database (project owner)

- File: `florea-api/.env` (local, untracked): `MONGO_DEV` now uses the `Florea` database.
- Result: API started, logged `MongoDB is connected into development db`, `/graphql` returned 200.

## 10. Fix stale agent guideline files

- `florea-api/AGENTS.md`: description changed from "real estate & community platform" to online gift & flower marketplace; module path `apps/nestar-api/...` → `apps/florea-api/...`.
- `florea-api/SKILLS.md`: `apps/nestar-batch` → `apps/florea-batch`.
- `florea-client/AGENTS.md`: description changed from "real estate platform" to online gift & flower marketplace.
- Lint / typecheck / build: not applicable (documentation only).

## 11. Restructure agent guidelines and add skills

- Modeled on the instructor's Petoria setup (Read First, Project Shape, Domain Rules, Workflow, Validation).
- Files:
  - `florea-api/AGENTS.md` (rewritten), `florea-api/SKILLS.md` (rewritten as a skill table)
  - `florea-api/skills/backend-migration/SKILL.md`, `florea-api/skills/product-logic/SKILL.md` (new)
  - `florea-client/AGENTS.md` (rewritten in the same shape)
  - the six migration docs moved from `docs/` to `docs/ai/`
- Product enum values written into `florea-api/AGENTS.md` (see `DECISIONS.md` 14).
- Lint / typecheck / build: not applicable (documentation only).

## 12. Backend member module: `memberProperties` → `memberProducts`

- First domain change. `MemberType` and all other member fields are unchanged.
- Files:
  - `apps/florea-api/src/schemas/Member.model.ts`
  - `apps/florea-api/src/libs/dto/member/member.ts`
  - `apps/florea-api/src/components/property/property.service.ts` (counter key only)
  - `apps/florea-batch/src/batch.service.ts` (rank formula reads the new field)
- Results:

| Check | Result |
|---|---|
| Typecheck `florea-api` | no errors |
| Typecheck `florea-batch` | no errors |
| Build `florea-api` | compiled successfully |
| Build `florea-batch` | compiled successfully |
| Lint (without `--fix`) | 3364 problems, same as the baseline |
| GraphQL schema | `Member` type exposes `memberProducts`, no `memberProperties` |

- Known effect: the client still queries `memberProperties`, so client queries that select it fail until the client member types and queries are migrated.

## 13. Backend product module: property → product

- Includes the like/view/comment/notification group enums and the batch app, because they compile together with the product service.
- Files (23 changed):
  - moved: `components/property/*` → `components/product/*`, `libs/dto/property/*` → `libs/dto/product/*`, `libs/enums/property.enum.ts` → `product.enum.ts`, `schemas/Property.model.ts` → `Product.model.ts`, `uploads/property/` → `uploads/product/`
  - edited: `components/like/like.service.ts`, `components/view/view.service.ts`, `components/comment/comment.service.ts`, `comment.module.ts`, `components.module.ts`, `libs/config.ts`, `libs/enums/{like,view,comment,notification}.enum.ts`
  - batch: `batch.module.ts`, `batch.service.ts`, `batch.controller.ts`, `lib/config.ts`
- What changed: see `BACKEND_MIGRATION.md` (fields, enums, operations, search filter).
- Not done from the plan: `Notification.model.ts` has no `propertyId` (it uses a generic `notificationRefId`), so nothing was renamed there.
- Results:

| Check | Result |
|---|---|
| Typecheck `florea-api` | no errors |
| Typecheck `florea-batch` | no errors |
| Build `florea-api` | compiled successfully |
| Build `florea-batch` | compiled successfully |
| Lint (without `--fix`) | 3346 problems (baseline 3364) |
| Leftover `propert` in `apps/` | none |
| Flow test on the dev database | passed: signup, create, read, filter, like, favorites, visited, update, agent list, comment |

- Test data left in the dev database: member `floreatest`, one test product, one like, one view, one comment.

## 14. Align database collections with the ERD

- File: `apps/florea-api/src/schemas/BoardArticle.model.ts` (collection `board-articles` → `boardArticles`).
- Dev `Florea` database: dropped two empty leftover collections (`properties`, `board-articles`), both created automatically by the old code and containing 0 documents.
- Result after starting the API: `boardArticles`, `comments`, `follows`, `likes`, `members`, `products`, `views`.
- Typecheck `florea-api`: no errors. Build `florea-api`: compiled successfully. `/graphql` returned 200.

## 15. Revise product enum values to the owner's migration plan

- File: `apps/florea-api/src/libs/enums/product.enum.ts` (plus `florea-api/AGENTS.md` and these docs).
- Values: see `DECISIONS.md` 15.
- Everything else in the plan was already done in tasks 12 to 14.

## 16. VS Code debug configuration and build script

- Modeled on the instructor's Petoria setup.
- Files:
  - `.vscode/launch.json` (new, repo root): `Debug Florea API` and `Debug Florea Batch`, both run from `florea-api/`
  - `florea-api/package.json`: `build` now builds both apps; new `start:debug:batch`
  - `florea-api/AGENTS.md`: validation section
- Not copied from the instructor's scripts: `migrate:products` (no data to migrate) and the `NODE_ENV=production` prefix in `start:prod` (that syntax does not run in the Windows shell used here).
- Results: `npm run build` compiled both apps; `npm run start:debug` printed `Debugger listening`, connected to MongoDB, started the application, and `/graphql` returned 200.
- Not verified: stopping on a breakpoint inside VS Code (needs the editor's debugger UI).

## 17. Full API operation test and product counter fix

- Ran every operation from the instructor's Postman collection against the running API on the dev `Florea` database: member (signup, login, checkAuth, checkAuthRoles, updateMember, getMember, getAgents, likeTargetMember, admin list/update), product (create, get, update, list with all filters, agent list, like, favorites, visited, admin list/update/remove), article, comment, follow, image uploaders and the WebSocket chat. Also checked that wrong passwords, missing tokens and wrong roles are rejected.
- Result: 51 checks, 51 passed.
- Bug found by the test: `memberProducts` was not decreased when a product became `SOLD` or `DELETE`. `updateProduct` and `updateProductByAdmin` read `soldAt` / `deletedAt` before setting them, so the check was always false. Inherited from Nestar.
- Files:
  - `apps/florea-api/src/components/product/product.service.ts` (the check now reads `input.soldAt` / `input.deletedAt`, as the board article service already does)
  - `florea-api/.gitignore` (uploaded files are ignored, the `uploads/*` folders stay)
- Results after the fix: typecheck no errors, both apps build, lint 3336 problems, counter test passed (create +1, SOLD by agent -1, DELETE by admin -1, plain update 0), full test 51 of 51 passed again.

## 18. Frontend agent guidelines, skills and env file

- Modeled on the instructor's Petoria frontend `AGENTS.md` (Rules, Backend Context, Workflow).
- Files:
  - `florea-client/AGENTS.md` (rewritten), `florea-client/SKILLS.md` (rewritten as a skill table)
  - `florea-client/skills/frontend-migration/SKILL.md`, `florea-client/skills/product-ui/SKILL.md` (new)
  - `florea-client/.env.development` (new, local only, ignored by git): API, GraphQL and WebSocket URLs for `localhost:3007`
- No client source code changed. Lint / typecheck / build: not applicable.

## 19. Frontend product migration (data layer, components, pages, routes)

- The existing Nestar client was adapted in place, the same way the backend was.
- Files (88 changed, 35 of them renamed):
  - renamed folders and files: `pages/property` → `pages/product`, `pages/_admin/properties` → `products`, `libs/components/property` → `product`, `libs/components/admin/properties` → `products`, `libs/types/property` → `product`, `libs/enums/property.enum.ts` → `product.enum.ts`, the `*Property*` components, the matching SCSS files, `public/img/property` → `product`
  - data layer: `libs/enums/product.enum.ts`, `libs/types/product/*`, `libs/config.ts`, `apollo/user/*`, `apollo/admin/*`
  - hand-edited components: `ProductBigCard`, `PopularProductCard`, `TopProductCard`, `TrendProductCard`, `product/ProductCard`, `homepage/HeaderFilter`, `product/Filter`, `mypage/AddNewProduct`, `pages/product/detail.tsx`, `pages/product/index.tsx`
  - text: `LayoutBasic` page descriptions, plural labels, locale key `Rooms` → `Occasion`
- What changed: see `FRONTEND_MIGRATION.md`.
- Results:

| Check | Result |
|---|---|
| Typecheck (`tsc --noEmit`) | no errors |
| GraphQL documents vs. the running backend schema | 35 of 35 valid |
| `next build` | succeeded, 73 static pages |
| Pages from `next start` | 10 main pages returned 200, old `/property` returns 404 |
| Lint | not runnable (no ESLint config) |
| Browser click-through | TODO (not done) |

## 20. Frontend AGENTS.md aligned with the owner's version; Yarn as the only package manager

- Files:
  - `florea-client/AGENTS.md`: rewritten from the owner's text (Rules, Backend Context, Workflow, Package Manager), with paths pointing at `../docs/ai` and two extra sections kept at the end (Backend Names, Validation)
  - `florea-client/skills/frontend-migration/SKILL.md`, `florea-client/skills/product-ui/SKILL.md`: commands switched to `yarn`
  - `florea-client/package-lock.json`: deleted
  - `florea-client/yarn.lock`: regenerated by `yarn install`. The old lockfile was out of sync with `package.json` (`yarn check --integrity` failed with "Lock files don't match"), because the project had been installed with npm.
- No client source code changed.
- Results (all with Yarn):

| Check | Result |
|---|---|
| `yarn install` | done; `yarn check --integrity` reports "Folder in sync" |
| `yarn tsc --noEmit` | no errors |
| `yarn build` | succeeded, 73 static pages |
| Installed versions vs. `package.json` | next 14.2.0, react 18.2.0, @apollo/client 3.14.1, @mui/material 5.18.0, graphql 15.10.3 (all within the declared ranges) |

## 21. Frontend design skills

- Modeled on the instructor's Petoria frontend skills.
- Files:
  - `florea-client/skills/user-project/SKILL.md` (new): design changes on the user-facing pages
  - `florea-client/skills/admin-panel/SKILL.md` (new): design changes on the admin pages
  - `florea-client/SKILLS.md`: both added to the table
- No source code changed. Lint / typecheck / build: not applicable.

## 22. Florea logo, favicon and app icons

- The logo was designed by the project owner and delivered as `florea-logo.zip`; its 15 files were extracted to `florea-client/public/img/logo/florea/`. No logo was drawn or changed.
- Files:
  - `libs/components/Top.tsx`, `libs/components/Footer.tsx`: `logoWhite.svg` → `florea/florea-logo-on-dark.svg`, `alt="Florea"`
  - `libs/components/layout/LayoutAdmin.tsx`, `pages/account/join.tsx`, `pages/community/index.tsx`, `pages/community/detail.tsx`: `logoText.svg` → `florea/florea-mark.svg`, `alt="Florea"`
  - `pages/_document.tsx`: favicon (svg, 32px png, ico), apple touch icon and manifest links
  - `public/favicon.ico`: replaced with the Florea one
  - `public/manifest.json` (new): app name and the 192 / 512 icons
  - `scss/pc/main.scss`, `scss/mobile/main.scss`: footer logo keeps its 128x52 box, with `object-fit: contain` so the new logo is not stretched
  - removed: `public/img/logo/logoWhite.svg`, `logoText.svg`, `favicon.svg` (the Nestar files)
- Difference from the request: `logoText.svg` was not a wide dark logo but a 40x40 round badge shown in square boxes (40, 80 and 90 px). The wide `florea-logo.svg` would be squashed there, so the flower mark is used in those four places to keep the sizes and layout. `florea-logo.svg` (for light backgrounds) is available but not used yet.
- Results: `yarn tsc --noEmit` no errors; `yarn build` succeeded (73 pages); served build returned 200 for all logo, icon and manifest files; the pages reference the new files with `alt="Florea"`.
- Not verified: how the logo looks in the browser (contrast on the navbar and footer, crop inside the round community avatar).

## 23. Logo hover animation

- CSS only. No component, GraphQL, routing or backend change.
- Files:
  - `scss/variables.scss`: two shared mixins, `florea-logo-motion` (resting state: transition, transform-origin, will-change) and `florea-logo-lift` (hover state)
  - `scss/pc/main.scss`: header logo (`.logo-box img`, on link hover and keyboard focus) and footer logo (`.footer-box .logo`)
  - `scss/pc/admin/admin.scss`: admin sidebar logo
  - `scss/pc/account/join.scss`: join page logo
  - `scss/pc/community/community.scss`, `scss/pc/community/detail.scss`: community logo
- Motion: lift 2px, scale 1.03, soft rose `drop-shadow` glow, 360 ms ease-out curve. No rotation or bounce. Uses `transform` and `filter` only, so the layout does not move.
- Reduced motion: under `prefers-reduced-motion: reduce` the transition, transform and glow are all switched off.
- Differences from the plan:
  - the join, admin and community logos are `florea-mark.svg`, not `florea-logo.svg` (see task 22)
  - not added to the mobile stylesheet: hover does not apply on touch screens
- Results: `yarn tsc --noEmit` no errors; `yarn build` succeeded; the compiled CSS contains the 6 hover rules and the reduced-motion overrides for every placement.
- Not verified: how the animation looks in a browser (TODO: check with `yarn dev`).

## 24. Homepage three.js carousel images

- The `threeJSContainer` carousel on the homepage (`libs/components/common/FiberContainer.tsx`, used by `LayoutHome`) showed eight real-estate photos from `public/img/fiber/`.
- Files:
  - `florea-client/public/img/fiber/img1.jpg` … `img8.jpg`: replaced with flower bouquet and gift box photos (5 bouquets, 3 gift boxes, alternating on each carousel page)
  - `florea-client/public/img/fiber/CREDITS.md` (new): photographer and source link for each photo
- Source and license: Unsplash, each photo page checked and showing "Free to use under the Unsplash License"; none is an Unsplash+ photo.
- Same file names, same pixel sizes and same format (progressive JPEG) as the files they replace, so `FiberContainer.tsx` and `ScrollControls.tsx` were not changed.
- `img2.jpg` (8192x4610) is slightly upscaled: its source photo is 6720x4480. The folder is now about 9 MB (was about 5.9 MB).
- Results: `yarn tsc --noEmit` no errors; sizes and format verified for all eight files.
- Not verified: how the carousel looks in a browser.
