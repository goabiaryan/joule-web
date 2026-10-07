# Power headroom check analytics

Events post to the Netlify form **`power-check-analytics`** (no cookies, no email in payloads).

## Event kinds (`kind`)

| kind | When |
|------|------|
| `started` | First answer in a session |
| `answer` | Each question answered (`question_id`, `answer_value`, `step_index`) |
| `completed` | All six questions done (`tier`, `score`, `q6`, `gap_count`) |
| `scoping_click` | "Request an assessment" from the result (`role` if they typed one in the email form first) |
| `scoping_landed` | `/scoping` opened with valid `check=v1&a=…` |
| `email_sent` | Readout email form succeeded (`role` on analytics when provided; role also stored on the email form submission) |
| `retake` | "Retake the diagnostic" |

Correlate a visit with **`session_id`**. Export form submissions from Netlify and pivot in a spreadsheet or script.

## Drop-off

For each `session_id`, max `step_index` on `answer` events shows how far they got. Compare `started` vs `completed` counts for completion rate.

## Tier and power context

Filter `completed`, `scoping_click`, `scoping_landed`, and `email_sent` by `tier` and `q6`.
