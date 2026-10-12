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
- [x] 25. Homepage search box: category, occasion and size only
- [x] 26. Community skills, glass search box and trend card (recorded after the fact)
- [x] 27. Homepage redesign
- [x] 28. Site-wide Florea design system
- [x] 29. Fix the "Invalid message type!" runtime error
- [x] 30. Fix the blank page caused by an invalid stored token
- [x] 31. Notifications redesign (alerts, toasts, navbar bell)
- [x] 32. Notification module in the backend and real notifications in the bell
- [x] 33. Live chat connected to the socket; notifications announced over it
- [x] 34. Mobile version of every page, including the admin panel
- [x] 35. Cart and delivery ordering

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

## 25. Homepage search box: category, occasion and size only

- The `search-box` under the three.js carousel on the homepage (`libs/components/homepage/HeaderFilter.tsx`).
- Kept: three dropdowns, Category (`typeList`), Occasion (`occasionList`) and Size (`sizeList`), plus the search button, which opens `/product` with the chosen filters.
- Removed: the Location dropdown, the Advanced button and its modal (text search, options, price range).
- Added: the heading "Find your perfect Florea flowers & gifts" above the box.
- Files:
  - `libs/components/homepage/HeaderFilter.tsx`
  - `scss/pc/main.scss`: `.search-title` added; `.filter-rooms` renamed to `.filter-options` (wraps and centers so six labels fit); `.filter-location`, `.filter-type`, `.advanced-filter` and `.advanced-filter-modal` styles deleted (about 330 lines)
  - `libs/config.ts`: unused `productPrices` removed
  - `public/locales/{en,kr,ru}/common.json`: keys for the heading, `Category` and `Size`
- Menu labels are shown as "Flower Box", "Gift Box" and so on; the values sent to the backend are unchanged (`FLOWER_BOX`, `GIFT_BOX`).
- The category menu is a text list now. The old menu used one image per type, and no images exist for the Florea types.
- The product list page (`/product`) still has its full filter, including location and price.
- Results: `yarn tsc --noEmit` no errors; `yarn build` succeeded; the served homepage contains the heading, exactly the three dropdowns with their options, and none of the removed elements.
- Not verified: the look and the dropdown behaviour in a browser.

## 26. Work done while `docs/ai/` was missing from disk

`docs/ai/` was deleted from the working tree on 2026-10-07 (not by a commit) and restored with `git restore docs/ai` on 2026-10-08. These steps were committed in between and are recorded here after the fact:

- `fffc259`, `fcd0508`: eight community agent skills installed in `.agents/skills` and `.claude/skills` (listed in the two `SKILLS.md` files).
- `408d2be`: homepage search box restyled as a glass bar; `framer-motion` added.
- `93d3fe9`: trend product card redesigned; shared `florea-product-card` mixin.

## 27. Homepage redesign

- Commit: `d798db1`.
- Scope: the homepage UI layer only. GraphQL queries, Apollo logic, routing, auth, data mapping, like/view logic and search behaviour are unchanged. Navbar and footer (shared components) were not touched.
- Design references read: `emil-design-eng` and `redesign-existing-projects` (installed), `impeccable`, `frontend-design` and `ui-ux-pro-max` (read with `npx skills use`, not installed; their scripts were not run).
- New page order: hero → shop by category → trending products → popular products → three.js gallery (desktop only) → brand band → top products → top agents → community.
- Files:
  - new components in `libs/components/homepage/`: `HomeHero`, `SectionHeader`, `CategoryTiles`, `HomeProductCard`, `BrandBand`
  - rewritten presentation, same queries and handlers: `TrendProducts`, `PopularProducts`, `TopProducts`, `TopAgents`, `TopAgentCard`, `CommunityBoards`, `CommunityCard`, `HeaderFilter` (heading moved to the hero, one layout for every device)
  - removed: `TrendProductCard`, `PopularProductCard`, `TopProductCard` (replaced by `HomeProductCard`), `Advertisement` (the apartment video)
  - `pages/index.tsx`: new order, one layout for every device, debug line `HELLO: {group}` removed, `Events` no longer rendered
  - `libs/components/layout/LayoutHome.tsx`: renders `HomeHero` on desktop and mobile
  - `scss/home/home.scss` (new, loaded from `pages/_app.tsx`): all homepage styles, responsive, not scoped to `#pc-wrap` / `#mobile-wrap`
  - removed old homepage styles: `scss/pc/homepage/homepage.scss` (852 lines), `.header-main` in `scss/pc/main.scss`, five homepage blocks in `scss/mobile/main.scss`
  - `scss/variables.scss`: display font (Playfair Display) and four colour tokens
  - `public/img/home/`: hero photo and six category photos, with `CREDITS.md` (Unsplash License, each page checked)
  - `public/locales/{en,kr,ru}/common.json`: hero text
