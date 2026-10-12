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
- **Effect:** the earlier open questions are settled. JWT stays (no `sessions`), `comments` stays (no separate `reviews`), notices and notifications stay, and there are no order collections. **Changed by decision 24:** `orders` and `orderItems` were added later at the owner's request.

## 12. Git workflow

- **Decision:** work was done on branches (`feat/nestar-backend-baseline`, `refactor/rename-nestar-to-florea`) and never pushed by the assistant. The project owner squashed the early history into one commit (`ec67111`), merged the rename into `main`, and pushed.
- **Reason:** branches keep `main` safe while a step is being verified; publishing is the owner's decision.
- **Rejected:** committing directly on `main` and pushing automatically.

## 13. One step per task, plan before code

- **Decision:** each migration step is a separate task with its own verification, and larger steps start with a written plan.
- **Reason:** small steps are easy to check and to undo.
- **Rejected:** one large "convert the whole project" task.

## 14. Agent guidelines follow the instructor's structure, with proposed enum values

- **Decision:** `AGENTS.md`, `SKILLS.md` and `skills/<name>/SKILL.md` follow the instructor's Petoria layout. `MemberType` stays `USER`, `AGENT`, `ADMIN`; product ownership uses `AGENT`. Product enum values in `florea-api/AGENTS.md`: `ProductType` (`BOUQUET`, `FLOWER`, `PLANT`, `GIFT_BOX`, `SWEET`, `TOY`, `OTHER`), `ProductOccasion` (`BIRTHDAY`, `WEDDING`, `ANNIVERSARY`, `LOVE`, `CONGRATS`, `SYMPATHY`, `OTHER`), `ProductSize` (`SMALL`, `MEDIUM`, `LARGE`, `DELUXE`), `ProductStatus` (same as the current `PropertyStatus`), `ProductLocation` (current values kept for now).
- **Reason:** the type, occasion and size values come from the project owner's first ER model; keeping `MemberType` unchanged follows the instructor's approach and avoids touching auth and role guards.
- **Status:** confirmed by the project owner on 2026-10-05.
- **Rejected:** renaming `AGENT` to `SELLER` now (touches guards, client and every role check for no functional gain).

## 15. Product enum values revised to the owner's migration plan

- **Decision:** `ProductType`: BOUQUET, FLOWER_BOX, PLANT, GIFT_BOX, SWEET, TOY. `ProductOccasion`: BIRTHDAY, WEDDING, ANNIVERSARY, LOVE, CONGRATS, SYMPATHY. `ProductSize`: SMALL, MEDIUM, LARGE. `ProductStatus`: ACTIVE, SOLD, DELETE. This replaces the values in decision 14 (`FLOWER` → `FLOWER_BOX`; `OTHER`, `DELUXE` and `HOLD` removed).
- **Reason:** the project owner's "Full Property To Product Backend Migration Plan" lists these values.
- **Not done from that plan, with reason:**
  - Migration script from `properties` to `products`: the `Florea` database was new, `properties` held 0 documents and was dropped, so there is nothing to copy.
  - `notifications.propertyId` → `productId`: the code has no `propertyId`; the notification schema uses a generic `notificationRefId`.

## 16. The frontend uses Yarn only

- **Decision:** all frontend commands use Yarn; `package-lock.json` was deleted and `yarn.lock` regenerated. This replaces decision 10 (installing with `npm ci --legacy-peer-deps`), which was a workaround for a network failure.
- **Reason:** the project owner's `AGENTS.md` says "Use Yarn for all frontend commands. Do not use npm or pnpm", following the instructor's setup. Two lockfiles from two package managers drift apart, which is what had happened to the old `yarn.lock`.
- **Rejected:** keeping both lockfiles (the rule and the repo would contradict each other).

## 17. Site-wide design system from the owner's brief

- **Decision:** Fraunces for headings and Outfit for text (replacing Poppins and the Playfair Display used for one day on the homepage); palette deep rose `#B4235F`, wine `#7A1F45`, blush `#FFF1F5`, amber `#F2B134` for small highlights only. The old palette was replaced token by token in every stylesheet rather than page by page.
- **Reason:** the owner's brief names these fonts and colours and asks for one system on every page. Replacing the colours as tokens changes every page at once and leaves no page behind in the old look.
- **Rejected:** restyling each page by hand first (weeks of work with an inconsistent site in between).

## 18. "Florists" in the interface, `AGENT` in the code

