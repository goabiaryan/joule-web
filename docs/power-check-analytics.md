# Power headroom check analytics

Diagnostic funnel events are **client-only** (buffered answers in `sessionStorage`). They are **not** sent to Netlify.

## Inbox notifications (completions only)

Turn on Netlify form email for:

| Form | When it fires |
|------|----------------|
| **`headroom-check-email`** | User submits the readout form (email + role + summary) after finishing all six questions |
| **`power-slo-assessment`** | User submits **Request an assessment** on `/scoping` |

Turn **off** notifications for **`power-check-analytics`**. That form exists only so Netlify registers fields at build time; the app does not POST to it. Partial or abandoned diagnostics never create submissions.

## Event kinds (`trackPowerCheckEvent`)

| kind | Behavior |
|------|----------|
| `started` | No-op |
| `answer` | Appends to in-session buffer (not exported) |
| `completed` | Clears buffer; no network |
| `scoping_click`, `scoping_landed`, `email_sent`, `retake` | No-op (lead forms carry conversion signal) |

`getPowerCheckSessionId` / `resetPowerCheckSessionId` remain for correlating future instrumentation (e.g. GA events) if added later.
