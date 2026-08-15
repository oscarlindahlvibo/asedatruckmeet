# Security

## Principer

- Lita aldrig på klienten för authorization.
- Pretix API-token stannar server-side.
- Pretix webhook är endast en trigger, inte betrodd data.
- Least privilege via RBAC.
- Audit log för känsliga adminåtgärder.

## Skydd

- Secure cookies i produktion.
- CSRF-skydd för formulär/server actions.
- Rate limiting via Redis.
- CSP med tillåtna Pretix/widget-domäner.
- Input validation med Zod.
- MIME-validering och bildsanering vid uploads.
- Skydd mot IDOR genom server-side ownership checks.
- MFA-ready adminauth.

## GDPR

- Separat marketing consent.
- Offentlig truckprofil kräver aktivt samtycke.
- Registreringsnummer är internt om ägaren/admin inte markerar det publikt.
- Retention policies ska köras som schemalagt jobb.
- Dataexport och radering/anonymisering där juridiskt möjligt.

## Incidenter

Misstänkta admin-login, webhookfel och Pretix API-fel loggas strukturerat och
visas i `/admin/system/health` eller integrationsloggen.