- **Decision:** the interface says Florist / Florists; routes (`/agent`), the `AGENT` member type, queries and component names are unchanged.
- **Reason:** the brief calls sellers florists; renaming the role in code would touch auth, guards and the backend (see decision 14).

## 19. Delivery wording

- **Decision:** the site now says products are delivered, including same-day delivery, as the owner's brief describes Florea. The same-day banner links to the existing same-day and gift-wrap filters.
- **Reason:** the brief defines Florea as a marketplace with delivery.
- **Open:** there is no order or checkout flow in the product yet, so the wording is ahead of the features. TODO: build ordering, or soften the wording.

## 20. The bell shows an empty state until the backend has notifications

- **Decision:** the bell opens a dropdown that says "No notifications yet". The list, unread state, badge and loading state are built in `NotificationBell` and wait for data; no sample notifications are shown to users.
- **Reason:** the backend has only a `Notification` schema, and the notifications brief did not allow backend or GraphQL changes. Showing invented notifications would be false.
- **Superseded by decision 21:** the backend module now exists and the bell shows real notifications; the empty state stays for members who have none.

## 21. How notifications work

- **Decision:**
  - The schema keeps the generic `notificationRefId` (the product, article or member the notification is about), not the ERD's separate `productId` and `articleId`.
  - `notificationTitle` holds a plain English line and `notificationDesc` the product title, article title or comment text. The client builds the visible sentence from the type, group and author, so it can be translated.
  - Taking a like back or unsubscribing deletes the notification, so liking and unliking repeatedly does not fill the list.
  - The server announces a change over the chat socket (`{ event: 'notification' }`, no content) and the client then asks for the list through GraphQL. A 60-second timer covers a socket that is down. (First version: a 20-second timer only.)
- **Reason:** `notificationRefId` is what the code already had and one field serves all three groups; sending only a signal over the socket keeps the notification data behind the GraphQL guard.
- **Rejected:** `productId` / `articleId` columns (two nullable fields and a third case for members); sending the whole notification over the socket.

## 22. One socket for the page, handled in one place

- **Decision:** `libs/socket.ts` owns the WebSocket: it opens it, reconnects it, and writes chat messages, the online count and the notification signal into reactive variables. Components read the variables and do not attach their own handlers to the socket.
- **Reason:** every page has its own layout wrapper, so the chat window is mounted again on each page change. State held inside the component (the Nestar approach) would lose the conversation on every navigation.
- **Kept from Nestar:** the socket is still created through Apollo's `WebSocketLink` (`LoggingWebSocket`), one public chat room, the last five messages in the server's memory.

## 23. One markup per page, responsive by screen width

- **Decision:** every page and component renders the same markup at every width. `scss/pc` styles the desktop; `scss/mobile` adapts it below 1024px (`tablet`) and 640px (`phone`). The layout wrapper is `#pc-wrap` on every device, and `#mobile-wrap` is gone. Parts that only exist on narrow screens (menu button and drawer, filter sheet) are in the markup and hidden on desktop.
- **Reason:** Nestar split by user agent and left 45 phone placeholders to be written as separate copies. Separate copies double every later change and let the two versions drift apart; a user-agent split also gives tablets that report a desktop browser the wrong layout.
- **Cost:** the desktop rules are nested deep, so the mobile sheets use `!important` for layout overrides.
- **Rejected:** writing a second markup for each page (the Nestar plan).

## 24. Orders

- **Decision (the owner approved the plan on 2026-10-12):**
  - `orders` and `orderItems` are back in the data model (they were removed in decision 11).
  - One order per florist: a cart with products of two florists becomes two orders, each with its own status and delivery fee. `orders.agentId` records the florist.
  - Delivery costs $5 per order and is free when the order's items reach $100.
  - A product whose stock reaches 0 stays `ACTIVE` and is shown as "Out of stock"; it is not switched to `SOLD`.
  - Payment is cash on delivery.
- **Reason:** each florist prepares and delivers their own products, so a shared order could not have one status. Keeping an out-of-stock product listed lets the florist restock without relisting.
- **Rejected:** one order for the whole cart with only the admin moving it; switching products to `SOLD` at zero stock.
- **Also decided while building:** the cart is kept in the browser, not in the database, as the brief asked; the server takes prices and the fee from its own data.

## 25. Notices and FAQ in one collection

