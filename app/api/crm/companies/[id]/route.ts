import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { companies, users } from "@/lib/db/schema";
import { getAuthSession } from "@/lib/auth/session";
import { eq } from "drizzle-orm";

// Existing PUT and DELETE handlers...

// GET /api/crm/companies/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getAuthSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = params;

  // Join with users for createdBy/updatedBy
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
      createdBy: companies.createdBy,
      updatedBy: companies.updatedBy,
      createdByName: users.email,
      updatedByName: users.email,
    })
    .from(companies)
    .leftJoin(users, eq(companies.createdBy, users.id))
    .where(eq(companies.id, id));

  if (!rows.length)
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  return NextResponse.json(rows[0]);
}