# Florea Frontend Modification Instructions

## Rules

- Preserve current project architecture
- Keep GraphQL/Apollo integration
- Do not rewrite the whole app
- Improve UI incrementally

## Backend Context

Before making any changes, read:

- ../docs/ai/BACKEND_MIGRATION.md
- ../docs/ai/DECISIONS.md
- ../docs/ai/FRONTEND_MIGRATION.md
  and etc inside of ../docs/ai (the `docs/ai` folder in the repo root)

## Workflow

1. Analyze before editing.
2. Backend is running on port http://localhost:3007/graphql now.
3. Make small incremental changes.
4. Run typecheck after each phase.
5. Do not remove working logic unless replaced safely.
6. Update ../docs/ai/COMPLETED_TASKS.md after major changes.

## Package Manager

- Use Yarn for all frontend commands.
- Do not use npm or pnpm.
- Install dependencies with:

```bash
yarn
```

## Backend Names

The backend is already migrated to the product domain. Names in this client must match it exactly:

- Operations: `createProduct`, `getProduct`, `updateProduct`, `getProducts`, `getAgentProducts`, `likeTargetProduct`, `getFavorites`, `getVisited`, `getAllProductsByAdmin`, `updateProductByAdmin`, `removeProductByAdmin`.
- Notification operations: `getNotifications`, `readNotification`, `readAllNotifications` (type `NotificationsInquiry`).
- Order operations: `createOrder`, `updateOrder`, `updateOrderByAgent`, `updateOrderByAdmin`, `getMyOrders`, `getAgentOrders`, `getOrder`, `getAllOrdersByAdmin` (types `OrderInput`, `OrderUpdate`, `OrdersInquiry`). `OrderStatus`: `PENDING`, `CONFIRMED`, `PREPARING`, `OUT_FOR_DELIVERY`, `DELIVERED`, `CANCELLED`.
- Notice operations: `getNotices` (public), `createNoticeByAdmin`, `updateNoticeByAdmin`, `removeNoticeByAdmin`, `getAllNoticesByAdmin`. `NoticeCategory`: `NOTICE`, `FAQ`, `TERMS`, `INQUIRY`. `NoticeTopic`: `PRODUCT`, `PAYMENT`, `ORDER`, `FLORIST`, `ACCOUNT`, `COMMUNITY`, `OTHER`.
- AI operations (all need a login): `aiGiftRecommend`, `aiCardMessage`, `aiProductDescription` (florists only). Types `AiGiftRecommendInput`, `AiCardMessageInput`, `AiProductDescriptionInput`. `AiCardTone`: `WARM`, `ROMANTIC`, `PLAYFUL`, `FORMAL`. `AiLanguage`: `ENGLISH`, `KOREAN`, `RUSSIAN`, `UZBEK`. The client never calls the AI provider and holds no key.
- Types: `Product`, `Products`, `ProductInput`, `ProductUpdate`, `ProductsInquiry`, `AgentProductsInquiry`, `AllProductsInquiry`.
- Member counter: `memberProducts`.
- Group enums (like, view, comment): `PRODUCT`.
- `MemberType` stays `USER`, `AGENT`, `ADMIN`.
- Upload target folder: `product`.
- Enum values are listed in `../florea-api/AGENTS.md`.

## Screen Widths

- One markup per page. Desktop styles are in `scss/pc`, and `scss/mobile` adapts them below 1024px and 640px (mixins `tablet` and `phone` in `scss/variables.scss`).
- Do not add `device === 'mobile'` branches or a second markup for phones.
- A new page or component needs its rules in `scss/mobile` too; check it at 375px and 768px.

## Translations

The site is in English (`en`, the default), Korean (`kr`) and Russian (`ru`). No text a visitor reads is written in a component.

- Texts are in `public/locales/<language>/<namespace>.json`, one file per feature: `common` (navbar, footer, cards, alerts, enum labels, server messages), `ai`, `home`, `product`, `agent`, `community`, `order`, `mypage`, `member`, `account`, `cs`, `admin`.
- In a component: `const { t } = useTranslation('<namespace>')`. Outside React (helpers, alerts): `tr('ns:key', 'English text')` from `libs/i18n/tr.ts`.
- A page loads its files in `getStaticProps` with `pageTranslations(locale, ['<namespace>', …])` from `libs/i18n/server.ts`. `common` and `ai` are always loaded. A page has to list every namespace that it or anything it imports reads.
- Enum values (`BOUQUET`, `PENDING`, …) are shown with `enumLabel('<group>', value)` from `useEnumLabel()`; the labels are under `enum.<group>` in `common.json`. The stored values and the GraphQL enums are not changed.
- Dates, prices and numbers go through `useFormat()` (`libs/i18n/format.ts`), never `toLocaleString()` or a moment format with words.
- Prices are whole Korean won and are always written with `format.price` (or `formatPrice` outside React): `₩59,000` in every language. Never write a currency sign in a component or a translation.
- Counts use plural keys (`key_one`, `key_other`; Russian also `key_few` and `key_many`; Korean only `key_other`).
- Messages the API sends in English are mapped to keys in `libs/i18n/serverText.ts`. A new backend message needs a line there and a text under `serverError` in `common.json`.
- Content from the database (product titles, descriptions, nicknames, articles, notices) is shown as it was written.
- The address keeps `kr` for Korean; `libs/i18n/locale.ts` gives the real tag (`ko-KR`) for `Intl` and `<html lang>`.
- After adding or changing a text, run `yarn i18n:check`. It fails when a key is missing in a language, a plural form is missing, or a page does not load a namespace it reads.

## Validation

```bash
yarn tsc --noEmit
yarn i18n:check
yarn build
```

- Run the app with `yarn dev`. It needs `.env.development` with `REACT_APP_API_URL`, `REACT_APP_API_GRAPHQL_URL` and `REACT_APP_API_WS` (see `.env.example`).
- `yarn build` reads the same three variables from `.env.production`. Stop `yarn dev` before building: both write to `.next`.
- There is no ESLint config in this project, so `yarn lint` only opens an interactive setup. Do not add a lint setup unless asked.
