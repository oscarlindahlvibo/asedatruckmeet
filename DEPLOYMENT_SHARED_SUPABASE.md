# Shared Supabase deployment

## Isolation

- PostgreSQL schema: `truckmeet`
- Migration source: `supabase/migrations/`
- Edge Functions: none currently; future functions must use the `truckmeet-` prefix
- Pretix, SMTP, S3 and Redis configuration remain app-specific environment variables

The migration creates all Prisma tables, enum types and foreign keys inside the
`truckmeet` schema. It does not create or alter tables in `public`.

Use a database URL with the schema explicitly selected:

```env
DATABASE_URL=postgresql://USER:PASSWORD@supabase-db:5432/postgres?schema=truckmeet
```

The shared deployment script should apply the SQL migration before starting
this app. Do not run `prisma migrate dev` against the shared production
database. Prisma is used here for the runtime client and local development.

## Build and runtime

This repository is a Vite/React SPA. The active frontend has no Next.js
runtime and `npm run build` produces a self-contained `dist/` directory:

```bash
npm ci
npm run build
npm run preview
```

Copy only this repository's `dist/` into its own web root. Configure the web
server fallback to `dist/index.html` for SPA routes. Do not share or overwrite
another app's web root.

The frontend may use `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` for
public Supabase access. Do not expose `DATABASE_URL`, `PRETIX_API_TOKEN`,
`SUPABASE_SERVICE_ROLE_KEY` or `AUTH_SECRET` to the browser. Pretix actions,
admin authorization and private data belong in Supabase Edge Functions.

`DATABASE_URL` is not required by the static build. It is only needed by the
separate migration/worker tooling if those are retained on the server.
