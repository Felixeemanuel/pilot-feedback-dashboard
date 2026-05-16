# Pilot Feedback Dashboard

Internal tool for collecting and triaging beta-tester feedback on after-school care software (Lgr22 curriculum). Testers submit categorized feedback during the pilot; an admin logs in via PIN to manage it.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS** for styling
- **JSON file** as the database — no external DB (`data/db.json`)

## Commands

```bash
npm run dev      # dev server at localhost:3000
npm run build    # production build
npm run start    # serve production build
```

No lint script is configured.

## Project Structure

```
app/
  page.tsx              # Login page (PIN entry)
  dashboard/page.tsx    # Dashboard (server component, reads DB, hydrates client)
  api/
    auth/route.ts       # POST — verifies PIN, sets auth cookie
    logout/route.ts     # POST — clears cookie
    feedback/route.ts   # GET/POST/PATCH/DELETE feedback items
    testers/route.ts    # GET/POST/DELETE testers
components/
  Dashboard.tsx         # Main client component (tabs, columns, modals)
  AddFeedbackModal.tsx  # Modal: add a feedback item
  ManageTestersModal.tsx # Modal: add/remove testers
lib/
  db.ts                 # readDB / writeDB helpers (synchronous fs)
data/
  db.json               # Live data — gitignored in prod; committed in dev
middleware.ts           # Protects /dashboard/* and /api/feedback, /api/testers
```

## Data Model

```ts
Tester:       { id, name, org }
FeedbackItem: { id, section: 'UX'|'Content'|'Performance'|'Bugs',
                type: 'positive'|'negative', text, testerId, timestamp, fixed }
```

## Environment Variables

```
DASHBOARD_PIN     # The PIN users enter to log in
DASHBOARD_SECRET  # Random secret used as the auth cookie value
```

Both must be set or auth will always fail. See `.env.local` (not committed).

## Specialized Docs

- [Auth flow](.claude/docs/auth.md) — PIN → cookie → middleware protection
- [Data layer](.claude/docs/data.md) — JSON file DB, read/write patterns, caveats