- Decisions taken on the owner's approval of the plan (its recommended options): the three.js carousel moved out of the hero into its own band; the Events section is hidden; a serif display font was added; navbar and footer were left alone.
- Results:

| Check | Result |
|---|---|
| `yarn tsc --noEmit` | no errors |
| `yarn build` | succeeded, 73 static pages |
| Browser (headless Edge, backend running), desktop 1600px | all sections render with API data; no bed/room/area icons, no video, no debug text, no horizontal scroll |
| Category tile | opens `/product?input=…typeList:["FLOWER_BOX"]` |
| Occasion shortcut | opens `/product?input=…occasionList:["WEDDING"]` |
| Search box | Gift Box → Love → Small → `/product?input=…` with all three lists |
| Like while logged out | the existing handler's alert appears ("Something went wrong!"), as before |
| Product card title and photo | open `/product/detail?id=…` |
| Agent card | opens `/agent/detail?agentId=…` |
| Phone 390px (phone user agent) and tablet 834px | sections lay out correctly; see the known issues for the navbar |

- Not verified: liking while logged in through the UI, the feel of the animation timing, Safari.

## 28. Site-wide Florea design system

- Brief from the project owner: one premium design system for every page (Fraunces + Outfit, deep rose / wine / blush / amber, light theme), with the homepage sections named in the brief.
- Scope: the UI layer. GraphQL queries, Apollo logic, routing, auth, like/view and search logic are unchanged.
- Design system:
  - `scss/variables.scss`: fonts changed to Fraunces (headings) and Outfit (text); tokens for surfaces, hairlines, shadows and radii; the shared product card (`florea-product-card`) now also carries the Top badge and the same-day / gift-wrap flags
  - `scss/theme/florea.scss` (new, loaded from `pages/_app.tsx`): page background, navbar, the page header of the inner pages, footer, florist card, headings, MUI controls
  - `scss/MaterialTheme/`: primary colour, text colours and font
  - every colour of the old Nestar palette in `scss/pc/**`, `scss/mobile/main.scss` and `scss/app.scss` replaced by a Florea token (26 stylesheets); the same colours where components set them inline (9 components)
- One product card everywhere: `libs/components/common/ProductCardView.tsx` (new) draws it; `HomeProductCard`, `product/ProductCard` (product list, favourites, recently visited) and `common/ProductBigCard` (similar products, florist page) keep their own data and like handlers and delegate the drawing.
- Homepage: `OccasionTiles` and `SameDayBanner` added, `BrandBand` removed; order is hero → shop by occasion → trending → same-day banner → popular → shop by category → gallery → top rated → top florists → community.
- Inner pages:
  - `LayoutBasic`: one floral header image, Florea titles and descriptions for each page
  - product detail: bed / room / area icons and icon boxes removed, readable labels, "Ask the florist", "View shop", "You may also like"
  - product list filter: readable labels (Flower Box, Seoul, Birthday)
  - florists: "Florist" label, search placeholder, count text; navigation label "Florists" in all three locales
  - about page: real-estate and placeholder text replaced with Florea copy; the invented statistics replaced by true counts (6 categories, 6 occasions, 3 sizes)
  - customer care heading, join page photo, footer copy, My page wording
  - default avatar: a member without a photo no longer shows a broken image in the navbar and My page (display only; the stored value is unchanged)
- Images: six occasion photos and the same-day banner photo in `public/img/home/`, cropped from photos already checked for the Unsplash License (`CREDITS.md` updated).
- Results:

