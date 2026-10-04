---
name: backend-migration
description: Continue the Nestar to Florea backend migration one module at a time while preserving the current NestJS architecture. Use when asked to migrate, rename or convert a backend module (member, property/product, like, view, comment, follow, board article, notice, notification, batch).
---

# Backend Migration

## Before starting

1. Read `AGENTS.md` and the files it lists under "Read First".
2. Open `../docs/ai/NEXT_STEPS.md` and pick the first unfinished module. Do not skip ahead: later modules depend on earlier ones.
3. Run the validation commands from `AGENTS.md` and confirm the project is clean before you change anything.

## Module order

1. Member (`memberProperties` → `memberProducts`; `MemberType` stays unchanged)
2. Property → Product (schema, DTOs, enums, config sorts, resolver, service, collection)
3. Like, View and Comment group enums (`PROPERTY` → `PRODUCT`)
4. Board articles
5. Notices and notifications (`propertyId` → `productId`)
6. Batch app (top products, top agents)

## Steps for one module

1. List every file that will change and what changes in each. Show the list before editing.
2. Change the enum and DTO files in `apps/florea-api/src/libs` first, then the schema in `apps/florea-api/src/schemas`, then service, resolver and module.
3. Follow the field list and enum values in `AGENTS.md` and `Florea-ERD.pdf`. If a value is missing there, stop and ask; do not invent one.
4. Update every import and usage in other modules and in `apps/florea-batch`.
5. Keep guards, decorators, the logging interceptor and error messages working as they are.

## After the module

1. Run the validation commands from `AGENTS.md`.
2. Start the API and try the changed queries and mutations in the GraphQL playground.
3. Search for leftovers of the old name in the module.
4. Update `../docs/ai/COMPLETED_TASKS.md` and `../docs/ai/BACKEND_MIGRATION.md`, and remove the finished item from `../docs/ai/NEXT_STEPS.md`.
5. Report: files changed, validation results, and anything left as TODO.

## Do not

- Do not migrate more than one module in a task.
- Do not change the client (`../florea-client`) in a backend task.
- Do not run `npm run lint` (it rewrites files with `--fix`).
- Do not commit `.env`.
