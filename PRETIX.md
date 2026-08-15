# Pretix Integration

Pretix är source of truth för:

- orders
- betalningar
- refunds
- biljettprodukter
- quotas
- ticket secrets/QR
- check-in

Truckmeet-web använder:

- Pretix widget på `/biljetter`
- Pretix REST API server-side
- Pretix webhooks som signaler
- PretixSCAN/check-in-system i första produktionsfasen

## Webhooks

Webhook-data ska inte betraktas som sanningskälla. Den implementerade mottagaren
validerar Basic Auth när secrets finns, sparar händelsen med unik
`idempotencyKey` och svarar `202` på upprepade händelser utan att skapa dubletter.
När en webhook kommer in:

1. Spara webhook idempotent.
2. Returnera 2xx snabbt.
3. Lägg sync-jobb i queue (nästa worker-steg i produktionssättningen).
4. Hämta aktuell order/check-in-data via autentiserat Pretix API.
5. Uppdatera lokal read model.

Pretix kan skicka samma webhook mer än en gång, så idempotency är obligatoriskt.

## Rekommenderade event

- `pretix.event.order.placed`
- `pretix.event.order.paid`
- `pretix.event.order.changed`
- `pretix.event.order.canceled`
- refund-relaterade event
- check-in
- check-in reverted

## Adminoperationer

Ekonomiska och säkerhetskritiska åtgärder ska alltid gå via Pretix officiella
API eller länkas till Pretix UI med “Öppna i Pretix”.

## Fordonsregistrering i checkout

Skapa Pretix-frågor på fordonsbiljetten med dessa identifierare så fylls den
lokala truckprofilen automatiskt när ordern synkas:

- `truck_company`, `truck_driver`, `truck_registration`
- `truck_country`, `truck_city`, `truck_brand`, `truck_model`, `truck_model_year`
- `truck_engine_type`, `truck_engine_power`, `truck_bodywork`
- `truck_category`, `truck_competition_class`, `truck_description`
- `truck_instagram`, `truck_facebook`, `truck_website`, `truck_photographer`
- `truck_public_consent`

Identifierarna kan ändras med `PRETIX_TRUCK_QUESTION_MAP`. Pretix är source of
truth för svaren; den lokala profilen är en read model som kan kompletteras i
Mina sidor.

## Byte/vidareförsäljning

Ett automatiserat flöde kan använda Pretix `mark_canceled` och skapa en
engångsvoucher med `allow_ignore_quota=true`. Det måste först fastställas hur
betalningsleverantören ska hantera återbetalningen och vilken ändringsavgift
som gäller. Därför ska detta köras som ett godkänt adminflöde via Pretix API,
inte som en fri kundändring av ordern.
