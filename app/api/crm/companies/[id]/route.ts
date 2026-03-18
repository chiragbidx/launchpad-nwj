import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { companies, contacts, activities } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

// PUT /api/crm/companies/[id]
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  const body = await req.json();
  const {
    name,
    website,
    industry,
    status,
    description,
    mainContactId,
    teamId,
  } = body;

  // Primary checks
  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  if (!status) return NextResponse.json({ error: "Status required" }, { status: 400 });

  // Enforce team scope and unique by name
  const exists = await db.query.companies.findFirst({
    where: (c, { eq, and }) =>
      and(eq(c.teamId, teamId), eq(c.id, id)),
  });
  if (!exists) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const [conflict] = await db
    .select()
    .from(companies)
    .where(and(eq(companies.teamId, teamId), eq(companies.name, name), (c) => c.id.ne(id)));
  if (conflict)
    return NextResponse.json({ error: "Company name already exists" }, { status: 409 });

  const [updated] = await db
    .update(companies)
    .set({
      name,
      website,
      industry,
      status,
      description,
      mainContactId: mainContactId || null,
      updatedBy: session.userId,
      updatedAt: new Date(),
    })
    .where(eq(companies.id, id))
    .returning();

  return NextResponse.json(updated);
}

// DELETE /api/crm/companies/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;
  // Fetch company/team
  const found = await db
    .select({ teamId: companies.teamId })
    .from(companies)
    .where(eq(companies.id, id));
  if (!found.length)
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  const teamId = found[0].teamId;

  // Cascade delete activities related to company
  await db.delete(activities).where(eq(activities.companyId, id));
  // Unlink contacts from this company (set company_id null, but keep the contact)
  await db
    .update(contacts)
    .set({ companyId: null })
    .where(eq(contacts.companyId, id));
  // Delete company
  await db.delete(companies).where(eq(companies.id, id));

  return NextResponse.json({ success: true });
}