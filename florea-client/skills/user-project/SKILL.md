---
name: user-project
description: Improve Florea Ecommerce frontend UI/UX and responsive design. Use for design changes on the user-facing pages (homepage, product list and detail, agents, community, mypage, account, about, CS).
---

Florea is an online gift & flower marketplace. The design should feel like a flower and gift shop, not a real-estate site.

Focus on:

- catalog layout
- typography
- spacing
- responsiveness
- commerce UX

Where the code is:

- pages: `pages/` (everything except `pages/_admin`)
- components: `libs/components/` (everything except `libs/components/admin`)
- layouts: `libs/components/layout/`
- styles: `scss/pc/`, `scss/mobile/`, `scss/variables.scss`, `scss/MaterialTheme/`
- images and icons: `public/img/`

How to work:

- Change one page or one section per task.
- Reuse the existing SCSS files and variables; put shared colors and fonts in `scss/variables.scss`.
- Keep existing class names when only the look changes.
- Replace real-estate leftovers you touch: bed, room and area icons, house photos, "home" and "rent" wording.
- Check the page at desktop and mobile widths.

Do NOT:

- rewrite architecture
- change GraphQL logic
- change backend integration

Finish with `yarn tsc --noEmit`, and update `../docs/ai/COMPLETED_TASKS.md` after major changes.
