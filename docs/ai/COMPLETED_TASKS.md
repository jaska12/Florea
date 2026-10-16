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
- [x] 36. Production builds, and three fixes found on the way
- [x] 37. Real-estate leftovers removed
- [x] 38. Notices and FAQ from the database, with an admin screen
- [x] 39. First deploy
- [x] 40. Homepage: same-day section in place of the three.js gallery
- [x] 41. Homepage UX fixes (v2): tabs, hidden empty sections, one spacing scale
- [x] 42. Second deploy: the new homepage and the client fixes
- [x] 43. Sample shops on production: five florists and twenty products
- [x] 44. Top florists as one row of four, and sample articles for the community
- [x] 45. AI features: gift assistant, card messages, product descriptions
- [x] 46. AI features moved to the OpenAI API and checked with the real model
- [x] 47. Third deploy: the AI features, the four-florist row, the API and the client together
- [x] 48. Gift assistant answers like a chat: its own reply, and the earlier messages

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

## 36. Production builds, and three fixes found on the way

- Reason: tasks 29 to 35 were checked with typecheck and the running dev servers only; neither `npm run build` nor `yarn build` was run during them.
- Builds (servers stopped first):

| Check | Result |
|---|---|
| `npm run build` (`florea-api` and `florea-batch`) | both compiled |
| `yarn build` (client) | 86 pages generated |

- Found: `yarn build` reads the API addresses at build time, and the repo has only `.env.development` (git-ignored). A build without `.env.production` succeeds but cannot reach the API. `florea-client/.env.example` (new) lists the three variables and says so.
- The build log prints two Apollo messages many times (codes 17 and 103). Both are deprecation notices for Apollo Client 4 (a default link, `onCompleted`), not errors.
- Production run: the client was built with the local addresses and started with `yarn start` against the dev API, and the browser tests were run on it:

| Test on the production build | Result |
|---|---|
| Order flow | 40 of 40 |
| Phone visitor | 21 of 21 |
| Chat | 18 of 18 |
| Fix checks (below) | 7 of 7 |
| Notifications | 10 of 11 on the first run, then fixed (below) |

- Fixes:
  1. **My page on a full load.** Opening `/mypage` by its address, or pressing F5 there, sent a logged-in member to the homepage: the page checked `userVar` before the layout had read the stored token. `pages/mypage/index.tsx` now sends away only a visitor who has no usable token. A guest and a broken token still go to the homepage.
  2. **Password field.** `pages/account/join.tsx` showed the password as plain text (`type="text"`, from Nestar). It is `type="password"` now.
  3. **Bell count one short, now and then.** Found on the production build (1 run in 3). Apollo shares identical requests that are in flight, so when two notification signals arrived close together the second check reused the first one's answer, read before the second change was written. The notification query and the order lists now send their own request each time (`queryDeduplication: false` in the query context). After the fix: 6 of 6 runs passed.
- Not verified: the API built for production was not started (it would use `MONGO_PROD`); only its build was checked. The third fix is supported by 6 passing runs, which makes the race unlikely, not impossible. Safari and real devices.

## 37. Real-estate leftovers removed

- What was still left from Nestar, and what was done:
  - **About page:** the house photo is replaced by a Florea photo; the empty section "Our Exclusive Agetns" with placeholder text is removed; the row of company logos (Amazon, AMD, Cisco, Dropcam, Spotify) under "Part of the Florea community" is removed, because Florea has no such partners; the three feature rows get the class their style expects; the phone number is the one in the footer; the two buttons are links (join, customer care); the page has its header title and its translations (the navbar said "Agents" there).
  - **FAQ (`libs/components/cs/Faq.tsx`):** 32 questions and answers about Florea replace the real-estate ones, in the same seven groups (Product, Payment, Orders, For Florists, Account, Community, Other). Each answer describes what the site does today.
  - **Notices (`libs/components/cs/Notice.tsx`):** three notices that are true of the site replace "Register to use and get discounts" and the 2024 dates.
  - **Product page:** a product without a photo showed a living-room picture; it now shows the blush frame.
  - **Community:** an article without a picture showed a living room (and a 6 MB SVG on the homepage); both now use a Florea photo. The default member picture on an article is the default avatar.
  - **Admin customer care (FAQ, Notice, Inquiry):** the five made-up rows ("mb id", "member.mb_full_name") are replaced by "data not found", and the search field no longer shows the word "searchInput". These screens have no backend yet.
  - **Translations:** Korean "매물" and Russian "Имущество" / "Тип недвижимости" (real-estate words) are now "상품" and "Товары" / "Тип товара"; "Agent Page" says florist; the unused key "Home / For Rent" is removed.
  - **SEO description (`pages/_document.tsx`):** it spoke of buying and selling real estate in three languages; it now describes Florea.
  - **Price filter:** its default upper limit was 2,000,000 (a house price), written in six places. It is `productPriceCeiling` (10,000) in `libs/config.ts` now.
  - **Deleted, after checking nothing refers to them:** `public/img/banner/` (headers, city and house-type pictures), `public/img/product/` (sample real-estate photos, floor plan), `public/img/events/`, `public/img/community/`, `public/img/event.svg`, `public/img/apartmentMain.png`, `public/video/ads.mov` (26 MB), and the unused components `homepage/Events.tsx` and `mypage/Article.tsx`. 37 asset files in all.
- Dev database (not in the repo): the five test products got everyday names and prices ($38 to $64) and a photo each, uploaded through the API from the Unsplash pictures in `public/img/home`. Three of them had photo paths that pointed at no file.
- Results:

| Check | Result |
|---|---|
| `yarn tsc --noEmit` | no errors |
| Browser: About, customer care (every FAQ group), product list and product page, admin FAQ | render with the new content; no real-estate words on the FAQ page; no sideways scroll at 375px |
| Order flow | 40 of 40 |
| Phone visitor | 21 of 21 |

- Not done:
  - Prices are still shown with `$`; the currency was not decided.
  - "Lost your password?" on the login page still does nothing; the FAQ says so.
  - The admin customer-care screens are empty until notices and FAQ get a backend (NEXT_STEPS.md).
- Not verified: `yarn build` after this task (the dev server was running), the Korean and Russian texts by a native reader.

## 38. Notices and FAQ from the database, with an admin screen

