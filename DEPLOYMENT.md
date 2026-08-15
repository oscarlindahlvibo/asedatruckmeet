# Deployment

## Serverkrav

- Linux-server med Docker och Docker Compose.
- Node.js 22 om appen körs utan container.
- PostgreSQL 17.
- Redis 7.
- S3-kompatibel objektlagring, exempelvis Cloudflare R2 eller MinIO.
- HTTPS via reverse proxy, exempelvis Caddy, nginx eller Traefik.

## Produktionsflöde

1. Skapa `.env` från `.env.example`.
2. Sätt riktiga secrets.
3. Starta databas, Redis och object storage.
4. Kör migreringar.
5. Kör app och worker.
6. Lägg reverse proxy framför appen.
7. Konfigurera Pretix webhook till `/api/pretix/webhook`.

```bash
docker compose up -d postgres redis minio
docker compose build web worker
docker compose run --rm web npx prisma migrate deploy
docker compose up -d web worker
```

Pretix bör köras separat enligt officiell Pretix-dokumentation, inte bakas in i
webbappen.

## Secrets

Alla secrets ska ligga i environment variables eller serverns secret manager.
Pretix API-token får aldrig exponeras i browsern.
