# Decisions

Important decisions made during the Nestar → Florea migration session, with the reason and the rejected alternative.

## 1. Import Nestar as an untouched baseline before changing anything

- **Decision:** copy the Nestar backend into `florea-api/` as-is and commit it, then start changing it.
- **Reason:** gives a working baseline, so every later diff shows only real Florea changes.
- **Rejected:** transforming the code while copying it. A broken result would be impossible to trace back to a cause.

## 2. Use the local `nestar` project as the source

- **Decision:** the backend was copied from the local `../nestar` folder, from its working tree, including uncommitted WebSocket chat changes.
- **Reason:** `florea-api/` contained only an empty NestJS scaffold, and the client already used the final chat client, so the newest gateway code was the matching version.
- **Rejected:** the last committed Nestar version, which lacked the chat changes the client expects.

## 3. Leave non-source files out of the import

- **Decision:** not copied: `material/`, `__MACOSX/`, build log `.txt` files, uploaded images. `.env` was copied locally only and is not tracked by git. Empty `uploads/member`, `uploads/property`, `uploads/article` folders were created.
- **Reason:** these are course materials, OS junk, logs, Nestar test data and secrets; none belong in the Florea repo.
- **Rejected:** copying the folder wholesale. Nestar's own repo tracks `.env`, and that would have put secrets on GitHub.

## 4. Fix the socket gateway types with the smallest possible change

- **Decision:** guests are typed as `Member | null` in `socket.gateway.ts`. Committed separately from the baseline import.
- **Reason:** the uncommitted chat code failed the build with two `strictNullChecks` errors. A baseline that does not build is not useful.
- **Rejected:** turning off `strictNullChecks` (hides real bugs project-wide), or going back to the older gateway (loses the chat features).

## 5. Rename layer is names only

- **Decision:** the rename step changed only project and app identifiers: folders, package names, config, scripts, branding text. No resolver, service, schema, DTO, GraphQL operation or collection was touched.
- **Reason:** a rename that also changes logic cannot be verified by "it still builds and runs the same".
- **Rejected:** renaming Property → Product in the same step. That changes fields and business rules, so it belongs to the domain step.

## 6. Run lint without `--fix` and compare to a baseline

- **Decision:** lint was measured before the rename (3364 problems) and after (3364 problems). `npm run lint` was not used, because it runs with `--fix`.
- **Reason:** 3152 of the problems are auto-fixable formatting. Auto-fixing would rewrite almost every file and bury the rename diff.
- **Rejected:** fixing all lint problems during the rename.

## 7. No new ESLint setup for the client

- **Decision:** client lint was reported as not runnable.
- **Reason:** the client has no ESLint config; `next lint` only opens an interactive setup. Adding a lint setup is a separate change, not a rename.
- **Rejected:** adding an ESLint config inside the rename step.

## 8. Leave CHANGELOG links and logo files alone

- **Decision:** `florea-client/CHANGELOG.md` and the logo/favicon SVG files were not changed.
- **Reason:** the CHANGELOG entries are real links to the upstream `nestar-next` repo; rewriting them would create dead links. The logos are artwork, not text identifiers.
- **Rejected:** a blind find-and-replace of every "nestar" string.

## 9. Do not touch `.env` values

- **Decision:** env variable names and values were left as they are.
- **Reason:** none of the names contain "Nestar". The values are secrets, and the database name inside `MONGO_DEV` decides which database is used, so changing it is not a pure rename.
- **Rejected:** editing the connection string as part of the rename.

## 10. Install client dependencies with npm `--legacy-peer-deps`

- **Decision:** used `npm ci --legacy-peer-deps` to install the client for the typecheck.
- **Reason:** `yarn install` failed with a network error, and plain `npm ci` failed on a peer-dependency conflict.
- **Rejected:** skipping the client typecheck.

## 11. Data model: `Florea-ERD.pdf` replaces the first ER model

- **Decision (made by the project owner):** the first ER model, based on the Burak project (with `orders`, `orderItems`, `reviews`, `sessions`), was removed. `Florea-ERD.pdf` is now the target. It follows Nestar's structure: `members`, `products`, `views`, `likes`, `follows`, `comments`, `boardArticles`, `notices`, `notifications`.
- **Reason:** not recorded in this session. TODO: add the owner's reason.
- **Effect:** the earlier open questions are settled. JWT stays (no `sessions`), `comments` stays (no separate `reviews`), notices and notifications stay, and there are no order collections.

## 12. Git workflow

- **Decision:** work was done on branches (`feat/nestar-backend-baseline`, `refactor/rename-nestar-to-florea`) and never pushed by the assistant. The project owner squashed the early history into one commit (`ec67111`), merged the rename into `main`, and pushed.
- **Reason:** branches keep `main` safe while a step is being verified; publishing is the owner's decision.
- **Rejected:** committing directly on `main` and pushing automatically.

## 13. One step per task, plan before code

- **Decision:** each migration step is a separate task with its own verification, and larger steps start with a written plan.
- **Reason:** small steps are easy to check and to undo.
- **Rejected:** one large "convert the whole project" task.
