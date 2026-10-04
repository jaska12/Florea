---
name: product-logic
description: Review product GraphQL, DTO, schema, enum, filter and naming consistency in the Florea backend. Use after the product module is created or changed, or when asked to check the product domain for leftovers and mismatches.
---

# Product Logic Review

This skill reviews; it does not rewrite. Report findings first, and fix only what is asked.

## What to compare

The same field must agree in all of these places:

| Layer | Location |
| --- | --- |
| Target model | `../Florea-ERD.pdf`, `AGENTS.md` (Domain Rules) |
| Enums | `apps/florea-api/src/libs/enums` |
| Schema | `apps/florea-api/src/schemas` |
| DTOs (object, input, update) | `apps/florea-api/src/libs/dto` |
| Resolver and service | `apps/florea-api/src/components` |
| Batch jobs | `apps/florea-batch/src` |

## Checklist

1. **Fields:** every product field in the ERD exists in the schema and in the DTOs, with the same name, type and required/optional setting.
2. **Enums:** enum values match `AGENTS.md` exactly, and each enum is registered for GraphQL.
3. **Naming:** no `property`, `Property` or real-estate field (rooms, beds, square, barter, rent) is left in product code, GraphQL operation names, or error messages.
4. **Filters:** search and filter inputs use product fields (`productType`, `productOccasion`, `productSize`, `productLocation`, price range) and the service applies each of them.
5. **Counters:** `productViews`, `productLikes`, `productComments`, `productRank` and `memberProducts` are updated where the old property counters were.
6. **Groups:** like, view and comment group enums use `PRODUCT`, and the services that switch on them handle it.
7. **Ownership:** only `MemberType.AGENT` can create and update products, and only the owner or an admin can change one.
8. **Status rules:** the allowed `ProductStatus` transitions match the previous property rules, and `soldAt` / `deletedAt` are set with them.

## Report format

For each finding give: file and line, what is inconsistent, and the smallest fix. Group findings as **Wrong** (breaks behavior), **Inconsistent** (naming or type mismatch) and **Leftover** (old-domain text).

Finish with the validation results from `AGENTS.md`.