| Check | Result |
|---|---|
| `yarn tsc --noEmit` | no errors |
| `yarn build` | succeeded, 73 static pages |
| Browser (headless Edge, backend running, logged in as the test florist) | homepage, product list, product detail, florists, florist page, community, customer care, about, join and My page (profile, products, favourites, add product, recently visited) render in the new theme with no horizontal scroll |
| Leftover bed / room / area icons | none on any page checked |
| Login through the join form | works; My page opens afterwards |

- Not done from the brief:
  - Mobile-first layouts for the inner pages. Only the homepage is responsive. The other pages still show their "MOBILE" placeholders on phones, as in Nestar.
  - Events on the homepage: the old content was Korean city festivals, so the section stays hidden.
  - A following count and follow button on the florist page beyond what the page already had; reviews, galleries and similar products use the existing features, restyled.
- Not verified: Safari, and every state of every form.

## 29. Fix the "Invalid message type!" runtime error

- Symptom: with the backend running, every page showed the dev overlay "Unhandled Runtime Error: Invalid message type!".
- Cause: `apollo/client.ts` opened Apollo's subscription WebSocket link on the chat gateway's address. The gateway sends its own chat messages, which the subscription client cannot parse. The file already had a `LoggingWebSocket` class for this, but it was never passed to the link.
- File: `florea-client/apollo/client.ts` (`webSocketImpl: LoggingWebSocket` added to the link; 4 lines).
- Results: `yarn tsc --noEmit` no errors. In a browser against the running site: no overlay and no runtime errors on the homepage (logged out and logged in), on the product list, and after waiting past the socket's 30-second timeout; the chat gateway's messages arrive on the socket.
- Not verified: sending and receiving chat messages through the chat window.

## 30. Fix the blank page caused by an invalid stored token

- Symptom: the site showed a completely blank page (no navbar, no title, no error overlay) in the owner's browser, while it rendered in a clean test browser.
- Cause: the browser had a value under `accessToken` in localStorage that is not a JWT (for example left by another project that also runs on `localhost:3000`). `updateUserInfo` decoded it without a guard; the decode threw inside the navbar and the layout, and React removed the whole page.
- File: `florea-client/libs/auth/index.ts`. `getJwtToken` now returns the token only if it can be decoded and otherwise removes it; `updateUserInfo` returns `false` instead of throwing.
- Results: `yarn tsc --noEmit` no errors. Reproduced the blank page with a broken token before the fix. After the fix the homepage, product list and My page redirect render with: broken text, the word "undefined", the word "null", half a token, and a JWT from another app; no runtime errors and no error popup. Logging in through the form still works.

## 31. Notifications redesign (alerts, toasts, navbar bell)

- Brief from the project owner: redesign every notification in the frontend (bell, badge, dropdown, notifications page, toasts and alerts, empty and loading states). UI only; no change to GraphQL, data, routing or backend.
- What existed before the work:
  - Alerts and toasts: 72 calls in 26 files, all through `libs/sweetAlert.ts`, with SweetAlert's default look.
  - The bell: a plain icon in the desktop navbar. No click, badge, dropdown or query.
  - No notifications page. The backend has a `Notification` schema and enums but no module, query or mutation.
- Alerts and toasts:
  - `libs/sweetAlert.ts`: every helper keeps its name, parameters and duration, so no call site changed. One icon style for success, error, warning, info and question; Florea classes on each part; the red confirm colour and the `bounceIn` entrance removed; a close button on the two error alerts that have no timer and no button.
  - `scss/theme/notifications.scss` (new, loaded from `pages/_app.tsx`): the dialog, the toast (placed below the fixed navbar, full width on phones, rose progress line), buttons, focus rings, motion, and a fade-only version under `prefers-reduced-motion`.
  - `animate.css` is no longer imported (the package is still in `package.json`).
- Bell:
  - `libs/components/common/NotificationBell.tsx` (new): a real button with an accessible label, a badge with the unread count, and a dropdown with a header, the list, a loading state and an empty state. Icons for `LIKE`, `COMMENT`, `FOLLOW`, `ORDER` and `SYSTEM`; an unknown type gets the system icon.
  - `libs/types/notification/notification.ts` (new): the shape of the backend schema.
  - `Top.tsx` renders the bell for a logged-in member on desktop and, new, in the phone navbar. It passes no data, so the dropdown shows "No notifications yet".
  - Labels added to the `en`, `kr` and `ru` locale files.
