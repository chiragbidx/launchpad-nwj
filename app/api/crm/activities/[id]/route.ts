import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { activities } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

// PUT /api/crm/activities/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
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

  // Enforce team scope
  const rows = await db
    .select({ id: activities.id })
    .from(activities)
    .where(and(eq(activities.id, id), eq(activities.teamId, teamId)));
  if (!rows.length)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  const [updated] = await db
    .update(activities)
    .set({
      type,
      subject,
      description,
      datetime: new Date(datetime),
      contactId: contactId || null,
      companyId: companyId || null,
      assignedUserId: assignedUserId || null,
      updatedBy: session.userId,
      updatedAt: new Date(),
    })
    .where(eq(activities.id, id))
    .returning();

  return NextResponse.json(updated);
}

// DELETE /api/crm/activities/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  // Fetch activity/team
  const found = await db
    .select({ teamId: activities.teamId })
    .from(activities)
    .where(eq(activities.id, id));
  if (!found.length)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Just delete activity
  await db.delete(activities).where(eq(activities.id, id));

  return NextResponse.json({ success: true });
}