# Project Architecture Overview

This project follows a layered architecture with clear separation between domain,
application, and infrastructure concerns.

## Layers

- Domain: core entities and business errors (e.g. `src/domain`).
- Application: use cases and ports (repositories/services) that define contracts
  (e.g. `src/application`).
- Infrastructure: adapters and integrations such as HTTP, database, env, and
  security implementations (e.g. `src/infrastructure`).

## Diagram

```
Client
  |
  v
Fastify HTTP (routes + schemas)
  |
  v
Use Cases (application layer)
  |                |
  v                v
Ports: Repos    Ports: Services
  |                |
  v                v
Drizzle Repo     Bcrypt Hasher
  |
  v
PostgreSQL
```

## Key components

- HTTP: Fastify app in `src/infrastructure/http`, routes in
  `src/infrastructure/http/routes`.
- Database: Drizzle ORM with PostgreSQL, schema and repositories in
  `src/infrastructure/database/drizzle`.
- Env/config: Zod-validated env in `src/infrastructure/env`.
- Security: bcrypt password hasher in `src/infrastructure/security`.

## Deployment/runtime

- Entry point: `src/infrastructure/http/server.ts`.
- Database containers: `docker-compose.yml` provides Postgres and test Postgres.
