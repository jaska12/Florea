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

- **After the site-wide design system:**
  - Inner pages are desktop-only; phones still get the "MOBILE" placeholders (homepage excepted).
  - The site talks about delivery, but there is no order or checkout flow.
  - The FAQ text in `libs/components/cs/Faq.tsx` is still about real estate.
  - Prices use `$`.
  - Product photos are missing for the test products, so cards and the detail gallery show the blush placeholder.

- **Homepage (after the redesign):**
  - The dev server shows a red overlay, "Invalid message type!", whenever the backend is running. `apollo/client.ts` opens a WebSocket link to the chat gateway but never uses its `LoggingWebSocket` class, and `Chat.tsx` does not use the socket. Inherited from Nestar; not fixed.
  - On tablets the shared navbar is still fixed-width and crowds its items. The homepage sections themselves adapt.
  - Product cards show a blush placeholder because the test products have no real photos.
  - `libs/components/homepage/Events.tsx` is no longer rendered and its styles were removed. Its content is Korean city festivals. TODO: delete it or give it Florea content.
  - Unused files left in place: `public/video/ads.mov` (26 MB), `public/img/banner/header1.svg`, `public/img/banner/types/`, `public/img/banner/cities/`, `public/img/events/`.
  - The footer still says "Product for Rent" and the prices use `$`.
- **`.next` on OneDrive:** `yarn build` or `yarn dev` sometimes fails with `EINVAL: invalid argument, readlink …\.next\…`. Deleting the `.next` folder fixes it.

- **Not checked in a browser.** Build and server-rendered pages work, but creating a product, filtering, liking and chatting through the UI were not clicked through.
- **Unused old images:** `public/img/banner/types/` (apartment, villa, house) and `public/img/banner/cities/` are no longer used by the homepage search box. TODO: delete them or replace them when a design needs them.
- **Old icons and photos.** Cards still use `bed.svg`, `room.svg`, `expand.svg` next to occasion, size and stock, and the sample photos in `public/img/product/` are real-estate photos. `floorPlan.png` is no longer used.
- **Real-estate marketing text remains** in `libs/components/cs/Faq.tsx`, `pages/about/index.tsx`, `libs/components/Footer.tsx` ("Product for Rent"), `libs/components/mypage/Article.tsx`, the SEO description in `pages/_document.tsx`, and the `kr` / `ru` translations (for example "Product type" is still translated as "property type").
- **Prices are shown with `$`** while the price filter steps go up to 2,000,000. TODO: decide the currency.
- **Apollo warnings during build:** `useQuery` `onCompleted` is deprecated in the installed Apollo Client. Inherited from Nestar, not changed.
- **Package manager:** Yarn only (`yarn`, `yarn dev`, `yarn build`). `package-lock.json` was removed and `yarn.lock` regenerated. Yarn prints peer-dependency warnings during install; they do not stop it.
- **Env file:** `.env.development` exists locally (ignored by git) and points at `localhost:3007`.
- **No ESLint setup.** TODO: decide whether to add one.
