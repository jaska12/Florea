---
name: admin-panel
description: Improve Florea admin panel UI/UX and layout. Use for design changes on the admin pages (members, products, community, CS) under pages/_admin.
---

The admin panel is where a Florea `ADMIN` manages members, products, community articles and customer-service content.

Focus on:

- table layout
- filters and search
- status controls
- spacing
- readability

Where the code is:

- pages: `pages/_admin/` (`users`, `products`, `community`, `cs`)
- components: `libs/components/admin/` (`AdminMenuList`, `users`, `products`, `community`, `cs`)
- layout: `libs/components/layout/LayoutAdmin.tsx`
- styles: `scss/pc/admin/admin.scss`

How to work:

- Change one admin page per task.
- Keep the same columns and actions unless asked to change them; product columns come from the product fields (type, occasion, size, stock, price, status).
- Keep the status values exactly as the backend defines them (`ACTIVE`, `SOLD`, `DELETE`, member `ACTIVE`, `BLOCK`, `DELETE`).
- Use Material-UI components already used on the other admin pages.

Do NOT:

- rewrite architecture
- change GraphQL logic
- change backend integration
- change the user-facing pages (use the `user-project` skill for those)

Finish with `yarn tsc --noEmit`, and update `../docs/ai/COMPLETED_TASKS.md` after major changes.
