# Prompts

Every prompt used in this session, in order, with what each one achieved.

## 1. Migration strategy

> I want to transform existing NestJS Monorepo Nestar platform into Petshop platform using Codex as an AI coding Agent. What steps do you recommend

(Sent as a screenshot.)

**Result:** a 7-step migration outline adapted to Florea, and the finding that `florea-api/` was only an empty scaffold.

## 2. Run step 1

> Recommended steps
> Bring the Nestar backend into florea-api. Copy the monorepo (the apps/ API and batch apps, libs/, monorepo nest-cli.json) and commit it untouched. That gives you a working baseline to diff against.
>  yaxshi unda boshlaymiz   "Florea"
> Topic"  Online Gift & Flower Marketplace   1stepni bajar

**Result:** the Nestar backend monorepo was imported into `florea-api/` as a baseline, a socket gateway type error was fixed, and the API was built and smoke-tested.

## 3. Safe rename layer

> Safe Rename Layer (No Business Logic Change)
> Rename all visible project/app identifiers from Nestar to Florea. Do not change domain logic. Keep APIs and database collections unchanged. Update package names, environment labels, and constants. Run lint and typecheck after refactoring. Please make a plan first!

**Result:** a written rename plan covering backend, client, what stays unchanged, and verification.

## 4. Status question

> nima boldi hozir

**Result:** an explanation that the work was paused by plan mode, with nothing renamed yet.

## 5. Continue

> davom et

**Result:** the rename was carried out in backend and client (commits `5e36d89`, `0442d14`), with typecheck, lint and build results.

## 6. Migration docs

> Create a new folder: docs
> Inside it, generate these markdown files:
>
> BACKEND_MIGRATION.md
> DECISIONS.md
> FRONTEND_MIGRATION.md
> COMPLETED_TASKS.md
> NEXT_STEPS.md
> PROMPTS.md
>
> Use everything completed and discussed in this session.
> Each file must summarize the current Nestar → Florea migration state.
> Florea is an online gift & flower marketplace.
>
> Requirements:
>
> BACKEND_MIGRATION.md:
> - original project summary (Nestar)
> - new project summary (Florea)
> - backend migration goal
> - naming changes (Nestar → Florea, property → product, and others)
> - collections, schemas and enums that changed
> - GraphQL/API changes
> - what stayed unchanged
> - current status and known issues
>
> FRONTEND_MIGRATION.md:
> - frontend migration goal
> - renamed pages, components and routes
> - updated types, queries and mutations
> - UI text and branding changes
> - what stayed unchanged
> - current status and known issues
>
> DECISIONS.md:
> - every important decision made in this session
> - the reason for each decision
> - alternatives that were rejected and why
>
> COMPLETED_TASKS.md:
> - checklist of finished tasks in the order they were done
> - files touched by each task
> - lint, typecheck and build results
>
> NEXT_STEPS.md:
> - remaining tasks in priority order
> - blockers and open questions
> - what to verify before each next step
>
> PROMPTS.md:
> - every prompt used in this session, in order
> - a one-line note on what each prompt achieved
>
> Rules:
> - Write only what was actually done or discussed. Do not invent anything.
> - If something is unknown or not done yet, mark it as TODO.
> - Do not change any source code. Only create the docs folder and these files.

**Result:** a plan for the six files.

## 7. Question about the pause

> nimaga qotib qolyapsan planingda

**Result:** an explanation that plan mode blocks file creation until the plan is approved.

## 8. Continue

> ok davom et

**Result:** the `docs/` folder and these six files were created.