- `libs/components/product/Filter.tsx`: two raw browser `alert('error')` calls now use the styled error alert with the existing "Something went wrong!" message.
- Results:

| Check | Result |
|---|---|
| `yarn tsc --noEmit` | no errors |
| Browser (headless Edge, backend running), desktop 1600px | error alert (like while logged out), success toast (like while logged in), confirm dialog (Logout on My page; Cancel keeps the session), bell and empty dropdown (opens, closes with Escape, no sideways scroll); timed messages close by themselves |
| Same, phone 390px | error alert, toast and bell dropdown fit the screen |
| Reduced motion | the toast uses the fade and hides the progress line; it still closes on its timer |
| List, unread, badge and loading states | checked with sample rows passed to the bell for the test only; the rows were removed afterwards |
| Runtime errors from the site | none |

- Not done from the brief:
  - A notifications page: there is no data to show and routing was out of scope.
  - Real notifications in the dropdown, mark as read, and links: these need a notification module in the backend (see BACKEND_MIGRATION.md).
- Not verified: `yarn build` (the dev server was running on the same `.next` folder), warning and info alerts (no code calls them yet), the admin alerts, Safari.

## 32. Notification module in the backend and real notifications in the bell

- Request from the project owner: build notifications in the backend so the bell shows real data, and finish the whole section.
- Backend (`florea-api/apps/florea-api/src`):
  - new: `components/notification/` (module, resolver, service), `libs/dto/notification/` (`notification.ts`, `notification.input.ts`)
  - operations, all behind `AuthGuard`: `getNotifications(input: NotificationsInquiry)` returns `list` (with `authorData`), `metaCounter` and `unreadCount`; `readNotification(input: String)`; `readAllNotifications` returns how many were changed
  - notifications are created in the existing services: a like on a product, an article or a profile; a comment on a product, an article or a profile; a subscription. Taking a like back or unsubscribing removes its notification. Acting on your own product, article or profile creates nothing.
  - a failure while writing a notification is logged and does not fail the like, comment or subscription
  - `libs/config.ts`: `lookupAuthorData`; `schemas/Notification.model.ts`: an index on `receiverId` and `createdAt`
  - the `notifications` collection now exists in the dev database
- Frontend (`florea-client`):
  - `apollo/user/query.ts`: `GET_NOTIFICATIONS`; `apollo/user/mutation.ts`: `READ_NOTIFICATION`, `READ_ALL_NOTIFICATIONS`
  - `NotificationBell.tsx` loads the member's notifications, checks again every 20 seconds and when the dropdown opens, shows 10 rows with "Show more", marks one as read on click and opens what it is about (product, article, the florist page with the review, or the member who liked or followed), and has "Mark all as read"
  - the row text is built in the client from the type, the group and the author's nickname, so it is translated (`en`, `kr`, `ru`)
  - `apollo/client.ts`: a request can set `silentError` in its context so a failure does not open an alert; the notification check uses it and stops checking after an error
  - `libs/enums/notification.enum.ts`: `SUBSCRIBE` added, as in the backend
- Results:

| Check | Result |
|---|---|
| `npx tsc --noEmit` for `florea-api` and `florea-batch` | no errors |
| `yarn tsc --noEmit` (client) | no errors |
| API flow test with two test accounts | 23 of 23: like on/off, own product, comment, follow/unfollow, profile like, read one (receiver only), status filter, read all, a member sees only their own, a guest is refused |
| Browser, one member acting through the API while the other watches the bell | 11 of 11: the badge showed 3 new notifications without a reload (13 to 15 seconds), rows show author, action and icon, a click opens the product and marks it read, "Mark all as read" clears the badge, a like taken back removes its row, no error alert, no runtime errors |
| A token the server refuses | the bell asks once, opens no alert and stops checking |
| "Show more" | checked with the page size set to 2 for the test, then set back to 10 |
| Phone width | the dropdown with real rows fits the screen |

- Lint: `npx eslint` reports 3429 problems, up from the 3336 baseline. 12 are in the new files (the same kinds every resolver and service here has: the unused `returns` argument and `any` access) and the rest are the lines added to existing files, which follow those files' 4-space indentation while Prettier expects tabs. The new files are formatted with Prettier. The baseline in `florea-api/AGENTS.md` is updated to 3429.
- Not done:
  - A notifications page; the dropdown with "Show more" is the whole list.
  - Notifications are not pushed over the socket; the client checks every 20 seconds.
  - Deleting a comment does not remove its notification.
