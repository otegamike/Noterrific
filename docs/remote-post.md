# Remote Post Guide

## Overview
Remote Post lets you send notes into your Noterrific account from external tools using an API key.

## Endpoints
- `POST /.netlify/functions/app/remote-post/key/new`
- `GET /.netlify/functions/app/remote-post/key/status`
- `DELETE /.netlify/functions/app/remote-post/key/delete`
- `POST /.netlify/functions/app/remote-post/note`

## Remote Note Request
### Headers
- `Content-Type: application/json`
- `username: YOUR_USERNAME`
- `apikey: YOUR_API_KEY`

### Body
```json
{
  "title": "Quick capture",
  "note": "Text to store"
}
```

### cURL Example
```bash
curl -X POST "https://YOUR_DOMAIN/.netlify/functions/app/remote-post/note" \
  -H "Content-Type: application/json" \
  -H "username: YOUR_USERNAME" \
  -H "apikey: YOUR_API_KEY" \
  -d '{"title":"Clipboard capture","note":"Hello from remote post"}'
```

### Fetch Example
```js
await fetch("https://YOUR_DOMAIN/.netlify/functions/app/remote-post/note", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    username: "YOUR_USERNAME",
    apikey: "YOUR_API_KEY"
  },
  body: JSON.stringify({
    title: "Quick capture",
    note: "Saved from automation"
  })
});
```

## Apple Shortcuts Setup (Clipboard + Back Tap)
1. Open **Shortcuts** and create `Remote Post Clipboard`.
2. Add **Get Clipboard**.
3. Add **Text** and map clipboard text.
4. Add **Get Contents of URL**.
5. Set URL to `https://YOUR_DOMAIN/.netlify/functions/app/remote-post/note`.
6. Set Method to `POST`.
7. Add Headers:
   - `Content-Type` = `application/json`
   - `username` = your Noterrific username
   - `apikey` = your generated key
8. Set Request Body as JSON with:
   - `title`: a fixed title like `Back Tap Capture`
   - `note`: clipboard text variable
9. Test the shortcut once.
10. Open iPhone **Settings > Accessibility > Touch > Back Tap** and bind double or triple tap to `Remote Post Clipboard`.

## Troubleshooting
- `400 Missing required fields`: Ensure `title`, `note`, `username`, and `apikey` are present.
- `403 Invalid API key`: Revoke existing key and generate a new one.
- `401/403 auth errors on key management`: Log in again and retry from Settings.
- No note created: Verify your deployed domain and endpoint path.
