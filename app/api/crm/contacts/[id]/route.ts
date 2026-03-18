import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { contacts, activities } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// PUT /api/crm/contacts/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  const body = await req.json();

  const {
    firstName,
    lastName,
    email,
    phone,
    jobTitle,
    companyId,
    status,
    notes,
    teamId,
  } = body;

  // Validation
  if (!firstName || !lastName)
    return NextResponse.json({ error: "First and last name are required." }, { status: 400 });
  if (email && !/\S+@\S+\.\S+/.test(email))
    return NextResponse.json({ error: "Enter valid email address." }, { status: 400 });
  if (phone && !/^(\+?\d{9,15})?$/.test(phone))
    return NextResponse.json({ error: "Enter valid phone number." }, { status: 400 });

  // Enforce team scope
  const rows = await db
    .select({ id: contacts.id })
    .from(contacts)
    .where(and(eq(contacts.id, id), eq(contacts.teamId, teamId)));
  if (!rows.length)
    return NextResponse.json({ error: "Not found." }, { status: 404 });

  // Update
  const [updated] = await db
    .update(contacts)
    .set({
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      companyId: companyId || null,
      status,
      notes,
      updatedBy: session.userId,
      updatedAt: new Date(),
    })
    .where(eq(contacts.id, id))
    .returning();

  return NextResponse.json(updated);
}

// DELETE /api/crm/contacts/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  // Fetch contact/team
  const found = await db
    .select({ teamId: contacts.teamId })
    .from(contacts)
    .where(eq(contacts.id, id));
  if (!found.length)
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  const teamId = found[0].teamId;

  // Cascade delete activities related to contact
  await db.delete(activities).where(eq(activities.contactId, id));
  // Delete contact
  await db.delete(contacts).where(eq(contacts.id, id));

  return NextResponse.json({ success: true });
}