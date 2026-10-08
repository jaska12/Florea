# Florea Frontend Skills

Use these Codex skills for repeatable Florea frontend workflows.

| Skill                | Purpose                                                                                                  |
| -------------------- | -------------------------------------------------------------------------------------------------------- |
| `admin-panel`        | Admin project related design modification skill                                                          |
| `user-project`       | User project related design modification skill                                                           |
| `frontend-migration` | Continue the nestar-next to florea-next modification while preserving the current Next.js architecture. |
| `product-ui`         | Review product types, Apollo operations, components, filters and naming against the backend schema.     |

Each skill lives at `skills/<skill-name>/SKILL.md`.

## Installed community skills

Installed at the repo root with `npx skills add` (files in `../.agents/skills/` and `../.claude/skills/`, versions pinned in `../skills-lock.json`).

| Skill                         | Source                    | Purpose                                                                              |
| ----------------------------- | ------------------------- | ------------------------------------------------------------------------------------ |
| `redesign-existing-projects`  | leonxlnx/taste-skill      | Audit and upgrade the existing design step by step without breaking functionality.  |
| `web-design-guidelines`       | vercel-labs/agent-skills  | Review UI code for interface and accessibility issues. Review only.                  |
| `vercel-react-best-practices` | vercel-labs/agent-skills  | React and Next.js performance rules.                                                 |
| `graphql-operations`          | apollographql/skills      | Writing GraphQL queries, mutations and fragments.                                    |
| `emil-design-eng`             | emilkowalski/skills       | UI polish and animation decisions: when to animate, easing, duration, transforms.   |
| `review-animations`           | emilkowalski/skills       | Review of animation code. Review only; run it explicitly, it does not start itself.  |
| `fixing-motion-performance`   | ibelick/ui-skills         | Find and fix animation performance problems.                                         |

Rules for using them in this project:

- `AGENTS.md` wins when a community skill disagrees with it (for example: do not rewrite the architecture, keep SCSS, use Yarn).
- This client uses the Next.js Pages Router and Apollo Client 3. Skip advice written for the App Router or React Server Components.
- Motion is written in SCSS. Do not add an animation library (Framer Motion, GSAP) unless asked; reuse the easing and glow values in `scss/variables.scss` so new motion matches the logo animation, and always keep the `prefers-reduced-motion` fallback.
