# Åseda Truckmeet Platform

Vite/React-frontend för Åseda Truckmeet.

Den aktiva frontend-builden är en statisk SPA. Supabase Edge Functions står för
auth, admin, Pretix-integrationer och annan server-side logik.

## Lokal start

```bash
npm install
npm run dev
```

Öppna Vite-adressen som skrivs ut i terminalen, normalt `http://localhost:5173`.

## Viktiga ytor

- Publik webb: `/`
- Biljetter: `/biljetter`
- Lastbilsgalleri: `/lastbilar`
- Partners: `/partners`
- Besöksinfo: `/besok`
- App API-kontrakt: [`APP_API.md`](./APP_API.md)
- Shared Supabase-deployment: [`DEPLOYMENT_SHARED_SUPABASE.md`](./DEPLOYMENT_SHARED_SUPABASE.md)

## Arkitektur

Frontend är Vite/React och byggs till `dist/`. Supabase Edge Functions är
systemets serverlager. Pretix körs separat och är source of truth för biljetter,
betalningar, refunds, quotas, QR/ticket secrets och check-in.

Truckmeet-systemet äger CMS, eventdata, Mina sidor, truckprofiler, karta,
publikens val, analytics, admin UX och lokala read models av Pretix-data.

## Databas och lokala secrets

Databasmigreringen finns i `supabase/migrations/` och använder det isolerade
schemat `truckmeet`. `DATABASE_URL` ska endast användas av migrationer eller
server-side workers, aldrig i frontend-builden.

Bildflödet kräver S3-kompatibel lagring. Originalbilden konverteras till WebP
och en thumbnail sparas som variant. Ägarkontroll sker server-side innan någon
fil tas emot eller kopplas till en truckprofil.

## Demo-data

Frontendens fallback-data är tydligt markerad som demo. Publika produktionstexter
och truckdata ska hämtas från Supabase/Edge Functions.

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
