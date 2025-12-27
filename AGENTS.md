# AGENTS.md

This repository is structured to keep the codebase consistent, testable, and easy to evolve.

## Quick Rules (Read This First)
- Keep the architecture clean: **Domain**, **Application**, **Infrastructure**.
- **Do not import infrastructure into application/domain**.
- Use-cases must be **small, explicit, and testable**.
- Validate input at the HTTP edge (Zod).
- Prefer clear naming, small files, and predictable folder structure.
- Always keep tests green:
  - unit tests for use-cases
  - integration tests with real Postgres
  - real HTTP E2E tests when needed

## Where to Find the Full Docs
Before making decisions or changing architecture, always check:
- `./documentation/GUIDELINE.md`
- `./documentation/ARCHITECTURE.md`
