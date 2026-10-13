# Frontend Migration: Nestar → Florea

State as of 2026-10-06, branch `develop`, after the product domain migration of the client.

## Migration goal

Turn the Nestar Next.js client (`florea-client/`) into the Florea client: an online gift & flower marketplace UI that talks to the Florea GraphQL API. The existing client is adapted in place; it is not rewritten.

Done so far: branding, and the full property → product migration of the data layer, components, pages and routes. Remaining: marketing text, images and icons (see Known issues).

## Renamed pages, components and routes

| Before | After |
|---|---|
| `pages/property/index.tsx`, `detail.tsx` | `pages/product/index.tsx`, `detail.tsx` |
| `pages/_admin/properties/index.tsx` | `pages/_admin/products/index.tsx` |
| route `/property`, `/property/detail` | `/product`, `/product/detail` (`/property` now returns 404) |
| route `/_admin/properties` | `/_admin/products` |
| `libs/components/property/` (`Filter`, `PropertyCard`, `Review`) | `libs/components/product/` (`Filter`, `ProductCard`, `Review`) |
| `libs/components/admin/properties/PropertyList.tsx` | `libs/components/admin/products/ProductList.tsx` |
| `PropertyBigCard`, `PopularProperties`, `PopularPropertyCard`, `TopProperties`, `TopPropertyCard`, `TrendProperties`, `TrendPropertyCard` | same names with `Product` / `Products` |
| `MemberProperties`, `MyProperties`, `AddNewProperty`, `mypage/PropertyCard` | `MemberProducts`, `MyProducts`, `AddNewProduct`, `mypage/ProductCard` |
| `scss/pc/property/`, `memberProperties.scss`, `addNewProperty.scss`, `myProperties.scss` | `scss/pc/product/`, `memberProducts.scss`, `addNewProduct.scss`, `myProducts.scss` |
| `public/img/property/`, `public/img/banner/properties.png` | `public/img/product/`, `public/img/banner/products.png` |
| mypage category `myProperties` | `myProducts` |

CSS class names, handler names and state names were renamed the same way (`property-...` → `product-...`, `likePropertyHandler` → `likeProductHandler`).

Not renamed: the agent pages and components (`pages/agent`, `AgentCard`, `TopAgents`), because `MemberType.AGENT` is unchanged.

## Updated types, queries and mutations

- `libs/enums/product.enum.ts`: `ProductType` (BOUQUET, FLOWER_BOX, PLANT, GIFT_BOX, SWEET, TOY), new `ProductOccasion` and `ProductSize`, `ProductStatus`, `ProductLocation`. The like, view and comment group enums use `PRODUCT`.
- `libs/types/product/`: `Product`, `Products`, `ProductInput`, `ProductUpdate`, `ProductsInquiry`, `AgentProductsInquiry`, `AllProductsInquiry`.
  - Removed: `propertySquare`, `propertyBeds`, `propertyRooms`, `propertyBarter`, `propertyRent`, `constructedAt`, and the search fields `roomsList`, `bedsList`, `squaresRange`.
  - Added: `productOccasion`, `productSize`, `productStock`, `productSameDay`, `productGiftWrap`, and the search fields `occasionList`, `sizeList`.
- `libs/types/member`: `memberProperties` → `memberProducts`.
- `apollo/user/query.ts`, `apollo/user/mutation.ts`, `apollo/admin/query.ts`, `apollo/admin/mutation.ts`: all 35 documents use the product operations and fields (`GET_PRODUCTS`, `CREATE_PRODUCT`, `LIKE_TARGET_PRODUCT`, `GET_ALL_PRODUCTS_BY_ADMIN`, ...).
- `libs/config.ts`: `availableOptions` is `productSameDay`, `productGiftWrap`; `propertyYears` and `propertySquare` replaced by `productPrices`.

## UI changes