- Not verified: `npm run build` (the API was running in watch mode on the same `dist` folder; its watch build compiled without errors), article notifications (like and comment on an article: the test account has no article; they use the same code path as products), a review on a profile in the browser (it passed through the API), the admin pages, Safari.
- Test data left in the dev database: the test accounts' notifications, including rows from test comments that were then set to `DELETE`; `floreauser` follows `floreatest` and likes one of its products, so `floreatest` has real notifications to look at.

## 33. Live chat connected to the socket; notifications announced over it

- Request from the project owner: connect the chat to the socket.
- What existed before the work: the backend gateway (`socket/socket.gateway.ts`) already handled connections, the online count, the last five messages and new messages. The chat window in the client was the Nestar starter: two messages written by hand, an empty send handler, no link to the socket.
- Frontend (`florea-client`):
  - `libs/socket.ts` (new): opens the page's one WebSocket, keeps what arrives (`info`, `getMessages`, `message`, `notification`) in reactive variables, opens the socket again when it drops (2 seconds, doubling up to 30), and opens it again as the member after a login without a page reload
  - `apollo/store.ts`: `chatMessagesVar`, `chatOnlineVar`, `chatOpenVar`, `notificationPingVar`; `libs/types/chat/chat.ts` (new)
  - `apollo/client.ts`: `LoggingWebSocket` now only hands the socket work to `libs/socket.ts`
  - `libs/components/Chat.tsx`: real messages (mine on the right; others on the left with avatar and nickname), sending with Enter or the button, the online count, a "Connecting..." state, a mark on the button for messages that arrived while the window was closed; the conversation and the open window survive page changes
  - `scss/pc/main.scss`: the chat block rewritten in the Florea look
  - `Top.tsx`: calls `refreshSocket()` when the logged-in member changes
  - `NotificationBell.tsx`: asks for the list when the socket announces a change; the timer is now a 60-second fallback
  - chat labels added to the `en`, `kr` and `ru` locale files
- Backend (`florea-api`):
  - `socket.gateway.ts`: `notifyMember(memberId)` sends `{ event: 'notification' }` to that member's open sockets; chat messages are trimmed, cut at 300 characters, and empty ones are ignored
  - `socket.module.ts` exports the gateway; `notification.module.ts` imports it; `notification.service.ts` calls `notifyMember` after creating or removing a notification
- Results:

| Check | Result |
|---|---|
| `npx tsc --noEmit` for `florea-api` and `florea-batch`, `yarn tsc --noEmit` | no errors |
| Chat test: a member in the browser and a second member on a plain WebSocket | 18 of 18: online count, a message from the other member with their name, sending with Enter, the other side receives it with my name, input cleared, spaces-only blocked, the conversation survives a page change, the unread mark, reconnect after the socket is dropped, login through the form reopens the socket as the member |
| The bell after another member's like | changed in 1.2 seconds (20-second timer before) and changed back when the like was taken back |
| Notification API test and browser test from task 32 | 23 of 23 and 11 of 11 again |

- Lint: 3440 problems (3429 after task 32); the 11 new ones are the lines added to `socket.gateway.ts`, which keeps its 4-space indentation. `florea-api/AGENTS.md` is updated.
- Not done:
  - The chat is one public room, as in Nestar. There are no private conversations between a customer and a florist.
  - Messages are kept in the server's memory (the last five) and are lost when the API restarts.
  - The chat window is shown to logged-in members on desktop only, as before.
- Not verified: `npm run build` and `yarn build` (the servers were running on the same output folders), Safari.
- The test wrote a few messages into the live chat room; they disappear when the API restarts.

## 34. Mobile version of every page, including the admin panel

