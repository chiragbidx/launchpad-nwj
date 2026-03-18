"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function CRMCompanyDetail({ companyId }: { companyId: string }) {
  const [company, setCompany] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!companyId) return;
    const fetchCompany = async () => {
      setLoading(true);
      const res = await fetch(`/api/crm/companies/${companyId}`);
      if (res.ok) {
        setCompany(await res.json());
      }
      setLoading(false);
    };
    fetchCompany();
  }, [companyId]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center text-destructive py-8">
        Company not found.
      </div>
    );
  }

  return (
    <Card className="p-5 max-w-[520px] mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-2">{company.name}</h2>
      <div className="mb-2">{company.website ? <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a> : "---"}</div>
      <div className="mb-2">{company.industry || "---"}</div>
      <div className="mb-2">{company.status}</div>
      <div className="mb-3">{company.description}</div>
      <div className="text-sm text-muted-foreground">
        Created: {company.createdAt ? new Date(company.createdAt).toLocaleString() : ""}
      </div>
      <div className="text-sm text-muted-foreground">
        Updated: {company.updatedAt ? new Date(company.updatedAt).toLocaleString() : ""}
      </div>
      <div className="text-xs text-muted-foreground mt-2 pb-1">
        Created by: {company.createdByName || company.createdBy}
        <br />
        Updated by: {company.updatedByName || company.updatedBy}
      </div>
      <Button variant="secondary" className="mt-4" onClick={() => window.history.back()}>
        Back
      </Button>
    </Card>
  );
}