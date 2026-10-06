---
name: product-ui
description: Review the Florea client's product types, Apollo operations, components, filters and naming against the backend GraphQL schema. Use after a frontend migration phase, or when asked to check the client for mismatches with the backend or leftovers of the property domain.
---

# Product UI Review

This skill reviews; it does not rewrite. Report findings first, and fix only what is asked.

## What to compare

| Layer | Location |
| --- | --- |
| Backend schema (source of truth) | http://localhost:3007/graphql, `../florea-api/AGENTS.md` |
| Enums | `libs/enums` |
| Types | `libs/types/product` |
| Queries and mutations | `apollo/user`, `apollo/admin` |
| Components | `libs/components` |
| Pages and routes | `pages` |

## Checklist

1. **Operations:** every query and mutation in `apollo/` exists in the backend schema with the same name, arguments and selected fields.
2. **Types:** each client type has the same fields, optional/required setting and enum types as the backend type.
3. **Enums:** values match the backend exactly (`ProductType`, `ProductOccasion`, `ProductSize`, `ProductStatus`, `ProductLocation`, and `PRODUCT` in the like, view and comment groups).
4. **Forms:** the add/edit product form sends every required `ProductInput` field and nothing the backend rejects.
5. **Filters:** the product list filter builds a valid `ProductsInquiry` (type, location, occasion, size, price range, `options`, text).
6. **Naming:** no `property`, `Property` or real-estate wording is left in types, variables, UI text or routes.
7. **Counters and flags:** `memberProducts`, `productViews`, `productLikes`, `productComments`, `meLiked` are read where the old property ones were.
8. **Uploads:** image upload uses the target `product`.

## Report format

For each finding give: file and line, what does not match, and the smallest fix. Group findings as **Broken** (request fails or page crashes), **Mismatch** (type or name differs) and **Leftover** (old-domain text).

Finish with the result of `npx tsc --noEmit`.
