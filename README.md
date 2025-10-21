# Docker & Neon setup

This repo contains a Node.js/Express API using Drizzle ORM and Neon. The Docker setup supports:
- Development: app + Neon Local sidecar (ephemeral branches)
- Production: app only, connects to Neon Cloud

## 1) Files
- `Dockerfile`: multi-stage (dev, prod)
- `docker-compose.dev.yml`: runs app and Neon Local
- `docker-compose.prod.yml`: runs app (no Neon Local)
- `.env.development.example`: sample env for dev
- `.env.production.example`: sample env for prod

## 2) Development (Neon Local)
1. Copy env and fill values:
   - `cp .env.development.example .env.development`
   - Edit `DATABASE_URL=postgres://user:password@neon-local:5432/dbname`
   - Provide Neon credentials for `NEON_API_KEY`, `NEON_PROJECT_ID`, `NEON_USER`, `NEON_PASSWORD`, `NEON_DATABASE`.
2. Start services:
   - `docker compose -f docker-compose.dev.yml up --build`
3. App will be at http://localhost:3000. Neon Local listens on 5432 and automatically creates ephemeral branches for dev/testing.
4. (Optional) Run migrations once the DB is reachable:
   - `docker compose -f docker-compose.dev.yml exec app npm run db:migrate`

Notes
- The app uses `DB_CLIENT=pg` in dev to connect via TCP to Neon Local.
- Winston writes logs to `logs/` inside the container.

## 3) Production (Neon Cloud)
1. Copy env and fill values:
   - `cp .env.production.example .env.production`
   - Set `DATABASE_URL` to your Neon Cloud URL (e.g. `...neon.tech...` with `sslmode=require`).
   - Set a strong `JWT_SECRET`.
2. Start app:
   - `docker compose -f docker-compose.prod.yml up --build -d`
3. The app uses the serverless Neon HTTP driver in prod.

## 4) Switching DB URLs
- Dev: `.env.development` sets `DB_CLIENT=pg` (via compose) and `DATABASE_URL=postgres://user:password@neon-local:5432/dbname`.
- Prod: `.env.production` sets `DATABASE_URL=postgres://...neon.tech...` and omits `DB_CLIENT` (defaults to Neon serverless driver).

## 5) Troubleshooting
- If `/health` returns a 500 from security middleware, ensure `ARCJET_KEY` is set or leave it blank; the middleware now skips when not configured.
- If the app can’t reach Neon Local, verify `NEON_*` variables and that `neon-local` container is healthy and exposing 5432.
