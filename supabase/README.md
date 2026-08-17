# Shared Supabase isolation

This app owns the `truckmeet` PostgreSQL schema. Apply only the files in
`supabase/migrations/` through the shared deployment script.

Do not apply the old public-schema seed manually. The app uses Prisma against
the `truckmeet` schema and must receive a `DATABASE_URL` with
`?schema=truckmeet`.

The Bolt frontend compatibility tables live in the same `truckmeet` schema.
They are intentionally kept separate from every other app's `public` tables.
The shared Supabase/PostgREST API must also expose `truckmeet`; otherwise the
frontend will report `Invalid schema: truckmeet` even when the migration ran.
If an Edge Function is added, its directory and function name must start with
`truckmeet-` so it cannot collide with another application in the shared
functions volume.
