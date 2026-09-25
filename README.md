# joule-web

Public marketing site for **Joule.lat**: Phase 1 product one-pager (inference power, phase economics, design partner program). Deploy to **joule.lat** (Netlify).

Dashboard readouts are **invite-only** after scoping ([`joule-dashboard`](../joule-dashboard/) repo).

Institutional advisory copy (Track A/B retainers) is parked in the sibling repo `Documents/abiaryan.com` under `docs/advisory/` (not published to nav yet).

## Routes

| Path | Purpose |
|------|---------|
| `/` | Phase 1 product one-pager |
| `/scoping` | Design partner program intake form |
| `/retainer` | Ongoing retainer intake form |
| `/demo` | Redirects to `/scoping` |
| `/print`, `/print/advisory` | Redirect to `/` (legacy URLs) |

## Quick start

```bash
cd joule-web
npm install
npm run dev
```

## Environment (Netlify)

| Variable | Purpose |
|----------|---------|
| `VITE_SCOPING_CTA_URL` | Override design partner CTA link (default: `/scoping` form) |
| `VITE_RETAINER_CTA_URL` | Override retainer CTA link (default: `/retainer` form) |

Engagement CTAs on `/` point at `/scoping` and `/retainer`. Submissions use **Netlify Forms** (`public/forms.html` for build-time detection). After deploy: Netlify **Forms** → enable **email notifications** for `design-partner-program` and `retainer-inquiry`.

## Copy source

All product text: [`src/content/phase1Product.js`](src/content/phase1Product.js). Event kit: [`docs/gtm/atlantic-convergence-booth-kit.md`](docs/gtm/atlantic-convergence-booth-kit.md).

## Repo setup (GitHub)

This folder is intended as its **own git repository** (sibling to `joule-dashboard`, `joule-core`, `joule-agent`):

```bash
cd joule-web
git init -b main
git add -A && git commit -m "Initial commit: public product site"
gh repo create joule-web --private --source=. --remote=origin --push
```
