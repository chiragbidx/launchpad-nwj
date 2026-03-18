import { getAuthSession } from "@/lib/auth/session";
import { getTeamIdForUser } from "@/lib/utils";
import { CRMContactsClient } from "./client";

export const dynamic = "force-dynamic";

export default async function CRMContactsPage() {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }
  const teamId = await getTeamIdForUser(session.userId);

  // The data fetch is deferred to client with SWR, so pass empty here (can SSR if desired)
  return <CRMContactsClient teamId={teamId} />;
}