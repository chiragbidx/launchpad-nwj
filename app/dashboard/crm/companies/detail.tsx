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
      {/* ...other fields as before */}
    </Card>
  );
}