## 2024-06-09 — Client/Server Boundary Fix

- Refactored `lib/utils.ts` to ensure only client-safe utilities are present, removing any database or server-only imports.
- Moved server-only utility functions (such as those accessing Drizzle/Postgres) to a new `lib/server-utils.ts` file, imported only from server context.
- Updated `components/ui/card.tsx` to import only client-safe utilities.
- Resolved Next.js error where `pg` (server-only Postgres library) was leaking into browser bundle due to improper import.
- Landing and client components now build and render cleanly with zero server-only dependency errors.