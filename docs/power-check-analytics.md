# Power headroom check analytics

Events post to the Netlify form **`power-check-analytics`** (no cookies, no email in payloads).

**Netlify email:** Turn off form notifications for **`power-check-analytics`**. Each POST is a separate submission; the app only POSTs on milestones (not on every tap). Keep notifications on **`headroom-check-email`** and **`power-slo-assessment`** only.

## Event kinds (`kind`)

| kind | When |
|------|------|
| `started` | First answer (client-only; not sent to Netlify) |
| `answer` | Each question (buffered in `sessionStorage`; included in `answer_trail` on `completed`) |
| `completed` | All six questions done (`tier`, `score`, `q6`, `gap_count`, `answer_trail` JSON) |
| `scoping_click` | "Request an assessment" from the result (`role` if they typed one in the email form first) |
| `scoping_landed` | `/scoping` opened with valid `check=v1&a=…` |
| `email_sent` | Readout email form succeeded (`role` on analytics when provided; role also stored on the email form submission) |
| `retake` | "Retake the diagnostic" |

Correlate a visit with **`session_id`**. Export form submissions from Netlify and pivot in a spreadsheet or script.

## Drop-off

Parse `answer_trail` on `completed` rows for per-question paths. Sessions with no `completed` row abandoned mid-diagnostic (not posted unless you add another pipeline).

## Tier and power context

Filter `completed`, `scoping_click`, `scoping_landed`, and `email_sent` by `tier` and `q6`.
