# Netlify forms (joule.lat)

Two forms only. Names and fields are declared in `index.html` (build-time detection for the SPA) and in `src/content/netlifyForms.js`.

**Quota:** Netlify counts **one submission per POST**. Anonymous quiz completions do **not** POST (they fire a GA4 `diagnostic_completed` event instead). Only real lead actions use Netlify.

| Form | Route | When it submits (counts toward quota) |
|------|--------|--------------------------------------|
| **`diagnostic-completion`** | `/` (Power headroom check result) | User submits **email + role** for the readout (`contact_provided=yes`, full tier/score/summary in payload) |
| **`assessment`** | `/scoping` | User submits **Request an assessment** |

Enable email notifications in the Netlify UI for both forms. After deploy, disable notifications on legacy forms if they still appear from older builds.

Bot friction: `src/lib/formBotGuard.js` (honeypot, trap field, timing, rate limits).
