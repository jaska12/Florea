# Florea Backend Skills

Use these Codex skills for repeatable Florea backend workflows.

| Skill               | Purpose                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------- |
| `backend-migration` | Continue the Nestar to Florea backend modification while preserving the current NestJS architecture.     |
| `product-logic`     | Review product GraphQL, DTO, schema, enum, filter and naming consistency.                                 |

Each skill lives at `skills/<skill-name>/SKILL.md`.

## Installed community skills

Installed at the repo root with `npx skills add` (files in `../.agents/skills/` and `../.claude/skills/`, versions pinned in `../skills-lock.json`).

| Skill                   | Source                         | Purpose                                                                       |
| ----------------------- | ------------------------------ | ----------------------------------------------------------------------------- |
| `nestjs-best-practices` | kadajett/agent-nestjs-skills   | NestJS rules for modules, dependency injection, security and performance.    |
| `graphql-operations`    | apollographql/skills           | Writing GraphQL queries, mutations and fragments.                             |

Rules for using them in this project:

- `AGENTS.md` wins when a community skill disagrees with it.
- This backend is GraphQL code-first with Mongoose. The NestJS skill's examples use REST controllers and TypeORM; apply the principle, not the example code.