- Before: the customer-care page showed notices and FAQ written in the component files, and the admin FAQ and Notice screens were mock-ups. The backend had a `Notice` schema and no module.
- Backend (`florea-api/apps/florea-api/src`):
  - new: `components/notice/` (module, resolver, service), `libs/dto/notice/`
  - `Notice` schema: `noticeTopic` (the FAQ group) and `noticeEvent` (the "event" mark) added; `NoticeCategory` gets `NOTICE`; new enum `NoticeTopic` (`PRODUCT`, `PAYMENT`, `ORDER`, `FLORIST`, `ACCOUNT`, `COMMUNITY`, `OTHER`)
  - `getNotices` is public and returns active entries of one category; `createNoticeByAdmin`, `updateNoticeByAdmin`, `removeNoticeByAdmin` and `getAllNoticesByAdmin` are for admins
  - an FAQ entry needs a topic; an entry is removed for good only after it has the `DELETE` status (as products are); search text is treated as plain text
  - `seed/notices.json` and `seed/seed-notices.mjs`: the 3 notices and 32 FAQ entries, created through the API; running it again adds nothing
- Frontend (`florea-client`):
  - `libs/components/cs/Notice.tsx` and `Faq.tsx` read from `getNotices`; the texts are no longer in the code
  - `libs/components/admin/cs/NoticePanel.tsx` (new) is the admin screen for both lists: status tabs, topic filter and title search, add and edit in a dialog, status change in the row, remove after `DELETE`
  - `pages/_admin/cs/faq.tsx` and `notice.tsx` use it; the mock `FaqList.tsx` and `NoticeList.tsx` are deleted
  - the notice list on the customer-care page shows the text under the title
- Results:

