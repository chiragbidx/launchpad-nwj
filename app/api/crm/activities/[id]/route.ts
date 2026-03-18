import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { activities, contacts, companies, users } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

// GET /api/crm/activities/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  const rows = await db
    .select({
      id: activities.id,
      type: activities.type,
      subject: activities.subject,
      description: activities.description,
      datetime: activities.datetime,
      contactId: activities.contactId,
      companyId: activities.companyId,
      assignedUserId: activities.assignedUserId,
      createdAt: activities.createdAt,
      updatedAt: activities.updatedAt,
      createdBy: activities.createdBy,
      updatedBy: activities.updatedBy,
      contactName: contacts.firstName,
      contactLastName: contacts.lastName,
      companyName: companies.name,
      createdByName: users.email,
      updatedByName: users.email,
    })
    .from(activities)
    .leftJoin(contacts, eq(activities.contactId, contacts.id))
    .leftJoin(companies, eq(activities.companyId, companies.id))
    .leftJoin(users, eq(activities.createdBy, users.id))
    .where(eq(activities.id, id));

  if (!rows.length)
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(rows[0]);
}