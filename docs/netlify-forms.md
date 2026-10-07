# Netlify forms (joule.lat)

Two forms only. Names and fields are declared in `index.html` (build-time detection for the SPA) and in `src/content/netlifyForms.js`.

| Form | Route | When it submits |
|------|--------|-----------------|
| **`diagnostic-completion`** | `/` (Power headroom check) | **All six questions answered** — auto-submits full result (`contact_provided=no`). Second row if they also submit email + role (`contact_provided=yes`). |
| **`assessment`** | `/scoping` | User submits **Request an assessment** |

Enable email notifications in the Netlify UI for both forms. After deploy, disable notifications on legacy forms (`power-check-analytics`, `headroom-check-email`, `power-slo-assessment`) if they still appear from older builds.

Bot friction: `src/lib/formBotGuard.js` (honeypot, trap field, timing, rate limits).
