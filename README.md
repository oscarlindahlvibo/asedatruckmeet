# Åseda Truckmeet Platform

Modern webb- och eventplattform för Åseda Truckmeet.

Målet är en sammanhållen publik webbplats, Mina sidor och admin för arrangören,
med Pretix bakom kulisserna som biljettmotor.

## Lokal start

```bash
cp .env.example .env
docker compose up -d postgres redis minio
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Öppna `http://localhost:3000`.

## Viktiga ytor

- Publik webb: `/`
- Biljetter/Pretix widget: `/biljetter`
- Mina sidor: `/konto`
- Lastbilsgalleri: `/lastbilar`
- Program: `/program`
- Karta: `/karta`
- Publikens val: `/rosta`
- Admin: `/admin`
- Systemhälsa: `/admin/system/health`
- Health API: `/api/system/health`
- Pretix webhook: `/api/pretix/webhook`
- App API: se [`APP_API.md`](./APP_API.md), publika lastbilar finns på `/api/public/events/{slug}/trucks`
- Magic link API: `/api/auth/request` och `/api/auth/verify`
- Truckbild-upload: `/api/uploads/truck` (S3/MinIO + Sharp)
- Sponsorlogotyper: `/api/uploads/partner-logo`

## Arkitektur

Appen är en Next.js/TypeScript-applikation med PostgreSQL, Prisma, Redis och
S3-kompatibel objektlagring. Pretix körs separat och är source of truth för
biljetter, betalningar, refunds, quotas, QR/ticket secrets och check-in.

Truckmeet-systemet äger CMS, eventdata, Mina sidor, truckprofiler, karta,
publikens val, analytics, admin UX och lokala read models av Pretix-data.

## Databas och lokala secrets

Prisma 7 använder PostgreSQL-adaptern `@prisma/adapter-pg`. `DATABASE_URL`
måste finnas även vid `prisma generate`. Kör `npm run db:migrate` innan seed.
Magic links skickas via SMTP i produktion. I lokal utveckling returnerar API:t
en förhandslänk i svaret så flödet kan testas utan e-postserver.

Bildflödet kräver S3-kompatibel lagring. Originalbilden konverteras till WebP
och en thumbnail sparas som variant. Ägarkontroll sker server-side innan någon
fil tas emot eller kopplas till en truckprofil.

## Demo-data

Seed-scriptet skapar Åseda Truckmeet 2027 och prefixar demo-innehåll med
`DEMO`. Demo-data ska aldrig användas som produktionstext.

## Import från gamla webbplatsen

Kör `npm run import:legacy-sponsors` för att läsa den publika sponsorsidan på
`asedatruckmeet.se`, hämta sponsornamn, beskrivningar, länkar och logotyper och
skriva resultatet till `data/legacy-sponsors.json` samt
`public/imported-sponsors/`. `npm run db:seed` importerar därefter posterna i
eventets partnersystem och kopplar logotyperna som media assets.

## Produktion

Se:

- `DEPLOYMENT.md`
- `PRETIX.md`
- `BACKUP.md`
- `SECURITY.md`