- Brief from the project owner: audit and fix the mobile version of the whole frontend (phones 360 to 430px and tablets), then, on approval: "the admin panel too".
- What the audit found (375, 414 and 768px):
  1. Only the homepage worked on phones. Every other page showed a one-line placeholder ("PRODUCTS MOBILE", "LOGIN MOBILE", "MY PAGE" and so on): 45 placeholders in pages and components. A phone visitor could not log in.
  2. Phone navbar: no logo, no login, My Page, language switch or logout; five text links in one row, under 44px tall.
  3. Product list: no filter on phones.
  4. Footer: three columns overlapping, the third cut off at the right edge, small targets.
  5. Homepage: 22 tap targets under 44px; large gaps between sections; no chat.
  6. Tablets and narrow windows that report a desktop browser got the 1300px desktop layout and a sideways scroll.
- Approach (DECISIONS.md, 23): one markup per page at every width, adapted by `scss/mobile/*.scss` below 1024px ("tablet") and 640px ("phone"). No separate phone copies of the pages.
- Fixed:
  - **Placeholders:** removed from 36 components and pages; the three layouts, the navbar and the footer render one markup. `useDeviceDetect` is left only where it skips the three.js gallery on phones, and in two files that are not rendered or only read it.
  - **Navbar:** a menu button opens a slide-in menu with the page links, the three languages and Login / Register or Logout; logo, bell and avatar stay in the bar; 64px tall.
  - **Page header and containers:** follow the screen width with 16 to 20px side margins.
  - **Footer:** one column, link groups in a grid, the subscribe field at full width.
  - **Login / sign up:** the form fills the screen; the photo beside it is hidden; 16px inputs so iOS does not zoom.
  - **Product list:** a "Filters" button opens the filter as a sheet from the bottom with a "Show N products" button; cards in 1, 2 or 3 columns.
  - **Product page:** title, price and counts stacked; photo in a 4:3 or square frame; details, map, reviews and the florist box in one column.
  - **Florists and a florist's page:** cards in 2 to 4 columns; search at full width.
  - **Community and an article:** the board picker is a compact block of four buttons; articles in 1 to 3 columns; the article body cannot be wider than the screen.
  - **My page and a member's page:** the menu is a profile line with a row of pills that scrolls sideways; product and follower tables become small cards; profile, add-product and write-article forms are one column.
  - **About and customer care:** sections stacked; FAQ categories in a row that scrolls sideways.
  - **Admin panel:** the side menu is a drawer opened from the top bar (`LayoutAdmin.tsx`); tables scroll sideways inside their frame.
  - **Chat:** shown on phones; the window fits the screen.
  - **Tap targets:** pagination, like buttons, filter checkboxes, menu pills and icon buttons are 44px; text links get an invisible 44px tap area.
  - **Homepage:** less space between sections on phones; hero spacing for the floating navbar.
  - Also fixed on the way: "/ mo" after the price in My products (left from Nestar).
- Files: new `scss/mobile/{layout,account,product,product-detail,agent,community,mypage,info,admin,touch}.scss`, `scss/mobile/main.scss` rewritten and loaded last in `pages/_app.tsx`; breakpoints `tablet` and `phone` in `scss/variables.scss`; `Top.tsx` (menu), `pages/product/index.tsx` (filter sheet), `LayoutAdmin.tsx` (drawer), `Teditor.tsx` (class names only). GraphQL, routing and logic unchanged.
- Results:

| Check | Result |
|---|---|
| `yarn tsc --noEmit` | no errors |
| Every page at 375px (iPhone), 414px (Android) and 768px (iPad) | no sideways scroll on any page; nothing sticks out past the right edge |
| Phone visitor test | 21 of 21: menu and its links, 44px targets, filter sheet filters the list and closes, login through the form, like, notification list, chat window, My page pills, admin drawer, table scroll |
| Desktop at 1600px, all 21 pages compared element by element with a record taken before the work | layout unchanged; the only differences are like counts and "Top" badges that changed in the data |

- Not done:
  - Between 1025 and 1339px the desktop layout is still 1300px wide and scrolls sideways, as before.
  - The About page still has a house photo, the heading "Our Exclusive Agetns" with placeholder text, and feature rows whose markup lacks the class its desktop style expects. These are content problems on desktop too and were left alone.
  - The password field on the login page shows the password as plain text (`type="text"`), as in Nestar.
- Not verified: real devices, Safari, landscape phones, the article page with a real article (the test accounts have none), `yarn build` (the dev server was running on the same `.next` folder).

## 35. Cart and delivery ordering