| Check | Result |
|---|---|
| `npx tsc --noEmit` for `florea-api` and `florea-batch`, `yarn tsc --noEmit` | no errors |
| Notice API test | 24 of 24: create, topic rule, length rule, roles, what visitors see, edit, topic filter, search, order, admin list, remove rules |
| Seed script on the dev database | 35 created; second run: 0 created, 35 already there |
| Browser | 19 of 19: the page shows the 3 notices and the 7 FAQ groups from the database; in the admin screen a question is added (with the form's messages), found by search, edited, put on hold, deleted and removed, and the public page follows each step; phone width fits |

- Found on the way: the theme fixes every outlined input at 48px, so a multi-line field overflowed its box. The dialog's text field sets its own height.
- Lint: 3489 problems (3460 before); the 29 new ones are in the notice files, of the same kinds as in every resolver and service here. `florea-api/AGENTS.md` is updated.
- Not done:
  - **Inquiry** (questions from members to customer care). The enum has `INQUIRY` and the admin panel has an Inquiry page, which is still a mock-up with no data and is not linked in the menu.
  - `TERMS` is in the enum and is not used.
  - A new database starts empty: run `seed/seed-notices.mjs` after the first deploy, or add the entries in the admin panel.
- Not verified: `npm run build` and `yarn build` after this task (the servers were running).

## 39. First deploy

- Request from the project owner: deploy to their server on port 3001, after checking that the port is free; two other people have projects on the same server.
- Checked first (read only): Ubuntu, Docker and nginx present; two other projects run as Docker containers behind nginx on ports 80, 443, 3100, 3101 and 3200; port 3001 was free but closed in the firewall.
- Two things were decided by the owner before the deploy (DECISIONS.md, 26): a separate production database, and no admin signup in production.
- Added to the repo: `florea-api/Dockerfile` (one image for the API and the batch jobs), `florea-client/Dockerfile`, `docker-compose.prod.yml`, `deploy/nginx-florea.conf`, `deploy/.env.example`, `deploy/README.md` (how to deploy, update, make an admin, seed), `.dockerignore` files.
- Code change: `member.service.ts` refuses a signup as `ADMIN` when `NODE_ENV` is `production`.
- On the server:
  - the code of commit `78c02b0` in `/root/apps/florea`; images built there; containers `florea-api`, `florea-batch`, `florea-next`, bound to `127.0.0.1` (3007 and 3002), restart policy `unless-stopped`; uploads in the volume `florea_uploads`
  - `florea-api/.env` on the server: the database name is `FloreaProd` on the same cluster, and `SECRET_TOKEN` is a new random value made on the server
  - nginx: a new site `florea` listening on 3001, enabled only after `nginx -t` passed; the firewall allows 3001
  - the first admin was made by signing up a member and changing its type on the server; the 3 notices and 32 FAQ entries were seeded through the API
- Results:

| Check | Result |
|---|---|
| Containers | all three up; the API reports "MongoDB is connected into production db" |
| From outside | pages 200, `/graphql` answers, the WebSocket sends its first event |
| Signup as `ADMIN` on the server | refused ("Not Allowed Request!") |
| Browser on the public address | 12 of 12: homepage, styles and photos, product list (empty shop), notices from the production database, login, chat socket, admin panel, admin FAQ, picture upload stored and served, phone width, no runtime errors, no failed requests |
| The other projects after the nginx reload | their ports still listen and answer |

- Not done:
  - HTTPS. The site is plain HTTP on a port; the neighbour project uses a `sslip.io` name with a Let's Encrypt certificate, and the same can be done for Florea.
  - The production shop is empty: no florists and no products yet.
  - `main` was not updated; the server runs `develop`.
  - The client image is 2.25 GB (it carries the whole build folder and dev packages). It works; it can be slimmed with Next's standalone output.
- Not verified: a server reboot (Docker and nginx are enabled at boot and the containers restart themselves, but it was not tried).

## 40. Homepage: same-day section in place of the three.js gallery

- Before: the homepage had a band of photos floating in a three.js canvas (desktop only), and a separate same-day banner further up.
- Now one section, `libs/components/homepage/SameDayFeature.tsx`, between "Shop by category" and "Top rated":
  - on the left a label, the heading "Flowers & gifts, delivered the same day", a sentence with the "add gift wrap" link, and two buttons; on the right one large photo with two small ones
  - under it "How Florea works": three steps (choose, add a card message and address, delivered with care)
  - "Shop now" opens the product list with the same-day filter on; the product page already reads its filters from the address, so its code was not changed. "How it works" scrolls to the steps.
  - the blocks rise a little as they scroll into view (framer-motion, once); with reduced motion they only fade in and the photos do not zoom
  - phone and tablet: the text goes above the photos and the steps go under each other; on a phone the large photo is on top with the two small ones under it
- Removed:
  - `libs/components/common/FiberContainer.tsx`, `ScrollControls.tsx` and `libs/components/homepage/SameDayBanner.tsx`, with their styles
  - packages `three`, `@react-three/fiber`, `@react-three/drei`, `@types/three`
  - `public/img/fiber/` and `public/img/home/sameday.jpg`; three of the gallery photos were kept as `public/img/home/sameday-bouquet.jpg`, `sameday-roses.jpg` and `sameday-gift.jpg` (credits moved to `public/img/home/CREDITS.md`)
- New page order: hero → shop by occasion → trending → popular → shop by category → same-day delivery → top rated → top florists → community.
- Not changed: GraphQL operations, routes, the product list and its filters.
- Results:

| Check | Result |
|---|---|
| `yarn tsc --noEmit` | no errors |
| `yarn build` | passes, 85 pages; the homepage is 50.9 kB (380 kB first load) |
| Browser at 1500, 768 and 375 px | 38 of 39: no canvas left, no horizontal overflow, the three photos load, layout as described at each width, "How it works" stops with the heading under the navbar, "Shop now" opens `/product` with the same-day box ticked (3 products in the dev database), the gift wrap link carries its filter, reduced motion, no failed requests |

- The one failed check is "no runtime errors": an object with `code=403` is thrown on the homepage. It is not from this section; the earlier browser checks met it too and skipped it. Its source was not looked for.
- Left as it is: `react-spring` is in `package.json` and nothing imports it; after this task Yarn warns that its three.js part has no `three`. It can be removed in a separate step.
- Not verified: the production server (not redeployed), and browsers other than Edge.

## 41. Homepage UX fixes (v2): tabs, hidden empty sections, one spacing scale

- Before: eight sections. Trending, Popular and Top rated showed the same few products three times; "Shop by occasion" and "Shop by category" looked alike; the community section showed an empty dashed box and the florists row had three cards; "See all" was in some headers only; two white sections in a row had a 192px gap and the others 96px.
- New order: hero → Shop by → Bestsellers → Same-day + How Florea works → Top florists → Community → footer. The hero is not changed.
- Sections (`florea-client/libs/components/homepage/`):
  - `ShopBy.tsx` (new): the occasion tiles and the category tiles behind two tabs, Occasion first. The tiles and their links are the same as before.
  - `Bestsellers.tsx` (new): Trending, Most viewed and Top rated as tabs. It runs the three `GET_PRODUCTS` requests of the old sections with their inputs unchanged. A tab with no products is not offered; with one list left there are no tabs; with no products the section is left out.
  - `HomeTabs.tsx` (new): the tab row used by both (`tablist` / `tab` / `tabpanel`, arrow keys, Home and End).
  - `SectionHeader.tsx`: one layout for all four headers: title and subtitle on the left, a "See all" link and the slider arrows on the right. The link is passed as `seeAll`.
  - `TopAgents.tsx`: shown from four florists up. `TopAgentCard.tsx`: a florist without a photo, or whose photo fails to load, gets the first letters of the name on a quiet tint.
  - `CommunityBoards.tsx`: left out when there are no articles; with articles in one board only, that board takes the full width. `CommunityCard.tsx`: an article without a picture gets a tinted block with a small flower mark; it used the Bouquets tile photo before.
  - deleted: `OccasionTiles.tsx`, `CategoryTiles.tsx`, `TrendProducts.tsx`, `PopularProducts.tsx`, `TopProducts.tsx`
- Photos (`florea-client/public/img/home/`): five pairs of files were crops of one photograph (hero and Love; Sweets and Congrats; Birthday, Wedding and Anniversary and the three same-day photos). `occ-love.jpg`, `occ-congrats.jpg` and `sameday-gift.jpg` are new photos under the same names; `sameday-bouquet.jpg` and `sameday-roses.jpg` are replaced by `sameday-tulips.jpg` and `sameday-ranunculus.jpg`. All five are from Unsplash under the Unsplash License; photographer, license and source of every file are in `CREDITS.md` there.
- Spacing (`scss/home/home.scss`): three values on `.florea-home` are the whole scale, and the smaller screens only change them.

| | Between sections | Under a header | Between blocks in a section |
|---|---|---|---|
| Desktop | 96px | 40px | 64px |
| Up to 900px | 72px | 32px | 48px |
| Up to 760px | 56px | 28px | 40px |

  - The backgrounds alternate (white, tinted, white, tinted, white). Two sections on the same background share one gap, which also covers a section that left itself out.
  - `scss/mobile/touch.scss`: its own 44px section padding for phones is removed; the `.empty-state` styles are removed from both files.
- Likes: the mutation and its order (like, read the lists again, show the toast) are as before. Two things follow from the merge:
  - after a like all three lists are read again, because the same product can be in every tab;
  - every tab has the heart button and the same message for a guest ("You are not authenticated, please login first!"). Before, the Popular section showed the count without a button, and Trending told a guest "Something went wrong".
- Not changed: GraphQL operations and their inputs, routes, the product list page, the hero and its search.
- Results:

| Check | Result |
|---|---|
| `yarn tsc --noEmit` | no errors |
| `yarn build` | passes, 85 pages; the homepage is 51.5 kB (380 kB first load) |
| Browser at 1500, 768 and 375 px | 87 of 87 |

- What the browser check covers:
  - with the dev data (5 products, 3 florists, no articles): the page is hero, Shop by, Bestsellers, Same-day; no empty box and nothing with a dashed border; no horizontal overflow; gaps on the scale; both tabs of Shop by with their six tiles and filters; the three tabs of Bestsellers; arrows; a tile and "See all" open the product list; tabs 44px tall on touch screens; arrow keys
  - with answers swapped in the browser, nothing written to the database (6 florists, 5 articles): all five sections in order, alternating backgrounds, four headers alike, initials for florists without a photo and for one whose photo does not load, tinted blocks for articles without a picture, every photo of the page used once
  - edges: four florists show the section and three do not; an empty list hides its tab and the next one opens; one list left shows no tabs; no products hides Bestsellers and the gap is not doubled
  - a guest's like asks for a login; a member's like changes the count in the other tabs too (put back after the check); reduced motion switches the tabs without an animation; no runtime errors or React and Apollo warnings; no failed requests
- Limits to know:
  - with five products the three tabs of Bestsellers show the same products in a different order; the difference shows as the shop grows
  - the same-day section keeps its own layout (text beside the photos) and has no shared header; its "Shop now" button is its link to the products
  - the florist list page (`/agent`) still shows the default picture for a florist without a photo; only the homepage card was in this task
  - the header rules that close an unused gap use the CSS `:has()` selector; a browser without it shows the same layout with a slightly larger gap
- Not verified: articles and florists with real pictures on the homepage (the dev database has none of the first and one of the second, and the section is hidden with three florists); browsers other than Edge; the production server (not redeployed).

## 42. Second deploy: the new homepage and the client fixes

- `develop` was pushed and commit `aaed950` was put on the server (http://201.18.219.9:3001). Before it the server ran `78c02b0`.
- What reached the live site: `/admin` leads to the admin pages (commit `d1210a3`), the Add Product page opens without an error alert (commit `3f8cdcc`), the same-day section in place of the three.js gallery (40), the homepage of task 41. The two fixes were made after the first deploy and have no entry of their own in this file: `next.config.js` redirects `/admin` and `/admin/...` to `/_admin`, and `AddNewProduct.tsx` skips the product query when the address has no `productId`.
- Only the client had changed since the first deploy (the API folder on the server was compared with the new code: the same). So only the client image was built and only `florea-next` was replaced. `florea-api` and `florea-batch` were not restarted.
- How it was done:
  - the code was sent into a fresh folder (`/root/apps/florea.new`), and the two settings files were copied into it from the old one
  - the image that was running was tagged `florea-next:prev`, then the new image was built while the old site kept serving
  - the folders were swapped and the new client started (`up -d --no-deps florea-next`)
  - after the check: the old folder, the build log and the `prev` image were removed
- Found before sending anything: the update steps of `deploy/README.md` would have failed. They unpack the new code over the old folder, which leaves the files that were deleted in git. `FiberContainer.tsx` was one of 18 such files, it imports `three`, the package is gone, and the client build type-checks every `.tsx` it finds. `deploy/README.md` now describes the steps above.
- Results:

| Check | Result |
|---|---|
| Client image build on the server | passes, 85 pages |
| Containers | `florea-next` new and up; `florea-api` and `florea-batch` with the same start time as before |
| Browser on the public address, at 1500, 768 and 375 px | 35 of 35 |
| The other projects | their five containers up as before; nginx was not reloaded or changed |

- What the browser check covers: the new homepage with nothing of the old one, no empty box and no broken picture, no horizontal overflow, gaps on the scale, the Shop by tabs, the three new same-day photos, "How it works", "Shop now" with the same-day filter, the notices from the production database, the other pages open, `/admin` and `/admin/users` redirect, no runtime errors, no failed requests.
- The live homepage shows the hero, Shop by and the same-day section only. The production shop has no products, florists or articles, so Bestsellers, Top florists and Community leave themselves out, as decided in DECISIONS.md, 28.
- Not verified on the server:
  - the Add Product page (it needs a florist account, and none was made on production); it was checked on the dev machine when the fix was made
  - the homepage sections that need data
  - an update where the API changed too
- Access: the owner gave the root password in chat for this deploy and said it will be changed. It was kept in a temporary file for the session and deleted afterwards. A key-based login is not set up.
- Still open from the first deploy: no HTTPS; `main` is not updated; the client image is 2.11 GB.

## 43. Sample shops on production: five florists and twenty products

- Before: the production shop had no florists and no products, so the live homepage showed the hero, Shop by and the same-day section only.
- Added to the repo (`florea-api/seed/`):
  - `demo-shop.json`: five florists (`rosegarden`, `petalhouse`, `bloombox`, `greenleaf`, `sweetpetal`) with a shop name, an area and a line about the shop, and four products each: bouquets, flower boxes, gift boxes, plants, sweets and toys, over all six occasions, priced from $22 to $110, ten of them marked same-day and eleven with gift wrap
  - `demo-shop/`: 5 shop photos (600x600) and 20 product photos (1000x750), 2.4 MB together, with `CREDITS.md` (photographer, license and source of each; all from Unsplash under the Unsplash License)
  - `seed-demo-shop.mjs <graphql url> <password>`: signs the florists up through the API, fills their profiles, uploads the photos and creates the products. It can be run again: an account that exists is logged in, a profile field that is filled and a product title the florist already has are left alone.
- `florea-api/.dockerignore`: `seed` is left out of the API image.
- `TopAgentCard.tsx`: the homepage card shows the shop name when the florist has one, and the nick otherwise.
- The script was run on the dev database first, then on production (http://201.18.219.9:3001), through the public API; the server itself was not touched.
- Results:

| Check | Result |
|---|---|
| Dev: first run | 5 signed up, 5 profiles filled, 20 products created |
| Dev: second run | nothing created, 20 products already there |
| Dev: run with another password | stops at the first account with the API's "Wrong password" message |
| Production: run | 5 signed up, 5 profiles filled, 20 products created |
| Browser on the public address, at 1500, 768 and 375 px | 24 of 25 |
| `yarn tsc --noEmit` | no errors |

- What the browser check covers: the homepage now shows Shop by, Bestsellers, Same-day and Top florists; three tabs and eight product cards with their photos; five florists with a photo and four products each; no overflow, no broken picture; the product list has 20 products; the same-day, plant and sympathy filters give 10, 4 and 2; the florist list shows 5; a florist page shows its 4 products; no runtime errors; no failed requests.
- The one failed check is the product page. Its own pattern for the price was written wrong; the facts it prints are all as expected (the page opens, two photos, no broken picture, the price and the "Add to cart" button are there), and the screenshot shows the page complete.
- To know:
  - These are sample shops. Their phone numbers are made up (`010-0000-01xx`) and are shown on the product pages. A visitor can order from them; the order arrives in the florist account and nobody delivers it.
  - All counts start at zero, so the three tabs of Bestsellers show the same order until products are viewed and liked. No views or likes were made up.
  - Community is still hidden on the homepage: there are no articles.
  - The password of the five production accounts was made for the run and given to the owner; it is not in the repo.
  - The shop name on the homepage card is in the code, not yet on the server (the client was not redeployed).
- Not verified: an order placed with a sample shop on production; the product page's "Address" block, which is empty on the live site as it is on the dev machine.

## 44. Top florists as one row of four, and sample articles for the community

- Asked by the owner: the Top florists section of the homepage keeps four florists.
- `florea-client/libs/components/homepage/TopAgents.tsx`: the section asks for four florists (by rank, as before) and shows them as one row of four equal cards. The slider and its arrows are gone; "See all" still leads to the florist list. The section is still left out with fewer than four.
- `scss/home/home.scss`:
  - `.agent-grid`: four columns, two on phones; `.agent-swiper` removed
  - a long shop name takes a second line on phones (it was cut with "…")
  - article titles in the community section wrap to two lines. They were cut after one: the card was a flex column, which cancels the two-line clamp, and the title inherited `nowrap`. Nobody had seen it, because there were no articles.
- Sample articles (`florea-api/seed/demo-shop.json`, `seed-demo-shop.mjs`, `seed/demo-shop/`): six short articles written under the sample shops' own names, four in News with a photo each and two in the Free board. The script creates them after the products and skips a title the florist already has. Four photos were added, with their credits.
- The script was run again on the dev database and on production: 6 articles created, nothing else touched; a second run on dev created nothing.
- Results:

| Check | Result |
|---|---|
| `yarn tsc --noEmit`, `yarn build` | no errors; 85 pages |
| Dev, browser at 1500, 768 and 375 px | four florists in one row (two rows of two on a phone), equal widths, from edge to edge of the page column, no arrows, no overflow |
| Dev, article titles | two lines where needed, none cut, at 1500 and 375 px |
| Production API | 4 News articles with pictures and 2 Free board articles, each under its shop |
| Production homepage | all five sections are shown: Shop by, Bestsellers, Same-day, Top florists, Community; no broken picture |

- On the server and not: the articles are data and are live. The four-florist row, the shop names on the cards and the two-line titles are in the code only; the live site still runs the client of task 42, so it shows five florists in a slider and cuts long article titles until the next deploy.
- To know: with five sample florists of equal rank, which four are shown is the database's order (the first four created). It changes when the ranks do.

## 45. AI features: gift assistant, card messages, product descriptions

- Read with task 46: the provider written about here (the Claude API, `ANTHROPIC_API_KEY`, `claude-haiku-5-5`) was replaced by the OpenAI API the next day, before any real request had been made. Everything else in this entry still holds.
- Three features that call the Claude API from the backend. The key is read on the server from `ANTHROPIC_API_KEY` and is never sent to the browser; the model is `AI_MODEL`, and `claude-haiku-5-5` when that is empty.
- The model: the brief named `claude-haiku-4-5-20251001`. Anthropic's model page lists it as a legacy model that is still available, and `claude-haiku-5-5` as the current fastest one, so that one is the default (the owner approved the plan that proposed it). The request uses `output_config.format` with a JSON schema, the current way to get JSON back; no beta header.
- Backend (`florea-api`):
  - package `@anthropic-ai/sdk` (0.133.0)
  - `components/ai/`: `ai.client.ts` (the only file that talks to the API: 15 s timeout, one retry), `ai.service.ts` (the three features, the rate limit, the checks on every answer), `ai.resolver.ts`, `ai.module.ts`, and two test files
  - `libs/dto/ai/`, `libs/enums/ai.enum.ts` (`AiCardTone`, `AiLanguage`), two messages in `Message`
  - `.env.example` (new): every variable the API reads, with `ANTHROPIC_API_KEY` and `AI_MODEL` empty
- The three mutations:
  - `aiGiftRecommend(input: { prompt, budgetMax?, occasion?, size? })`, for a logged-in member. It takes up to 30 products from the database (active, in stock, matching the filters, not the member's own), sends the model only id, title, type, occasion, size, price and a shortened description, and returns up to five of them with a one-sentence reason each. An id that is not among the candidates is dropped, and so is a repeat.
  - `aiCardMessage(input: { occasion, recipient, tone, language? })`, for a logged-in member: three messages of 200 characters at most.
  - `aiProductDescription(input: { title, type, occasion, size, notes? })`, for florists only: one description of 500 characters at most (the limit of `productDesc`).
- Limits and failures:
  - ten requests a minute for each member, over the three features together; the count is in memory
  - when the model cannot answer (no key, time-out, refusal, an answer that is not what was asked for), the gift assistant returns the most popular matching products without reasons and says so; the other two return a clear "not available right now" message. The request never fails with a server error, and no text is made up in place of the model's.
  - the customer's words and the shop's texts are sent as data, with an instruction not to follow anything written inside them; whatever comes back is used only as ids to look up and as plain text
- Frontend (`florea-client`):
  - `libs/components/ai/GiftAssistant.tsx`: a "Find a gift" button in the corner of every page (above the chat button for a member) that opens a side panel; on a phone the panel fills the screen. A guest is asked to log in. The member writes a request, with an occasion and a budget if they like, and gets the site's normal product cards with the reason under each and "Add to cart". The conversation stays while the member moves between pages (`giftAssistantOpenVar`, `giftAssistantTurnsVar` in `apollo/store.ts`); the server keeps nothing of it.
  - `libs/components/ai/CardMessageHelper.tsx` on the checkout page: "Write it for me" asks who the card is for, the occasion and the tone, shows three suggestions, and a click puts one into the message field, where it can be edited. The language follows the language of the site.
  - `libs/components/mypage/AddNewProduct.tsx`: "Generate description" fills the description from the title, type, occasion and size; what is already typed in the box is passed on as notes, and "Undo" puts it back.
  - `AiNote.tsx` ("AI suggestions may not be perfect"), `aiError.ts`, `scss/theme/ai.scss`, `scss/mobile/ai.scss`; three mutations in `apollo/user/mutation.ts`; types in `libs/types/ai/`
  - failures are shown inside the panel or under the button, not as the site's error alert
- Results:

| Check | Result |
|---|---|
| `npx tsc` for `florea-api` and `florea-batch`, `npm run build` | no errors |
| `npx jest apps/florea-api/src/components/ai` | 16 of 16; the model client and the database are mocks, nothing reaches the API |
| The three mutations on the running dev API, without a key | 15 of 15: a guest and a wrong role are refused, bad input is refused, the filters are applied, a florist is not offered their own products, the fallback and the "not available" answers, the rate limit, another member unaffected |
| `yarn tsc --noEmit`, `yarn build` | no errors; 85 pages |
| Browser at 1500, 768 and 375 px | 36 of 37 |

- What the browser check covers: the button for a guest and for a member; the login prompt; examples; a request with filters; the fallback and "nothing matches"; the loading line; three picks as normal cards with reasons; "Add to cart" fills the cart; a refused request explained in the panel; a card opens the product and the panel closes; the conversation is kept; Escape; the checkout helper (no-key message, three suggestions, insert, edit); the product form (missing fields, no-key message, fill, edit, undo); tablet and phone (nothing sticks out, the form stays in view, tap sizes); reduced motion; no failed requests.
- The one failed check is "no React warnings": the product form's selects set `selected` on an `<option>`. Those six lines were in the form before this task.
- **Not verified: a real answer from the model.** `florea-api/.env` has no `ANTHROPIC_API_KEY` yet, so no request reached the Claude API. The screens with suggestions were checked with answers swapped in inside the browser. With a key, run the three mutations once (the gift assistant in the panel is the quickest) before relying on them.
- Lint: 3497 problems. The new files add none; three lines added to two existing files in their own four-space style add 3. Before this task the count was 3494 by that sum, not the 3489 recorded in `florea-api/AGENTS.md`; the difference of 5 was not looked for.
- The other tests of the repo (3 suites) fail as they did before this task: Jest cannot load the `uuid` package that `libs/config.ts` imports.
- To put this on the server: add `ANTHROPIC_API_KEY` to `florea-api/.env` there and rebuild the API image as well as the client. Each request costs a little; the login, the rate limit and the short answers keep it small.

## 46. AI features moved to the OpenAI API and checked with the real model

- Why: the owner has an OpenAI key and no Anthropic key, and asked for the features to use it. The brief of task 45 named the Claude API; this is a change of that brief by the owner.
- What changed, all of it in the backend:
  - package `openai` (7.32.0) in place of `@anthropic-ai/sdk`
  - `components/ai/ai.client.ts`: the request is now `client.responses.create` (the Responses API) with `text.format` of type `json_schema` in strict mode, which is what OpenAI's structured-outputs guide shows today. `store: false`, so the customer's words are not kept on OpenAI's side after the answer. Timeout 15 s and one retry, as before. An answer that is not `completed`, or a refusal, counts as a failure.
  - settings: `OPENAI_API_KEY` in place of `ANTHROPIC_API_KEY`; `AI_MODEL` stays, and the default is `gpt-6-luna`, which OpenAI's model page gives as its most economical model for high-volume tasks
  - `ai.service.ts`: each request names its answer format (`gift_picks`, `card_messages`, `product_description`), which the API asks for. The prompts, the checks on the answers, the rate limit and the fallbacks are unchanged.
- Not changed: the three mutations and their types, the tests' expectations, the whole frontend.
- The key: the owner sent it in the chat and asked for it to be added. It is in `florea-api/.env`, which git ignores. Because it was written in a chat it should be replaced by a new one in OpenAI's dashboard.
- Results, with the real model:

| Check | Result |
|---|---|
| `npx tsc` for both apps, `npm run build` | no errors |
| `npx jest apps/florea-api/src/components/ai` | 16 of 16 (mocks; no request leaves the machine) |
| Lint | 3497 problems, as after task 45 |
| The three mutations on the dev API | 16 of 16 |
| The three flows in the browser | 7 of 7 |

- What the model did in those runs:
  - gift assistant, "My sister just moved into her first flat. Something that lasts, not cut flowers.", up to $60: three plants (a monstera, a house plant, a pair of succulents), each with a reason that used only what the product data says; 5.4 s
  - gift assistant with filters (occasion and size): only products with that occasion and size came back
  - card messages: three messages of 86 to 135 characters; in Korean when Korean was asked for; 2.6 s
  - product description from a title and the florist's notes: 220 and 250 characters, using the notes and nothing that was not given; 2.9 s
- Also checked in the browser: the page talks only to the site and to its own API, never to the AI provider, and none of the scripts it loads holds a key or the name of the key's variable.
- Still as written in task 45: a guest and a wrong role are refused, ten requests a minute for each member, the fallback when the model cannot answer. Those were run again here and pass.
- Not verified: the features on the production server (the key is not there and the API image was not rebuilt); how the answers hold up in Russian and Uzbek (English and Korean were tried); long use against the rate limits of the OpenAI account.

## 47. Third deploy: the AI features, the four-florist row, the API and the client together

- `develop` was pushed and commit `6f97080` was put on the server (http://201.18.219.9:3001). Before it the server ran `aaed950`.
- What reached the live site: the AI features (45, 46), Top florists as a row of four with shop names, two-line article titles (44).
- The first update in which the API changed too. Both images were built and all three containers replaced; the steps are the ones in `deploy/README.md`, with the build and the `up` for every service.
- The owner's new OpenAI key was put into `florea-api/.env` on the dev machine and on the server (sent over SSH, not written to any file in the repo). Inside the API container the variable is set.
- A build that failed, and why:
  - the first build of the API image stopped at `npm ci`: "package.json and package-lock.json are not in sync", missing `@emnapi/core` and `@emnapi/runtime`
  - cause: installing and removing packages with npm on Windows (task 45 and 46) had dropped those two entries from the lock file; the Linux install needs them
  - fix (commit `6f97080`): the lock file is the last one that had built on the server, plus the entry of the `openai` package
  - the live site was not touched by the failure: the code was still in the side folder, and the folders are swapped only after the build passes
- Results:

| Check | Result |
|---|---|
| Image builds on the server | both pass (after the lock fix); client 85 pages |
| Containers | all three new and up; the API and the batch log "MongoDB is connected into production db" |
| The three AI mutations on the live API, with the real model | pass: a guest is refused; gift picks with reasons within the budget; three card messages in Russian; a product description |
| Browser on the public address, at 1500, 768 and 375 px | 15 of 16 |
| The other projects on the server | their containers up as before; nginx was not reloaded or changed |

- What the model answered on the live site: for "a plant for a friend who just moved house, nothing too big" up to $60, the succulent pair ($22); for "something sweet for a colleague, to say thank you" up to $40, the chocolate box and the macaron box. Each answer took 2 to 4 seconds.
- The one failed check: on a phone two of the six article titles are longer than two lines at that width and end with "…". That is the two-line limit doing its work, not a title cut after one line; the check counted it as cut.
- Afterwards: the old folder, the build log and the two fallback images were removed from the server; the password and key files used for the session were deleted from the dev machine.
- Access: the owner said to use the login already given for deploys. No key-based login is set up; the root password has been written in the chat several times and should be changed.
- Not verified on the server: "Write it for me" on the checkout page and "Generate description" in the product form in a browser (their mutations were called directly and pass; the screens were checked on the dev machine); a server reboot.

## 48. Gift assistant answers like a chat: its own reply, and the earlier messages

- Reported by the owner: they wrote "salom" in the assistant and got "Nothing among the current products fits that well. Try describing it in another way." The model had answered (no product fits a greeting), and the panel showed the fixed line for an empty list, so it looked as if the assistant was not answering.
- Backend (`components/ai/ai.service.ts`, `libs/dto/ai/ai.input.ts`):
  - the model now also returns `reply`, one or two short sentences to the customer in their language. It is passed on in `message` (300 characters at most). With picks it introduces them; with none it asks what would help. A greeting, a thank-you or small talk gets a warm answer and the question who the gift is for; anything that is not about gifts gets a polite "I only help with gifts here". No picks in those cases.
  - `AiGiftRecommendInput.history` (optional, six lines at most, 300 characters each): what the member wrote earlier in the conversation. The last four go to the model with the request, so "something cheaper" or "for my mother" is understood. Only the member's own messages are sent, not the assistant's earlier answers.
  - a request may be two characters long ("hi"); it was three
  - the fixed line is still used when the model returns no reply and no picks
- Frontend (`libs/components/ai/GiftAssistant.tsx`): the request sends the earlier messages of the panel; two characters are enough to send; the opening line starts with "Hello!".
- Results:

| Check | Result |
|---|---|
| `npx tsc` for `florea-api`, `yarn tsc --noEmit` | no errors |
| `npx jest apps/florea-api/src/components/ai` | 18 of 18 (two new: the reply is passed on and shortened; the last four earlier messages are sent) |
| Lint of the AI files | no problems |
| A conversation on the dev API with the real model | "salom" is answered in Uzbek with a question; "onamga tug'ilgan kuniga sovg'a kerak" gets four products with reasons in Uzbek; "arzonrog'i bormi?" gets cheaper ones for the same mother and birthday; "rahmat" is answered; "what is the capital of France?" is declined politely; "hi" is answered in English |
| The panel in a browser on the dev site | "hi" and "salom" get a reply and no cards; the real request gets cards under the assistant's own line |

- Deployed the next day (fourth deploy, commit `89cf1ff`), with the steps of `deploy/README.md` for an update of the API and the client. Both images built on the server (client 85 pages), all three containers were replaced, and the neighbours' containers kept running.
- On the live API with the real model: "salom" is answered in Uzbek with the question who the gift is for; "onamga tug'ilgan kuniga sovg'a kerak" gets five products with reasons; "arzonrog'i bormi?" gets the three cheapest for the same occasion.
- During the deploy the SSH session and one request from the dev machine dropped for a moment (the dev machine's network, not the server: other sites were unreachable at the same time). The containers had already been started; the checks were run again after it.
- Not verified: the panel of the live site in a browser after this deploy (the conversation above was held through the API; the panel was checked on the dev machine); `yarn build` on the dev machine (it passed on the server).

## 49. Full translation of the client: English, Korean, Russian

- Before: 57 keys in one `common.json`; about a tenth of the site followed the language. Most pages, every alert, the dates, the prices, the admin panel and the AI components were English whatever language was chosen, and eight admin pages did not load translations at all.
- Now every text of the client is a key, in all three languages.

**Structure**

- `public/locales/{en,kr,ru}/`: twelve files, one per feature: `common` (navbar, footer, cards, alerts, enum labels, server messages), `ai`, `home`, `product`, `agent`, `community`, `order`, `mypage`, `member`, `account`, `cs`, `admin`. 832 keys; 859 English texts, 832 Korean, 913 Russian (the difference is plural forms).
- `libs/i18n/` (new):
  - `server.ts`: `pageTranslations(locale, [namespaces])` for `getStaticProps`; `common` and `ai` are always loaded
  - `tr.ts`: `tr('ns:key', 'English')` for code outside React (alerts, the cart, helpers)
  - `format.ts`: `useFormat()` with `number`, `price`, `date`, `weekday`, `ago`, `dateTime` and others, built on `Intl`
  - `labels.ts`: `useEnumLabel()`; an enum value is shown through `enum.<group>.<value>` and is stored and sent unchanged
  - `serverText.ts`: the English messages and notification titles of the API, mapped to keys
  - `memory.ts`: the language chosen last is stored in the browser; an address without a language goes to it
  - `locale.ts`: the address says `kr`, `Intl` and `<html lang>` get `ko`
- `scripts/i18n-check.mjs` and `yarn i18n:check`: fails on a key the code asks for and English lacks, a key missing in Korean or Russian, a missing plural form, an empty text, or a page that does not load a namespace it (or anything it imports) reads. Unused keys are listed.

**What changed in the pages**

- every page loads its namespaces in `getStaticProps`; the eight admin pages got one
- strings moved to keys in the pages, the layouts, the navbar and footer, the homepage sections, cards, filters, cart, checkout, orders, My page, the member page, community, customer care, the admin panel, the gift assistant, the card helper and the product-description button
- sentences with a number use plural keys (Russian has four forms); sentences with a name or a link inside use `Trans`
- dates, prices and counts go through `useFormat()`; `moment` formats with English words and `toLocaleString()` calls are gone
- enum labels (product type, occasion, size, location, order status, article category, member type and status, notice topic and status, card tone) come from `common.json`; `orderStatusLabels` and the label maps of the notice enums were removed
- alerts (`libs/sweetAlert.ts`) translate their buttons and pass every message through `serverText()`
- `<html lang>` follows the language; the page description and keywords are translated
- the texts MUI brings with it (pagination, "Rows per page") follow the language through the theme (`pages/_app.tsx`); the article editor's toolbar uses its own Korean and Russian texts
- not changed: GraphQL documents, routes, stored values, the backend

**Found while checking in the browser, and fixed**

- the occasion shortcuts under the hero search showed the enum value in lower case (`birthday`)
- MUI pagination and the editor toolbar were English (above)
- `text-transform: capitalize` gave every Russian word a capital letter ("Мои Заказы"). The 34 rules now read `var(--title-case, capitalize)`, and Russian turns it off in `scss/app.scss`. Russian texts that relied on it start with a capital in the file.
- avatars in the admin lists had the alt text "Remy Sharp" (the letter "R" appeared when a photo was missing); they use the nickname or the product title
- the email field of "Ask the florist" had the placeholder `creativelayers088`
- on phones the My page menu kept the desktop minimum height of 700px, which left half a screen empty under it. Not a translation matter; one line in `scss/mobile/mypage.scss`.
- three keys nothing read were removed; `formatLabel` and `prettyLabel` (unused after the enum labels) were removed

**Results**

| Check | Result |
|---|---|
| `yarn i18n:check` | passes: 0 missing keys in English, Korean, Russian; 0 missing plural forms; 0 pages without a namespace they read; 0 unused keys |
| `yarn tsc --noEmit` | no errors |
| `yarn build` | succeeds, 77 static pages |
| Browser, production build, 37 page states × 3 languages × 2 widths (1440 and 390 px) = 222 | raw keys shown: 0; pages with sideways scroll: 0 |
| Latin text left on the Korean and Russian pages | only database content (titles, nicknames, addresses, notices, FAQ), ids, the brand name, file formats, and "English" in the language menu |
| `<html lang>` | `en`, `ko`, `ru` |
| Language memory | `/ru/product`, then `/product` → `/ru/product`; reload and a link keep Russian; choosing English in the navbar is stored and `/product` stays English |

- The 37 page states: home (guest and member, with the language menu, the bell, the chat, the gift assistant and the phone drawer opened), join, products, product detail, cart (empty and with an item), checkout (with "Write it for me" opened), order placed, florists, florist page, community, article, customer care, about, a member's page (four tabs), My page (eleven sections, as a customer and as a florist), and the seven admin pages.
- Test data: one order was placed on the dev database as `aitester` so that the order pages had something to show.

**What stays in English or as written, on purpose**

- everything from the database: product titles and descriptions, nicknames, addresses, articles, comments, chat messages, notices and FAQ entries
- the name of each language in the language menu is written in that language
- "Q" and "A" marks in the FAQ; "Markdown" and "WYSIWYG" in the Russian editor (the editor's own translation keeps them)
- the empty date field shows the placeholder of the visitor's browser, not of the site

**Not verified**

- The screenshots were not all looked at one by one: the 222 states were checked by script (keys, Latin text, overflow), and about fifteen screenshots were read by eye (home, drawer, product page, checkout, My page, admin orders).
- The AI answers themselves were not asked again with the real model in this task; the backend is unchanged since task 48, where they followed the language of the request. The panels' own texts were checked in all three languages.
- Korean and Russian were written by the assistant and not read by a native speaker.
- Tablet width (768px) was not part of this run.

**Known and left**

- on phones "See all" beside a section title is 8px wider than its box in every language (it was so before)
- status tabs of the orders and the homepage tabs scroll sideways on a phone when the labels are long (Russian); that is how the strips are built

**Deployed on 2026-10-14 (fifth deploy)**

- Steps of `deploy/README.md` for an update of the client alone: code into `/root/apps/florea.new`, the two settings files carried over, `florea-next` built there, folders swapped, `up -d --no-deps florea-next`. The API and the batch container were not restarted.
- Two things were found on the live site, fixed and deployed again the same way (three client builds in all, each 77 pages):
  - **`<html lang>` turned into `kr` in the browser.** The server sends `ko`, but Next writes the locale of the address into the tag on every navigation inside the site, and the florists and community pages change their own address when they open. `pages/_app.tsx` now sets the tag again after each navigation (commit `0f53364`). The local run had shown both `ko` and `kr` for Korean and it was not followed up at the time.
  - **Korean lines broke inside a word** (the hero title ended a line with "꽃" and started the next with "과"). `scss/app.scss`: `word-break: keep-all` for Korean, with `overflow-wrap: break-word` so that a long word still fits (commit `4a86c02`).
- Checks on the public address after the last build:

| Check | Result |
|---|---|
| Eight public pages (home, products, florists, community, customer care, about, join, cart) in three languages at 1440 and 390 px, as a guest | 46 of 48 pass: no raw key, no sideways scroll, `<html lang>` right, the navbar in the language |
| The two that did not pass | the English home page opened in Russian, because the test browser still had Russian stored from the run before. That is the language memory doing its work, not a fault of the page; English passed in the run made before any language was stored. |
| `<html lang>` after opening florists, community and products and then following a navbar link, Korean and Russian | 6 of 6 (`ko`, `ru`) |
| Language memory | `/kr/product`, then `/agent` → `/kr/agent` |
| Other projects on the server | their containers kept running; nginx was not touched |

- Afterwards the side folders, the build log and the fallback image tag were removed from the server, and the password files of the session were deleted from the dev machine.
- The three builds left about 9 GB of untagged images and build cache on the server disk (50% used, 49 GB free). They were not removed, because the cache is shared with the other projects.
- Access: the owner said to use the server login given earlier in the conversation. No key-based login is set up yet.
- Not verified on the live site: the pages behind a login (My page, checkout, orders, admin) in a browser. They were checked on the dev machine with the same code; on the server only their addresses were requested (200).

## 50. A full retest after the translation, and the defects it found

- Asked by the owner after task 49: "test again, so that no errors are left". Run on the dev machine against the dev API, then on the live site after the deploy.

**What was run**

| Test | Result |
|---|---|
| `yarn i18n:check`, `yarn tsc --noEmit`, `npx tsc` of the API | pass |
| API flows: orders, notices and FAQ, article and profile notifications | 72 of 72 |
| Backend AI unit tests | 18 of 18 |
| Browser, in English: ordering (cart, checkout, order, cancel, every status, the bell), customer care and its admin screen, the bell, the live chat, the phone layout | 109 of 109 |
| Browser, the whole way in Korean and in Russian (new test, `flow-lang`): wrong and right password, add to cart, cart, checkout errors, order, thank-you page, cancel, status tabs, the florist's buttons, the buyer's bell | 18 of 18 in each language |
| The AI with the real model, in Korean and Russian | "Write it for me" gave three card messages in the language; the gift assistant answered in the language with four or five products and reasons in the language |
| Every page in three languages (37 page states, guest, customer, florist, admin), looking for uncaught errors, console errors, React warnings, failed requests and GraphQL errors | 123 page loads: no uncaught error from the site, no failed request, no GraphQL error, no missing key, no hydration warning. Left: the two Apollo deprecation warnings and the product form warning below (27 loads had none of them) |

- Some of the older browser tests failed at first because the tests had aged, not the site: they looked for English texts that were reworded in task 49 ("LOGIN" is now "LOG IN", "data not found!" is "Nothing found.", "For Florists" is "For florists"), and for a product on the first page of the list, where the sample shops now put other products. The tests were brought up to date and pass.

**Defects found and fixed** (commit `a9f17df`)

- **A failed login said only "We could not log you in."** `libs/auth/index.ts` waited for messages the API no longer sends ("Definer: login and password do not match"). It now passes on what the API answered, and the form shows it in the chosen language: wrong password, no member with this nickname, blocked, nickname or phone already used.
- **The typed password was printed to the browser console**, twice: by the login form (`pages/account/join.tsx` logged the form state on every key press and on submit) and by the Apollo link, which logged every request with its variables (`apollo/client.ts`). Both logs are removed.
- **Short dates had a two-digit year** ("10/12/26", "26. 10. 12."). `libs/i18n/format.ts` writes the whole year: "10/12/2026", "2026. 10. 12.", "12.10.2026"; date with time the same way.
- **The admin header asked the API for the placeholder photo** (`localhost:3007//img/profile/defaultUser.svg`, refused), so an admin without a photo saw an empty circle. `LayoutAdmin.tsx` treats `/img/…` as a file of the site, as the navbar already did.
- **Article page:** MUI warned on every load that the board tabs had no value before the address was read; it now gets `false` until then.
- **Admin inquiry mock-up:** its select and pagination had values the components reject (console warnings); set to valid ones. The page is still a mock-up.

**Known and left**

- The exception with `code=403` that appears on every page in the test browser comes from a browser extension of the test profile (Monica); it appears on example.com too. Not the site.
- Apollo warns that the `onCompleted` and `onError` options of `useQuery` are deprecated (Apollo 3.14). They still work; changing them touches every list page.
- The product form's selects mix `value`, `defaultValue` and `selected` (React warns); inherited, and not visible to a member.

**Deployed on 2026-10-14 (sixth deploy)**

- Client only, with the steps of `deploy/README.md`; the API and the batch container were not restarted; the other projects' containers kept running. Build on the server: 77 pages.
- On the live site, in English, Korean and Russian: a wrong password for `rosegarden` is answered with the reason in the language, nothing typed is printed to the console, no session is opened, notice dates have the whole year, `<html lang>` is `en`, `ko`, `ru`: 15 of 15.
- Afterwards the old folder, the build log and the fallback image tag were removed from the server, and the password files of the session were deleted from the dev machine. Disk: 52% used.
- Test data: the browser tests place and move orders on the dev database as they always did; the order placed for the order pages in task 49 (`aitester`) was cancelled. On the live site: one failed login attempt for `rosegarden` per language.
