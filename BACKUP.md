# Backup Strategy

## PostgreSQL

- Daglig full backup.
- Tätare backup under eventveckan.
- Restore-test innan event.
- Kryptera backupfiler.

Exempel:

```bash
pg_dump "$DATABASE_URL" > truckmeet-$(date +%F).sql
```

## Media

- Versionerad bucket om möjligt.
- Separat backup/snapshot av R2/MinIO.
- Bevara original och genererade thumbnails.

## Pretix

Pretix har egen databas och media. Säkerhetskopiera Pretix separat enligt
Pretix driftmodell.

## Secrets/config

- Exportera inte secrets till repo.
- Dokumentera vilka environment variables som krävs.
- Förvara produktionssecrets i password manager eller secret manager.

## Återställningsövning

Senast två veckor före event ska följande testas:

1. Återställ PostgreSQL till staging.
2. Återställ media.
3. Kontrollera adminlogin.
4. Kör Pretix API health.
5. Kontrollera `/admin/system/health`.
