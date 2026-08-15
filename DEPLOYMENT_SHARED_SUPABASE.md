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

This repository is a Next.js SSR application with server routes for auth,
Pretix, admin and the app API. It is not a static Vite site. The existing
`npm run build` produces `.next`, and production must run:

```bash
npm ci
npm run build
npm run start
```

Run it in its own container/process and route the domain to port 3000. Do not
copy this app's `.next` or a stale `dist/` directory into another app's web
root. The generic static-app deployer should skip this repository's `dist/`
copy step, or invoke the app's SSR deployment adapter.

The `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` variables may exist in the
shared build environment, but this Next runtime does not use them. Do not
expose `DATABASE_URL`, `PRETIX_API_TOKEN`, `SUPABASE_SERVICE_ROLE_KEY` or
`AUTH_SECRET` to the browser.