- **Decision:** announcements and FAQ entries are both rows of `notices`, told apart by `noticeCategory` (`NOTICE`, `FAQ`). Two fields were added to the schema of the ERD: `noticeTopic`, the group an FAQ entry is shown under, and `noticeEvent`, the "event" mark of an announcement. A new entry is `HOLD` unless the admin chooses otherwise; the admin form offers `ACTIVE` first.
- **Reason:** the customer-care page groups the FAQ into seven topics and marks some notices as events; the ERD's fields had no place for either. One collection keeps one admin screen and one set of operations.
- **Rejected:** a separate `faqs` collection; keeping the texts in the client code (they could not be edited without a deploy).
- **Open:** inquiries from members are not built.

## 26. Production database and admin accounts

- **Decision (made by the project owner on 2026-10-12, before the first deploy):**
  - The server uses its own database, `FloreaProd`, on the same Atlas cluster. `MONGO_DEV` and `MONGO_PROD` in the local `.env` were the same address, so the dev database with its test accounts (password `test12345`, an admin among them) would otherwise have been public.
  - In production the API refuses a signup as `ADMIN`. Nestar let anyone sign up as an admin; local development keeps that. The first admin is made on the server (deploy/README.md).
- **Also:** the server has its own `SECRET_TOKEN`, so a login token from a developer's machine is not valid there.
- **Rejected:** using the dev database for the public site; leaving admin signup open.

## 27. No three.js on the homepage

- **Decision:** the floating photo gallery is replaced with an ordinary section: the same-day offer with three photos, and the three steps of ordering. The three.js packages are removed. The old same-day banner is removed too, so the page has one same-day section.
- **Reason:** the gallery said nothing about the shop, was hidden on phones and brought a 3D library to the page for one decoration. The new section tells a visitor what Florea does and leads to the products.
- **Rejected:** keeping both the banner and the new section (the same message twice); changing the product search for the "Shop now" button (the product page already takes the same-day filter from the address).

## 28. The homepage hides what it cannot fill

- **Decision:** a homepage section that has too little to show is left out: Bestsellers with no products (and a tab of it with none), Top florists with fewer than four florists, Community with no articles. No placeholder box is shown in their place.
- **Reason:** an empty dashed box or a row of three cards on the first page of a shop reads as a broken or abandoned site. The sections come back by themselves as the data grows.
- **Rejected:** placeholder or sample content (the brief forbids mock data); a lower limit for florists (three cards leave half of the row empty on a desktop screen).
- **Also decided:** product lists that differ only in their sort order are tabs of one section, and the tiles that lead into the catalog are one section with two tabs. One page section per kind of content.

## 29. Sample shops on the live site

- **Decision:** the production shop is filled with five sample florists and twenty products, created through the public API by a script in the repo. The data, the photos and their credits are in `florea-api/seed/`. Views, likes, reviews and orders are not made up.
- **Reason:** the owner asked for at least four florists with good photos so that the site looks like a working product; with an empty shop the homepage hides most of its sections.
- **Limits:** the shops are not real. Their accounts belong to the owner, and an order placed with them is not delivered. Before the site is offered to real customers they have to be replaced by real florists or marked as samples.
- **Rejected:** photos of people as shop pictures (a stock photo of a person would present a stranger as a florist of this shop); made-up popularity numbers.

## 30. AI features call the model from the backend only

- **Decision:** the browser never talks to the AI provider. It calls three GraphQL mutations of our own API; the key is in the server's `.env`. Every AI operation needs a login and is counted per member (ten a minute).
- **The model chooses, the database answers:** for gift ideas the model gets a short list of real products and returns ids and reasons. The products shown are read from the database by those ids; an id the model was not given is dropped. The model cannot add a product, a price or a stock level.
- **When the model fails:** the gift assistant falls back to popular matching products and says the assistant is not available; card messages and descriptions return a clear message. Nothing is written in the model's place.
- **Default model:** the provider's small, fast model (see decision 31); `AI_MODEL` changes it without a code change.
- **Rejected:** calling the API from the browser (the key would be public); letting guests use it (cost, and no member to count); a database table of requests for the rate limit (one API container; a count in memory is enough until there are more).

## 31. The AI provider is OpenAI

- **Decision:** the AI features call the OpenAI API (Responses API, strict JSON schema). Key in `OPENAI_API_KEY`; default model `gpt-6-luna`.
- **Reason:** the owner has an OpenAI account. The first version (task 45) was written for the Claude API, as the brief said, and was changed before it had made a real request.
- **What made the change small:** only `components/ai/ai.client.ts` knows the provider. The service gives it a system text, a user text and a JSON schema, and gets parsed JSON or a failure back. Another provider means another client file.
- **Privacy:** requests are sent with `store: false`. What is sent is the member's request text and public product data; no member name, id, address or order.
