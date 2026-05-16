# Data Layer

## Overview

All data lives in `data/db.json`. There is no database process — reads and writes go through synchronous `fs` calls in `lib/db.ts`.

## API

```ts
readDB(): DB          // parses db.json; creates file with empty state if missing
writeDB(db: DB): void // serializes entire DB back to disk (pretty-printed)
```

## Write pattern

Every mutation in the API routes follows read → mutate → write:

```ts
const db = readDB()
db.feedback.push(newItem)
writeDB(db)
```

## Caveats

- **No concurrency safety** — concurrent writes can race and overwrite each other. Fine for a single-admin pilot tool; would need a lock or real DB for multi-user writes.
- **No schema migration** — adding fields to `Tester` or `FeedbackItem` requires manually updating `db.json` or deleting it to reset.
- `data/db.json` is committed to the repo in development. Make sure not to commit real pilot data if the repo is public.
- The dashboard page uses `export const dynamic = 'force-dynamic'` to bypass Next.js caching and always read fresh data from disk.
