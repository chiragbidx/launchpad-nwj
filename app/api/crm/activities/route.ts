import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { activities, contacts, companies } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, or, and, isNull } from "drizzle-orm";

// GET /api/crm/activities?teamId=...
export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const teamId = url.searchParams.get("teamId");
  if (!teamId) return NextResponse.json({ error: "Missing team" }, { status: 400 });

  // Optionally: filter by type/date/contact/company (not implemented here for brevity)
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
      contactName: contacts.firstName,
      contactLastName: contacts.lastName,
      companyName: companies.name,
    })
    .from(activities)
    .leftJoin(contacts, eq(activities.contactId, contacts.id))
    .leftJoin(companies, eq(activities.companyId, companies.id))
    .where(eq(activities.teamId, teamId))
    .orderBy(activities.datetime);

  return NextResponse.json(rows);
}

// POST /api/crm/activities
export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    type,
    subject,
    description,
    datetime,
    contactId,
    companyId,
    assignedUserId,
    teamId,
  } = body;

  if (!type) return NextResponse.json({ error: "Type required" }, { status: 400 });
  if (!subject) return NextResponse.json({ error: "Subject required" }, { status: 400 });
  if (!datetime) return NextResponse.json({ error: "Date/time required" }, { status: 400 });

  // Must link to either a contact or a company (not both, not neither)
  if (
    (!contactId && !companyId) ||
    (contactId && companyId)
  )
    return NextResponse.json(
      { error: "Link to either a contact or a company, not both or neither." },
      { status: 400 }
    );

  const [inserted] = await db
    .insert(activities)
    .values({
      type,
      subject,
      description,
      datetime: new Date(datetime),
      contactId: contactId || null,
      companyId: companyId || null,
      assignedUserId: assignedUserId || null,
      teamId,
      createdBy: session.userId,
      updatedBy: session.userId,
    })
    .returning();

  return NextResponse.json(inserted);
}