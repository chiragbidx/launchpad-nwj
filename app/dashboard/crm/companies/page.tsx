import { getAuthSession } from "@/lib/auth/session";
import { getTeamIdForUser } from "@/lib/utils";
import { CRMCompaniesClient } from "./client";

export const dynamic = "force-dynamic";

export default async function CRMCompaniesPage() {
  const session = await getAuthSession();
  if (!session) {
    return null;
  }
  const teamId = await getTeamIdForUser(session.userId);

  return <CRMCompaniesClient teamId={teamId} />;
}