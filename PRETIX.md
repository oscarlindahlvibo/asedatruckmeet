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
