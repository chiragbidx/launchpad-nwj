import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { companies, contacts } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

// GET /api/crm/companies?teamId=...
export async function GET(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const teamId = url.searchParams.get("teamId");
  if (!teamId) return NextResponse.json({ error: "Missing team" }, { status: 400 });

  const rows = await db
    .select({
      id: companies.id,
      name: companies.name,
      website: companies.website,
      industry: companies.industry,
      status: companies.status,
      description: companies.description,
      mainContactId: companies.mainContactId,
      createdAt: companies.createdAt,
      updatedAt: companies.updatedAt,
    })
    .from(companies)
    .where(eq(companies.teamId, teamId))
    .orderBy(companies.name);

  return NextResponse.json(rows);
}

// POST /api/crm/companies
export async function POST(req: NextRequest) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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

  if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
  if (!status) return NextResponse.json({ error: "Status required" }, { status: 400 });

  // Unique by name per team
  const exists = await db.query.companies.findFirst({
    where: (c, { eq, and }) =>
      and(eq(c.teamId, teamId), eq(c.name, name)),
  });
  if (exists) return NextResponse.json({ error: "Company name already exists" }, { status: 409 });

  const [inserted] = await db
    .insert(companies)
    .values({
      name,
      website,
      industry,
      status,
      description,
      mainContactId: mainContactId || null,
      teamId,
      createdBy: session.userId,
      updatedBy: session.userId,
    })
    .returning();

  return NextResponse.json(inserted);
}