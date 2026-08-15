# App API

Appen på `app.asedatruckmeet.se` ska använda webbplatsens publika API. Den ska
inte prata direkt med PostgreSQL eller Pretix.

## Publika lastbilar

`GET /api/public/events/{event-slug}/trucks`

Exempel:

```text
https://asedatruckmeet.se/api/public/events/aseda-truckmeet-2027/trucks?page=1&limit=30&brand=Scania&search=kalmar
```

Stöd för `page`, `limit`, `search`, `brand` och `category`. Svaret innehåller
endast godkända profiler där ägaren lämnat publikt samtycke. Registreringsnummer
skickas aldrig i detta API.

```json
{
  "event": { "slug": "aseda-truckmeet-2027", "year": 2027 },
  "page": 1,
  "limit": 30,
  "total": 1,
  "pages": 1,
  "trucks": [
    {
      "truckNumber": "B127",
      "companyName": "Johanssons Åkeri",
      "brand": "Scania",
      "model": "770S V8",
      "imageUrl": "https://...",
      "profileUrl": "https://asedatruckmeet.se/lastbilar/..."
    }
  ]
}
```

Sätt `APP_ORIGIN=https://app.asedatruckmeet.se` i produktion för CORS.

## BankID-röstning

Röstning ska använda ett server-side BankID-flöde. Appen får endast ett
kortlivat verifieringsresultat och får aldrig hantera BankID-certifikat eller
Pretix-token. BankID RP-certifikat, relying-party-id och callback-domän måste
konfigureras innan `BANKID_REQUIRED` kan aktiveras för ett event.

