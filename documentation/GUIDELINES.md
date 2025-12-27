# Appointment Booking API — Project Guidelines

## Goal
Build a production-ready **Appointment Booking API** that allows users to:
- register and authenticate
- define availability (time windows / slots)
- create, confirm, and cancel bookings
- prevent schedule conflicts
- support future features like reminders, notifications, and public booking links

The focus is to practice **backend fundamentals** with a clean, maintainable architecture:
- clear separation of concerns (Domain / Application / Infrastructure)
- testable business logic (use-cases)
- real database integration (PostgreSQL)
- reliable error handling and validation
- automated quality checks and CI-ready tests

---

## Tech Stack
### Core
- **Node.js + TypeScript**
- **Fastify** (HTTP server, routing, plugins)
- **PostgreSQL** (Docker Compose for local + test DB)
- **Drizzle ORM** (schema in TS + migrations)

### Quality & Tooling
- **Biome** (lint/format)
- **Vitest** (unit + integration + real HTTP E2E tests)
- **tsx** (TS execution for scripts)
- `.env`, `.env.test` (environment configuration)

### Optional (future)
- JWT (authentication)
- OpenAPI/Swagger (API documentation)
- Docker image for deployment
- CI pipeline (GitHub Actions)

---

## Architecture Principles
### Layering
- **Domain**: entities, domain types, domain errors
- **Application**: use-cases, DTOs, ports (interfaces)
- **Infrastructure**: HTTP, DB, adapters (Drizzle repositories, bcrypt, env)

### Dependency Direction
- `domain` and `application` must **not depend** on infrastructure.
- infrastructure implements application ports and wires everything.

### Naming & Organization
- **Use-cases are organized by feature**:
  - `src/application/use-cases/auth/register-user/...`
- **Factories per use-case**:
  - `src/infrastructure/factories/auth/register-user.factory.ts`
- **Validation** via Zod:
  - kept in `infrastructure/http/schemas`

---

## Quality Rules
- Always validate input on the HTTP edge (Zod schemas).
- Use consistent error responses:
  - `400` validation errors with `issues`
  - `AppError` for business errors (statusCode + code)
  - `500` only for unexpected errors
- Avoid leaking infrastructure concerns into the application layer.
- Keep use-cases small, explicit, and testable.

---

## Milestones (Progress Checklist)

### Milestone 0 — Project Setup
- [x] TypeScript + tsx working
- [x] Biome configured
- [x] Docker Compose running Postgres
- [x] Drizzle schema + migrations setup
- [x] `.env` and `.env.test` separated

**Done when:** you can run migrations and connect from the app + DBeaver.

---

### Milestone 1 — Auth (Register) Baseline
- [x] Domain entity: `User`
- [x] Password hashing (bcrypt)
- [x] User repository (Drizzle)
- [x] Use-case: `RegisterUserUseCase`
- [x] Route: `POST /auth/register`
- [x] Unique email handling (409)
- [x] Global error handler (AppError + Zod)

**Done when:** registering creates a user and duplicate email returns 409.

---

### Milestone 2 — Testing Foundation
- [x] Unit tests for use-cases (Vitest)
- [x] Integration tests with real Postgres test DB
- [x] Real HTTP E2E tests (listen on random port + fetch)
- [x] Automatic migrations on test startup
- [x] Database cleanup between tests

**Done when:** `npm test` runs unit + integration reliably.

---

### Milestone 3 — Auth (Login + JWT)
- [x] Use-case: `LoginUserUseCase`
- [x] Route: `POST /auth/login`
- [x] JWT token generation (access token)
- [x] Auth middleware / Fastify plugin
- [ ] Protected route example (e.g. `GET /me`)

**Done when:** you can login and call a protected endpoint.

---

### Milestone 4 — Availability
- [ ] Domain entity: `Availability`
- [ ] Create availability use-case + repo
- [ ] Routes:
  - [ ] `POST /availability` (create)
  - [ ] `GET /availability` (list)
- [ ] Timezone strategy documented
- [ ] Validation: date ranges, overlaps, constraints

**Done when:** a provider can define time windows safely.

---

### Milestone 5 — Booking Core
- [ ] Domain entity: `Booking`
- [ ] Use-cases:
  - [ ] `CreateBookingUseCase`
  - [ ] `CancelBookingUseCase`
  - [ ] `ConfirmBookingUseCase` (optional)
- [ ] Conflict prevention (no double-booking)
- [ ] Routes:
  - [ ] `POST /bookings`
  - [ ] `GET /bookings`
  - [ ] `PATCH /bookings/:id/cancel`

**Done when:** bookings are created only when slots are available.

---

### Milestone 6 — Production Readiness
- [ ] Logging strategy (structured logs)
- [ ] Rate limiting / basic security headers
- [ ] Healthcheck route
- [ ] Dockerfile for app
- [ ] CI pipeline (tests + lint on PR)

**Done when:** you can deploy confidently to a VPS/hosted platform.

---

## Suggested Commit Convention
Use clear commits:
- `feat(auth): add user registration endpoint`
- `test(auth): add integration tests for /auth/register`
- `chore(db): add drizzle migrations setup`
- `refactor(app): extract buildApp for testability`

---

## Local Development Commands (example)
- `docker compose up -d` (db)
- `npm run db:generate`
- `npm run db:migrate`
- `npm run dev`
- `npm test`

---

## Next Recommended Step
Implement **Milestone 3 — Login + JWT**:
- Add `POST /auth/login`
- Return `{ accessToken }`
- Create a protected route to validate the token end-to-end

