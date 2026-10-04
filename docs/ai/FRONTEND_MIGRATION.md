# Frontend Migration: Nestar → Florea

State as of 2026-10-05, branch `main` at commit `5f5405e`.

## Migration goal

Turn the Nestar Next.js client (`florea-client/`) into the Florea client: an online gift & flower marketplace UI that talks to the Florea GraphQL API.

Only the first layer is done: **branding and package name**. No page, route, component, type, query or mutation has been migrated to the product domain yet.

## Renamed pages, components and routes

**None yet.**

TODO: these still carry the old domain names and will need renaming in the domain step.

- Pages: `pages/property/index.tsx`, `pages/property/detail.tsx`, `pages/agent/index.tsx`, `pages/agent/detail.tsx`, `pages/_admin/properties/index.tsx`
- Components: `libs/components/property/*`, `libs/components/agent/ReviewCard.tsx`, `libs/components/common/AgentCard.tsx`, `libs/components/common/PropertyBigCard.tsx`, `libs/components/homepage/{Popular,Top,Trend}Properties.tsx` and their cards, `libs/components/homepage/TopAgents.tsx`, `TopAgentCard.tsx`, `libs/components/member/MemberProperties.tsx`, `libs/components/mypage/{AddNewProperty,MyProperties,PropertyCard}.tsx`, `libs/components/admin/properties/PropertyList.tsx`
- Styles: `scss/pc/property/*`, `scss/pc/agent/*`, `scss/pc/member/memberProperties.scss`, `scss/pc/mypage/{addNewProperty,myProperties}.scss`
- Images: `public/img/property/*`, `public/img/banner/properties.png`, `public/img/banner/agents.webp`, `public/img/profile/agent.png`

The new route names are not decided. TODO.

## Updated types, queries and mutations

**None yet.**

TODO:

- `libs/enums/property.enum.ts`
- `libs/types/property/{property,property.input,property.update}.ts`
- `apollo/user/query.ts`, `apollo/user/mutation.ts`, `apollo/admin/query.ts`, `apollo/admin/mutation.ts`

These must change together with the backend, because the client calls the same operation names.

## UI text and branding changes (done)

| File | Change |
|---|---|
| `package.json`, `package-lock.json` | package name `nestar-next` → `florea-next` |
| `libs/components/layout/LayoutBasic.tsx`, `LayoutFull.tsx`, `LayoutHome.tsx` | `<title>` and `meta title`: Nestar → Florea |
| `libs/components/Footer.tsx` | copyright text: Nestar → Florea (2 places) |
| `pages/account/join.tsx` | brand name next to the logo |
| `pages/community/index.tsx` | `Nestar Community` → `Florea Community` |
| `pages/_document.tsx` | SEO keywords and site name: `nestar`, `nestar.uz` → `florea`, `florea.uz` |
| `MemberFollowers`, `MemberFollowings`, `MemberProperties`, `MyFavorites`, `MyProperties`, `RecentlyVisited` | mobile placeholder text `NESTAR ... MOBILE` → `FLOREA ... MOBILE` |
| `.gitignore` | comment text |

## What stayed unchanged

- All routes and page files
- All Apollo queries and mutations
- All types and enums
- Component logic
- Logo and favicon files in `public/img/logo/` (artwork, may still show the old brand; TODO: check and replace)
- `CHANGELOG.md` (its `nestar-next` links are real links to the upstream repo history)
- i18n locale files (TODO: review wording in the domain step)

## Current status

| Check | Result |
|---|---|
| Typecheck (`tsc --noEmit`) | no errors |
| Lint | not runnable: the client has no ESLint config, `next lint` only opens an interactive setup |
| Build (`next build`) | TODO (not run) |
| Run in browser | TODO (not verified) |

## Known issues

- **Install:** `yarn install` failed with a network error in this session. `npm ci` fails on a peer-dependency conflict; `npm ci --legacy-peer-deps` works.
- **Two lockfiles:** both `yarn.lock` and `package-lock.json` exist. TODO: pick one package manager.
- **SEO description:** `pages/_document.tsx` still says "Buy and sell properties anywhere anytime in South Korea" (in English, Russian and Korean). Only the site name was changed.
- **Env file:** no `.env` file exists in `florea-client/`. TODO: create it with the API and WebSocket URLs before running the client.
- **No ESLint setup.** TODO: decide whether to add one.
