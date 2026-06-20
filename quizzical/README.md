# Quizzical

A Next.js quiz game by BDL Corp.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` (or uncomment the keys at the top of `.env.local`) and fill in your values.

### Required — Clerk (authentication)

Create an application at [clerk.com](https://clerk.com) and add:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Optional route overrides (defaults work with `/signin`):

- `NEXT_PUBLIC_CLERK_SIGN_IN_URL=/signin`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signin`

### Optional — AI & media APIs

- `OPENROUTER_API_KEY` — generates wrong-answer distractors for image quizzes
- `TMDB_READ_TOKEN` — movie poster reveals for "Guess the Movie"

### Optional — Supabase (data cache only, not auth)

Supabase is **not required** for the app to run. When configured, it persists:

- Reveal cache (`reveal_cache` table) — avoids repeat TMDB/SportsDB/Wikipedia calls
- Wikipedia quiz cache (`wikipedia_quiz_cache` table)
- Admin image questions (`image_questions` table)

Without Supabase, each feature falls back gracefully:

| Feature | Fallback |
| --- | --- |
| Reveal cache | In-process memory cache (per server instance) |
| Quiz cache | `.mock-data/wikipedia-quiz-cache.json` |
| Image questions admin | `.mock-data/image-questions.json` |

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Run the SQL in `supabase/` once if you enable Supabase caching.

## Protected routes

Clerk protects these routes (via `proxy.ts`):

- `/dashboard/**` — admin image-question management
- `/api/admin/**` — admin API endpoints

Unauthenticated users are redirected to `/signin`.

## Scripts

```bash
npm run dev      # development server
npm run build    # production build
npm run start    # production server
npm run lint     # ESLint
```
