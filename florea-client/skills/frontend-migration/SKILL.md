---
name: frontend-migration
description: Continue the nestar-next to florea-next frontend migration one phase at a time while preserving the current Next.js and Apollo architecture. Use when asked to migrate, rename or convert client enums, types, GraphQL operations, components, pages or routes from property to product.
---

# Frontend Migration

## Before starting

1. Read `AGENTS.md` and the files it lists under "Backend Context".
2. Open `../docs/ai/NEXT_STEPS.md` and pick the first unfinished frontend phase. Do not skip ahead.
3. Make sure the backend answers at http://localhost:3007/graphql. Its schema is the source of truth for names and fields.
4. Run `npx tsc --noEmit` and note the result before changing anything.

## Phase order

1. Env file and config (`.env.development`, `libs/config.ts`)
2. Enums and types (`libs/enums`, `libs/types`)
3. Apollo operations (`apollo/user`, `apollo/admin`)
4. Components and pages (`libs/components`, `pages`)
5. Routes (`/property` → `/product`), menus and links
6. Styles, images, i18n text, SEO text

## Steps for one phase

1. List every file that will change and what changes in each. Show the list before editing.
2. Take field names, enum values and operation names from the backend, never from memory.
3. Replace real-estate fields (rooms, beds, square, barter, rent, constructed year) with product fields (`productOccasion`, `productSize`, `productStock`, `productSameDay`, `productGiftWrap`). Do not just rename them.
4. Keep the existing component structure, hooks, Apollo usage and SCSS class names unless the phase is about them.
5. Keep the agent pages and the `AGENT` role as they are.

## After the phase

1. Run `npx tsc --noEmit`.
2. Start the app with `npm run dev` and open the pages touched by the phase.
3. Search the phase's files for leftovers of the old name.
4. Update `../docs/ai/COMPLETED_TASKS.md` and `../docs/ai/FRONTEND_MIGRATION.md`, and remove the finished item from `../docs/ai/NEXT_STEPS.md`.
5. Report: files changed, typecheck result, pages checked, and anything left as TODO.

## Do not

- Do not change the backend (`../florea-api`) in a frontend task.
- Do not rewrite a page from scratch when an edit is enough.
- Do not add libraries or a lint setup unless asked.
- Do not commit `.env*` files.
