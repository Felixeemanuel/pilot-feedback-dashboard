# Auth Flow

## How it works

1. User submits PIN on `/` → `POST /api/auth`
2. API compares PIN to `DASHBOARD_PIN` env var
3. On match, sets an `httpOnly` cookie `auth_token = DASHBOARD_SECRET` (8 h, `sameSite: lax`)
4. `middleware.ts` reads that cookie on every request to `/dashboard/*`, `/api/feedback`, and `/api/testers`; redirects to `/` if missing or mismatched

## Key files

| File | Role |
|---|---|
| `app/api/auth/route.ts` | Issues the cookie |
| `app/api/logout/route.ts` | Clears the cookie |
| `middleware.ts` | Enforces it on protected routes |

## Caveats

- No rate limiting on `/api/auth` — brute-forceable in local/dev use, acceptable for internal pilot tool
- Cookie is compared with `===` against `DASHBOARD_SECRET`; rotating the secret immediately invalidates all sessions
- `DASHBOARD_PIN` and `DASHBOARD_SECRET` must both be set in `.env.local`; if either is missing, every login attempt returns 401
