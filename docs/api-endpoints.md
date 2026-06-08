# LexiDict Endpoint Outline

LexiDict currently consumes a public dictionary API directly. If we later add a backend, these are the endpoints that should be developed to keep the app clean and easier to maintain.

## Existing External Dictionary Endpoint

### `GET /api/v2/entries/en/:word`

Example:

```text
https://api.dictionaryapi.dev/api/v2/entries/en/hello
```

### Purpose

- Fetch definitions, phonetics, examples, parts of speech, and pronunciation audio.

### Response Use

- `word`
- `phonetics[].text`
- `phonetics[].audio`
- `meanings[].partOfSpeech`
- `meanings[].definitions[].definition`
- `meanings[].definitions[].example`

## Recommended App Backend Endpoints

These are not required for the current app to work, but they are good to plan if you want your own backend layer.

### `GET /words/:word`

Purpose:
- Proxy dictionary lookup requests.
- Normalize API responses into a stable app contract.
- Hide third-party dependency details from the mobile app.

### `GET /history`

Purpose:
- Return the saved search history for the current user or device.

### `POST /history`

Purpose:
- Save a searched word.

### `DELETE /history/:word`

Purpose:
- Remove one item from search history.

### `DELETE /history`

Purpose:
- Clear all history after confirmation.

### `GET /health`

Purpose:
- Confirm the service is reachable and ready.

## Endpoint Design Notes

- Return consistent JSON shapes.
- Use clear error messages for 400, 404, 429, and 500 cases.
- Keep pronunciation audio URLs in the response so the app can play them without extra translation.
- Keep validation on both the client and server side.

