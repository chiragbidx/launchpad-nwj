/**
 * Shared utility helpers for client-safe usage.
 * IMPORTANT:
 * Do NOT import or export any server-only modules (such as db connections, schema, or direct Postgres/Drizzle code) from this file.
 * For server-only utilities, use a separate file (e.g., lib/server-utils.ts) and import ONLY from server context.
 */

// The `cn` helper is used in many client components for classNames.
export function cn(...inputs: (string | undefined | false | null)[]): string {
  return inputs.filter(Boolean).join(" ");
}

// Add other client-safe utility functions below.
// (No DB or server context allowed in this file)