- Brief from the project owner: a full cart and delivery order flow, backend and frontend. The plan was approved with three choices: one order per florist, a $5 delivery fee that is free from $100 of items, and a product with no stock stays listed as "Out of stock".
- Backend (`florea-api/apps/florea-api/src`):
  - new: `schemas/Order.model.ts`, `schemas/OrderItem.model.ts` (collections `orders`, `orderItems`), `libs/enums/order.enum.ts`, `libs/dto/order/`, `components/order/` (module, resolver, service)
  - `orders` has the fields of the brief plus `agentId`, the florist whose products are in the order
  - operations: `createOrder` (returns one order per florist), `updateOrder` (the buyer cancels while `PENDING`), `updateOrderByAgent`, `updateOrderByAdmin`, `getMyOrders`, `getAgentOrders`, `getOrder`, `getAllOrdersByAdmin`
  - prices and the delivery fee are taken from the database and `libs/config.ts` (`DELIVERY_FEE`, `FREE_DELIVERY_FROM`), never from the request
  - stock: taken when the order is placed, with a condition in the query so two buyers cannot take the same piece; given back when an order is cancelled; if one product is short, nothing is taken
  - status: only forward (`PENDING` → `CONFIRMED` → `PREPARING` → `OUT_FOR_DELIVERY` → `DELIVERED`); a florist or admin may cancel until the order is out for delivery
  - notifications: a new order and a buyer's cancellation go to the florist; every status change goes to the buyer; `ORDER` added to `NotificationType` and `NotificationGroup`
  - payment: cash on delivery; nothing is charged
- Frontend (`florea-client`):
  - cart: `libs/cart.ts` and `cartVar`, kept in `localStorage` (`floreaCart`) and shared between tabs; `AddToCartButton` on every product card and, with a quantity stepper, on the product page; `CartIcon` with the count in the navbar
  - pages: `/cart` (grouped by florist, quantity, remove, totals), `/checkout` (recipient, address filled from the member's address, date, time slot, card message, summary, field-by-field messages), `/order/complete`
  - My page: "My Orders" for every member and "Shop Orders" for florists (`components/order/OrdersPanel.tsx`, `OrderCard.tsx`, `OrderTimeline.tsx`), with status tabs, the delivery timeline, cancel, and "Mark as …" for the florist; the lists follow status changes over the socket
  - admin: `/_admin/orders` with a status selector, and "Orders" in the admin menu
  - notifications about orders open the order; their text is translated (`en`, `kr`, `ru`)
  - styles: `scss/theme/order.scss`, one sheet for every width
  - the My page menu box on desktop now grows with its items (a florist has two more)
- Results:

| Check | Result |
|---|---|
| `npx tsc --noEmit` for `florea-api` and `florea-batch`, `yarn tsc --noEmit` | no errors |
| Order API test | 47 of 47: totals and fee, two florists in one request, stock down and back, refused requests leave the stock alone, own product, past date, guest, reading by buyer, florist and admin, every status step with its notification, cancel rules |
| Browser, whole flow | 40 of 40: add to cart from a card and the product page → cart → checkout validation → order placed (2 orders) → thank-you page → the florist confirms → the bell and the open order follow each step to Delivered without a reload → buyer cancels a pending order → stock error shown on the page → florist screen → admin list → guest → cart, checkout and orders at phone width |
| Earlier tests again | notifications 23 of 23, phone visitor 21 of 21, chat 18 of 18 |

- Lint: 3460 problems (3440 before); the 20 new ones are in the order files, of the same kinds as in every resolver and service here. `florea-api/AGENTS.md` is updated.
- Not done:
  - No online payment.
  - Delivery is a date and a time slot; there is no delivery zone or distance check, and the fee does not depend on the address.
  - A cart line is a copy of what the buyer saw. If the price or stock changes before checkout, the server's numbers win and the buyer sees the server's message.
  - Order numbers are the last six characters of the id.
- Not verified: `npm run build` and `yarn build` (the servers were running on the same output folders), Safari, real devices, the Korean and Russian texts by a native reader.
- Test data left in the dev database: the florist account `floreashop2`, the products "Pink Peony Bouquet" ($45) and "Tea And Sweets Gift Box" ($60), and the test orders of `floreauser`.
