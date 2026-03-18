import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { contacts, companies, users } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";

// Existing PUT and DELETE handlers...

// GET /api/crm/contacts/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  // Join with companies and users for primary/updated by display
  const rows = await db
    .select({
      id: contacts.id,
      firstName: contacts.firstName,
      lastName: contacts.lastName,
      email: contacts.email,
      phone: contacts.phone,
      jobTitle: contacts.jobTitle,
      status: contacts.status,
      notes: contacts.notes,
      companyName: companies.name,
      companyId: contacts.companyId,
      createdAt: contacts.createdAt,
      updatedAt: contacts.updatedAt,
      createdBy: contacts.createdBy,
      updatedBy: contacts.updatedBy,
      createdByName: users.email, // could also be first+last name if available
      updatedByName: users.email,
    })
    .from(contacts)
    .leftJoin(companies, eq(contacts.companyId, companies.id))
    .leftJoin(users, eq(contacts.createdBy, users.id))
    .where(eq(contacts.id, id));

  if (!rows.length)
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(rows[0]);
}