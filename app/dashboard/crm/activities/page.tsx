import { getAuthSession } from "@/lib/auth/session";
import { getTeamIdForUser } from "@/lib/utils";
import { CRMActivitiesClient } from "./client";

export const dynamic = "force-dynamic";

export default async function CRMActivitiesPage() {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }
  const teamId = await getTeamIdForUser(session.userId);

  return <CRMActivitiesClient teamId={teamId} />;
}