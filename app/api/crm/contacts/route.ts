import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { contacts, companies } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

// GET /api/crm/contacts?teamId=...
export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const teamId = url.searchParams.get("teamId");
  if (!teamId) return NextResponse.json({ error: "Missing team" }, { status: 400 });

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
      companyId: contacts.companyId,
      createdAt: contacts.createdAt,
      updatedAt: contacts.updatedAt,
      companyName: companies.name,
    })
    .from(contacts)
    .leftJoin(companies, eq(contacts.companyId, companies.id))
    .where(eq(contacts.teamId, teamId))
    .orderBy(contacts.lastName, contacts.firstName);

  return NextResponse.json(rows);
}

// POST /api/crm/contacts
export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  // Insert
  const [inserted] = await db
    .insert(contacts)
    .values({
      firstName,
      lastName,
      email,
      phone,
      jobTitle,
      companyId: companyId || null,
      status,
      notes,
      teamId,
      createdBy: session.userId,
      updatedBy: session.userId,
    })
    .returning();

  return NextResponse.json(inserted);
}