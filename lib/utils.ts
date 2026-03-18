import { db } from "@/lib/db/client";
import { team_members } from "@/lib/db/schema";

// Other utility functions...

// Returns primary teamId for a user (assume first for now)
export async function getTeamIdForUser(userId: string): Promise<string | null> {
  const tm = await db
    .select({ teamId: team_members.teamId })
    .from(team_members)
    .where(team_members.userId.eq(userId));
  if (!tm.length) return null;
  return tm[0].teamId;
}