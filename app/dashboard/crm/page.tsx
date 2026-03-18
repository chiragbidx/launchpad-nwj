import { getAuthSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function CRMRootPage() {
  const session = await getAuthSession();
  if (!session) {
    redirect("/auth#signin");
  }
  // Optional: redirect to Contacts by default, or show a CRM summary here
  redirect("/dashboard/crm/contacts");
  return null;
}