"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CRMCompaniesList } from "./companies-list";
import { CRMCompanyDialog } from "./company-dialog";
import { Download } from "lucide-react";
import { exportCompaniesCSV } from "./export-csv";

export function CRMCompaniesClient({ teamId }: { teamId: string }) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null); // company | null
  const [refreshFlag, setRefreshFlag] = useState(0);

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/crm/companies?teamId=${encodeURIComponent(teamId)}`);
      if (!res.ok) throw new Error("Failed to fetch companies");
      setCompanies(await res.json());
      setLoading(false);
      setError(null);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Error loading companies"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line
  }, [refreshFlag]);

  const onEdit = (company: any) => {
    setEditing(company);
    setOpen(true);
  };
  const onClose = () => {
    setEditing(null);
    setOpen(false);
  };
  const onSaved = () => {
    setEditing(null);
    setOpen(false);
    setRefreshFlag((r) => r + 1);
  };

  const handleExport = () => exportCompaniesCSV(companies);

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Companies</h2>
          <p className="text-muted-foreground">Manage your team’s companies in LeadFlow.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => setOpen(true)}>Add Company</Button>
        </div>
      </div>
      <CRMCompaniesList
        companies={companies}
        loading={loading}
        error={error}
        onEdit={onEdit}
        onRefresh={() => setRefreshFlag((r) => r + 1)}
      />
      <CRMCompanyDialog
        open={open}
        onClose={onClose}
        onSaved={onSaved}
        company={editing}
        teamId={teamId}
      />
    </div>
  );
}