| Place | Change |
|---|---|
| Product cards (big, popular, top, trend, list) | show occasion, size and stock instead of beds, rooms and square metres; "Same day" / "Gift wrap" instead of "Rent" / "Barter" |
| Product detail page | option boxes and details table show Occasion, Size, Stock, Listed year and options; the "Floor Plans" block was removed |
| Homepage search box | heading "Find your perfect Florea flowers & gifts" and three dropdowns only: Category, Occasion, Size. Location and the advanced filter modal were removed |
| Product list filter | Occasion checkboxes and Size buttons instead of Rooms and Bedrooms; options are same day and gift wrap; "Square meter" was removed |
| Add / edit product form | Occasion and Size selects, Stock number input, Gift wrap and Same day selects instead of Rooms, Bed, Square, Barter, Rent |
| Branding (earlier step) | package name, page titles, footer, join page, community title, SEO keywords and site name, mobile placeholders |
| Locales | key `Rooms` replaced by `Occasion` in `en`, `kr`, `ru` |
| Logo and icons | Florea logo in the navbar and footer, flower mark in the admin sidebar, join page and community pages, new favicon, apple touch icon and web manifest (`public/img/logo/florea/`) |

## What stayed unchanged

- Project architecture, Apollo setup, layouts, hooks, auth, chat
- Agent, community, member, mypage (except product parts), CS and admin user pages
- SCSS rules (only file and class names changed)
- `CHANGELOG.md`

## Current status

| Check | Result |
|---|---|
| Typecheck (`yarn tsc --noEmit`) | no errors |
| GraphQL documents validated against the running backend schema | 35 of 35 valid |
| Production build (`yarn build`) | succeeded, 73 static pages generated |
| Pages served by `next start` | `/`, `/product`, `/product/detail`, `/agent`, `/community`, `/mypage`, `/_admin/products`, `/account/join`, `/cs`, `/about` returned 200 |
| Lint | not runnable: no ESLint config |
| Manual check in a browser (click-through, forms, chat) | TODO (not done) |

## Known issues

- **Real-estate leftovers:** removed in task 37 (COMPLETED_TASKS.md). Prices stay in dollars in all three languages (DECISIONS.md, 32).
- **Customer care:** notices and FAQ come from the database (task 38). The admin Inquiry page is still a mock-up.
- **AI features (tasks 45 and 46):** the gift assistant (`libs/components/ai/GiftAssistant.tsx`, on every page through the three layouts), "Write it for me" on the checkout page (`CardMessageHelper.tsx`) and "Generate description" in the product form. They call `aiGiftRecommend`, `aiCardMessage` and `aiProductDescription`; the client holds no key. Checked with the real model in task 46.
- **React warning in the product form:** its selects set `selected` on an `<option>`; inherited, not changed.

- **Orders:** cash on delivery only; the delivery fee does not depend on the address; products without a photo show the blush placeholder in the cart and in orders.

- **Chat:** one public room for all logged-in members; messages are not stored in the database.
- **Screen widths:** phones and tablets are covered (COMPLETED_TASKS.md, 34). Between 1025 and 1339px the 1300px desktop layout still scrolls sideways.


- **After the site-wide design system:**
  - Prices use `$`.

- **Homepage (after the redesign):**
  - On tablets the shared navbar is still fixed-width and crowds its items. The homepage sections themselves adapt.
- **`.next` on OneDrive:** `yarn build` or `yarn dev` sometimes fails with `EINVAL: invalid argument, readlink …\.next\…`. Deleting the `.next` folder fixes it.

- **Not checked in a browser.** Build and server-rendered pages work, but creating a product, filtering, liking and chatting through the UI were not clicked through.
- **Apollo warnings during build:** `useQuery` `onCompleted` is deprecated in the installed Apollo Client. Inherited from Nestar, not changed.
- **Package manager:** Yarn only (`yarn`, `yarn dev`, `yarn build`). `package-lock.json` was removed and `yarn.lock` regenerated. Yarn prints peer-dependency warnings during install; they do not stop it.
- **Env file:** `.env.development` exists locally (ignored by git) and points at `localhost:3007`. `.env.example` lists the variables. A production build needs them in `.env.production` before `yarn build`.
- **No ESLint setup.** TODO: decide whether to add one.

- **Translations (task 49):** every text is a key in `public/locales/<language>/<namespace>.json`; rules are in `florea-client/AGENTS.md` ("Translations") and the reasons in DECISIONS.md, 32. `yarn i18n:check` has to pass before a change is done. Open: Korean and Russian were not read by a native speaker; content from the database is shown as written (the notices and FAQ entries of the shop are English); a new API message is shown in English until it gets a line in `libs/i18n/serverText.ts`.
