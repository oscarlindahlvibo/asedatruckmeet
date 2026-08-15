# Shared Supabase isolation

This app owns the `truckmeet` PostgreSQL schema. Apply only the files in
`supabase/migrations/` through the shared deployment script.

Do not apply the old public-schema seed manually. The app uses Prisma against
the `truckmeet` schema and must receive a `DATABASE_URL` with
`?schema=truckmeet`.

There are currently no Edge Functions owned by this app. If one is added, its
directory and function name must start with `truckmeet-` so it cannot collide
with another application in the shared functions volume.
