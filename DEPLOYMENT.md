# Deployment

Den aktiva applikationen är en Vite/React SPA. För den gemensamma servern ska
`dist/` kopieras till denna apps egen webbrot. Använd inte den gamla lokala
Next/Prisma-compose-konfigurationen för frontenddeployment.

## Serverkrav

- Linux-server med Docker och Docker Compose.
- Node.js 22 för byggsteget.
- HTTPS via reverse proxy, exempelvis Caddy, nginx eller Traefik.

## Produktionsflöde

1. Sätt `VITE_SUPABASE_URL` och `VITE_SUPABASE_ANON_KEY` i byggmiljön.
2. Kör migreringarna från `supabase/migrations/` mot den gemensamma Supabase-instansen.
3. Kör `npm ci` och `npm run build`.
4. Kopiera endast `dist/` till appens egen webbrot.
5. Konfigurera SPA-fallback till `index.html`.
6. Lägg reverse proxy framför appen.

```bash
npm ci
npm run build
```

Pretix och privata admin-/orderoperationer ska köras separat via Supabase Edge
Functions enligt `DEPLOYMENT_SHARED_SUPABASE.md`.

## Secrets

Alla secrets ska ligga i environment variables eller serverns secret manager.
Pretix API-token får aldrig exponeras i browsern.
