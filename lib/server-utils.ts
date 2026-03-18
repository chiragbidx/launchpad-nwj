import { db } from "@/lib/db/client";
import { teamMembers } from "@/lib/db/schema";

// Only import this module in server-only files/components
export async function getTeamIdForUser(userId: string): Promise<string | null> {
  const tm = await db
    .select({ teamId: teamMembers.teamId })
    .from(teamMembers)
    .where(teamMembers.userId.eq(userId));
  if (!tm.length) return null;
  return tm[0].teamId;
}

// Add other server-only helpers here when needed